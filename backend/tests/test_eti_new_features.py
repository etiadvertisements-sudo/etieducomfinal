"""ETI Educom — lead forms + CRM webhook, announcements, placed students,
recruiters (partners), events, blogs, programs. Run against external preview URL."""
import os
import time
import uuid
import subprocess

import pytest
import requests
import pyotp
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
API = f"{BASE_URL}/api"

backend_env = dotenv_values("/app/backend/.env")
ADMIN_PASSWORD = backend_env.get("ADMIN_PASSWORD")
MONGO_URL = backend_env.get("MONGO_URL")
DB_NAME = backend_env.get("DB_NAME")

TAG = uuid.uuid4().hex[:6]


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    from pymongo import MongoClient
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    data = r.json()
    if data.get("token"):
        return data["token"]
    if data.get("requires_setup"):
        secret = data["secret"]
        assert data.get("qr_data_url", "").startswith("data:image/png;base64,")
        pending = secret
    else:
        mc = MongoClient(MONGO_URL)
        admin = mc[DB_NAME].admin_users.find_one({"role": "admin"})
        secret = admin.get("totp_secret")
        pending = None
        if not secret:
            pytest.fail("2FA enabled but no secret in DB")
    payload = {"password": ADMIN_PASSWORD, "otp": pyotp.TOTP(secret).now()}
    if pending:
        payload["pending_secret"] = pending
    r2 = client.post(f"{API}/admin/login", json=payload)
    if r2.status_code != 200 or not r2.json().get("token"):
        pytest.fail(f"2FA verify failed {r2.status_code}: {r2.text[:300]}")
    return r2.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ============ Lead endpoints (all forward to CRM) ============
LEAD_CASES = [
    ("quick-enquiry", {"name": "TEST QA Quick", "phone": "9990000001", "email": "qa1@qatest.example.com",
                       "interest": "Cyber Security", "source": "homepage"}),
    ("counselling-leads", {"name": "TEST QA Counsel", "phone": "9990000002", "education": "B.Tech",
                           "preferred_track": "Data Science"}),
    ("contact", {"name": "TEST QA Contact", "email": "qa3@qatest.example.com", "phone": "9990000003",
                 "enquiry_type": "general", "message": "This is an automated QA test message."}),
    ("franchise-enquiry", {"name": "TEST QA Franchise", "email": "qa4@qatest.example.com", "phone": "9990000004",
                           "location": "Sector 62", "city": "Noida", "experience": "Ten years in education sector",
                           "investment_budget": "10-20 Lakh",
                           "why_franchise": "Automated QA test reason text that is definitely longer than fifty characters."}),
    ("hire-request", {"company_name": "TEST QA Corp", "contact_person": "TEST QA Hirer",
                      "email": "qa5@qatest.example.com", "phone": "9990000005",
                      "requirements": "Need 2 QA engineers for automated testing."}),
    ("summer-training-leads", {"name": "TEST QA Summer", "phone": "9990000006", "email": "qa6@qatest.example.com",
                               "program_interest": "Python", "duration": "6 weeks"}),
    ("industrial-training-leads", {"name": "TEST QA Industrial", "email": "qa7@qatest.example.com",
                                   "phone": "9990000007", "college": "ABC College", "course": "CSE",
                                   "program_interest": "Networking"}),
    ("referrals", {"referrer_name": "TEST QA Referrer", "referrer_phone": "9990000008",
                   "referrer_email": "qa8@qatest.example.com", "friend_name": "TEST QA Friend",
                   "friend_phone": "9990000009", "program_interest": "Ethical Hacking"}),
    ("cyber-warriors/register", {"registration_type": "school", "name": "TEST QA Warrior",
                                 "organization_name": "TEST School", "organization_type": "school",
                                 "contact_number": "9990000010", "email": "qa10@qatest.example.com"}),
    ("service-enquiry", {"service_type": "corporate_training", "company_name": "TEST QA Services",
                         "contact_person": "TEST QA Person", "email": "qa11@qatest.example.com",
                         "phone": "9990000011", "training_topic": "Cloud"}),
    ("brochure-requests", {"name": "TEST QA Brochure", "phone": "9990000012", "email": "qa12@qatest.example.com",
                           "program_id": "prog-1", "program_name": "Cyber Security Diploma"}),
    ("applications", {"job_id": "test-job-1", "name": "TEST QA Applicant", "email": "qa13@qatest.example.com",
                      "phone": "9990000013",
                      "cover_letter": "Automated QA cover letter text long enough to pass validation."}),
    ("educonnect/enquiry", {"name": "TEST QA Educonnect", "phone": "9990000014", "qualification": "12th",
                            "program_interest": "BCA", "message": "QA test"}),
]


class TestLeadEndpoints:
    @pytest.mark.parametrize("path,payload", LEAD_CASES, ids=[c[0] for c in LEAD_CASES])
    def test_lead_submission(self, client, path, payload):
        r = client.post(f"{API}/{path}", json=payload)
        assert r.status_code in (200, 201), f"{path} -> {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert isinstance(data, dict) and data, f"{path} empty response"
        assert "_id" not in data, f"{path} leaks mongo _id"
        assert data.get("id") or data.get("success"), f"{path} response has no id/success: {data}"

    def test_lead_validation_rejects_bad_payload(self, client):
        r = client.post(f"{API}/quick-enquiry", json={"name": "A", "phone": "1", "interest": ""})
        assert r.status_code == 422, f"expected 422, got {r.status_code}"

    def test_crm_webhook_logged_for_each_source(self, client):
        """send_lead_to_crm should log 'CRM webhook sent: <name> (<source>)'."""
        time.sleep(4)
        out = subprocess.run(
            "grep -h 'CRM webhook' /var/log/supervisor/backend.*.log | tail -200",
            shell=True, capture_output=True, text=True).stdout
        assert "CRM webhook sent" in out, f"No successful CRM webhook log lines found. Log tail:\n{out[-1500:]}"
        missing = [n for n in ["TEST QA Quick", "TEST QA Counsel", "TEST QA Contact", "TEST QA Franchise",
                               "TEST QA Hirer", "TEST QA Summer", "TEST QA Industrial",
                               "TEST QA Friend", "TEST QA Warrior", "TEST QA Person", "TEST QA Brochure",
                               "TEST QA Applicant", "TEST QA Educonnect"]
                   if f"CRM webhook sent: {n}" not in out]
        assert not missing, f"CRM forward log missing for: {missing}"
        assert "Job Application" in out, "Job application not forwarded with source 'Job Application'"


# ============ Announcements ============
class TestAnnouncements:
    created = []

    def test_get_announcements(self, client):
        r = client.get(f"{API}/announcements")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) >= 1, f"expected seeded announcements, got {data}"
        for a in data:
            assert "_id" not in a
            assert a.get("text")
            assert a.get("is_active") is True

    def test_create_requires_auth(self, client):
        r = client.post(f"{API}/announcements", json={"text": "TEST_unauth announcement"})
        assert r.status_code in (401, 403), f"unauth create returned {r.status_code}"

    def test_admin_crud(self, client, auth_headers):
        payload = {"text": f"TEST_QA announcement {TAG}", "link": "/contact", "link_text": "Contact", "order": 99}
        r = client.post(f"{API}/announcements", json=payload, headers=auth_headers)
        assert r.status_code in (200, 201), r.text[:300]
        ann = r.json()
        aid = ann["id"]
        assert ann["text"] == payload["text"]
        # verify in list
        lst = client.get(f"{API}/announcements").json()
        assert any(a["id"] == aid for a in lst), "created announcement not in public list"
        # update
        r2 = client.put(f"{API}/announcements/{aid}", json={"text": f"TEST_QA updated {TAG}"}, headers=auth_headers)
        assert r2.status_code == 200, r2.text[:300]
        assert r2.json()["text"] == f"TEST_QA updated {TAG}"
        # delete
        r3 = client.delete(f"{API}/announcements/{aid}", headers=auth_headers)
        assert r3.status_code in (200, 204), r3.text[:300]
        lst2 = client.get(f"{API}/announcements").json()
        assert not any(a["id"] == aid for a in lst2), "deleted announcement still listed"


# ============ Placed Students (NEW) ============
class TestPlacedStudents:
    def test_get_seeded(self, client):
        r = client.get(f"{API}/placed-students")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) >= 4, f"expected >=4 seeded, got {len(data)}"
        for s in data:
            assert "_id" not in s
            for f in ("name", "photo_url", "company_name", "position"):
                assert s.get(f), f"missing {f} in {s}"

    def test_create_requires_auth(self, client):
        r = client.post(f"{API}/placed-students", json={"name": "TEST_unauth", "photo_url": "x",
                                                        "company_name": "c", "position": "p"})
        assert r.status_code in (401, 403), f"unauth create returned {r.status_code}"

    def test_admin_crud(self, client, auth_headers):
        payload = {"name": f"TEST_QA Student {TAG}", "photo_url": "https://example.com/p.jpg",
                   "company_name": "TEST_QA Corp", "position": "QA Engineer", "order": 99}
        r = client.post(f"{API}/placed-students", json=payload, headers=auth_headers)
        assert r.status_code in (200, 201), r.text[:300]
        sid = r.json()["id"]
        assert r.json()["company_name"] == "TEST_QA Corp"
        got = client.get(f"{API}/placed-students").json()
        assert any(s["id"] == sid for s in got), "created student not persisted in list"
        r2 = client.put(f"{API}/placed-students/{sid}", json={"position": "Senior QA"}, headers=auth_headers)
        assert r2.status_code == 200, r2.text[:300]
        assert r2.json()["position"] == "Senior QA"
        assert r2.json()["name"] == payload["name"]
        r3 = client.delete(f"{API}/placed-students/{sid}", headers=auth_headers)
        assert r3.status_code in (200, 204)
        assert not any(s["id"] == sid for s in client.get(f"{API}/placed-students").json())

    def test_update_nonexistent_returns_404(self, client, auth_headers):
        r = client.put(f"{API}/placed-students/does-not-exist", json={"position": "x"}, headers=auth_headers)
        assert r.status_code == 404, f"got {r.status_code}"


# ============ Partners / Recruiters ============
class TestPartners:
    def test_recruiters(self, client):
        r = client.get(f"{API}/partners", params={"partner_type": "recruiter"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 8, f"expected >=8 recruiters, got {len(data)}"
        for p in data:
            assert p["partner_type"] == "recruiter"
            assert p.get("logo_url")
            assert "_id" not in p

    @pytest.mark.parametrize("ptype", ["certification", "placement"])
    def test_existing_types_still_work(self, client, ptype):
        r = client.get(f"{API}/partners", params={"partner_type": ptype})
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert all(p["partner_type"] == ptype for p in r.json())

    def test_invalid_partner_type_rejected_on_create(self, client, auth_headers):
        r = client.post(f"{API}/partners", json={"name": "TEST_bad", "logo_url": "x",
                                                 "partner_type": "bogus"}, headers=auth_headers)
        assert r.status_code == 422, f"got {r.status_code}"

    def test_recruiter_create_delete(self, client, auth_headers):
        r = client.post(f"{API}/partners", json={"name": f"TEST_QA Recruiter {TAG}",
                                                 "logo_url": "https://example.com/l.png",
                                                 "partner_type": "recruiter", "order": 99},
                        headers=auth_headers)
        assert r.status_code in (200, 201), r.text[:300]
        pid = r.json()["id"]
        assert r.json()["partner_type"] == "recruiter"
        d = client.delete(f"{API}/partners/{pid}", headers=auth_headers)
        assert d.status_code in (200, 204), d.text[:300]


# ============ Events ============
class TestEvents:
    def test_list_and_detail(self, client):
        r = client.get(f"{API}/events")
        assert r.status_code == 200
        events = r.json()
        assert len(events) >= 3, f"expected >=3 seeded events, got {len(events)}"
        for e in events:
            assert "_id" not in e
            assert e.get("event_date")
            assert e.get("image_url") is not None, f"event {e.get('title')} has no image_url"
        eid = events[0]["id"]
        d = client.get(f"{API}/events/{eid}")
        assert d.status_code == 200
        assert d.json()["id"] == eid

    def test_detail_404(self, client):
        r = client.get(f"{API}/events/nope-{TAG}")
        assert r.status_code == 404

    def test_admin_crud(self, client, auth_headers):
        payload = {"title": f"TEST_QA Event {TAG}", "description": "Automated QA event description.",
                   "event_date": "2026-01-15", "event_time": "10:00 AM", "location": "Noida",
                   "image_url": "https://example.com/e.jpg"}
        r = client.post(f"{API}/events", json=payload, headers=auth_headers)
        assert r.status_code in (200, 201), r.text[:400]
        eid = r.json()["id"]
        g = client.get(f"{API}/events/{eid}")
        assert g.status_code == 200 and g.json()["title"] == payload["title"]
        u = client.put(f"{API}/events/{eid}", json={**payload, "location": "Delhi"}, headers=auth_headers)
        assert u.status_code == 200, u.text[:300]
        assert client.get(f"{API}/events/{eid}").json()["location"] == "Delhi"
        d = client.delete(f"{API}/events/{eid}", headers=auth_headers)
        assert d.status_code in (200, 204)
        assert client.get(f"{API}/events/{eid}").status_code == 404


# ============ Blogs ============
class TestBlogs:
    def test_list(self, client):
        r = client.get(f"{API}/blogs")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_create_and_fetch_by_slug(self, client, auth_headers):
        slug = f"test-qa-blog-{TAG}"
        payload = {"title": f"TEST_QA Blog {TAG}", "slug": slug,
                   "excerpt": "Automated QA excerpt text.", "content": "Automated QA blog content body.",
                   "category": "Testing", "author": "QA Bot", "tags": ["qa"]}
        r = client.post(f"{API}/blogs", json=payload, headers=auth_headers)
        assert r.status_code in (200, 201), r.text[:400]
        bid = r.json()["id"]
        g = client.get(f"{API}/blogs/{slug}")
        assert g.status_code == 200, g.text[:300]
        assert g.json()["title"] == payload["title"]
        lst = client.get(f"{API}/blogs").json()
        assert any(b["slug"] == slug for b in lst), "created blog not in public list"
        d = client.delete(f"{API}/blogs/{bid}", headers=auth_headers)
        assert d.status_code in (200, 204), d.text[:300]


# ============ Programs ============
class TestPrograms:
    def test_list(self, client):
        r = client.get(f"{API}/programs")
        assert r.status_code == 200
        progs = r.json()
        assert len(progs) >= 20, f"expected >=20 programs, got {len(progs)}"
        assert all("_id" not in p for p in progs)

    def test_detail_by_slug(self, client):
        progs = client.get(f"{API}/programs").json()
        slug = progs[0].get("slug") or progs[0].get("id")
        r = client.get(f"{API}/programs/{slug}")
        assert r.status_code == 200, r.text[:300]
