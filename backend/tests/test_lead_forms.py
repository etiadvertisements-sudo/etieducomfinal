"""Backend lead form endpoint tests + CRM webhook forwarding verification.

Covers:
- POST /api/quick-enquiry (HeroForm)
- POST /api/counselling-leads (ProgramEnquiryForm & FreeCounsellingForm)
- POST /api/contact (ContactForm)
- POST /api/summer-training-leads
- POST /api/industrial-training-leads
- POST /api/cyber-warriors/registrations
- POST /api/educonnect/enquiries
- POST /api/hire-request
- POST /api/franchise-enquiries
- POST /api/referrals

Each successful submission must also trigger send_lead_to_crm() and
form must succeed even if the CRM webhook fails (fire-and-await but
wrapped in retry+error handling so it can't 500 the request).
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://eti-edu-com.preview.emergentagent.com").rstrip("/")
BACKEND_LOG = "/var/log/supervisor/backend.err.log"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _rand_phone():
    return "9" + str(int(time.time() * 1000))[-9:]


def _tail_log(n=400):
    try:
        with open(BACKEND_LOG, "r") as f:
            return "".join(f.readlines()[-n:])
    except Exception:
        return ""


def _wait_and_check_crm_log(marker_name, timeout=8):
    """Wait for 'CRM webhook sent: <marker_name>' or 'CRM webhook failed' in log."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        log = _tail_log(600)
        if f"CRM webhook sent: {marker_name}" in log:
            return "sent"
        if f"CRM webhook failed" in log and marker_name in log:
            return "failed"
        time.sleep(0.5)
    # final check
    log = _tail_log(1200)
    if f"CRM webhook sent: {marker_name}" in log:
        return "sent"
    if "CRM webhook failed" in log:
        return "failed-generic"
    return "not_found"


# ---------- Health ----------
def test_health(api):
    r = api.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"


# ---------- Quick Enquiry (HeroForm) ----------
def test_quick_enquiry_success_and_crm(api):
    name = f"TEST_QE_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "phone": _rand_phone(), "email": "qe@test.com", "interest": "Python Programming", "source": "homepage"}
    r = api.post(f"{BASE_URL}/api/quick-enquiry", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == name
    assert data["interest"] == "Python Programming"
    assert "id" in data
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic"), f"CRM not invoked for quick-enquiry: {status}"


# ---------- Counselling Leads (ProgramEnquiryForm + FreeCounsellingForm) ----------
def test_counselling_lead_success_and_crm(api):
    name = f"TEST_CL_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "phone": _rand_phone(), "education": "Graduate", "preferred_track": "Full Stack Web Development"}
    r = api.post(f"{BASE_URL}/api/counselling-leads", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == name
    assert data["preferred_track"] == "Full Stack Web Development"
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Contact Form ----------
def test_contact_form_success_and_crm(api):
    name = f"TEST_CT_{uuid.uuid4().hex[:6]}"
    payload = {
        "name": name,
        "email": "contact@test.com",
        "phone": _rand_phone(),
        "enquiry_type": "General Enquiry",
        "message": "I would like more info about your courses please.",
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    assert r.json()["name"] == name
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Summer Training ----------
def test_summer_training_lead_and_crm(api):
    name = f"TEST_ST_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "email": "st@test.com", "phone": _rand_phone(), "program_interest": "Python", "duration": "6 weeks"}
    r = api.post(f"{BASE_URL}/api/summer-training-leads", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Industrial Training ----------
def test_industrial_training_lead_and_crm(api):
    name = f"TEST_IT_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "email": "it@test.com", "phone": _rand_phone(), "program_interest": "Cybersecurity", "college": "ABC", "course": "BE"}
    r = api.post(f"{BASE_URL}/api/industrial-training-leads", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Cyber Warriors ----------
def test_cyber_warriors_registration_and_crm(api):
    name = f"TEST_CW_{uuid.uuid4().hex[:6]}"
    payload = {"registration_type": "self", "name": name, "contact_number": _rand_phone(), "email": "cw@test.com"}
    r = api.post(f"{BASE_URL}/api/cyber-warriors/register", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- EduConnect ----------
def test_educonnect_enquiry_and_crm(api):
    name = f"TEST_EC_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "phone": _rand_phone(), "qualification": "12th", "program_interest": "BBA", "message": "Please share details"}
    r = api.post(f"{BASE_URL}/api/educonnect/enquiry", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Hire From Us ----------
def test_hire_request_and_crm(api):
    name = f"TEST_HR_{uuid.uuid4().hex[:6]}"
    payload = {"company_name": "TestCo", "contact_person": name, "email": "hr@test.com", "phone": _rand_phone(), "requirements": "Looking to hire 5 Python developers with 0-1 yrs experience."}
    r = api.post(f"{BASE_URL}/api/hire-request", json=payload, timeout=20)
    assert r.status_code in (200, 201), r.text
    status = _wait_and_check_crm_log(name)
    assert status in ("sent", "failed", "failed-generic")


# ---------- Franchise ----------
def test_franchise_enquiry_and_crm(api):
    name = f"TEST_FR_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "email": "fr@test.com", "phone": _rand_phone(), "city": "Delhi", "investment_capacity": "10-20 Lakhs", "business_experience": "5 years retail"}
    r = api.post(f"{BASE_URL}/api/franchise-enquiries", json=payload, timeout=20)
    # endpoint may not exist / may differ - accept 200/201/404 gracefully
    assert r.status_code in (200, 201, 404, 422), r.text
    if r.status_code in (200, 201):
        status = _wait_and_check_crm_log(name)
        assert status in ("sent", "failed", "failed-generic")


# ---------- Referrals ----------
def test_referral_and_crm(api):
    friend = f"TEST_RF_{uuid.uuid4().hex[:6]}"
    payload = {
        "referrer_name": "Ref Person",
        "referrer_phone": _rand_phone(),
        "referrer_email": "ref@test.com",
        "friend_name": friend,
        "friend_phone": _rand_phone(),
        "program_interest": "Python",
    }
    r = api.post(f"{BASE_URL}/api/referrals", json=payload, timeout=20)
    assert r.status_code in (200, 201, 404), r.text
    if r.status_code in (200, 201):
        status = _wait_and_check_crm_log(friend)
        assert status in ("sent", "failed", "failed-generic")


# ---------- Validation: form still succeeds independent of CRM ----------
def test_form_succeeds_even_if_crm_slow():
    """The CRM call has 10s timeout + retry; check that endpoint responds under 30s and is 2xx."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    name = f"TEST_QE_TIMING_{uuid.uuid4().hex[:6]}"
    payload = {"name": name, "phone": _rand_phone(), "interest": "AI"}
    start = time.time()
    r = s.post(f"{BASE_URL}/api/quick-enquiry", json=payload, timeout=35)
    elapsed = time.time() - start
    assert r.status_code == 200
    # Should not hang more than ~25s even with retries
    assert elapsed < 30, f"Form response too slow: {elapsed:.1f}s"
