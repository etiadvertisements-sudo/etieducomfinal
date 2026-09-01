"""
ETI Educom — comprehensive backend audit suite.
Covers: health, public GET endpoints, lead POST endpoints, chat (Emergent LLM),
admin 2FA login flow, admin-protected CRUD, seed endpoints, sitemap/SEO.

NOTE: /api/admin/login is rate limited to 5/minute. A single session-scoped token
fixture is used to avoid tripping the limiter.
"""
import os
import time

import pyotp
import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
API = f"{BASE_URL}/api"

backend_env = dotenv_values("/app/backend/.env")
ADMIN_PASSWORD = backend_env.get("ADMIN_PASSWORD")

TS = str(int(time.time()))


# ---------------- fixtures ----------------

@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _stored_totp_secret():
    """Read the enabled TOTP secret from Mongo so re-logins work across workers/runs."""
    try:
        from pymongo import MongoClient
        mc = MongoClient(backend_env.get("MONGO_URL"), serverSelectionTimeoutMS=5000)
        doc = mc[backend_env.get("DB_NAME")].admin_users.find_one({"role": "admin"})
        if doc and doc.get("totp_enabled") and doc.get("totp_secret"):
            return doc["totp_secret"]
    except Exception as e:  # pragma: no cover
        print(f"mongo lookup for totp secret failed: {e}")
    return None


@pytest.fixture(scope="session")
def admin_token():
    """Full mandatory-2FA login flow. Uses a fresh session to avoid header bleed."""
    s = requests.Session()
    r = s.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=60)
    if r.status_code != 200:
        pytest.fail(f"admin/login step1 failed {r.status_code}: {r.text[:300]}")
    data = r.json()

    if data.get("requires_setup"):
        secret = data["secret"]
        code = pyotp.TOTP(secret).now()
        r2 = s.post(f"{API}/admin/login",
                    json={"password": ADMIN_PASSWORD, "otp": code, "pending_secret": secret},
                    timeout=60)
        if r2.status_code != 200 or not r2.json().get("token"):
            pytest.fail(f"2FA setup confirm failed {r2.status_code}: {r2.text[:300]}")
        return r2.json()["token"]

    if data.get("requires_otp"):
        secret = _stored_totp_secret()
        if not secret:
            pytest.fail("2FA enabled but TOTP secret unreadable from DB")
        code = pyotp.TOTP(secret).now()
        r2 = s.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD, "otp": code}, timeout=60)
        if r2.status_code != 200 or not r2.json().get("token"):
            pytest.fail(f"2FA login failed {r2.status_code}: {r2.text[:300]}")
        return r2.json()["token"]

    pytest.fail(f"Unexpected login response: {data}")


@pytest.fixture(scope="session")
def auth(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------------- health / basics ----------------

class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=30)
        assert r.status_code == 200, r.text[:300]

    def test_health(self, client):
        r = client.get(f"{API}/health", timeout=30)
        assert r.status_code == 200, r.text[:300]


# ---------------- public GET endpoints ----------------

PUBLIC_GETS = [
    "/programs", "/blogs", "/events", "/team", "/partners", "/faqs", "/reviews",
    "/branches", "/announcements", "/jobs", "/seo", "/technical-seo",
    "/founder-settings", "/popup-modal", "/authors", "/reviews/stats",
    "/educonnect/universities", "/educonnect/programs",
    "/cyber-warriors/events", "/cyber-warriors/upcoming-events",
    "/cyber-warriors/assessments/stats", "/cyber-warriors/video-reviews",
    "/sitemap.xml",
]


class TestPublicGets:
    @pytest.mark.parametrize("path", PUBLIC_GETS)
    def test_public_get(self, client, path):
        r = client.get(f"{API}{path}", timeout=45)
        assert r.status_code == 200, f"{path} -> {r.status_code}: {r.text[:300]}"
        # ensure Mongo _id never leaks
        assert '"_id"' not in r.text, f"{path} leaks mongo _id"

    def test_reviews_stats_shape(self, client):
        r = client.get(f"{API}/reviews/stats", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, dict) and len(d) > 0

    def test_sitemap_is_xml(self, client):
        r = client.get(f"{API}/sitemap.xml", timeout=45)
        assert r.status_code == 200
        assert "<urlset" in r.text or "<sitemapindex" in r.text, r.text[:200]

    def test_program_detail_404_for_unknown(self, client):
        r = client.get(f"{API}/programs/definitely-not-a-real-slug-xyz", timeout=30)
        assert r.status_code == 404, f"expected 404 got {r.status_code}"

    def test_blog_detail_404_for_unknown(self, client):
        r = client.get(f"{API}/blogs/definitely-not-a-real-slug-xyz", timeout=30)
        assert r.status_code == 404, f"expected 404 got {r.status_code}"


# ---------------- lead / form POST endpoints ----------------

LEAD_CASES = [
    ("/quick-enquiry", {"name": "TEST_Quick", "phone": "9876500001",
                        "email": "test_quick@example.com", "interest": "Full Stack",
                        "source": "homepage"}),
    ("/contact", {"name": "TEST_Contact", "email": "test_contact@example.com",
                  "phone": "9876500002", "enquiry_type": "Course Enquiry",
                  "message": "This is an automated QA test message."}),
    ("/counselling-leads", {"name": "TEST_Counsel", "phone": "9876500003",
                            "education": "12th Pass", "preferred_track": "Data Science"}),
    ("/summer-training-leads", {"name": "TEST_Summer", "phone": "9876500004",
                               "email": "test_summer@example.com",
                               "program_interest": "Python", "duration": "6 weeks"}),
    ("/industrial-training-leads", {"name": "TEST_Indus", "email": "test_indus@example.com",
                                    "phone": "9876500005", "college": "TEST College",
                                    "course": "B.Tech CSE", "program_interest": "Networking"}),
    ("/franchise-enquiry", {"name": "TEST_Franchise", "email": "test_fr@example.com",
                            "phone": "9876500006", "location": "Pathankot", "city": "Pathankot",
                            "experience": "Ten years of running education businesses.",
                            "investment_budget": "10-15 Lakh",
                            "why_franchise": "I want to bring quality computer education to my city and grow with a proven brand."}),
    ("/referrals", {"referrer_name": "TEST_Ref", "referrer_phone": "9876500007",
                    "referrer_email": "test_ref@example.com", "friend_name": "TEST_Friend",
                    "friend_phone": "9876500008", "program_interest": "Full Stack"}),
    ("/cyber-warriors/register", {"registration_type": "school", "name": "TEST_CW",
                                  "organization_name": "TEST School",
                                  "organization_type": "School", "contact_number": "9876500009",
                                  "email": "test_cw@example.com", "message": "QA test"}),
    ("/educonnect/enquiry", {"name": "TEST_Educonnect", "phone": "9876500010",
                             "qualification": "Graduate", "program_interest": "MBA",
                             "message": "QA test"}),
    ("/service-enquiry", {"service_type": "corporate_training",
                          "company_name": "TEST_Company", "contact_person": "TEST_Service",
                          "email": "test_svc@example.com", "phone": "9876500011",
                          "employees_count": "50", "training_topic": "Cyber Security",
                          "message": "QA automated test message"}),
]


class TestLeadSubmissions:
    @pytest.mark.parametrize("path,payload", LEAD_CASES, ids=[c[0] for c in LEAD_CASES])
    def test_lead_post(self, client, path, payload):
        r = client.post(f"{API}{path}", json=payload, timeout=60)
        assert r.status_code in (200, 201), f"{path} -> {r.status_code}: {r.text[:400]}"
        assert r.json(), f"{path} returned empty body"

    def test_lead_validation_rejects_bad_payload(self, client):
        r = client.post(f"{API}/quick-enquiry", json={"name": "x", "phone": "1"}, timeout=30)
        assert r.status_code == 422, f"expected 422 got {r.status_code}"

    def test_brochure_request(self, client):
        r = client.post(f"{API}/brochure-requests",
                        json={"name": "TEST_Broch", "phone": "9876500012",
                              "email": "test_b@example.com", "program_id": "full-stack",
                              "program_name": "Full Stack"}, timeout=60)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"

    def test_career_quiz_submit(self, client):
        r = client.post(f"{API}/career-quiz/submit",
                        json={"name": "TEST_Quiz", "phone": "9876500013",
                              "email": "test_q@example.com",
                              "answers": {"q1": "a", "q2": "b"},
                              "result": "Data Science"}, timeout=60)
        assert r.status_code in (200, 201, 422), f"{r.status_code}: {r.text[:300]}"


# ---------------- AI chatbot ----------------

class TestChat:
    def test_chat_responds(self, client):
        r = client.post(f"{API}/chat",
                        json={"session_id": f"qa-{TS}",
                              "message": "Hi, I finished 12th. Which course should I pick?"},
                        timeout=120)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:400]}"
        d = r.json()
        assert d.get("session_id") == f"qa-{TS}"
        text = d.get("response", "")
        assert len(text) > 20, f"suspiciously short AI response: {text!r}"
        assert "not available on this server" not in text, "LLM integration unavailable"
        assert "trouble" not in text.lower()[:60] or len(text) > 200, f"error-ish response: {text[:200]}"


# ---------------- admin auth ----------------

class TestAdminAuth:
    def test_login_flow_returns_token(self, admin_token):
        assert isinstance(admin_token, str) and len(admin_token) > 20

    def test_verify_token(self, client, admin_token):
        r = client.post(f"{API}/admin/verify", params={"token": admin_token}, timeout=30)
        assert r.status_code == 200 and r.json().get("valid") is True, r.text[:300]

    def test_verify_bad_token(self, client):
        r = client.post(f"{API}/admin/verify", params={"token": "garbage"}, timeout=30)
        assert r.status_code == 200 and r.json().get("valid") is False

    def test_protected_requires_auth(self, client):
        r = client.post(f"{API}/team", json={"name": "TEST_x", "title": "TEST_t"}, timeout=30)
        assert r.status_code in (401, 403), f"unprotected! got {r.status_code}"


# ---------------- admin protected CRUD ----------------

class TestAdminCRUD:
    def test_team_crud(self, client, auth):
        payload = {"name": "TEST_Member", "title": "QA Engineer",
                   "bio": "Automated test member", "order": 99}
        r = client.post(f"{API}/team", json=payload, headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST /team {r.status_code}: {r.text[:300]}"
        mid = r.json()["id"]
        assert r.json()["name"] == payload["name"]

        g = client.get(f"{API}/team", timeout=30)
        assert g.status_code == 200
        assert any(m["id"] == mid for m in g.json()), "created team member not in GET /team"

        u = client.put(f"{API}/team/{mid}", json={**payload, "title": "Lead QA"},
                       headers=auth, timeout=45)
        assert u.status_code == 200, f"PUT /team {u.status_code}: {u.text[:300]}"
        assert u.json()["title"] == "Lead QA"

        d = client.delete(f"{API}/team/{mid}", headers=auth, timeout=45)
        assert d.status_code in (200, 204), d.text[:300]
        g2 = client.get(f"{API}/team", timeout=30)
        assert not any(m["id"] == mid for m in g2.json()), "team member not deleted"

    def test_blog_crud(self, client, auth):
        slug = f"test-qa-blog-{TS}"
        payload = {"title": "TEST_QA Blog Post Title", "slug": slug,
                   "excerpt": "This is an automated QA excerpt for testing.",
                   "content": "This is automated QA content body for the blog post.",
                   "category": "Testing", "author": "QA Bot", "tags": ["qa"]}
        r = client.post(f"{API}/blogs", json=payload, headers=auth, timeout=60)
        assert r.status_code in (200, 201), f"POST /blogs {r.status_code}: {r.text[:400]}"
        bid = r.json()["id"]

        g = client.get(f"{API}/blogs/{slug}", timeout=30)
        assert g.status_code == 200, f"GET /blogs/{slug} {g.status_code}"
        assert g.json()["title"] == payload["title"]

        d = client.delete(f"{API}/blogs/{bid}", headers=auth, timeout=60)
        assert d.status_code in (200, 204), d.text[:300]

    def test_event_crud(self, client, auth):
        payload = {"title": "TEST_QA Event", "description": "Automated QA event description.",
                   "event_date": "2026-12-01", "event_time": "10:00 AM",
                   "location": "Pathankot"}
        r = client.post(f"{API}/events", json=payload, headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST /events {r.status_code}: {r.text[:300]}"
        eid = r.json()["id"]
        g = client.get(f"{API}/events/{eid}", timeout=30)
        assert g.status_code == 200 and g.json()["title"] == payload["title"]
        d = client.delete(f"{API}/events/{eid}", headers=auth, timeout=45)
        assert d.status_code in (200, 204)

    def test_partner_crud(self, client, auth):
        payload = {"name": "TEST_Partner", "logo_url": "https://example.com/logo.png",
                   "partner_type": "placement", "order": 99}
        r = client.post(f"{API}/partners", json=payload, headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST /partners {r.status_code}: {r.text[:300]}"
        pid = r.json()["id"]
        g = client.get(f"{API}/partners", timeout=30)
        assert any(p["id"] == pid for p in g.json())
        d = client.delete(f"{API}/partners/{pid}", headers=auth, timeout=45)
        assert d.status_code in (200, 204)

    def test_university_crud(self, client, auth):
        # NOTE: this endpoint takes QUERY PARAMS, not a JSON body (inconsistent with rest of API)
        r = client.post(f"{API}/educonnect/universities",
                        params={"name": "TEST_University", "logo": "https://example.com/u.png",
                                "order": 99},
                        headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST universities {r.status_code}: {r.text[:300]}"
        uid = r.json().get("id")
        g = client.get(f"{API}/educonnect/universities", timeout=30)
        assert g.status_code == 200
        assert any(u.get("name") == "TEST_University" for u in g.json()), "university not persisted"
        d = client.delete(f"{API}/educonnect/universities/{uid}", headers=auth, timeout=45)
        assert d.status_code in (200, 204), d.text[:300]

    def test_educonnect_program_crud(self, client, auth):
        r = client.post(f"{API}/educonnect/programs",
                        params={"name": "TEST_Program", "duration": "2 Years", "type": "PG"},
                        headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST programs {r.status_code}: {r.text[:300]}"
        pid = r.json().get("id")
        client.delete(f"{API}/educonnect/programs/{pid}", headers=auth, timeout=45)

    def test_announcement_crud(self, client, auth):
        r = client.post(f"{API}/announcements",
                        json={"text": "TEST_Announcement QA banner text", "order": 99},
                        headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST /announcements {r.status_code}: {r.text[:300]}"
        aid = r.json().get("id")
        if aid:
            client.delete(f"{API}/announcements/{aid}", headers=auth, timeout=45)

    def test_branch_crud(self, client, auth):
        r = client.post(f"{API}/branches",
                        json={"name": "TEST_Branch", "slug": f"test-branch-{TS}",
                              "city": "Pathankot", "state": "Punjab",
                              "address": "TEST address 123", "phone": "9876500055",
                              "email": "test_branch@example.com"},
                        headers=auth, timeout=45)
        assert r.status_code in (200, 201), f"POST /branches {r.status_code}: {r.text[:300]}"
        bid = r.json().get("id")
        if bid:
            client.delete(f"{API}/branches/{bid}", headers=auth, timeout=45)

    def test_cyber_warriors_event_create(self, client, auth):
        payload = {"title": "TEST_CW Event", "description": "QA cyber warriors event",
                   "event_date": "2026-11-01", "location": "Pathankot",
                   "organization_name": "TEST School"}
        r = client.post(f"{API}/cyber-warriors/events", json=payload, headers=auth, timeout=45)
        assert r.status_code in (200, 201, 422), f"{r.status_code}: {r.text[:300]}"
        if r.status_code in (200, 201):
            eid = r.json().get("id")
            if eid:
                client.delete(f"{API}/cyber-warriors/events/{eid}", headers=auth, timeout=45)


# ---------------- admin lead listing (dashboard data) ----------------

ADMIN_LISTS = [
    "/counselling-leads", "/summer-training-leads", "/industrial-training-leads",
    "/quick-enquiry", "/contact", "/franchise-enquiry", "/referrals",
    "/educonnect/enquiries", "/service-enquiry", "/cyber-warriors/registrations",
    "/cyber-warriors/assessments", "/applications", "/hire-requests",
    "/msg91-settings", "/popup-modal/admin",
]


class TestAdminLists:
    @pytest.mark.parametrize("path", ADMIN_LISTS)
    def test_admin_list(self, client, auth, path):
        r = client.get(f"{API}{path}", headers=auth, timeout=45)
        assert r.status_code == 200, f"{path} -> {r.status_code}: {r.text[:300]}"
        assert '"_id"' not in r.text, f"{path} leaks mongo _id"


# ---------------- seed endpoints ----------------

class TestSeeds:
    def test_seed_programs_then_list(self, client, auth):
        r = client.post(f"{API}/programs/seed-all", headers=auth, timeout=120)
        assert r.status_code in (200, 201), f"seed-all programs {r.status_code}: {r.text[:400]}"
        g = client.get(f"{API}/programs", timeout=45)
        assert g.status_code == 200
        assert len(g.json()) > 0, "programs still empty after seed"

    def test_seed_seo_then_list(self, client, auth):
        r = client.post(f"{API}/seo/seed-all", headers=auth, timeout=120)
        assert r.status_code in (200, 201), f"seo seed-all {r.status_code}: {r.text[:400]}"
        g = client.get(f"{API}/seo", timeout=45)
        assert g.status_code == 200 and len(g.json()) > 0, "seo settings empty after seed"

    def test_seo_by_slug(self, client):
        lst = client.get(f"{API}/seo", timeout=45).json()
        if not lst:
            pytest.skip("no seo entries")
        slug = lst[0]["page_slug"]
        r = client.get(f"{API}/seo/{slug}", timeout=30)
        assert r.status_code == 200 and r.json()["page_slug"] == slug


# ---------------- not-configured integrations ----------------

class TestUnconfiguredIntegrations:
    def test_upload_local_fallback(self, client, admin_token):
        files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n" + b"0" * 100, "image/png")}
        r = requests.post(f"{API}/upload", files=files,
                          headers={"Authorization": f"Bearer {admin_token}"}, timeout=60)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:200]}"
        d = r.json()
        assert d.get("url"), "upload returned no url"
        # Cloudinary blank -> should fall back to local storage and be servable
        assert d.get("storage") in ("local", "cloudinary")
        served = requests.get(f"{BASE_URL}{d['url']}", timeout=45)
        assert served.status_code == 200, f"uploaded file not servable: {served.status_code}"

    def test_upload_rejects_bad_extension(self, client, admin_token):
        files = {"file": ("evil.exe", b"MZ" + b"0" * 50, "application/octet-stream")}
        r = requests.post(f"{API}/upload", files=files,
                          headers={"Authorization": f"Bearer {admin_token}"}, timeout=60)
        assert r.status_code == 400, f"expected 400 got {r.status_code}"

    def test_msg91_test_endpoint(self, client, auth):
        # endpoint takes query params (phone, name), same as admin UI
        r = client.post(f"{API}/msg91-settings/test",
                        params={"phone": "9876500099", "name": "Test User"},
                        headers=auth, timeout=60)
        print(f"MSG91 test -> {r.status_code}: {r.text[:200]}")
        assert r.status_code in (200, 400, 503), f"{r.status_code}: {r.text[:200]}"

    def test_seo_ping(self, client, auth):
        r = client.post(f"{API}/admin/seo/ping",
                        json={"urls": ["https://www.etieducom.com/"]}, headers=auth, timeout=90)
        print(f"SEO ping -> {r.status_code}: {r.text[:300]}")
        assert r.status_code in (200, 400, 422, 500, 503)


# ---------------- security / change password (non destructive) ----------------

class TestAdminSecurity:
    def test_change_password_wrong_current_rejected(self, client, auth):
        r = client.post(f"{API}/admin/change-password",
                        json={"current_password": "definitely-wrong", "new_password": "Whatever@12345"},
                        headers=auth, timeout=45)
        assert r.status_code == 400, f"expected 400 got {r.status_code}: {r.text[:300]}"


# ---------------- authorization hardening (expected failures = security gaps) ----------------

# Lead / PII listing endpoints that should require an admin bearer token
PII_GETS = [
    "/contact", "/counselling-leads", "/summer-training-leads",
    "/industrial-training-leads", "/quick-enquiry", "/franchise-enquiry",
    "/referrals", "/educonnect/enquiries", "/service-enquiry",
    "/cyber-warriors/registrations", "/cyber-warriors/assessments",
    "/applications", "/hire-requests", "/msg91-settings",
]

# Mutating endpoints that should require an admin bearer token
UNAUTH_MUTATIONS = [
    ("delete", "/contact/no-such-id"),
    ("delete", "/counselling-leads/no-such-id"),
    ("delete", "/quick-enquiry/no-such-id"),
    ("delete", "/referrals/no-such-id"),
    ("delete", "/educonnect/enquiries/no-such-id"),
    ("delete", "/educonnect/universities/no-such-id"),
    ("delete", "/announcements/no-such-id"),
    ("delete", "/branches/no-such-id"),
    ("delete", "/cyber-warriors/registrations/no-such-id"),
]


class TestAuthorizationHardening:
    @pytest.mark.parametrize("path", PII_GETS)
    def test_pii_listing_requires_auth(self, path):
        r = requests.get(f"{API}{path}", timeout=45)
        assert r.status_code in (401, 403), (
            f"SECURITY: {path} is publicly readable without a token (got {r.status_code}); "
            f"leaks lead PII")

    @pytest.mark.parametrize("method,path", UNAUTH_MUTATIONS,
                             ids=[f"{m}{p}" for m, p in UNAUTH_MUTATIONS])
    def test_mutation_requires_auth(self, method, path):
        r = requests.request(method, f"{API}{path}", timeout=45)
        assert r.status_code in (401, 403), (
            f"SECURITY: {method.upper()} {path} accepted without a token (got {r.status_code})")

    def test_unauth_university_create_blocked(self):
        r = requests.post(f"{API}/educonnect/universities",
                          params={"name": "TEST_Unauth_Uni"}, timeout=45)
        if r.status_code in (200, 201):
            uid = r.json().get("id")
            # clean up whatever we managed to create
            requests.delete(f"{API}/educonnect/universities/{uid}", timeout=30)
        assert r.status_code in (401, 403), (
            f"SECURITY: POST /educonnect/universities creates content without auth "
            f"(got {r.status_code})")


# =====================================================================
# ITERATION 2 — verification of the security-hardening + form fixes
# =====================================================================

# --- full unauthenticated 401 matrix requested in the review ---

ITER2_PII_GETS = [
    "/counselling-leads", "/contact", "/franchise-enquiry", "/summer-training-leads",
    "/industrial-training-leads", "/quick-enquiry", "/referrals", "/service-enquiry",
    "/educonnect/enquiries", "/cyber-warriors/registrations",
    "/cyber-warriors/assessments", "/applications", "/hire-requests", "/msg91-settings",
]

ITER2_UNAUTH_MUTATIONS = [
    ("delete", "/counselling-leads/no-such-id", None),
    ("delete", "/contact/no-such-id", None),
    ("delete", "/franchise-enquiry/no-such-id", None),
    ("post", "/announcements", {"text": "TEST_unauth announcement"}),
    ("post", "/branches", {"name": "TEST_U", "slug": "test-u", "address": "Some address",
                           "city": "City", "state": "State", "phone": "9999999999",
                           "email": "a@b.com"}),
    ("post", "/popup-modal", {"title": "TEST_U", "body": "TEST unauth popup body"}),
    ("post", "/seo", {"page_slug": "test-unauth", "title": "TEST_U",
                      "description": "TEST unauthenticated seo write attempt"}),
    ("post", "/technical-seo", {"robots_txt": "User-agent: *"}),
    ("post", "/msg91-settings", {"auth_key": "TEST_UNAUTH"}),
    ("put", "/founder-settings", {"name": "TEST_Unauth"}),
    ("post", "/cyber-warriors/events", {"title": "TEST_U", "description": "x",
                                        "event_date": "2026-12-01", "location": "X"}),
    ("post", "/cyber-warriors/video-reviews", {"name": "TEST_U", "video_url": "https://x.y/z"}),
    ("post", "/faqs", {"question": "TEST unauthenticated question?",
                       "answer": "TEST unauthenticated answer body long enough.",
                       "category": "General"}),
    ("post", "/jobs", {"title": "TEST_U job", "department": "QA", "location": "Remote",
                       "type": "Full-time", "description": "TEST unauthenticated job post.",
                       "requirements": ["none"]}),
    ("post", "/authors", {"name": "TEST_Unauth Author"}),
    ("post", "/programs/seed-all", {}),
    ("post", "/seo/seed-all", {}),
]


class TestIter2AuthHardening:
    @pytest.mark.parametrize("path", ITER2_PII_GETS)
    def test_pii_get_401(self, path):
        r = requests.get(f"{API}{path}", timeout=45)
        assert r.status_code in (401, 403), f"SECURITY {path} -> {r.status_code}: {r.text[:200]}"

    @pytest.mark.parametrize("method,path,body", ITER2_UNAUTH_MUTATIONS,
                             ids=[f"{m}_{p}" for m, p, _ in ITER2_UNAUTH_MUTATIONS])
    def test_mutation_401(self, method, path, body):
        r = requests.request(method, f"{API}{path}", json=body, timeout=60)
        assert r.status_code in (401, 403), (
            f"SECURITY {method.upper()} {path} -> {r.status_code}: {r.text[:200]}")

    @pytest.mark.parametrize("path", ["/educonnect/universities", "/educonnect/programs"])
    def test_educonnect_create_401(self, path):
        r = requests.post(f"{API}{path}", params={"name": "TEST_Unauth"}, timeout=45)
        assert r.status_code in (401, 403), f"SECURITY {path} -> {r.status_code}: {r.text[:200]}"


# --- public surface must stay open (regression) ---

ITER2_PUBLIC_GETS = [
    "/programs", "/blogs", "/events", "/team", "/partners", "/reviews", "/faqs",
    "/branches", "/announcements", "/popup-modal", "/founder-settings",
    "/educonnect/universities", "/educonnect/programs",
    "/cyber-warriors/video-reviews", "/authors", "/reviews/stats", "/sitemap.xml",
]

ITER2_PUBLIC_POSTS = [
    (p, b) for p, b in LEAD_CASES
] + [
    ("/applications", {"job_id": "test-job", "name": "TEST_App",
                       "email": "test_app@example.com", "phone": "9876500021",
                       "cover_letter": "This is an automated QA cover letter body."}),
    ("/hire-request", {"company_name": "TEST_Hire Co", "contact_person": "TEST_Hire",
                       "email": "test_hire@example.com", "phone": "9876500022",
                       "roles": ["Full Stack"], "positions": "2",
                       "message": "QA automated hire request"}),
    ("/career-quiz/submit", {"name": "TEST_Quiz2", "phone": "9876500023",
                             "email": "test_q2@example.com",
                             "answers": {"q1": "a"}, "result": "Data Science"}),
    ("/brochure-requests", {"name": "TEST_Broch2", "phone": "9876500024",
                            "email": "test_b2@example.com", "program_id": "full-stack",
                            "program_name": "Full Stack"}),
    ("/chat", {"session_id": "qa-iter2", "message": "Hi"}),
]


class TestIter2PublicRegression:
    @pytest.mark.parametrize("path", ITER2_PUBLIC_GETS)
    def test_public_get_still_open(self, path):
        r = requests.get(f"{API}{path}", timeout=60)
        assert r.status_code == 200, f"REGRESSION {path} -> {r.status_code}: {r.text[:200]}"

    @pytest.mark.parametrize("path,body", ITER2_PUBLIC_POSTS, ids=[p for p, _ in ITER2_PUBLIC_POSTS])
    def test_public_post_not_401(self, path, body):
        r = requests.post(f"{API}{path}", json=body, timeout=90)
        assert r.status_code not in (401, 403), (
            f"REGRESSION public POST {path} now requires auth ({r.status_code})")
        assert r.status_code in (200, 201, 422), f"{path} -> {r.status_code}: {r.text[:250]}"


# --- fixed form 1: franchise (payload exactly as FranchiseForm.jsx builds it) ---

class TestIter2FranchiseForm:
    def _payload(self, message):
        city = "TEST_City"
        why = (message.strip() if message and len(message.strip()) >= 50 else
               f"Interested in opening an ETI Educom franchise in {city}. "
               f"Investment capacity: 10-15 Lakh. Please share partnership details.")
        exp = message.strip() if message and len(message.strip()) >= 10 else "Not specified yet"
        return {"name": "TEST_FranchiseUI", "email": "not-provided@example.com",
                "phone": "9876500031", "location": city, "city": city,
                "experience": exp, "investment_budget": "10-15 Lakh", "why_franchise": why}

    @pytest.mark.parametrize("message", ["", "Want a franchise"])
    def test_empty_and_short_message_accepted(self, client, auth, message):
        r = client.post(f"{API}/franchise-enquiry", json=self._payload(message), timeout=60)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:400]}"
        lead_id = r.json()["id"]
        lst = client.get(f"{API}/franchise-enquiry", headers=auth, timeout=45)
        assert lst.status_code == 200
        assert any(x["id"] == lead_id for x in lst.json()), "franchise lead not in admin list"
        client.delete(f"{API}/franchise-enquiry/{lead_id}", headers=auth, timeout=30)


# --- fixed form 2: cyber warriors register ---

class TestIter2CyberWarriorsForm:
    @pytest.mark.parametrize("reg", [
        {"registration_type": "individual", "name": "TEST_CW_Indiv",
         "contact_number": "9876500041", "email": "not-provided@example.com",
         "organization_name": None, "organization_type": None},
        {"registration_type": "organization", "name": "TEST_CW_Org",
         "organization_name": "TEST_Org School", "organization_type": "School",
         "contact_number": "9876500042", "email": "test_cworg@example.com"},
    ], ids=["individual", "organization"])
    def test_register_and_appears_in_admin_list(self, client, auth, reg):
        r = client.post(f"{API}/cyber-warriors/register", json=reg, timeout=60)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:400]}"
        rid = r.json()["id"]
        lst = client.get(f"{API}/cyber-warriors/registrations", headers=auth, timeout=45)
        assert lst.status_code == 200
        match = [x for x in lst.json() if x["id"] == rid]
        assert match, "CW registration not in admin list"
        assert match[0]["registration_type"] == reg["registration_type"]
        client.delete(f"{API}/cyber-warriors/registrations/{rid}", headers=auth, timeout=30)


# --- fixed form 3: homepage quick enquiry ---

class TestIter2QuickEnquiry:
    def test_quick_enquiry_persisted(self, client, auth):
        r = client.post(f"{API}/quick-enquiry",
                        json={"name": "TEST_HeroForm", "phone": "9876500051",
                              "email": "test_hero@example.com",
                              "interest": "Full Stack Development", "source": "homepage"},
                        timeout=60)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"
        qid = r.json()["id"]
        lst = client.get(f"{API}/quick-enquiry", headers=auth, timeout=45)
        assert lst.status_code == 200
        match = [x for x in lst.json() if x["id"] == qid]
        assert match and match[0]["interest"] == "Full Stack Development"
        client.delete(f"{API}/quick-enquiry/{qid}", headers=auth, timeout=30)


# --- new admin-screen CRUD spot checks (with token) ---

class TestIter2NewAdminCRUD:
    def test_faq_crud(self, client, auth):
        r = client.post(f"{API}/faqs", headers=auth, json={
            "question": "TEST_ Is this an automated QA question?",
            "answer": "TEST_ Yes, this answer is long enough to pass validation.",
            "category": "General", "order": 99}, timeout=45)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"
        fid = r.json()["id"]
        g = client.get(f"{API}/faqs", timeout=45)
        assert any(x["id"] == fid for x in g.json()), "FAQ not persisted"
        d = client.delete(f"{API}/faqs/{fid}", headers=auth, timeout=30)
        assert d.status_code in (200, 204)

    def test_job_crud(self, client, auth):
        r = client.post(f"{API}/jobs", headers=auth, json={
            "title": "TEST_ QA Engineer", "department": "QA", "location": "Remote",
            "type": "Full-time", "description": "TEST automated job description body.",
            "requirements": ["pytest", "playwright"]}, timeout=45)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"
        jid = r.json()["id"]
        g = client.get(f"{API}/jobs", timeout=45)
        assert any(x["id"] == jid for x in g.json()), "job not persisted"
        client.delete(f"{API}/jobs/{jid}", headers=auth, timeout=30)

    def test_author_crud(self, client, auth):
        r = client.post(f"{API}/authors", headers=auth,
                        json={"name": "TEST_ QA Author", "title": "Tester",
                              "bio": "Automated test author", "expertise": ["QA"]}, timeout=45)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"
        aid = r.json()["id"]
        g = client.get(f"{API}/authors", timeout=45)
        assert any(x["id"] == aid for x in g.json()), "author not persisted"
        client.delete(f"{API}/authors/{aid}", headers=auth, timeout=30)

    def test_founder_settings_update(self, client, auth):
        before = client.get(f"{API}/founder-settings", timeout=45).json()
        r = client.put(f"{API}/founder-settings", headers=auth,
                       json={"title": "TEST_ Founder Title"}, timeout=45)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:300]}"
        g = client.get(f"{API}/founder-settings", timeout=45).json()
        assert g["title"] == "TEST_ Founder Title", g
        # restore
        client.put(f"{API}/founder-settings", headers=auth,
                   json={"title": before.get("title") or "Founder & CEO"}, timeout=45)

    def test_popup_modal_upsert(self, client, auth):
        r = client.post(f"{API}/popup-modal", headers=auth,
                        json={"title": "TEST_ Popup", "body": "QA popup body text",
                              "delay_seconds": 4}, timeout=45)
        assert r.status_code in (200, 201), f"{r.status_code}: {r.text[:300]}"
