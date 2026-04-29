from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Depends
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt as pyjwt
import bleach
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import cloudinary
import cloudinary.uploader
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
except ImportError:
    LlmChat = None
    UserMessage = None
    logging.warning("emergentintegrations not available - chatbot disabled")
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Admin Password
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'fallback-secret-change-me')
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24

# Uploads directory (local fallback)
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# Cloudinary Config
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True
)
CLOUDINARY_ENABLED = bool(os.environ.get("CLOUDINARY_CLOUD_NAME") and os.environ.get("CLOUDINARY_API_SECRET"))

# ============ Rate Limiter ============
limiter = Limiter(key_func=get_remote_address)

# ============ HTML Sanitizer for blog content (prevent stored XSS) ============
ALLOWED_HTML_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a', 'img',
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'figure', 'figcaption',
    'video', 'source', 'iframe', 'section', 'article', 'header', 'footer', 'nav',
    'dl', 'dt', 'dd', 'sub', 'sup', 'mark', 'abbr', 'details', 'summary'
]
ALLOWED_HTML_ATTRS = {
    '*': ['class', 'id', 'style', 'data-testid', 'aria-label', 'role'],
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height', 'loading'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
    'td': ['colspan', 'rowspan'], 'th': ['colspan', 'rowspan', 'scope'],
    'video': ['src', 'controls', 'width', 'height'], 'source': ['src', 'type'],
}

def sanitize_html(html_content: str) -> str:
    """Sanitize HTML content to prevent XSS attacks"""
    if not html_content:
        return html_content
    return bleach.clean(html_content, tags=ALLOWED_HTML_TAGS, attributes=ALLOWED_HTML_ATTRS, strip=True)

def sanitize_text(text: str) -> str:
    """Strip HTML tags from plain text fields"""
    if not text:
        return text
    return bleach.clean(text, tags=[], strip=True).strip()

# ============ Security Headers Middleware ============
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate" if "/api/admin" in request.url.path else "public, max-age=60"
        return response

# ============ Auth Utilities ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_jwt_token(admin_id: str) -> str:
    payload = {
        "sub": admin_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(request: Request):
    token = request.cookies.get("admin_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = verify_jwt_token(token)
    admin = await db.admin_users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin

# Create the main app
app = FastAPI(title="ETI Educom API", version="3.0.0")
app.state.limiter = limiter

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Mount uploads as static files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============ Admin Auth Models ============

class AdminLogin(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None


# ============ Summer Training Lead Models ============

class SummerTrainingLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[str] = None
    phone: str
    program_interest: str
    duration: str = "6 weeks"
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SummerTrainingLeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: Optional[str] = None
    phone: str = Field(..., min_length=10)
    program_interest: str = Field(..., min_length=2)
    duration: str = "6 weeks"


class SummerTrainingLeadResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: str
    program_interest: str
    duration: str
    status: str
    created_at: str


# ============ Industrial Training Lead Models ============

class IndustrialTrainingLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    college: Optional[str] = None
    course: Optional[str] = None
    program_interest: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IndustrialTrainingLeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10)
    college: Optional[str] = None
    course: Optional[str] = None
    program_interest: str = Field(..., min_length=2)


class IndustrialTrainingLeadResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    college: Optional[str] = None
    course: Optional[str] = None
    program_interest: str
    status: str
    created_at: str


# ============ Referral Models ============

class Referral(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_name: str
    referrer_phone: str
    referrer_email: Optional[str] = None
    friend_name: str
    friend_phone: str
    program_interest: Optional[str] = None
    status: str = "pending"  # pending, contacted, enrolled, rewarded
    reward_amount: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReferralCreate(BaseModel):
    referrer_name: str = Field(..., min_length=2, max_length=100)
    referrer_phone: str = Field(..., min_length=10)
    referrer_email: Optional[str] = None
    friend_name: str = Field(..., min_length=2, max_length=100)
    friend_phone: str = Field(..., min_length=10)
    program_interest: Optional[str] = None


class ReferralResponse(BaseModel):
    id: str
    referrer_name: str
    referrer_phone: str
    referrer_email: Optional[str]
    friend_name: str
    friend_phone: str
    program_interest: Optional[str]
    status: str
    reward_amount: Optional[float]
    created_at: str


# ============ MSG91 WhatsApp Settings Models ============

class MSG91Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    auth_key: str = ""
    integrated_number: str = "918728054145"
    template_name: str = "eti_certificate"
    template_namespace: str = "73fda5e9_77e9_445f_82ac_9c2e532b32f4"
    is_enabled: bool = False
    thank_you_message: str = "Thank you for your enquiry! Our team will contact you shortly."


class MSG91SettingsUpdate(BaseModel):
    auth_key: Optional[str] = None
    integrated_number: Optional[str] = None
    template_name: Optional[str] = None
    template_namespace: Optional[str] = None
    is_enabled: Optional[bool] = None
    thank_you_message: Optional[str] = None


# ============ WhatsApp Utility Function ============

# CRM Webhook URL
CRM_WEBHOOK_URL = "https://bms.etieducom.com/api/webhooks/leads/GEoGREfHahr3mU4vyL0X_3VFNf1oCfj6DLY44rDmUlA"


async def send_lead_to_crm(name: str, phone: str, email: str = "", source: str = "Website", campaign: str = "", program_name: str = ""):
    """Forward lead to CRM webhook"""
    try:
        payload = {
            "name": name,
            "phone": phone.replace("+", "").replace(" ", "").replace("-", ""),
            "email": email or "",
            "source": source,
            "campaign": campaign,
            "program_name": program_name
        }
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                CRM_WEBHOOK_URL,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10.0
            )
            if response.status_code in (200, 201):
                logging.info(f"CRM webhook sent: {name} ({source})")
                return True
            else:
                logging.error(f"CRM webhook failed: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        logging.error(f"CRM webhook error: {e}")
        return False

async def send_whatsapp_thank_you(phone: str, name: str, form_type: str = "enquiry"):
    """Send WhatsApp thank you message via MSG91 using 'webenq' template"""
    try:
        # Get MSG91 settings from database
        settings = await db.msg91_settings.find_one({}, {"_id": 0})
        if not settings or not settings.get("is_enabled") or not settings.get("auth_key"):
            logging.info(f"WhatsApp notifications disabled or not configured")
            return False
        
        # Format phone number (remove +, spaces, ensure starts with 91 for India)
        clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")
        if not clean_phone.startswith("91") and len(clean_phone) == 10:
            clean_phone = "91" + clean_phone
        
        # Use the exact payload format from MSG91 webenq template
        payload = {
            "integrated_number": "918728054145",
            "content_type": "template",
            "payload": {
                "messaging_product": "whatsapp",
                "type": "template",
                "template": {
                    "name": "webenq",
                    "language": {
                        "code": "en",
                        "policy": "deterministic"
                    },
                    "namespace": "73fda5e9_77e9_445f_82ac_9c2e532b32f4",
                    "to_and_components": [
                        {
                            "to": [clean_phone],
                            "components": {
                                "body_1": {
                                    "type": "text",
                                    "value": name
                                }
                            }
                        }
                    ]
                }
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "authkey": settings.get("auth_key")
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                logging.info(f"WhatsApp sent successfully to {clean_phone} for {form_type}")
                return True
            else:
                logging.error(f"WhatsApp failed: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        logging.error(f"Error sending WhatsApp: {e}")
        return False


# ============ Quick Enquiry Models ============

class QuickEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    interest: str
    source: str = "homepage"
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class QuickEnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10)
    email: Optional[str] = None
    interest: str = Field(..., min_length=2)
    source: str = "homepage"


class QuickEnquiryResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str]
    interest: str
    source: str
    status: str
    created_at: str


# ============ EduConnect Models ============

class EduConnectUniversity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo: Optional[str] = None
    is_active: bool = True
    order: int = 0


class EduConnectProgram(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    duration: str
    type: str = "UG"  # UG or PG
    is_active: bool = True


class EduConnectEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    qualification: Optional[str] = None
    program_interest: Optional[str] = None
    message: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EduConnectEnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10)
    qualification: Optional[str] = None
    program_interest: Optional[str] = None
    message: Optional[str] = None


# ============ Service Enquiry Models ============

class ServiceEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_type: str  # "corporate_training" or "fly_me_a_trainer"
    company_name: str
    contact_person: str
    email: str
    phone: str
    employees_count: Optional[str] = None
    training_topic: Optional[str] = None
    preferred_mode: Optional[str] = None  # "online" or "offline" or "both"
    location: Optional[str] = None
    message: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ServiceEnquiryCreate(BaseModel):
    service_type: str = Field(..., pattern="^(corporate_training|fly_me_a_trainer)$")
    company_name: str = Field(..., min_length=2, max_length=200)
    contact_person: str = Field(..., min_length=2, max_length=100)
    email: str
    phone: str = Field(..., min_length=10)
    employees_count: Optional[str] = None
    training_topic: Optional[str] = None
    preferred_mode: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None


class ServiceEnquiryResponse(BaseModel):
    id: str
    service_type: str
    company_name: str
    contact_person: str
    email: str
    phone: str
    employees_count: Optional[str]
    training_topic: Optional[str]
    preferred_mode: Optional[str]
    location: Optional[str]
    message: Optional[str]
    status: str
    created_at: str


# ============ Models ============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# Contact Enquiry Models
class ContactEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    enquiry_type: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"


class ContactEnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    enquiry_type: str = Field(..., min_length=1)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactEnquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    enquiry_type: str
    message: str
    created_at: str
    status: str


# Event Models
class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: str
    event_time: str
    location: str
    image_url: Optional[str] = None
    gallery_images: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EventCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    event_date: str
    event_time: str
    location: str = Field(..., min_length=2, max_length=200)
    image_url: Optional[str] = None
    gallery_images: List[str] = Field(default_factory=list)


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    is_active: Optional[bool] = None


class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    event_date: str
    event_time: str
    location: str
    image_url: Optional[str]
    gallery_images: List[str] = Field(default_factory=list)
    is_active: bool
    created_at: str


# Student Review Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_name: str
    course: str
    review_text: str
    photo_url: Optional[str] = None
    rating: int = 5
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReviewCreate(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=100)
    course: str = Field(..., min_length=2, max_length=200)
    review_text: str = Field(..., min_length=10, max_length=1000)
    photo_url: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)


class ReviewUpdate(BaseModel):
    student_name: Optional[str] = None
    course: Optional[str] = None
    review_text: Optional[str] = None
    photo_url: Optional[str] = None
    rating: Optional[int] = None
    is_active: Optional[bool] = None


class ReviewResponse(BaseModel):
    id: str
    student_name: str
    course: str
    review_text: str
    photo_url: Optional[str]
    rating: int
    is_active: bool
    created_at: str


# Program/Track Models
class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str = ""
    slug: str
    description: str
    category: str  # career_tracks, tech_programs, design_marketing, cybersecurity, office_accounting, soft_skills
    duration: str
    outcomes: List[str]
    suitable_for: str
    certifications: List[str]
    modules: List[str]
    image_url: Optional[str] = None
    icon: str = "Monitor"
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProgramCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    subtitle: str = ""
    slug: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=2000)
    category: str
    duration: str
    outcomes: List[str]
    suitable_for: str
    certifications: List[str]
    modules: List[str]
    image_url: Optional[str] = None
    icon: str = "Monitor"
    order: int = 0


class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    outcomes: Optional[List[str]] = None
    suitable_for: Optional[str] = None
    certifications: Optional[List[str]] = None
    modules: Optional[List[str]] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class ProgramResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    slug: str
    description: str
    category: str
    duration: str
    outcomes: List[str]
    suitable_for: str
    certifications: List[str]
    modules: List[str]
    image_url: Optional[str]
    icon: str
    is_active: bool
    order: int
    created_at: str


# Job Opening Models
class JobOpening(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    department: str
    location: str
    type: str
    description: str
    requirements: List[str]
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class JobOpeningCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    department: str
    location: str
    type: str
    description: str = Field(..., min_length=10, max_length=3000)
    requirements: List[str]


class JobOpeningUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    is_active: Optional[bool] = None


class JobOpeningResponse(BaseModel):
    id: str
    title: str
    department: str
    location: str
    type: str
    description: str
    requirements: List[str]
    is_active: bool
    created_at: str


# Job Application Models
class JobApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    name: str
    email: EmailStr
    phone: str
    resume_url: Optional[str] = None
    cover_letter: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class JobApplicationCreate(BaseModel):
    job_id: str
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str
    resume_url: Optional[str] = None
    cover_letter: str = Field(..., min_length=20, max_length=3000)


class JobApplicationResponse(BaseModel):
    id: str
    job_id: str
    name: str
    email: str
    phone: str
    resume_url: Optional[str]
    cover_letter: str
    created_at: str


# Certificate Verification Models
class CertificateVerify(BaseModel):
    certificate_id: str = Field(..., min_length=5, max_length=50)


class CertificateResponse(BaseModel):
    verified: bool
    certificate_id: str
    student_name: Optional[str] = None
    course_name: Optional[str] = None
    issue_date: Optional[str] = None
    message: str


# Hire Request Models
class HireRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    requirements: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HireRequestCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=200)
    contact_person: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str
    requirements: str = Field(..., min_length=10, max_length=2000)


class HireRequestResponse(BaseModel):
    id: str
    company_name: str
    contact_person: str
    email: str
    phone: str
    requirements: str
    created_at: str


# Chatbot Models
class ChatMessage(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    session_id: str


# ============ Cyber Warriors Models ============

class CyberWarriorsEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    date: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CyberWarriorsEventCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=3000)
    image: str
    date: Optional[str] = None


class CyberWarriorsEventResponse(BaseModel):
    id: str
    title: str
    description: str
    image: str
    date: Optional[str]
    is_active: bool
    created_at: str


class CyberWarriorsRegistration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    registration_type: str  # "self" or "organization"
    name: str
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None  # "school", "college", "other"
    contact_number: str
    email: str
    preferred_date: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CyberWarriorsRegistrationCreate(BaseModel):
    registration_type: str
    name: str = Field(..., min_length=2, max_length=100)
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    contact_number: str
    email: str
    preferred_date: Optional[str] = None
    message: Optional[str] = None


class CyberWarriorsRegistrationResponse(BaseModel):
    id: str
    registration_type: str
    name: str
    organization_name: Optional[str]
    organization_type: Optional[str]
    contact_number: str
    email: str
    preferred_date: Optional[str]
    message: Optional[str]
    status: str
    created_at: str


# ============ Cyber Warriors Assessment Models ============

class CyberWarriorsAssessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    college: Optional[str] = None
    score: int
    total: int = 10
    passed: bool
    certificate_id: Optional[str] = None
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CyberWarriorsAssessmentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    phone: str = Field(..., min_length=10)
    college: Optional[str] = None
    score: int = Field(..., ge=0, le=10)
    total: int = 10
    passed: bool
    completed_at: Optional[str] = None


class CyberWarriorsAssessmentResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    college: Optional[str]
    score: int
    total: int
    passed: bool
    certificate_id: Optional[str]
    completed_at: str


# ============ Team Member Models ============

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TeamMemberCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    title: str = Field(..., min_length=2, max_length=100)
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[str] = None
    order: int = 0


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class TeamMemberResponse(BaseModel):
    id: str
    name: str
    title: str
    bio: Optional[str]
    photo_url: Optional[str]
    linkedin_url: Optional[str]
    twitter_url: Optional[str]
    email: Optional[str]
    order: int
    is_active: bool
    created_at: str


# ============ Branch Models ============

class Branch(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    address: str
    city: str
    state: str
    phone: str
    email: str
    map_url: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    facilities: List[str] = []
    timings: Optional[str] = None
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BranchCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., min_length=2, max_length=50)
    address: str = Field(..., min_length=5, max_length=300)
    city: str = Field(..., min_length=2, max_length=50)
    state: str = Field(..., min_length=2, max_length=50)
    phone: str
    email: str
    map_url: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    facilities: List[str] = []
    timings: Optional[str] = None
    order: int = 0


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    map_url: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    facilities: Optional[List[str]] = None
    timings: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class BranchResponse(BaseModel):
    id: str
    name: str
    slug: str
    address: str
    city: str
    state: str
    phone: str
    email: str
    map_url: Optional[str]
    image_url: Optional[str]
    description: Optional[str]
    facilities: List[str]
    timings: Optional[str]
    is_active: bool
    order: int
    created_at: str


# Store chat sessions in memory (for simplicity)
chat_sessions = {}


# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "ETI Educom API - Training | Certification | Placement"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ETI Educom API v3.0"}


# Status Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Contact Routes
@api_router.post("/contact", response_model=ContactEnquiryResponse)
@limiter.limit("10/minute")
async def create_contact_enquiry(request: Request, input: ContactEnquiryCreate):
    try:
        enquiry_dict = input.model_dump()
        enquiry_obj = ContactEnquiry(**enquiry_dict)
        doc = enquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.contact_enquiries.insert_one(doc)
        
        # Send WhatsApp notification
        if input.phone:
            await send_whatsapp_thank_you(input.phone, input.name, "Contact Enquiry")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone or "", email=input.email, source="Contact Form", program_name=input.enquiry_type)
        
        return ContactEnquiryResponse(
            id=doc['id'], name=doc['name'], email=doc['email'],
            phone=doc['phone'], enquiry_type=doc['enquiry_type'],
            message=doc['message'], created_at=doc['created_at'], status=doc['status']
        )
    except Exception as e:
        logging.error(f"Error creating contact enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")


@api_router.get("/contact", response_model=List[ContactEnquiryResponse])
async def get_contact_enquiries():
    enquiries = await db.contact_enquiries.find({}, {"_id": 0}).to_list(1000)
    return [
        ContactEnquiryResponse(
            id=e['id'], name=e['name'], email=e['email'], phone=e.get('phone'),
            enquiry_type=e['enquiry_type'], message=e['message'],
            created_at=e['created_at'] if isinstance(e['created_at'], str) else e['created_at'].isoformat(),
            status=e.get('status', 'new')
        ) for e in enquiries
    ]


@api_router.delete("/contact/{contact_id}")
async def delete_contact_enquiry(contact_id: str):
    result = await db.contact_enquiries.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact enquiry not found")
    return {"message": "Contact enquiry deleted successfully"}


# Event Routes
@api_router.post("/events", response_model=EventResponse)
async def create_event(input: EventCreate, admin=Depends(get_current_admin)):
    try:
        event_dict = input.model_dump()
        event_obj = Event(**event_dict)
        doc = event_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.events.insert_one(doc)
        return EventResponse(
            id=doc['id'], title=doc['title'], description=doc['description'],
            event_date=doc['event_date'], event_time=doc['event_time'],
            location=doc['location'], image_url=doc['image_url'],
            gallery_images=doc.get('gallery_images', []),
            is_active=doc['is_active'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail="Failed to create event")


@api_router.get("/events", response_model=List[EventResponse])
async def get_events(active_only: bool = True, limit: int = 100):
    query = {"is_active": True} if active_only else {}
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(limit)
    return [
        EventResponse(
            id=e['id'], title=e['title'], description=e['description'],
            event_date=e['event_date'], event_time=e['event_time'],
            location=e['location'], image_url=e.get('image_url'),
            gallery_images=e.get('gallery_images', []),
            is_active=e['is_active'],
            created_at=e['created_at'] if isinstance(e['created_at'], str) else e['created_at'].isoformat()
        ) for e in events
    ]


@api_router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventResponse(
        id=event['id'], title=event['title'], description=event['description'],
        event_date=event['event_date'], event_time=event['event_time'],
        location=event['location'], image_url=event.get('image_url'),
        gallery_images=event.get('gallery_images', []),
        is_active=event['is_active'],
        created_at=event['created_at'] if isinstance(event['created_at'], str) else event['created_at'].isoformat()
    )


@api_router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, input: EventUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.events.update_one({"id": event_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return await get_event(event_id)


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin=Depends(get_current_admin)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


# Review Routes
@api_router.post("/reviews", response_model=ReviewResponse)
async def create_review(input: ReviewCreate, admin=Depends(get_current_admin)):
    try:
        review_dict = input.model_dump()
        review_obj = Review(**review_dict)
        doc = review_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.reviews.insert_one(doc)
        return ReviewResponse(
            id=doc['id'], student_name=doc['student_name'], course=doc['course'],
            review_text=doc['review_text'], photo_url=doc['photo_url'],
            rating=doc['rating'], is_active=doc['is_active'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating review: {e}")
        raise HTTPException(status_code=500, detail="Failed to create review")


@api_router.get("/reviews", response_model=List[ReviewResponse])
async def get_reviews(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [
        ReviewResponse(
            id=r['id'], student_name=r['student_name'], course=r['course'],
            review_text=r['review_text'], photo_url=r.get('photo_url'),
            rating=r['rating'], is_active=r['is_active'],
            created_at=r['created_at'] if isinstance(r['created_at'], str) else r['created_at'].isoformat()
        ) for r in reviews
    ]


@api_router.put("/reviews/{review_id}", response_model=ReviewResponse)
async def update_review(review_id: str, input: ReviewUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.reviews.update_one({"id": review_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    return ReviewResponse(
        id=review['id'], student_name=review['student_name'], course=review['course'],
        review_text=review['review_text'], photo_url=review.get('photo_url'),
        rating=review['rating'], is_active=review['is_active'],
        created_at=review['created_at'] if isinstance(review['created_at'], str) else review['created_at'].isoformat()
    )


@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, admin=Depends(get_current_admin)):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}


# Program Routes
@api_router.post("/programs", response_model=ProgramResponse)
async def create_program(input: ProgramCreate, admin=Depends(get_current_admin)):
    try:
        program_dict = input.model_dump()
        program_obj = Program(**program_dict)
        doc = program_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.programs.insert_one(doc)
        return ProgramResponse(
            id=doc['id'], title=doc['title'], subtitle=doc.get('subtitle', ''), slug=doc['slug'],
            description=doc['description'], category=doc['category'],
            duration=doc['duration'], outcomes=doc['outcomes'],
            suitable_for=doc['suitable_for'], certifications=doc['certifications'],
            modules=doc['modules'], image_url=doc['image_url'],
            icon=doc['icon'], is_active=doc['is_active'],
            order=doc['order'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating program: {e}")
        raise HTTPException(status_code=500, detail="Failed to create program")


@api_router.get("/programs", response_model=List[ProgramResponse])
async def get_programs(category: Optional[str] = None, active_only: bool = True):
    query = {}
    if active_only:
        query["is_active"] = True
    if category:
        query["category"] = category
    programs = await db.programs.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        ProgramResponse(
            id=p['id'], title=p['title'], subtitle=p.get('subtitle', ''), slug=p['slug'],
            description=p['description'], category=p['category'],
            duration=p['duration'], outcomes=p['outcomes'],
            suitable_for=p['suitable_for'], certifications=p['certifications'],
            modules=p['modules'], image_url=p.get('image_url'),
            icon=p.get('icon', 'Monitor'), is_active=p['is_active'],
            order=p.get('order', 0),
            created_at=p['created_at'] if isinstance(p['created_at'], str) else p['created_at'].isoformat()
        ) for p in programs
    ]


@api_router.get("/programs/{program_slug}", response_model=ProgramResponse)
async def get_program(program_slug: str):
    program = await db.programs.find_one({"slug": program_slug}, {"_id": 0})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return ProgramResponse(
        id=program['id'], title=program['title'], subtitle=program.get('subtitle', ''), slug=program['slug'],
        description=program['description'], category=program['category'],
        duration=program['duration'], outcomes=program['outcomes'],
        suitable_for=program['suitable_for'], certifications=program['certifications'],
        modules=program['modules'], image_url=program.get('image_url'),
        icon=program.get('icon', 'Monitor'), is_active=program['is_active'],
        order=program.get('order', 0),
        created_at=program['created_at'] if isinstance(program['created_at'], str) else program['created_at'].isoformat()
    )


@api_router.put("/programs/{program_id}", response_model=ProgramResponse)
async def update_program(program_id: str, input: ProgramUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.programs.update_one({"id": program_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    program = await db.programs.find_one({"id": program_id}, {"_id": 0})
    return ProgramResponse(
        id=program['id'], title=program['title'], subtitle=program.get('subtitle', ''), slug=program['slug'],
        description=program['description'], category=program['category'],
        duration=program['duration'], outcomes=program['outcomes'],
        suitable_for=program['suitable_for'], certifications=program['certifications'],
        modules=program['modules'], image_url=program.get('image_url'),
        icon=program.get('icon', 'Monitor'), is_active=program['is_active'],
        order=program.get('order', 0),
        created_at=program['created_at'] if isinstance(program['created_at'], str) else program['created_at'].isoformat()
    )


@api_router.delete("/programs/{program_id}")
async def delete_program(program_id: str, admin=Depends(get_current_admin)):
    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted successfully"}


@api_router.post("/programs/seed-all")
async def seed_all_programs(admin=Depends(get_current_admin)):
    """Seed all programs to the database"""
    programs_data = [
        # Career Tracks
        {
            "slug": "it-foundation", "title": "IT Foundation", "subtitle": "Build Your Digital Career Base",
            "description": "A comprehensive 6-month program designed to build a solid foundation in computing fundamentals, digital literacy, and essential IT skills. Perfect for beginners starting their career journey in the technology sector.",
            "category": "career_tracks", "duration": "6 Months", "icon": "Monitor",
            "outcomes": ["IT Support Specialist", "Computer Operator", "Digital Literacy Expert", "Office Administrator"],
            "suitable_for": "Students, Fresh Graduates, Career Starters, Working Professionals",
            "certifications": ["Microsoft Office Specialist (MOS)", "IC3 Digital Literacy Certification", "CompTIA IT Fundamentals"],
            "modules": ["Computer Fundamentals & Hardware Basics", "Operating Systems (Windows & Linux Basics)", "Microsoft Office Suite", "Internet Technologies & Email Management", "Basic Networking Concepts", "Troubleshooting & Technical Support", "Digital Communication & Collaboration Tools", "Introduction to Cloud Computing"],
            "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200", "order": 1
        },
        {
            "slug": "digital-design", "title": "Digital Design & Marketing", "subtitle": "Create & Market with Impact",
            "description": "Master the art of digital design and marketing in this comprehensive 9-12 month program. Learn industry-standard tools and strategies to create compelling visual content and execute effective marketing campaigns.",
            "category": "career_tracks", "duration": "9-12 Months", "icon": "Palette",
            "outcomes": ["Graphic Designer", "Digital Marketing Specialist", "UI/UX Designer", "Social Media Manager", "Brand Strategist"],
            "suitable_for": "Creative Professionals, Marketing Enthusiasts, Entrepreneurs, Freelancers",
            "certifications": ["Adobe Certified Professional", "Google Digital Marketing", "Meta Blueprint", "HubSpot Content Marketing"],
            "modules": ["Design Fundamentals & Color Theory", "Adobe Photoshop & Illustrator Mastery", "UI/UX Design Principles", "Social Media Marketing & Management", "Search Engine Optimization (SEO)", "Google Ads & PPC Campaigns", "Content Marketing Strategy", "Analytics & Performance Tracking", "Brand Identity & Logo Design", "Video Editing Basics"],
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200", "order": 2
        },
        {
            "slug": "it-networking", "title": "IT Support & Cybersecurity", "subtitle": "Secure & Connect the Digital World",
            "description": "Develop expertise in IT infrastructure, network administration, and cybersecurity protocols in this 9-12 month program. Prepare for roles in enterprise IT environments with hands-on practical training.",
            "category": "career_tracks", "duration": "9-12 Months", "icon": "Shield",
            "outcomes": ["IT Support Technician", "Network Administrator", "Security Analyst", "Help Desk Specialist", "System Administrator"],
            "suitable_for": "Technical Aspirants, IT Professionals, Career Changers, Engineering Students",
            "certifications": ["CompTIA A+", "CompTIA Network+", "CompTIA Security+", "Cisco CCNA", "CEH"],
            "modules": ["Hardware & Software Troubleshooting", "Windows & Linux Server Administration", "Network Configuration & Management", "TCP/IP & Network Protocols", "Cybersecurity Fundamentals", "Firewall & Security Tools", "Cloud Computing (AWS/Azure Basics)", "IT Service Management (ITIL)", "Vulnerability Assessment", "Incident Response & Recovery"],
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010c89b20c?auto=format&fit=crop&q=80&w=1200", "order": 3
        },
        {
            "slug": "software-development", "title": "Software Development", "subtitle": "Code the Future",
            "description": "Learn programming languages, development frameworks, and software engineering principles in this comprehensive 9-12 month program. Build real-world applications and prepare for high-paying careers in software development.",
            "category": "career_tracks", "duration": "9-12 Months", "icon": "Code",
            "outcomes": ["Full Stack Developer", "Software Engineer", "Web Developer", "Application Developer", "Backend Developer"],
            "suitable_for": "Engineering Students, Tech Enthusiasts, Career Changers, IT Professionals",
            "certifications": ["Microsoft Certified Developer", "AWS Developer Associate", "Oracle Certified Java Programmer"],
            "modules": ["Programming Fundamentals", "Python Programming", "Java Programming", "Web Development (HTML, CSS, JavaScript)", "Database Management (SQL & NoSQL)", "Backend Development (Node.js/Django)", "Frontend Frameworks (React)", "API Development & Integration", "Version Control (Git & GitHub)", "Software Testing & DevOps Basics"],
            "image_url": "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200", "order": 4
        },
        # Tech Programs
        {
            "slug": "python", "title": "Python Programming", "subtitle": "Master the Most Versatile Language",
            "description": "Learn Python programming from basics to advanced concepts. Python is the most popular programming language used in web development, data science, AI, automation, and more.",
            "category": "tech_programs", "duration": "3 Months", "icon": "Code",
            "outcomes": ["Python Developer", "Automation Engineer", "Backend Developer", "Data Analyst"],
            "suitable_for": "Beginners, Students, Working Professionals, Career Changers",
            "certifications": ["Python Institute PCAP", "Microsoft Python Certification"],
            "modules": ["Python Basics & Syntax", "Data Types & Variables", "Control Flow & Loops", "Functions & Modules", "Object-Oriented Programming", "File Handling & Exception Management", "Libraries (NumPy, Pandas basics)", "Project Development"],
            "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200", "order": 5
        },
        {
            "slug": "web-designing", "title": "Web Designing", "subtitle": "Design Beautiful Websites",
            "description": "Learn to create visually stunning and user-friendly websites. Master HTML, CSS, and design principles to build responsive websites that work on all devices.",
            "category": "tech_programs", "duration": "3 Months", "icon": "Globe",
            "outcomes": ["Web Designer", "Frontend Designer", "UI Developer", "Freelance Designer"],
            "suitable_for": "Creative Individuals, Students, Small Business Owners",
            "certifications": ["Adobe Certified Professional - Web", "W3Schools Certification"],
            "modules": ["HTML5 Fundamentals", "CSS3 & Styling", "Responsive Web Design", "CSS Flexbox & Grid", "Bootstrap Framework", "UI/UX Principles", "Adobe XD/Figma Basics", "Portfolio Website Project"],
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200", "order": 6
        },
        {
            "slug": "web-development", "title": "Web Development", "subtitle": "Build Dynamic Web Applications",
            "description": "Learn full-stack web development including frontend and backend technologies. Build interactive web applications using modern frameworks and tools.",
            "category": "tech_programs", "duration": "6 Months", "icon": "Code",
            "outcomes": ["Web Developer", "Frontend Developer", "Full Stack Developer", "JavaScript Developer"],
            "suitable_for": "Students, IT Professionals, Career Changers",
            "certifications": ["Meta Front-End Developer", "freeCodeCamp Certification"],
            "modules": ["HTML5 & CSS3", "JavaScript ES6+", "React.js Framework", "Node.js & Express", "Database Integration (MongoDB/MySQL)", "REST API Development", "Git & Version Control", "Deployment & Hosting"],
            "image_url": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1200", "order": 7
        },
        {
            "slug": "data-analytics", "title": "Data Analytics", "subtitle": "Turn Data into Insights",
            "description": "Master data analytics skills to make data-driven decisions. Learn statistical analysis, data visualization, and business intelligence tools to extract meaningful insights from complex datasets.",
            "category": "tech_programs", "duration": "4 Months", "icon": "BarChart3",
            "outcomes": ["Data Analyst", "Business Analyst", "BI Developer", "Data Visualization Specialist"],
            "suitable_for": "Analysts, Business Professionals, Statistics Enthusiasts, MBA Students",
            "certifications": ["Google Data Analytics Certificate", "Microsoft Power BI Certification", "Tableau Desktop Specialist"],
            "modules": ["Excel for Data Analysis", "SQL & Database Querying", "Python for Data Analysis", "Statistical Analysis Fundamentals", "Data Visualization (Power BI/Tableau)", "Dashboard Creation", "Business Intelligence Reporting", "Capstone Analytics Project"],
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200", "order": 8
        },
        {
            "slug": "ai-beginners", "title": "AI For Beginners", "subtitle": "Start Your AI Journey",
            "description": "An introductory course to Artificial Intelligence covering fundamental concepts, applications, and hands-on experience with AI tools. Perfect for anyone wanting to understand AI technology.",
            "category": "tech_programs", "duration": "2 Months", "icon": "Bot",
            "outcomes": ["AI Enthusiast", "AI-Enabled Professional", "Prompt Engineer", "AI Tool User"],
            "suitable_for": "Anyone interested in AI, Students, Working Professionals, Business Owners",
            "certifications": ["Google AI Essentials", "IBM AI Foundations"],
            "modules": ["Introduction to AI & Machine Learning", "Understanding ChatGPT & LLMs", "Prompt Engineering Basics", "AI Tools for Productivity", "AI in Business Applications", "Ethics in AI", "Hands-on AI Projects"],
            "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200", "order": 9
        },
        {
            "slug": "ai-engineering", "title": "AI Engineering", "subtitle": "Build Intelligent Systems",
            "description": "Advanced program covering machine learning, deep learning, and AI system development. Learn to build and deploy AI models for real-world applications.",
            "category": "tech_programs", "duration": "6 Months", "icon": "Cpu",
            "outcomes": ["AI Engineer", "ML Engineer", "Data Scientist", "Deep Learning Specialist"],
            "suitable_for": "Programmers, Data Analysts, Engineering Graduates, Tech Professionals",
            "certifications": ["TensorFlow Developer Certificate", "AWS Machine Learning Specialty", "Google ML Engineer"],
            "modules": ["Python for AI", "Mathematics for Machine Learning", "Machine Learning Algorithms", "Deep Learning & Neural Networks", "TensorFlow & PyTorch", "Natural Language Processing", "Computer Vision Basics", "Model Deployment & MLOps", "AI Project Development"],
            "image_url": "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1200", "order": 10
        },
        # Design & Marketing
        {
            "slug": "digital-marketing", "title": "Digital Marketing", "subtitle": "Master Online Marketing Strategies",
            "description": "Become a digital marketing expert with comprehensive training in SEO, social media marketing, content marketing, paid advertising, and analytics. Learn to create and execute successful marketing campaigns.",
            "category": "design_marketing", "duration": "4 Months", "icon": "TrendingUp",
            "outcomes": ["Digital Marketing Manager", "SEO Specialist", "Social Media Manager", "Content Strategist", "PPC Specialist"],
            "suitable_for": "Marketing Professionals, Business Owners, Fresh Graduates, Entrepreneurs",
            "certifications": ["Google Digital Marketing Certification", "Meta Blueprint Certification", "HubSpot Inbound Marketing"],
            "modules": ["Digital Marketing Fundamentals", "Search Engine Optimization (SEO)", "Search Engine Marketing (Google Ads)", "Social Media Marketing", "Content Marketing Strategy", "Email Marketing & Automation", "Analytics & Performance Tracking", "Marketing Campaign Management"],
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", "order": 11
        },
        {
            "slug": "graphic-designing", "title": "Graphic Designing", "subtitle": "Create Visual Masterpieces",
            "description": "Master the art of visual communication with professional graphic design training. Learn industry-standard tools like Adobe Photoshop, Illustrator, and Canva to create stunning designs.",
            "category": "design_marketing", "duration": "3 Months", "icon": "Palette",
            "outcomes": ["Graphic Designer", "Visual Designer", "Brand Designer", "Print Designer", "Digital Artist"],
            "suitable_for": "Creative Individuals, Art Enthusiasts, Marketing Professionals, Freelancers",
            "certifications": ["Adobe Certified Professional", "Canva Design Certification"],
            "modules": ["Design Principles & Color Theory", "Adobe Photoshop Mastery", "Adobe Illustrator Mastery", "Logo & Brand Identity Design", "Social Media Graphics", "Print Design (Brochures, Banners)", "Canva for Quick Designs", "Portfolio Development"],
            "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200", "order": 12
        },
        {
            "slug": "ui-ux-designing", "title": "UI & UX Designing", "subtitle": "Design User-Centric Experiences",
            "description": "Learn to design intuitive and engaging user interfaces and experiences. Master design thinking, prototyping, and user research to create products users love.",
            "category": "design_marketing", "duration": "4 Months", "icon": "PenTool",
            "outcomes": ["UI Designer", "UX Designer", "Product Designer", "Interaction Designer", "UX Researcher"],
            "suitable_for": "Designers, Developers, Product Managers, Creative Professionals",
            "certifications": ["Google UX Design Certificate", "Adobe XD Certification", "Figma Certification"],
            "modules": ["UX Design Fundamentals", "User Research & Personas", "Information Architecture", "Wireframing & Prototyping", "UI Design Principles", "Figma/Adobe XD Mastery", "Design Systems", "Usability Testing", "Portfolio & Case Studies"],
            "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200", "order": 13
        },
        # Cybersecurity
        {
            "slug": "soc-analyst", "title": "SOC Analyst", "subtitle": "Defend Against Cyber Threats",
            "description": "Become a Security Operations Center (SOC) Analyst with comprehensive training in threat detection, incident response, and security monitoring. Prepare for a high-demand cybersecurity career.",
            "category": "cybersecurity", "duration": "6 Months", "icon": "Shield",
            "outcomes": ["SOC Analyst Level 1", "Security Analyst", "Threat Analyst", "Incident Responder"],
            "suitable_for": "IT Professionals, Networking Enthusiasts, Security Aspirants, Career Changers",
            "certifications": ["CompTIA Security+", "CompTIA CySA+", "Splunk Certified User", "IBM QRadar"],
            "modules": ["Cybersecurity Fundamentals", "Network Security & Protocols", "Security Information & Event Management (SIEM)", "Threat Intelligence", "Incident Detection & Response", "Malware Analysis Basics", "Log Analysis & Monitoring", "SOC Tools & Technologies", "Compliance & Frameworks (NIST, ISO)", "Hands-on SOC Simulation"],
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200", "order": 14
        },
        {
            "slug": "ethical-hacking", "title": "Ethical Hacking", "subtitle": "Become a Cybersecurity Expert",
            "description": "Learn ethical hacking and penetration testing techniques to protect organizations from cyber threats. Master security tools, vulnerability assessment, and defensive strategies.",
            "category": "cybersecurity", "duration": "6 Months", "icon": "Network",
            "outcomes": ["Ethical Hacker", "Penetration Tester", "Security Consultant", "Vulnerability Analyst"],
            "suitable_for": "IT Professionals, Networking Enthusiasts, Security Aspirants",
            "certifications": ["Certified Ethical Hacker (CEH)", "CompTIA PenTest+", "OSCP"],
            "modules": ["Networking & System Fundamentals", "Linux for Hackers", "Footprinting & Reconnaissance", "Scanning & Enumeration", "Vulnerability Assessment", "System Hacking", "Web Application Hacking", "Wireless Network Hacking", "Social Engineering", "Report Writing & Documentation"],
            "image_url": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=1200", "order": 15
        },
        # Office & Accounting
        {
            "slug": "ms-office-ai", "title": "MS-Office with AI", "subtitle": "Office Productivity Reimagined",
            "description": "Master Microsoft Office applications enhanced with AI capabilities. Learn to use Copilot, AI-powered features in Word, Excel, PowerPoint, and Outlook to boost your productivity.",
            "category": "office_accounting", "duration": "2 Months", "icon": "Award",
            "outcomes": ["Office Administrator", "Executive Assistant", "Data Entry Specialist", "Office Productivity Expert"],
            "suitable_for": "Students, Office Workers, Professionals, Job Seekers",
            "certifications": ["Microsoft Office Specialist (MOS)", "Microsoft 365 Certified"],
            "modules": ["Microsoft Word Advanced Features", "Excel Formulas & Data Analysis", "PowerPoint Presentation Design", "Outlook & Email Management", "Microsoft Copilot Integration", "AI Features in Office Apps", "Cloud Collaboration (OneDrive, Teams)", "Productivity Tips & Shortcuts"],
            "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200", "order": 16
        },
        {
            "slug": "e-accounting", "title": "E-Accounting", "subtitle": "Master Digital Accounting",
            "description": "Learn computerized accounting using industry-standard software like Tally and accounting principles. Prepare for accounting roles in the digital age.",
            "category": "office_accounting", "duration": "3 Months", "icon": "Calculator",
            "outcomes": ["Accountant", "Accounts Executive", "Tally Operator", "Bookkeeper", "GST Practitioner"],
            "suitable_for": "Commerce Students, Accountants, Small Business Owners, Finance Professionals",
            "certifications": ["Tally Certification", "GST Practitioner Certificate"],
            "modules": ["Accounting Fundamentals", "Tally Prime Complete Course", "GST Accounting & Returns", "Inventory Management", "Payroll Processing", "Bank Reconciliation", "Financial Statements", "TDS & Tax Compliance"],
            "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200", "order": 17
        },
        # Soft Skills
        {
            "slug": "spoken-english", "title": "Spoken English", "subtitle": "Communicate with Confidence",
            "description": "Improve your English speaking skills with comprehensive training in grammar, vocabulary, pronunciation, and conversational English. Gain confidence to communicate effectively in any situation.",
            "category": "soft_skills", "duration": "3 Months", "icon": "MessageCircle",
            "outcomes": ["Confident English Speaker", "Better Communication Skills", "Interview Ready", "Professional Communicator"],
            "suitable_for": "Students, Job Seekers, Working Professionals, Anyone wanting to improve English",
            "certifications": ["Cambridge English Certificate", "IELTS Preparation"],
            "modules": ["English Grammar Essentials", "Vocabulary Building", "Pronunciation & Accent Training", "Conversational English", "Public Speaking Basics", "Business English", "Email & Written Communication", "Group Discussions Practice"],
            "image_url": "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=1200", "order": 18
        },
        {
            "slug": "personality-development", "title": "Personality Development", "subtitle": "Unlock Your True Potential",
            "description": "Develop essential soft skills, build confidence, and enhance your personality for personal and professional success. Learn leadership, communication, and interpersonal skills.",
            "category": "soft_skills", "duration": "2 Months", "icon": "Star",
            "outcomes": ["Enhanced Confidence", "Better Leadership Skills", "Improved Communication", "Professional Image"],
            "suitable_for": "Students, Young Professionals, Job Seekers, Anyone seeking self-improvement",
            "certifications": ["Personality Development Certificate"],
            "modules": ["Self-Awareness & Confidence Building", "Effective Communication Skills", "Body Language & Non-verbal Communication", "Time Management", "Stress Management", "Leadership & Team Skills", "Positive Attitude Development", "Goal Setting & Achievement"],
            "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", "order": 19
        },
        {
            "slug": "interview-preparation", "title": "Interview Preparation", "subtitle": "Ace Your Next Interview",
            "description": "Comprehensive interview preparation program covering all aspects of job interviews. Learn to present yourself effectively, answer tough questions, and negotiate offers.",
            "category": "soft_skills", "duration": "1 Month", "icon": "Briefcase",
            "outcomes": ["Interview Confident", "Resume Ready", "Negotiation Skills", "Job Offer Ready"],
            "suitable_for": "Job Seekers, Fresh Graduates, Career Changers, Working Professionals",
            "certifications": ["Interview Preparation Certificate"],
            "modules": ["Resume & CV Writing", "LinkedIn Profile Optimization", "Common Interview Questions", "Behavioral Interview Techniques", "Technical Interview Preparation", "Group Discussion Skills", "Salary Negotiation", "Mock Interview Practice"],
            "image_url": "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&q=80&w=1200", "order": 20
        }
    ]
    
    # Clear existing programs and insert new ones
    await db.programs.delete_many({})
    
    for prog_data in programs_data:
        program = Program(
            slug=prog_data["slug"],
            title=prog_data["title"],
            subtitle=prog_data.get("subtitle", ""),
            description=prog_data["description"],
            category=prog_data["category"],
            duration=prog_data["duration"],
            outcomes=prog_data["outcomes"],
            suitable_for=prog_data["suitable_for"],
            certifications=prog_data["certifications"],
            modules=prog_data["modules"],
            image_url=prog_data.get("image_url"),
            icon=prog_data.get("icon", "Monitor"),
            order=prog_data.get("order", 0)
        )
        doc = program.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.programs.insert_one(doc)
    
    return {"message": f"Successfully seeded {len(programs_data)} programs"}


# Job Openings Routes
@api_router.post("/jobs", response_model=JobOpeningResponse)
async def create_job(input: JobOpeningCreate, admin=Depends(get_current_admin)):
    try:
        job_dict = input.model_dump()
        job_obj = JobOpening(**job_dict)
        doc = job_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.job_openings.insert_one(doc)
        return JobOpeningResponse(
            id=doc['id'], title=doc['title'], department=doc['department'],
            location=doc['location'], type=doc['type'], description=doc['description'],
            requirements=doc['requirements'], is_active=doc['is_active'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating job: {e}")
        raise HTTPException(status_code=500, detail="Failed to create job opening")


@api_router.get("/jobs", response_model=List[JobOpeningResponse])
async def get_jobs(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    jobs = await db.job_openings.find(query, {"_id": 0}).to_list(100)
    return [
        JobOpeningResponse(
            id=j['id'], title=j['title'], department=j['department'],
            location=j['location'], type=j['type'], description=j['description'],
            requirements=j['requirements'], is_active=j['is_active'],
            created_at=j['created_at'] if isinstance(j['created_at'], str) else j['created_at'].isoformat()
        ) for j in jobs
    ]


@api_router.get("/jobs/{job_id}", response_model=JobOpeningResponse)
async def get_job(job_id: str):
    job = await db.job_openings.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobOpeningResponse(
        id=job['id'], title=job['title'], department=job['department'],
        location=job['location'], type=job['type'], description=job['description'],
        requirements=job['requirements'], is_active=job['is_active'],
        created_at=job['created_at'] if isinstance(job['created_at'], str) else job['created_at'].isoformat()
    )


@api_router.put("/jobs/{job_id}", response_model=JobOpeningResponse)
async def update_job(job_id: str, input: JobOpeningUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.job_openings.update_one({"id": job_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return await get_job(job_id)


@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, admin=Depends(get_current_admin)):
    result = await db.job_openings.delete_one({"id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}


# Job Applications Routes
@api_router.post("/applications", response_model=JobApplicationResponse)
async def create_application(input: JobApplicationCreate):
    try:
        app_dict = input.model_dump()
        app_obj = JobApplication(**app_dict)
        doc = app_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.job_applications.insert_one(doc)
        return JobApplicationResponse(
            id=doc['id'], job_id=doc['job_id'], name=doc['name'],
            email=doc['email'], phone=doc['phone'], resume_url=doc['resume_url'],
            cover_letter=doc['cover_letter'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating application: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit application")


@api_router.get("/applications", response_model=List[JobApplicationResponse])
async def get_applications():
    apps = await db.job_applications.find({}, {"_id": 0}).to_list(1000)
    return [
        JobApplicationResponse(
            id=a['id'], job_id=a['job_id'], name=a['name'],
            email=a['email'], phone=a['phone'], resume_url=a.get('resume_url'),
            cover_letter=a['cover_letter'],
            created_at=a['created_at'] if isinstance(a['created_at'], str) else a['created_at'].isoformat()
        ) for a in apps
    ]


# Hire Request Routes
@api_router.post("/hire-request", response_model=HireRequestResponse)
async def create_hire_request(input: HireRequestCreate):
    try:
        hire_dict = input.model_dump()
        hire_obj = HireRequest(**hire_dict)
        doc = hire_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.hire_requests.insert_one(doc)
        
        # Send WhatsApp notification
        await send_whatsapp_thank_you(input.phone, input.contact_person, "Hire Request")
        
        # Send to CRM
        await send_lead_to_crm(name=input.contact_person, phone=input.phone, email=input.email, source="Hire From Us", program_name=input.company_name)
        
        return HireRequestResponse(
            id=doc['id'], company_name=doc['company_name'],
            contact_person=doc['contact_person'], email=doc['email'],
            phone=doc['phone'], requirements=doc['requirements'], created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error creating hire request: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit hire request")


@api_router.get("/hire-requests", response_model=List[HireRequestResponse])
async def get_hire_requests():
    requests = await db.hire_requests.find({}, {"_id": 0}).to_list(1000)
    return [
        HireRequestResponse(
            id=r['id'], company_name=r['company_name'],
            contact_person=r['contact_person'], email=r['email'],
            phone=r['phone'], requirements=r['requirements'],
            created_at=r['created_at'] if isinstance(r['created_at'], str) else r['created_at'].isoformat()
        ) for r in requests
    ]


# Certificate Verification Route
@api_router.post("/verify-certificate", response_model=CertificateResponse)
async def verify_certificate(input: CertificateVerify):
    certificate = await db.certificates.find_one({"certificate_id": input.certificate_id}, {"_id": 0})
    if certificate:
        return CertificateResponse(
            verified=True, certificate_id=input.certificate_id,
            student_name=certificate.get('student_name'),
            course_name=certificate.get('course_name'),
            issue_date=certificate.get('issue_date'),
            message="Certificate verified successfully"
        )
    else:
        return CertificateResponse(
            verified=False, certificate_id=input.certificate_id,
            message="Certificate not found in our records. Please check the certificate ID and try again."
        )


# AI Chatbot Route
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(input: ChatMessage):
    try:
        if LlmChat is None:
            return ChatResponse(
                response="AI Chat is not available on this server. Please contact our team directly at +91 9646727676.",
                session_id=input.session_id
            )
        
        session_id = input.session_id
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message="""You are an AI Career Counselor for ETI Educom®, India's premier Computer Career School. 
Your role is to help students find the right career track based on their background, interests, and goals.

Available Career Tracks:
1. Computer Career Foundation (3-6 months) - For beginners, covers digital literacy, MS Office, basic IT
2. Digital Design & Marketing (6-12 months) - For creative people, covers Adobe tools, UI/UX, digital marketing
3. IT Support, Networking & Cybersecurity (6-12 months) - For technical people, covers hardware, networking, security
4. Software Development (9-18 months) - For aspiring developers, covers programming, web development

Short Term Programs are also available for specific skills.

When chatting:
1. First, ask about their educational background
2. Then ask about their interests (creative, technical, business, etc.)
3. Ask about their career goals
4. Based on their responses, recommend the most suitable track with reasons
5. Be friendly, professional, and encouraging

Keep responses concise but helpful. Use simple language."""
            ).with_model("openai", "gpt-5.2")
        
        chat = chat_sessions[session_id]
        
        # Send message and get response
        user_message = UserMessage(text=input.message)
        response = await chat.send_message(user_message)
        
        return ChatResponse(response=response, session_id=session_id)
    
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return ChatResponse(
            response="I apologize, but I'm having trouble processing your request. Please try again or contact our team directly.",
            session_id=input.session_id
        )


# ============ Blog Models ============

class Blog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: Optional[str] = None
    category: str
    tags: List[str] = []
    author: str
    author_image: Optional[str] = None
    read_time: int = 5
    is_published: bool = True
    is_featured: bool = False
    # SEO Fields
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None
    secondary_keywords: List[str] = []
    canonical_url: Optional[str] = None
    robots: str = "index, follow"
    og_image: Optional[str] = None
    og_type: str = "article"
    # Structured Data
    faq_items: List[dict] = []  # [{question, answer}]
    # Content Meta
    word_count: int = 0
    heading_structure: List[str] = []  # ["H2: Title", "H3: Subtitle"]
    internal_links: List[str] = []
    external_links: List[str] = []
    seo_score: int = 0
    # Dates
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published_at: Optional[str] = None


class BlogCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    slug: str = Field(..., min_length=3, max_length=100)
    excerpt: str = Field(..., min_length=10, max_length=500)
    content: str = Field(..., min_length=10)
    featured_image: Optional[str] = None
    category: str = Field(..., min_length=2)
    tags: List[str] = []
    author: str = Field(..., min_length=2, max_length=100)
    author_image: Optional[str] = None
    read_time: int = 5
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None
    secondary_keywords: List[str] = []
    canonical_url: Optional[str] = None
    robots: str = "index, follow"
    og_image: Optional[str] = None
    faq_items: List[dict] = []
    word_count: int = 0
    heading_structure: List[str] = []
    internal_links: List[str] = []
    external_links: List[str] = []
    seo_score: int = 0
    published_at: Optional[str] = None


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    author_image: Optional[str] = None
    read_time: Optional[int] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None
    secondary_keywords: Optional[List[str]] = None
    canonical_url: Optional[str] = None
    robots: Optional[str] = None
    og_image: Optional[str] = None
    faq_items: Optional[List[dict]] = None
    word_count: Optional[int] = None
    heading_structure: Optional[List[str]] = None
    internal_links: Optional[List[str]] = None
    external_links: Optional[List[str]] = None
    seo_score: Optional[int] = None
    published_at: Optional[str] = None


class BlogResponse(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: Optional[str]
    category: str
    tags: List[str]
    author: str
    author_image: Optional[str]
    read_time: int
    is_published: bool
    is_featured: bool
    meta_title: Optional[str]
    meta_description: Optional[str]
    focus_keyword: Optional[str] = None
    secondary_keywords: List[str] = []
    canonical_url: Optional[str] = None
    robots: str = "index, follow"
    og_image: Optional[str] = None
    og_type: str = "article"
    faq_items: List[dict] = []
    word_count: int = 0
    heading_structure: List[str] = []
    internal_links: List[str] = []
    external_links: List[str] = []
    seo_score: int = 0
    published_at: Optional[str] = None
    created_at: str
    updated_at: str


# ============ Franchise Enquiry Models ============

class FranchiseEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    location: str
    city: str
    experience: str
    resume_url: Optional[str] = None
    investment_budget: str
    why_franchise: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FranchiseEnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10)
    location: str = Field(..., min_length=2)
    city: str = Field(..., min_length=2)
    experience: str = Field(..., min_length=10)
    resume_url: Optional[str] = None
    investment_budget: str = Field(..., min_length=2)
    why_franchise: str = Field(..., min_length=50, max_length=2000)


class FranchiseEnquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    location: str
    city: str
    experience: str
    resume_url: Optional[str]
    investment_budget: str
    why_franchise: str
    status: str
    created_at: str


# ============ Counselling Lead Models ============

class CounsellingLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    education: str
    preferred_track: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CounsellingLeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10)
    education: str = Field(..., min_length=2)
    preferred_track: str = Field(..., min_length=2)


class CounsellingLeadResponse(BaseModel):
    id: str
    name: str
    phone: str
    education: str
    preferred_track: str
    status: str
    created_at: str


# ============ FAQ Models ============

class FAQ(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FAQCreate(BaseModel):
    question: str = Field(..., min_length=10, max_length=500)
    answer: str = Field(..., min_length=20, max_length=2000)
    category: str = Field(..., min_length=2)
    order: int = 0


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FAQResponse(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    order: int
    is_active: bool
    created_at: str


# ============ SEO Settings Models ============

class SEOSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_slug: str
    meta_title: str
    meta_description: str
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SEOSettingsCreate(BaseModel):
    page_slug: str = Field(..., min_length=1)
    meta_title: str = Field(..., min_length=5, max_length=70)
    meta_description: str = Field(..., min_length=10, max_length=160)
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None


class SEOSettingsResponse(BaseModel):
    id: str
    page_slug: str
    meta_title: str
    meta_description: str
    meta_keywords: Optional[str]
    og_title: Optional[str]
    og_description: Optional[str]
    og_image: Optional[str]
    updated_at: str


# ============ Founder Settings Models ============

class FounderSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "Deepak Kumar"
    title: str = "Founder & CEO"
    image_url: Optional[str] = None
    message: str = ""
    vision: str = ""
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FounderSettingsUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    image_url: Optional[str] = None
    message: Optional[str] = None
    vision: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None


class FounderSettingsResponse(BaseModel):
    id: str
    name: str
    title: str
    image_url: Optional[str]
    message: str
    vision: str
    linkedin: Optional[str]
    twitter: Optional[str]
    updated_at: str


# ============ Announcement Models ============

class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    link: Optional[str] = None
    link_text: Optional[str] = None
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AnnouncementCreate(BaseModel):
    text: str = Field(..., min_length=5, max_length=200)
    link: Optional[str] = None
    link_text: Optional[str] = None
    order: int = 0


class AnnouncementUpdate(BaseModel):
    text: Optional[str] = None
    link: Optional[str] = None
    link_text: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class AnnouncementResponse(BaseModel):
    id: str
    text: str
    link: Optional[str]
    link_text: Optional[str]
    is_active: bool
    order: int
    created_at: str


# ============ Popup Modal Models ============

class PopupModal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    body: str
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    delay_seconds: int = 4
    is_active: bool = True
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PopupModalCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    body: str = Field(..., min_length=10, max_length=500)
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    delay_seconds: int = 4


class PopupModalUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    delay_seconds: Optional[int] = None
    is_active: Optional[bool] = None


class PopupModalResponse(BaseModel):
    id: str
    title: str
    body: str
    image_url: Optional[str]
    cta_text: Optional[str]
    cta_link: Optional[str]
    delay_seconds: int
    is_active: bool
    updated_at: str


# ============ Technical SEO Models ============

class TechnicalSEO(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    google_analytics_id: Optional[str] = None
    google_tag_manager_id: Optional[str] = None
    facebook_pixel_id: Optional[str] = None
    sitemap_url: Optional[str] = None
    robots_txt: Optional[str] = None
    custom_head_scripts: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TechnicalSEOCreate(BaseModel):
    google_analytics_id: Optional[str] = None
    google_tag_manager_id: Optional[str] = None
    facebook_pixel_id: Optional[str] = None
    sitemap_url: Optional[str] = None
    robots_txt: Optional[str] = None
    custom_head_scripts: Optional[str] = None


class TechnicalSEOResponse(BaseModel):
    id: str
    google_analytics_id: Optional[str]
    google_tag_manager_id: Optional[str]
    facebook_pixel_id: Optional[str]
    sitemap_url: Optional[str]
    robots_txt: Optional[str]
    custom_head_scripts: Optional[str]
    updated_at: str


# ============ Blog Routes ============

def _blog_to_response(b: dict) -> BlogResponse:
    """Helper to convert a blog document to BlogResponse with all SEO fields"""
    return BlogResponse(
        id=b['id'], title=b['title'], slug=b['slug'], excerpt=b['excerpt'],
        content=b['content'], featured_image=b.get('featured_image'),
        category=b['category'], tags=b.get('tags', []), author=b['author'],
        author_image=b.get('author_image'), read_time=b.get('read_time', 5),
        is_published=b['is_published'], is_featured=b.get('is_featured', False),
        meta_title=b.get('meta_title'), meta_description=b.get('meta_description'),
        focus_keyword=b.get('focus_keyword'), secondary_keywords=b.get('secondary_keywords', []),
        canonical_url=b.get('canonical_url'), robots=b.get('robots', 'index, follow'),
        og_image=b.get('og_image'), og_type=b.get('og_type', 'article'),
        faq_items=b.get('faq_items', []), word_count=b.get('word_count', 0),
        heading_structure=b.get('heading_structure', []),
        internal_links=b.get('internal_links', []), external_links=b.get('external_links', []),
        seo_score=b.get('seo_score', 0), published_at=b.get('published_at'),
        created_at=b['created_at'] if isinstance(b['created_at'], str) else b['created_at'].isoformat(),
        updated_at=b['updated_at'] if isinstance(b['updated_at'], str) else b['updated_at'].isoformat()
    )


@api_router.post("/blogs", response_model=BlogResponse)
async def create_blog(input: BlogCreate, admin=Depends(get_current_admin)):
    try:
        blog_dict = input.model_dump()
        # Sanitize HTML content to prevent XSS
        blog_dict['content'] = sanitize_html(blog_dict['content'])
        blog_dict['title'] = sanitize_text(blog_dict['title'])
        blog_dict['excerpt'] = sanitize_text(blog_dict['excerpt'])
        blog_obj = Blog(**blog_dict)
        doc = blog_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if not doc.get('published_at'):
            doc['published_at'] = doc['created_at']
        await db.blogs.insert_one(doc)
        return _blog_to_response(doc)
    except Exception as e:
        logging.error(f"Error creating blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to create blog")


@api_router.get("/blogs", response_model=List[BlogResponse])
async def get_blogs(published_only: bool = True, featured_only: bool = False, limit: int = 100):
    query = {}
    if published_only:
        query["is_published"] = True
    if featured_only:
        query["is_featured"] = True
    blogs = await db.blogs.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return [_blog_to_response(b) for b in blogs]


@api_router.get("/blogs/{blog_slug}", response_model=BlogResponse)
async def get_blog(blog_slug: str):
    blog = await db.blogs.find_one({"slug": blog_slug}, {"_id": 0})
    if not blog:
        blog = await db.blogs.find_one({"id": blog_slug}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return _blog_to_response(blog)


@api_router.put("/blogs/{blog_id}", response_model=BlogResponse)
async def update_blog(blog_id: str, input: BlogUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.blogs.update_one({"id": blog_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    return _blog_to_response(blog)


@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin=Depends(get_current_admin)):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}


# ============ Franchise Enquiry Routes ============

@api_router.post("/franchise-enquiry", response_model=FranchiseEnquiryResponse)
async def create_franchise_enquiry(input: FranchiseEnquiryCreate):
    try:
        enquiry_dict = input.model_dump()
        enquiry_obj = FranchiseEnquiry(**enquiry_dict)
        doc = enquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.franchise_enquiries.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "Franchise Enquiry")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, email=input.email, source="Franchise Enquiry", program_name=f"Franchise - {input.city}")
        
        return FranchiseEnquiryResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating franchise enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit franchise enquiry")


@api_router.get("/franchise-enquiry", response_model=List[FranchiseEnquiryResponse])
async def get_franchise_enquiries():
    enquiries = await db.franchise_enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        FranchiseEnquiryResponse(
            id=e['id'], name=e['name'], email=e['email'], phone=e['phone'],
            location=e['location'], city=e['city'], experience=e['experience'],
            resume_url=e.get('resume_url'), investment_budget=e['investment_budget'],
            why_franchise=e['why_franchise'], status=e.get('status', 'new'),
            created_at=e['created_at'] if isinstance(e['created_at'], str) else e['created_at'].isoformat()
        ) for e in enquiries
    ]


@api_router.delete("/franchise-enquiry/{enquiry_id}")
async def delete_franchise_enquiry(enquiry_id: str):
    result = await db.franchise_enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Franchise enquiry deleted successfully"}


# ============ Counselling Lead Routes ============

@api_router.post("/counselling-leads", response_model=CounsellingLeadResponse)
async def create_counselling_lead(input: CounsellingLeadCreate):
    try:
        lead_dict = input.model_dump()
        lead_obj = CounsellingLead(**lead_dict)
        doc = lead_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.counselling_leads.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "Counselling Request")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, source="Free Counselling", program_name=input.preferred_track)
        
        return CounsellingLeadResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating counselling lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit lead")


@api_router.get("/counselling-leads", response_model=List[CounsellingLeadResponse])
async def get_counselling_leads():
    leads = await db.counselling_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        CounsellingLeadResponse(
            id=lead['id'], name=lead['name'], phone=lead['phone'], education=lead['education'],
            preferred_track=lead['preferred_track'], status=lead.get('status', 'new'),
            created_at=lead['created_at'] if isinstance(lead['created_at'], str) else lead['created_at'].isoformat()
        ) for lead in leads
    ]


@api_router.delete("/counselling-leads/{lead_id}")
async def delete_counselling_lead(lead_id: str):
    result = await db.counselling_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}


# ============ FAQ Routes ============

@api_router.post("/faqs", response_model=FAQResponse)
async def create_faq(input: FAQCreate, admin=Depends(get_current_admin)):
    try:
        faq_dict = input.model_dump()
        faq_obj = FAQ(**faq_dict)
        doc = faq_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.faqs.insert_one(doc)
        return FAQResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating FAQ: {e}")
        raise HTTPException(status_code=500, detail="Failed to create FAQ")


@api_router.get("/faqs", response_model=List[FAQResponse])
async def get_faqs(active_only: bool = True, category: Optional[str] = None):
    query = {}
    if active_only:
        query["is_active"] = True
    if category:
        query["category"] = category
    faqs = await db.faqs.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        FAQResponse(
            id=f['id'], question=f['question'], answer=f['answer'],
            category=f['category'], order=f.get('order', 0), is_active=f['is_active'],
            created_at=f['created_at'] if isinstance(f['created_at'], str) else f['created_at'].isoformat()
        ) for f in faqs
    ]


@api_router.put("/faqs/{faq_id}", response_model=FAQResponse)
async def update_faq(faq_id: str, input: FAQUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.faqs.update_one({"id": faq_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    faq = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    return FAQResponse(
        id=faq['id'], question=faq['question'], answer=faq['answer'],
        category=faq['category'], order=faq.get('order', 0), is_active=faq['is_active'],
        created_at=faq['created_at'] if isinstance(faq['created_at'], str) else faq['created_at'].isoformat()
    )


@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, admin=Depends(get_current_admin)):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}


# ============ SEO Settings Routes ============

@api_router.post("/seo", response_model=SEOSettingsResponse)
async def upsert_seo_settings(input: SEOSettingsCreate):
    try:
        existing = await db.seo_settings.find_one({"page_slug": input.page_slug})
        seo_dict = input.model_dump()
        seo_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        if existing:
            await db.seo_settings.update_one(
                {"page_slug": input.page_slug},
                {"$set": seo_dict}
            )
            seo = await db.seo_settings.find_one({"page_slug": input.page_slug}, {"_id": 0})
        else:
            seo_obj = SEOSettings(**seo_dict)
            doc = seo_obj.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat() if not isinstance(doc['updated_at'], str) else doc['updated_at']
            await db.seo_settings.insert_one(doc)
            seo = doc
        
        return SEOSettingsResponse(
            id=seo['id'], page_slug=seo['page_slug'], meta_title=seo['meta_title'],
            meta_description=seo['meta_description'], meta_keywords=seo.get('meta_keywords'),
            og_title=seo.get('og_title'), og_description=seo.get('og_description'),
            og_image=seo.get('og_image'),
            updated_at=seo['updated_at'] if isinstance(seo['updated_at'], str) else seo['updated_at'].isoformat()
        )
    except Exception as e:
        logging.error(f"Error saving SEO settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save SEO settings")


@api_router.get("/seo", response_model=List[SEOSettingsResponse])
async def get_all_seo_settings():
    settings = await db.seo_settings.find({}, {"_id": 0}).to_list(100)
    return [
        SEOSettingsResponse(
            id=s['id'], page_slug=s['page_slug'], meta_title=s['meta_title'],
            meta_description=s['meta_description'], meta_keywords=s.get('meta_keywords'),
            og_title=s.get('og_title'), og_description=s.get('og_description'),
            og_image=s.get('og_image'),
            updated_at=s['updated_at'] if isinstance(s['updated_at'], str) else s['updated_at'].isoformat()
        ) for s in settings
    ]


@api_router.get("/seo/{page_slug}", response_model=SEOSettingsResponse)
async def get_seo_settings(page_slug: str):
    seo = await db.seo_settings.find_one({"page_slug": page_slug}, {"_id": 0})
    if not seo:
        raise HTTPException(status_code=404, detail="SEO settings not found for this page")
    return SEOSettingsResponse(
        id=seo['id'], page_slug=seo['page_slug'], meta_title=seo['meta_title'],
        meta_description=seo['meta_description'], meta_keywords=seo.get('meta_keywords'),
        og_title=seo.get('og_title'), og_description=seo.get('og_description'),
        og_image=seo.get('og_image'),
        updated_at=seo['updated_at'] if isinstance(seo['updated_at'], str) else seo['updated_at'].isoformat()
    )


@api_router.post("/seo/seed-all")
async def seed_all_seo(admin=Depends(get_current_admin)):
    """Seed all SEO settings to the database"""
    seo_data = [
        {
            "page_slug": "home",
            "meta_title": "ETI Educom® | Best Computer Training Institute in Pathankot",
            "meta_description": "ETI Educom is India's leading computer career school offering professional IT training, certifications & placement support. Join our industry-aligned programs today!",
            "meta_keywords": "computer training institute, IT courses, professional certification, career training, Pathankot",
            "og_title": "ETI Educom® - The Computer Career School",
            "og_description": "Transform your career with industry-recognized IT certifications and hands-on training at ETI Educom."
        },
        {
            "page_slug": "about",
            "meta_title": "About ETI Educom | Our Story & Mission",
            "meta_description": "Learn about ETI Educom's mission to bridge the gap between education and industry. Discover our structured career tracks and commitment to student success.",
            "meta_keywords": "about ETI Educom, computer training institute, career school, IT education",
            "og_title": "About ETI Educom - Building Digital Careers Since 2017",
            "og_description": "ETI Educom is India's trusted Computer Career School transforming students into industry-ready professionals."
        },
        {
            "page_slug": "contact",
            "meta_title": "Contact ETI Educom | Get in Touch",
            "meta_description": "Contact ETI Educom for course inquiries, admissions, and career guidance. Visit our centers in Pathankot or reach us online.",
            "meta_keywords": "contact ETI Educom, IT training inquiry, admission, career guidance",
            "og_title": "Contact ETI Educom",
            "og_description": "Get in touch with ETI Educom for course information and career guidance."
        },
        {
            "page_slug": "founder",
            "meta_title": "Founder's Desk | ETI Educom",
            "meta_description": "Message from the founder of ETI Educom. Learn about the vision and mission that drives India's leading computer career school.",
            "meta_keywords": "ETI Educom founder, vision, mission, leadership",
            "og_title": "Founder's Message - ETI Educom",
            "og_description": "Learn about the vision behind ETI Educom from our founder."
        },
        {
            "page_slug": "franchise",
            "meta_title": "Franchise Opportunity | Partner with ETI Educom",
            "meta_description": "Start your education business with ETI Educom franchise. Get brand authorization, CATC certification support, and comprehensive training programs.",
            "meta_keywords": "ETI Educom franchise, education franchise, computer training franchise, business opportunity",
            "og_title": "ETI Educom Franchise Opportunity",
            "og_description": "Partner with ETI Educom and build a future-proof education business."
        },
        {
            "page_slug": "team",
            "meta_title": "Our Team | Meet the Experts at ETI Educom",
            "meta_description": "Meet the dedicated team of industry experts and educators at ETI Educom who are committed to shaping future IT professionals.",
            "meta_keywords": "ETI Educom team, faculty, trainers, experts",
            "og_title": "Meet Our Team - ETI Educom",
            "og_description": "Dedicated experts committed to your career success."
        },
        {
            "page_slug": "events",
            "meta_title": "Events & Workshops | ETI Educom",
            "meta_description": "Explore upcoming events, workshops, and seminars at ETI Educom. Stay updated with our tech talks and career guidance sessions.",
            "meta_keywords": "IT events, workshops, seminars, tech talks, career guidance",
            "og_title": "Events at ETI Educom",
            "og_description": "Join our workshops and events to enhance your skills."
        },
        {
            "page_slug": "blogs",
            "meta_title": "Blog | Tech Insights & Career Tips | ETI Educom",
            "meta_description": "Read our latest blog posts on technology trends, career advice, and industry insights. Stay informed with ETI Educom's expert content.",
            "meta_keywords": "tech blog, career tips, IT trends, education blog",
            "og_title": "ETI Educom Blog",
            "og_description": "Tech insights and career tips from industry experts."
        },
        {
            "page_slug": "faq",
            "meta_title": "FAQ | Frequently Asked Questions | ETI Educom",
            "meta_description": "Find answers to commonly asked questions about ETI Educom's courses, admissions, certifications, and placement support.",
            "meta_keywords": "FAQ, questions, admissions, courses, certifications",
            "og_title": "Frequently Asked Questions - ETI Educom",
            "og_description": "Get answers to your questions about our programs."
        },
        {
            "page_slug": "hire-from-us",
            "meta_title": "Hire From Us | Recruit Trained Professionals | ETI Educom",
            "meta_description": "Hire skilled IT professionals trained at ETI Educom. Our graduates are industry-ready with practical experience and certifications.",
            "meta_keywords": "hire IT professionals, recruitment, trained candidates, placement",
            "og_title": "Hire From ETI Educom",
            "og_description": "Recruit industry-ready professionals from our talent pool."
        },
        {
            "page_slug": "join-team",
            "meta_title": "Careers at ETI Educom | Join Our Team",
            "meta_description": "Explore career opportunities at ETI Educom. Join our team of passionate educators and help shape the future of IT education.",
            "meta_keywords": "careers, jobs, ETI Educom jobs, teaching jobs",
            "og_title": "Join Our Team - ETI Educom",
            "og_description": "Be part of India's leading computer career school."
        },
        {
            "page_slug": "programs",
            "meta_title": "Programs & Courses | IT Training | ETI Educom",
            "meta_description": "Explore our comprehensive range of IT programs including career tracks, certifications, and skill development courses at ETI Educom.",
            "meta_keywords": "IT programs, courses, certifications, career tracks",
            "og_title": "Programs at ETI Educom",
            "og_description": "Industry-aligned IT training programs for your career."
        },
        {
            "page_slug": "free-counselling",
            "meta_title": "Free Career Counselling | ETI Educom",
            "meta_description": "Get free career counselling from ETI Educom experts. Discover the right IT career path based on your interests and goals.",
            "meta_keywords": "free counselling, career guidance, IT career, consultation",
            "og_title": "Free Career Counselling - ETI Educom",
            "og_description": "Get expert guidance for your IT career journey."
        },
        {
            "page_slug": "cyber-warriors",
            "meta_title": "Cyber Warriors | Cybersecurity Training | ETI Educom",
            "meta_description": "Join the Cyber Warriors program at ETI Educom. Comprehensive cybersecurity training for ethical hacking, security operations and digital defense.",
            "meta_keywords": "cybersecurity training, ethical hacking, cyber warriors, security",
            "og_title": "Cyber Warriors - ETI Educom",
            "og_description": "Become a cybersecurity professional with expert training."
        },
        {
            "page_slug": "summer-training",
            "meta_title": "Summer Training Program | ETI Educom",
            "meta_description": "Join ETI Educom's summer training program. Hands-on IT training with certifications during your summer break.",
            "meta_keywords": "summer training, vacation courses, IT internship, summer program",
            "og_title": "Summer Training - ETI Educom",
            "og_description": "Make your summer productive with our training programs."
        },
        {
            "page_slug": "industrial-training",
            "meta_title": "6 Weeks Industrial Training | ETI Educom | Rs. 6,999",
            "meta_description": "45 Days Industrial Training for BCA, MCA, BTech, MTech students. International Certifications, Expert Trainers, Project Development Support. Technologies: Python, Java, Web Design, CCNA & more.",
            "meta_keywords": "6 weeks industrial training, industrial training for BCA, MCA industrial training, BTech summer training, project training",
            "og_title": "6 Weeks Industrial Training | ETI Educom",
            "og_description": "Get 45 days hands-on industrial training with International Certification at just Rs. 6,999."
        },
        {
            "page_slug": "privacy-policy",
            "meta_title": "Privacy Policy | ETI Educom",
            "meta_description": "Read ETI Educom's privacy policy. Learn how we collect, use, and protect your personal information.",
            "meta_keywords": "privacy policy, data protection, terms",
            "og_title": "Privacy Policy - ETI Educom",
            "og_description": "Our commitment to protecting your privacy."
        }
    ]
    
    # Clear existing SEO settings and insert new ones
    await db.seo_settings.delete_many({})
    
    for seo_item in seo_data:
        seo = SEOSettings(
            page_slug=seo_item["page_slug"],
            meta_title=seo_item["meta_title"],
            meta_description=seo_item["meta_description"],
            meta_keywords=seo_item.get("meta_keywords"),
            og_title=seo_item.get("og_title"),
            og_description=seo_item.get("og_description"),
            og_image=seo_item.get("og_image")
        )
        doc = seo.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.seo_settings.insert_one(doc)
    
    return {"message": f"Successfully seeded {len(seo_data)} SEO settings"}


# ============ Technical SEO Routes ============

@api_router.post("/technical-seo", response_model=TechnicalSEOResponse)
async def upsert_technical_seo(input: TechnicalSEOCreate):
    try:
        existing = await db.technical_seo.find_one({})
        seo_dict = input.model_dump()
        seo_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        if existing:
            await db.technical_seo.update_one(
                {"id": existing['id']},
                {"$set": seo_dict}
            )
            seo = await db.technical_seo.find_one({"id": existing['id']}, {"_id": 0})
        else:
            seo_obj = TechnicalSEO(**seo_dict)
            doc = seo_obj.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat() if not isinstance(doc['updated_at'], str) else doc['updated_at']
            await db.technical_seo.insert_one(doc)
            seo = doc
        
        return TechnicalSEOResponse(
            id=seo['id'],
            google_analytics_id=seo.get('google_analytics_id'),
            google_tag_manager_id=seo.get('google_tag_manager_id'),
            facebook_pixel_id=seo.get('facebook_pixel_id'),
            sitemap_url=seo.get('sitemap_url'),
            robots_txt=seo.get('robots_txt'),
            custom_head_scripts=seo.get('custom_head_scripts'),
            updated_at=seo['updated_at'] if isinstance(seo['updated_at'], str) else seo['updated_at'].isoformat()
        )
    except Exception as e:
        logging.error(f"Error saving Technical SEO settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save Technical SEO settings")


@api_router.get("/technical-seo", response_model=TechnicalSEOResponse)
async def get_technical_seo():
    seo = await db.technical_seo.find_one({}, {"_id": 0})
    if not seo:
        return TechnicalSEOResponse(
            id="", google_analytics_id=None, google_tag_manager_id=None,
            facebook_pixel_id=None, sitemap_url=None, robots_txt=None,
            custom_head_scripts=None, updated_at=datetime.now(timezone.utc).isoformat()
        )
    return TechnicalSEOResponse(
        id=seo['id'],
        google_analytics_id=seo.get('google_analytics_id'),
        google_tag_manager_id=seo.get('google_tag_manager_id'),
        facebook_pixel_id=seo.get('facebook_pixel_id'),
        sitemap_url=seo.get('sitemap_url'),
        robots_txt=seo.get('robots_txt'),
        custom_head_scripts=seo.get('custom_head_scripts'),
        updated_at=seo['updated_at'] if isinstance(seo['updated_at'], str) else seo['updated_at'].isoformat()
    )


# ============ MSG91 WhatsApp Settings Routes ============

@api_router.get("/msg91-settings")
async def get_msg91_settings():
    settings = await db.msg91_settings.find_one({}, {"_id": 0})
    if not settings:
        return {
            "auth_key": "",
            "integrated_number": "918728054145",
            "template_name": "eti_certificate",
            "template_namespace": "73fda5e9_77e9_445f_82ac_9c2e532b32f4",
            "is_enabled": False,
            "thank_you_message": "Thank you for your enquiry! Our team will contact you shortly."
        }
    # Mask auth key for security (show only last 4 chars)
    masked_key = ""
    if settings.get("auth_key"):
        key = settings["auth_key"]
        masked_key = "*" * (len(key) - 4) + key[-4:] if len(key) > 4 else key
    return {
        **settings,
        "auth_key_masked": masked_key,
        "auth_key": ""  # Don't send full key to frontend
    }


@api_router.post("/msg91-settings")
async def save_msg91_settings(input: MSG91SettingsUpdate):
    try:
        update_data = {}
        if input.auth_key is not None and input.auth_key != "":
            update_data["auth_key"] = input.auth_key
        if input.integrated_number is not None:
            update_data["integrated_number"] = input.integrated_number
        if input.template_name is not None:
            update_data["template_name"] = input.template_name
        if input.template_namespace is not None:
            update_data["template_namespace"] = input.template_namespace
        if input.is_enabled is not None:
            update_data["is_enabled"] = input.is_enabled
        if input.thank_you_message is not None:
            update_data["thank_you_message"] = input.thank_you_message
        
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        await db.msg91_settings.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        return {"message": "MSG91 settings saved successfully"}
    except Exception as e:
        logging.error(f"Error saving MSG91 settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save MSG91 settings")


@api_router.post("/msg91-settings/test")
async def test_msg91_whatsapp(phone: str, name: str = "Test User", admin=Depends(get_current_admin)):
    """Test WhatsApp integration with a test message"""
    result = await send_whatsapp_thank_you(phone, name, "Test Message")
    if result:
        return {"message": "Test WhatsApp sent successfully", "success": True}
    else:
        return {"message": "Failed to send test WhatsApp. Check settings and logs.", "success": False}


# ============ Founder Settings Routes ============

@api_router.get("/founder-settings", response_model=FounderSettingsResponse)
async def get_founder_settings():
    settings = await db.founder_settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        return FounderSettingsResponse(
            id="default",
            name="Deepak Kumar",
            title="Founder & CEO",
            image_url=None,
            message="",
            vision="",
            linkedin=None,
            twitter=None,
            updated_at=datetime.now(timezone.utc).isoformat()
        )
    return FounderSettingsResponse(
        id=settings['id'],
        name=settings['name'],
        title=settings['title'],
        image_url=settings.get('image_url'),
        message=settings.get('message', ''),
        vision=settings.get('vision', ''),
        linkedin=settings.get('linkedin'),
        twitter=settings.get('twitter'),
        updated_at=settings['updated_at'] if isinstance(settings['updated_at'], str) else settings['updated_at'].isoformat()
    )


@api_router.put("/founder-settings", response_model=FounderSettingsResponse)
async def update_founder_settings(input: FounderSettingsUpdate):
    try:
        existing = await db.founder_settings.find_one({})
        update_data = {k: v for k, v in input.model_dump().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        if existing:
            await db.founder_settings.update_one(
                {"id": existing['id']},
                {"$set": update_data}
            )
            settings = await db.founder_settings.find_one({"id": existing['id']}, {"_id": 0})
        else:
            # Create new settings
            settings_obj = FounderSettings(**update_data)
            doc = settings_obj.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat() if not isinstance(doc['updated_at'], str) else doc['updated_at']
            await db.founder_settings.insert_one(doc)
            settings = doc
        
        return FounderSettingsResponse(
            id=settings['id'],
            name=settings['name'],
            title=settings['title'],
            image_url=settings.get('image_url'),
            message=settings.get('message', ''),
            vision=settings.get('vision', ''),
            linkedin=settings.get('linkedin'),
            twitter=settings.get('twitter'),
            updated_at=settings['updated_at'] if isinstance(settings['updated_at'], str) else settings['updated_at'].isoformat()
        )
    except Exception as e:
        logging.error(f"Error saving founder settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save founder settings")


# ============ Cyber Warriors Routes ============

@api_router.post("/cyber-warriors/register", response_model=CyberWarriorsRegistrationResponse)
async def create_cyber_warriors_registration(input: CyberWarriorsRegistrationCreate):
    try:
        reg_dict = input.model_dump()
        reg_obj = CyberWarriorsRegistration(**reg_dict)
        doc = reg_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.cyber_warriors_registrations.insert_one(doc)
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.contact_number, email=input.email, source="Cyber Warriors", program_name="Cybersecurity Awareness")
        
        return CyberWarriorsRegistrationResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating cyber warriors registration: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit registration")


@api_router.get("/cyber-warriors/registrations", response_model=List[CyberWarriorsRegistrationResponse])
async def get_cyber_warriors_registrations():
    regs = await db.cyber_warriors_registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        CyberWarriorsRegistrationResponse(
            id=r['id'], registration_type=r['registration_type'], name=r['name'],
            organization_name=r.get('organization_name'), organization_type=r.get('organization_type'),
            contact_number=r['contact_number'], email=r['email'],
            preferred_date=r.get('preferred_date'), message=r.get('message'),
            status=r.get('status', 'pending'),
            created_at=r['created_at'] if isinstance(r['created_at'], str) else r['created_at'].isoformat()
        ) for r in regs
    ]


@api_router.delete("/cyber-warriors/registrations/{reg_id}")
async def delete_cyber_warriors_registration(reg_id: str):
    result = await db.cyber_warriors_registrations.delete_one({"id": reg_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Registration deleted successfully"}


@api_router.post("/cyber-warriors/events", response_model=CyberWarriorsEventResponse)
async def create_cyber_warriors_event(input: CyberWarriorsEventCreate):
    try:
        event_dict = input.model_dump()
        event_obj = CyberWarriorsEvent(**event_dict)
        doc = event_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.cyber_warriors_events.insert_one(doc)
        return CyberWarriorsEventResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating cyber warriors event: {e}")
        raise HTTPException(status_code=500, detail="Failed to create event")


@api_router.get("/cyber-warriors/events", response_model=List[CyberWarriorsEventResponse])
async def get_cyber_warriors_events(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    events = await db.cyber_warriors_events.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [
        CyberWarriorsEventResponse(
            id=e['id'], title=e['title'], description=e['description'], image=e['image'],
            date=e.get('date'), is_active=e.get('is_active', True),
            created_at=e['created_at'] if isinstance(e['created_at'], str) else e['created_at'].isoformat()
        ) for e in events
    ]


@api_router.delete("/cyber-warriors/events/{event_id}")
async def delete_cyber_warriors_event(event_id: str):
    result = await db.cyber_warriors_events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


# ============ Cyber Warriors Assessment Routes ============

@api_router.post("/cyber-warriors/assessment", response_model=CyberWarriorsAssessmentResponse)
async def create_cyber_warriors_assessment(input: CyberWarriorsAssessmentCreate):
    try:
        assessment_dict = input.model_dump()
        
        # Generate certificate ID if passed
        certificate_id = None
        if input.passed:
            certificate_id = f"CW-{str(uuid.uuid4())[:8].upper()}"
        
        assessment_obj = CyberWarriorsAssessment(
            name=input.name,
            email=input.email,
            phone=input.phone,
            college=input.college,
            score=input.score,
            total=input.total,
            passed=input.passed,
            certificate_id=certificate_id
        )
        doc = assessment_obj.model_dump()
        doc['completed_at'] = doc['completed_at'].isoformat()
        await db.cyber_warriors_assessments.insert_one(doc)
        
        # Send WhatsApp congratulations if passed
        if input.passed:
            await send_whatsapp_thank_you(input.phone, input.name, "Cyber Warriors Assessment - Congratulations!")
        
        return CyberWarriorsAssessmentResponse(**{**doc, 'completed_at': doc['completed_at']})
    except Exception as e:
        logging.error(f"Error creating cyber warriors assessment: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit assessment")


@api_router.get("/cyber-warriors/assessments", response_model=List[CyberWarriorsAssessmentResponse])
async def get_cyber_warriors_assessments(passed_only: bool = False):
    query = {"passed": True} if passed_only else {}
    assessments = await db.cyber_warriors_assessments.find(query, {"_id": 0}).sort("completed_at", -1).to_list(1000)
    return [
        CyberWarriorsAssessmentResponse(
            id=a['id'], name=a['name'], email=a['email'], phone=a['phone'],
            college=a.get('college'), score=a['score'], total=a.get('total', 10),
            passed=a['passed'], certificate_id=a.get('certificate_id'),
            completed_at=a['completed_at'] if isinstance(a['completed_at'], str) else a['completed_at'].isoformat()
        ) for a in assessments
    ]


@api_router.get("/cyber-warriors/assessments/stats")
async def get_cyber_warriors_assessment_stats():
    total = await db.cyber_warriors_assessments.count_documents({})
    passed = await db.cyber_warriors_assessments.count_documents({"passed": True})
    failed = total - passed
    pass_rate = round((passed / total * 100), 1) if total > 0 else 0
    return {
        "total_attempts": total,
        "passed": passed,
        "failed": failed,
        "pass_rate": pass_rate
    }


@api_router.delete("/cyber-warriors/assessments/{assessment_id}")
async def delete_cyber_warriors_assessment(assessment_id: str):
    result = await db.cyber_warriors_assessments.delete_one({"id": assessment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"message": "Assessment deleted successfully"}


# ============ Cyber Warriors Video Reviews Models ============

class CyberWarriorsVideoReview(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    designation: str
    location: Optional[str] = None
    video_url: str  # YouTube/Instagram reel URL
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CyberWarriorsVideoReviewCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    designation: str = Field(..., min_length=2, max_length=200)
    location: Optional[str] = None
    video_url: str = Field(..., min_length=10)


class CyberWarriorsVideoReviewResponse(BaseModel):
    id: str
    name: str
    designation: str
    location: Optional[str]
    video_url: str
    is_active: bool
    created_at: str


# ============ Cyber Warriors Video Reviews Routes ============

@api_router.get("/cyber-warriors/video-reviews", response_model=List[CyberWarriorsVideoReviewResponse])
async def get_cyber_warriors_video_reviews(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    reviews = await db.cyber_warriors_video_reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    return [
        CyberWarriorsVideoReviewResponse(
            id=r['id'], name=r['name'], designation=r['designation'],
            location=r.get('location'), video_url=r['video_url'],
            is_active=r.get('is_active', True),
            created_at=r['created_at'] if isinstance(r['created_at'], str) else r['created_at'].isoformat()
        ) for r in reviews
    ]


@api_router.post("/cyber-warriors/video-reviews", response_model=CyberWarriorsVideoReviewResponse)
async def create_cyber_warriors_video_review(input: CyberWarriorsVideoReviewCreate):
    try:
        review_dict = input.model_dump()
        review_obj = CyberWarriorsVideoReview(**review_dict)
        doc = review_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.cyber_warriors_video_reviews.insert_one(doc)
        return CyberWarriorsVideoReviewResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating video review: {e}")
        raise HTTPException(status_code=500, detail="Failed to create video review")


@api_router.delete("/cyber-warriors/video-reviews/{review_id}")
async def delete_cyber_warriors_video_review(review_id: str):
    result = await db.cyber_warriors_video_reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video review not found")
    return {"message": "Video review deleted successfully"}


@api_router.put("/cyber-warriors/video-reviews/{review_id}/toggle")
async def toggle_cyber_warriors_video_review(review_id: str):
    review = await db.cyber_warriors_video_reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Video review not found")
    new_status = not review.get('is_active', True)
    await db.cyber_warriors_video_reviews.update_one(
        {"id": review_id},
        {"$set": {"is_active": new_status}}
    )
    return {"message": f"Video review {'activated' if new_status else 'deactivated'} successfully", "is_active": new_status}


# ============ Admin Auth Routes ============

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

@api_router.post("/admin/login", response_model=AdminLoginResponse)
@limiter.limit("5/minute")
async def admin_login(request: Request, input: AdminLogin):
    # Check if admin user exists in DB, if not seed it
    admin = await db.admin_users.find_one({"role": "admin"}, {"_id": 0})
    if not admin:
        admin_id = str(uuid.uuid4())
        hashed = hash_password(ADMIN_PASSWORD)
        admin = {"id": admin_id, "password_hash": hashed, "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()}
        await db.admin_users.insert_one(admin)
    
    if verify_password(input.password, admin["password_hash"]):
        token = create_jwt_token(admin["id"])
        return AdminLoginResponse(success=True, message="Login successful", token=token)
    return AdminLoginResponse(success=False, message="Invalid password", token=None)


@api_router.post("/admin/verify")
async def verify_admin(token: str = ""):
    try:
        payload = verify_jwt_token(token)
        return {"valid": True}
    except Exception:
        return {"valid": False}


@api_router.post("/admin/change-password")
async def change_admin_password(input: ChangePasswordRequest, admin=Depends(get_current_admin)):
    if not verify_password(input.current_password, admin["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    new_hash = hash_password(input.new_password)
    await db.admin_users.update_one({"id": admin["id"]}, {"$set": {"password_hash": new_hash}})
    return {"message": "Password changed successfully"}


# ============ File Upload Route ============

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".ico"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 5MB allowed.")
    
    # Upload to Cloudinary if configured
    if CLOUDINARY_ENABLED:
        try:
            import io
            result = cloudinary.uploader.upload(
                io.BytesIO(contents),
                folder="eti-educom",
                resource_type="image",
                quality="auto",
                fetch_format="auto"
            )
            return {"url": result["secure_url"], "filename": result.get("public_id", ""), "storage": "cloudinary"}
        except Exception as e:
            logging.error(f"Cloudinary upload failed: {e}, falling back to local storage")
    
    # Fallback to local storage
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOADS_DIR / unique_name
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {"url": f"/api/uploads/{unique_name}", "filename": unique_name, "storage": "local"}


# ============ Summer Training Lead Routes ============

@api_router.post("/summer-training-leads", response_model=SummerTrainingLeadResponse)
async def create_summer_training_lead(input: SummerTrainingLeadCreate):
    try:
        lead_dict = input.model_dump()
        lead_obj = SummerTrainingLead(**lead_dict)
        doc = lead_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.summer_training_leads.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "Summer Training")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, email=input.email or "", source="Summer Training", program_name=input.program_interest)
        
        return SummerTrainingLeadResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating summer training lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit lead")


@api_router.get("/summer-training-leads", response_model=List[SummerTrainingLeadResponse])
async def get_summer_training_leads():
    leads = await db.summer_training_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        SummerTrainingLeadResponse(
            id=lead['id'], name=lead['name'], email=lead.get('email'), phone=lead['phone'],
            program_interest=lead['program_interest'], duration=lead.get('duration', '6 weeks'),
            status=lead.get('status', 'new'),
            created_at=lead['created_at'] if isinstance(lead['created_at'], str) else lead['created_at'].isoformat()
        ) for lead in leads
    ]


@api_router.delete("/summer-training-leads/{lead_id}")
async def delete_summer_training_lead(lead_id: str):
    result = await db.summer_training_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}


# ============ Industrial Training Lead Routes ============

@api_router.post("/industrial-training-leads", response_model=IndustrialTrainingLeadResponse)
async def create_industrial_training_lead(input: IndustrialTrainingLeadCreate):
    try:
        lead_dict = input.model_dump()
        lead_obj = IndustrialTrainingLead(**lead_dict)
        doc = lead_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.industrial_training_leads.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "Industrial Training")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, email=input.email, source="Industrial Training", program_name=input.program_interest)
        
        return IndustrialTrainingLeadResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating industrial training lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit lead")


@api_router.get("/industrial-training-leads", response_model=List[IndustrialTrainingLeadResponse])
async def get_industrial_training_leads():
    leads = await db.industrial_training_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        IndustrialTrainingLeadResponse(
            id=lead['id'], name=lead['name'], email=lead['email'], phone=lead['phone'],
            college=lead.get('college'), course=lead.get('course'),
            program_interest=lead['program_interest'],
            status=lead.get('status', 'new'),
            created_at=lead['created_at'] if isinstance(lead['created_at'], str) else lead['created_at'].isoformat()
        ) for lead in leads
    ]


@api_router.delete("/industrial-training-leads/{lead_id}")
async def delete_industrial_training_lead(lead_id: str):
    result = await db.industrial_training_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}


# ============ Quick Enquiry Routes ============

@api_router.post("/quick-enquiry", response_model=QuickEnquiryResponse)
@limiter.limit("10/minute")
async def create_quick_enquiry(request: Request, input: QuickEnquiryCreate):
    try:
        enquiry_dict = input.model_dump()
        enquiry_obj = QuickEnquiry(**enquiry_dict)
        doc = enquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.quick_enquiries.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "Quick Enquiry")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, email=input.email or "", source="Quick Enquiry", program_name=input.interest)
        
        return QuickEnquiryResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating quick enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")


@api_router.get("/quick-enquiry", response_model=List[QuickEnquiryResponse])
async def get_quick_enquiries():
    enquiries = await db.quick_enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        QuickEnquiryResponse(
            id=e['id'], name=e['name'], phone=e['phone'], email=e.get('email'),
            interest=e['interest'], source=e.get('source', 'homepage'),
            status=e.get('status', 'new'),
            created_at=e['created_at'] if isinstance(e['created_at'], str) else e['created_at'].isoformat()
        ) for e in enquiries
    ]


@api_router.delete("/quick-enquiry/{enquiry_id}")
async def delete_quick_enquiry(enquiry_id: str):
    result = await db.quick_enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted successfully"}


# ============ Referral Routes ============

@api_router.post("/referrals", response_model=ReferralResponse)
async def create_referral(input: ReferralCreate):
    try:
        referral_dict = input.model_dump()
        referral_obj = Referral(**referral_dict)
        doc = referral_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.referrals.insert_one(doc)
        
        # Send WhatsApp thank you to referrer
        await send_whatsapp_thank_you(input.referrer_phone, input.referrer_name, "Referral Submission")
        
        # Send referred friend to CRM
        await send_lead_to_crm(name=input.friend_name, phone=input.friend_phone, email=input.referrer_email or "", source="Referral", program_name=input.program_interest or "Referred by " + input.referrer_name)
        
        return ReferralResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating referral: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit referral")


@api_router.get("/referrals", response_model=List[ReferralResponse])
async def get_referrals():
    referrals = await db.referrals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [
        ReferralResponse(
            id=r['id'], referrer_name=r['referrer_name'], referrer_phone=r['referrer_phone'],
            referrer_email=r.get('referrer_email'), friend_name=r['friend_name'],
            friend_phone=r['friend_phone'], program_interest=r.get('program_interest'),
            status=r.get('status', 'pending'), reward_amount=r.get('reward_amount'),
            created_at=r['created_at'] if isinstance(r['created_at'], str) else r['created_at'].isoformat()
        ) for r in referrals
    ]


@api_router.put("/referrals/{referral_id}")
async def update_referral(referral_id: str, status: str, reward_amount: Optional[float] = None):
    update_data = {"status": status}
    if reward_amount is not None:
        update_data["reward_amount"] = reward_amount
    result = await db.referrals.update_one({"id": referral_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Referral not found")
    return {"message": "Referral updated successfully"}


@api_router.delete("/referrals/{referral_id}")
async def delete_referral(referral_id: str):
    result = await db.referrals.delete_one({"id": referral_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Referral not found")
    return {"message": "Referral deleted successfully"}


# ============ Service Enquiry Routes ============

@api_router.post("/service-enquiry", response_model=ServiceEnquiryResponse)
async def create_service_enquiry(input: ServiceEnquiryCreate):
    try:
        enquiry_dict = input.model_dump()
        enquiry_obj = ServiceEnquiry(**enquiry_dict)
        doc = enquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.service_enquiries.insert_one(doc)
        
        # Send WhatsApp thank you
        service_name = "Corporate Training" if input.service_type == "corporate_training" else "Fly Me A Trainer"
        await send_whatsapp_thank_you(input.phone, input.contact_person, f"{service_name} Enquiry")
        
        # Send to CRM
        await send_lead_to_crm(name=input.contact_person, phone=input.phone, email=input.email, source=f"Service - {service_name}", program_name=input.training_topic or service_name)
        
        return ServiceEnquiryResponse(**{**doc, 'created_at': doc['created_at']})
    except Exception as e:
        logging.error(f"Error creating service enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")


@api_router.get("/service-enquiry")
async def get_service_enquiries(service_type: Optional[str] = None):
    query = {}
    if service_type:
        query["service_type"] = service_type
    enquiries = await db.service_enquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return enquiries


@api_router.put("/service-enquiry/{enquiry_id}")
async def update_service_enquiry(enquiry_id: str, status: str):
    result = await db.service_enquiries.update_one({"id": enquiry_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry updated successfully"}


@api_router.delete("/service-enquiry/{enquiry_id}")
async def delete_service_enquiry(enquiry_id: str):
    result = await db.service_enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted successfully"}


# ============ EduConnect Routes ============

@api_router.get("/educonnect/universities")
async def get_educonnect_universities():
    universities = await db.educonnect_universities.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return universities


@api_router.post("/educonnect/universities")
async def create_educonnect_university(name: str, logo: Optional[str] = None, order: int = 0):
    uni = EduConnectUniversity(name=name, logo=logo, order=order)
    doc = uni.model_dump()
    await db.educonnect_universities.insert_one(doc)
    return {"message": "University added successfully", "id": doc["id"]}


@api_router.put("/educonnect/universities/{uni_id}")
async def update_educonnect_university(uni_id: str, name: Optional[str] = None, logo: Optional[str] = None, is_active: Optional[bool] = None, order: Optional[int] = None):
    update_data = {}
    if name is not None: update_data["name"] = name
    if logo is not None: update_data["logo"] = logo
    if is_active is not None: update_data["is_active"] = is_active
    if order is not None: update_data["order"] = order
    
    result = await db.educonnect_universities.update_one({"id": uni_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    return {"message": "University updated successfully"}


@api_router.delete("/educonnect/universities/{uni_id}")
async def delete_educonnect_university(uni_id: str):
    result = await db.educonnect_universities.delete_one({"id": uni_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    return {"message": "University deleted successfully"}


@api_router.get("/educonnect/programs")
async def get_educonnect_programs():
    programs = await db.educonnect_programs.find({"is_active": True}, {"_id": 0}).to_list(100)
    return programs


@api_router.post("/educonnect/programs")
async def create_educonnect_program(name: str, duration: str, type: str = "UG"):
    prog = EduConnectProgram(name=name, duration=duration, type=type)
    doc = prog.model_dump()
    await db.educonnect_programs.insert_one(doc)
    return {"message": "Program added successfully", "id": doc["id"]}


@api_router.delete("/educonnect/programs/{prog_id}")
async def delete_educonnect_program(prog_id: str):
    result = await db.educonnect_programs.delete_one({"id": prog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted successfully"}


@api_router.post("/educonnect/enquiry")
async def create_educonnect_enquiry(input: EduConnectEnquiryCreate):
    try:
        enquiry_dict = input.model_dump()
        enquiry_obj = EduConnectEnquiry(**enquiry_dict)
        doc = enquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.educonnect_enquiries.insert_one(doc)
        
        # Send WhatsApp thank you
        await send_whatsapp_thank_you(input.phone, input.name, "EduConnect Enquiry")
        
        # Send to CRM
        await send_lead_to_crm(name=input.name, phone=input.phone, source="ETI EduConnect", program_name=input.program_interest or "Distance Learning")
        
        return {"message": "Enquiry submitted successfully", "id": doc["id"]}
    except Exception as e:
        logging.error(f"Error creating EduConnect enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")


@api_router.get("/educonnect/enquiries")
async def get_educonnect_enquiries():
    enquiries = await db.educonnect_enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return enquiries


@api_router.delete("/educonnect/enquiries/{enquiry_id}")
async def delete_educonnect_enquiry(enquiry_id: str):
    result = await db.educonnect_enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted successfully"}


# ============ Announcement Routes ============

@api_router.post("/announcements", response_model=AnnouncementResponse)
async def create_announcement(input: AnnouncementCreate):
    try:
        ann_dict = input.model_dump()
        ann_obj = Announcement(**ann_dict)
        doc = ann_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.announcements.insert_one(doc)
        return AnnouncementResponse(**doc)
    except Exception as e:
        logging.error(f"Error creating announcement: {e}")
        raise HTTPException(status_code=500, detail="Failed to create announcement")


@api_router.get("/announcements", response_model=List[AnnouncementResponse])
async def get_announcements(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    announcements = await db.announcements.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        AnnouncementResponse(
            id=a['id'], text=a['text'], link=a.get('link'), link_text=a.get('link_text'),
            is_active=a.get('is_active', True), order=a.get('order', 0),
            created_at=a['created_at'] if isinstance(a['created_at'], str) else a['created_at'].isoformat()
        ) for a in announcements
    ]


@api_router.put("/announcements/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(announcement_id: str, input: AnnouncementUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.announcements.update_one({"id": announcement_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    ann = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return AnnouncementResponse(
        id=ann['id'], text=ann['text'], link=ann.get('link'), link_text=ann.get('link_text'),
        is_active=ann.get('is_active', True), order=ann.get('order', 0),
        created_at=ann['created_at'] if isinstance(ann['created_at'], str) else ann['created_at'].isoformat()
    )


@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str):
    result = await db.announcements.delete_one({"id": announcement_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"message": "Announcement deleted successfully"}


@api_router.get("/cyber-warriors/upcoming-events")
async def get_upcoming_cyber_warriors_events():
    """Get Cyber Warriors events happening within the next 3 days for announcement bar"""
    from datetime import timedelta
    today = datetime.now(timezone.utc).date()
    three_days_later = today + timedelta(days=3)
    
    events = await db.cyber_warriors_events.find({"is_active": True}, {"_id": 0}).to_list(100)
    upcoming = []
    for event in events:
        event_date_str = event.get('date')
        if event_date_str:
            try:
                event_date = datetime.strptime(event_date_str, "%Y-%m-%d").date()
                if today <= event_date <= three_days_later:
                    upcoming.append({
                        "id": event['id'],
                        "title": event['title'],
                        "date": event_date_str,
                        "is_today": event_date == today,
                        "days_until": (event_date - today).days
                    })
            except ValueError:
                continue
    
    return upcoming


# ============ Popup Modal Routes ============

@api_router.get("/popup-modal")
async def get_popup_modal():
    """Get active popup modal for frontend"""
    modal = await db.popup_modal.find_one({"is_active": True}, {"_id": 0})
    if not modal:
        return None
    return PopupModalResponse(
        id=modal['id'], title=modal['title'], body=modal['body'],
        image_url=modal.get('image_url'), cta_text=modal.get('cta_text'),
        cta_link=modal.get('cta_link'), delay_seconds=modal.get('delay_seconds', 4),
        is_active=modal.get('is_active', True),
        updated_at=modal['updated_at'] if isinstance(modal['updated_at'], str) else modal['updated_at'].isoformat()
    )


@api_router.get("/popup-modal/admin")
async def get_popup_modal_admin():
    """Get popup modal for admin (regardless of active status)"""
    modal = await db.popup_modal.find_one({}, {"_id": 0})
    if not modal:
        return None
    return PopupModalResponse(
        id=modal['id'], title=modal['title'], body=modal['body'],
        image_url=modal.get('image_url'), cta_text=modal.get('cta_text'),
        cta_link=modal.get('cta_link'), delay_seconds=modal.get('delay_seconds', 4),
        is_active=modal.get('is_active', True),
        updated_at=modal['updated_at'] if isinstance(modal['updated_at'], str) else modal['updated_at'].isoformat()
    )


@api_router.post("/popup-modal", response_model=PopupModalResponse)
async def create_or_update_popup_modal(input: PopupModalCreate):
    """Create or update the popup modal (only one exists at a time)"""
    try:
        # Check if a modal already exists
        existing = await db.popup_modal.find_one({}, {"_id": 0})
        
        modal_dict = input.model_dump()
        modal_dict['is_active'] = True
        modal_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        if existing:
            # Update existing
            modal_dict['id'] = existing['id']
            await db.popup_modal.update_one({"id": existing['id']}, {"$set": modal_dict})
        else:
            # Create new
            modal_obj = PopupModal(**modal_dict)
            modal_dict = modal_obj.model_dump()
            modal_dict['updated_at'] = modal_dict['updated_at'].isoformat()
            await db.popup_modal.insert_one(modal_dict)
        
        return PopupModalResponse(**modal_dict)
    except Exception as e:
        logging.error(f"Error saving popup modal: {e}")
        raise HTTPException(status_code=500, detail="Failed to save popup modal")


@api_router.put("/popup-modal/toggle")
async def toggle_popup_modal():
    """Toggle the active status of the popup modal"""
    modal = await db.popup_modal.find_one({}, {"_id": 0})
    if not modal:
        raise HTTPException(status_code=404, detail="No popup modal configured")
    
    new_status = not modal.get('is_active', True)
    await db.popup_modal.update_one(
        {"id": modal['id']}, 
        {"$set": {"is_active": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": f"Popup modal {'activated' if new_status else 'deactivated'}", "is_active": new_status}


@api_router.delete("/popup-modal")
async def delete_popup_modal():
    """Delete the popup modal"""
    result = await db.popup_modal.delete_many({})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No popup modal to delete")
    return {"message": "Popup modal deleted successfully"}


# ============ Team Member Routes ============

@api_router.post("/team", response_model=TeamMemberResponse)
async def create_team_member(input: TeamMemberCreate, admin=Depends(get_current_admin)):
    try:
        member_dict = input.model_dump()
        member_obj = TeamMember(**member_dict)
        doc = member_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.team_members.insert_one(doc)
        return TeamMemberResponse(**doc)
    except Exception as e:
        logging.error(f"Error creating team member: {e}")
        raise HTTPException(status_code=500, detail="Failed to create team member")


@api_router.get("/team", response_model=List[TeamMemberResponse])
async def get_team_members(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    members = await db.team_members.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        TeamMemberResponse(
            id=m['id'], name=m['name'], title=m['title'], bio=m.get('bio'),
            photo_url=m.get('photo_url'), linkedin_url=m.get('linkedin_url'),
            twitter_url=m.get('twitter_url'), email=m.get('email'),
            order=m.get('order', 0), is_active=m.get('is_active', True),
            created_at=m['created_at'] if isinstance(m['created_at'], str) else m['created_at'].isoformat()
        ) for m in members
    ]


@api_router.put("/team/{member_id}", response_model=TeamMemberResponse)
async def update_team_member(member_id: str, input: TeamMemberUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.team_members.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    member = await db.team_members.find_one({"id": member_id}, {"_id": 0})
    return TeamMemberResponse(
        id=member['id'], name=member['name'], title=member['title'], bio=member.get('bio'),
        photo_url=member.get('photo_url'), linkedin_url=member.get('linkedin_url'),
        twitter_url=member.get('twitter_url'), email=member.get('email'),
        order=member.get('order', 0), is_active=member.get('is_active', True),
        created_at=member['created_at'] if isinstance(member['created_at'], str) else member['created_at'].isoformat()
    )


@api_router.delete("/team/{member_id}")
async def delete_team_member(member_id: str, admin=Depends(get_current_admin)):
    result = await db.team_members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted successfully"}


# ============ Branch Routes ============

@api_router.post("/branches", response_model=BranchResponse)
async def create_branch(input: BranchCreate):
    try:
        branch_dict = input.model_dump()
        branch_obj = Branch(**branch_dict)
        doc = branch_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.branches.insert_one(doc)
        return BranchResponse(**doc)
    except Exception as e:
        logging.error(f"Error creating branch: {e}")
        raise HTTPException(status_code=500, detail="Failed to create branch")


@api_router.get("/branches", response_model=List[BranchResponse])
async def get_branches(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    branches = await db.branches.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        BranchResponse(
            id=b['id'], name=b['name'], slug=b['slug'], address=b['address'],
            city=b['city'], state=b['state'], phone=b['phone'], email=b['email'],
            map_url=b.get('map_url'), image_url=b.get('image_url'),
            description=b.get('description'), facilities=b.get('facilities', []),
            timings=b.get('timings'), is_active=b.get('is_active', True),
            order=b.get('order', 0),
            created_at=b['created_at'] if isinstance(b['created_at'], str) else b['created_at'].isoformat()
        ) for b in branches
    ]


@api_router.get("/branches/{branch_slug}", response_model=BranchResponse)
async def get_branch(branch_slug: str):
    branch = await db.branches.find_one({"slug": branch_slug, "is_active": True}, {"_id": 0})
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return BranchResponse(
        id=branch['id'], name=branch['name'], slug=branch['slug'], address=branch['address'],
        city=branch['city'], state=branch['state'], phone=branch['phone'], email=branch['email'],
        map_url=branch.get('map_url'), image_url=branch.get('image_url'),
        description=branch.get('description'), facilities=branch.get('facilities', []),
        timings=branch.get('timings'), is_active=branch.get('is_active', True),
        order=branch.get('order', 0),
        created_at=branch['created_at'] if isinstance(branch['created_at'], str) else branch['created_at'].isoformat()
    )


@api_router.put("/branches/{branch_id}", response_model=BranchResponse)
async def update_branch(branch_id: str, input: BranchUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.branches.update_one({"id": branch_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Branch not found")
    branch = await db.branches.find_one({"id": branch_id}, {"_id": 0})
    return BranchResponse(
        id=branch['id'], name=branch['name'], slug=branch['slug'], address=branch['address'],
        city=branch['city'], state=branch['state'], phone=branch['phone'], email=branch['email'],
        map_url=branch.get('map_url'), image_url=branch.get('image_url'),
        description=branch.get('description'), facilities=branch.get('facilities', []),
        timings=branch.get('timings'), is_active=branch.get('is_active', True),
        order=branch.get('order', 0),
        created_at=branch['created_at'] if isinstance(branch['created_at'], str) else branch['created_at'].isoformat()
    )


@api_router.delete("/branches/{branch_id}")
async def delete_branch(branch_id: str):
    result = await db.branches.delete_one({"id": branch_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Branch not found")
    return {"message": "Branch deleted successfully"}


# ============ Partners Models ============

class Partner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=100)
    logo_url: str = Field(..., min_length=1)
    website_url: Optional[str] = None
    partner_type: str = Field(..., pattern="^(placement|certification)$")  # placement or certification
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PartnerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    logo_url: str = Field(..., min_length=1)
    website_url: Optional[str] = None
    partner_type: str = Field(..., pattern="^(placement|certification)$")
    order: int = 0
    is_active: bool = True


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class PartnerResponse(BaseModel):
    id: str
    name: str
    logo_url: str
    website_url: Optional[str]
    partner_type: str
    order: int
    is_active: bool
    created_at: str


# ============ Partners Routes ============

@api_router.post("/partners", response_model=PartnerResponse)
async def create_partner(input: PartnerCreate, admin=Depends(get_current_admin)):
    try:
        partner_dict = input.model_dump()
        partner_obj = Partner(**partner_dict)
        doc = partner_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.partners.insert_one(doc)
        return PartnerResponse(**doc)
    except Exception as e:
        logging.error(f"Error creating partner: {e}")
        raise HTTPException(status_code=500, detail="Failed to create partner")


@api_router.get("/partners", response_model=List[PartnerResponse])
async def get_partners(partner_type: Optional[str] = None, active_only: bool = True):
    query = {}
    if active_only:
        query["is_active"] = True
    if partner_type:
        query["partner_type"] = partner_type
    partners = await db.partners.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return [
        PartnerResponse(
            id=p['id'], name=p['name'], logo_url=p['logo_url'],
            website_url=p.get('website_url'), partner_type=p['partner_type'],
            order=p.get('order', 0), is_active=p.get('is_active', True),
            created_at=p['created_at'] if isinstance(p['created_at'], str) else p['created_at'].isoformat()
        ) for p in partners
    ]


@api_router.put("/partners/{partner_id}", response_model=PartnerResponse)
async def update_partner(partner_id: str, input: PartnerUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.partners.update_one({"id": partner_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    partner = await db.partners.find_one({"id": partner_id}, {"_id": 0})
    return PartnerResponse(
        id=partner['id'], name=partner['name'], logo_url=partner['logo_url'],
        website_url=partner.get('website_url'), partner_type=partner['partner_type'],
        order=partner.get('order', 0), is_active=partner.get('is_active', True),
        created_at=partner['created_at'] if isinstance(partner['created_at'], str) else partner['created_at'].isoformat()
    )


@api_router.delete("/partners/{partner_id}")
async def delete_partner(partner_id: str, admin=Depends(get_current_admin)):
    result = await db.partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted successfully"}


# ============ Sitemap Generation ============

@api_router.get("/sitemap.xml")
async def generate_sitemap():
    """Generate dynamic sitemap.xml"""
    base_url = "https://etieducom.com"
    
    # Static pages with priorities
    static_pages = [
        {"url": "/", "priority": "1.0", "changefreq": "weekly"},
        {"url": "/about", "priority": "0.9", "changefreq": "monthly"},
        {"url": "/founder", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/programs", "priority": "0.9", "changefreq": "weekly"},
        {"url": "/events", "priority": "0.8", "changefreq": "weekly"},
        {"url": "/blogs", "priority": "0.8", "changefreq": "daily"},
        {"url": "/faq", "priority": "0.7", "changefreq": "monthly"},
        {"url": "/contact", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/franchise", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/hire-from-us", "priority": "0.7", "changefreq": "monthly"},
        {"url": "/join-team", "priority": "0.7", "changefreq": "weekly"},
        {"url": "/team", "priority": "0.7", "changefreq": "monthly"},
        {"url": "/cyber-warriors", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/free-counselling", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/summer-training", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/industrial-training", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/privacy-policy", "priority": "0.3", "changefreq": "yearly"},
    ]
    
    # Build XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add static pages
    for page in static_pages:
        xml_content += f'''  <url>
    <loc>{base_url}{page["url"]}</loc>
    <changefreq>{page["changefreq"]}</changefreq>
    <priority>{page["priority"]}</priority>
  </url>\n'''
    
    # Add dynamic program pages
    try:
        programs = await db.programs.find({"is_active": True}, {"id": 1}).to_list(100)
        for program in programs:
            xml_content += f'''  <url>
    <loc>{base_url}/programs/{program["id"]}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n'''
    except Exception as e:
        logging.error(f"Error fetching programs for sitemap: {e}")
    
    # Add dynamic blog pages
    try:
        blogs = await db.blogs.find({"is_published": True}, {"slug": 1}).to_list(100)
        for blog in blogs:
            xml_content += f'''  <url>
    <loc>{base_url}/blogs/{blog["slug"]}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n'''
    except Exception as e:
        logging.error(f"Error fetching blogs for sitemap: {e}")
    
    # Add branch pages
    try:
        branches = await db.branches.find({"is_active": True}, {"id": 1}).to_list(50)
        for branch in branches:
            xml_content += f'''  <url>
    <loc>{base_url}/branches/{branch["id"]}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n'''
    except Exception as e:
        logging.error(f"Error fetching branches for sitemap: {e}")
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")


# Include the router in the main app
app.include_router(api_router)

# Rate limit error handler
from fastapi.responses import JSONResponse
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Too many requests. Please slow down."})

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_admin_user():
    """Seed admin user with bcrypt hashed password on startup"""
    admin = await db.admin_users.find_one({"role": "admin"}, {"_id": 0})
    if not admin:
        admin_id = str(uuid.uuid4())
        hashed = hash_password(ADMIN_PASSWORD)
        await db.admin_users.insert_one({"id": admin_id, "password_hash": hashed, "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
        logging.info("Admin user seeded successfully")
    else:
        logging.info("Admin user already exists")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
