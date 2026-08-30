"""
Admin CRUD tests: announcements, events, team, reviews, blogs
Uses TOTP 2FA login flow to acquire a JWT bearer token, then exercises
POST/PUT/DELETE against admin-protected endpoints and verifies the
resource is reflected in public GETs.
"""
import os
import time
import uuid
import pytest
import pyotp
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://eti-edu-com.preview.emergentagent.com").rstrip("/")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ETIadmin@2026")


# ---------- Auth helpers ----------
def _login_and_get_token() -> str:
    """Perform TOTP flow. Handles both fresh-setup and existing-2FA."""
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Login step1 failed: {r.status_code} {r.text}"
    data = r.json()

    if data.get("requires_setup"):
        secret = data["secret"]
        otp = pyotp.TOTP(secret).now()
        r2 = s.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": ADMIN_PASSWORD, "otp": otp, "pending_secret": secret},
            timeout=15,
        )
        assert r2.status_code == 200, f"Setup confirm failed: {r2.status_code} {r2.text}"
        token = r2.json().get("token")
        assert token, f"No token in setup response: {r2.text}"
        return token

    if data.get("requires_otp"):
        # 2FA is already set up on server; we cannot recover the secret.
        # In this test env task says 2FA has been reset to fresh-setup state,
        # so this branch means a prior test set it up in this process.
        pytest.skip("2FA already enabled server-side and secret unavailable to test.")

    # Direct token (shouldn't happen with mandatory 2FA)
    token = data.get("token")
    assert token, f"Unexpected login response: {data}"
    return token


@pytest.fixture(scope="module")
def token() -> str:
    return _login_and_get_token()


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------- Announcements ----------
class TestAnnouncements:
    def test_public_list_ok(self):
        r = requests.get(f"{BASE_URL}/api/announcements", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_crud_announcement(self, auth_headers):
        unique = f"TEST_announce_{uuid.uuid4().hex[:6]}"
        payload = {"text": f"{unique} 🎉 test announcement", "link": "/test", "link_text": "Learn"}
        r = requests.post(f"{BASE_URL}/api/announcements", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code in (200, 201), r.text
        created = r.json()
        assert created["text"] == payload["text"]
        aid = created["id"]

        # public GET reflects it
        r2 = requests.get(f"{BASE_URL}/api/announcements", timeout=10)
        assert r2.status_code == 200
        assert any(a["id"] == aid for a in r2.json()), "New announcement not in public GET"

        # UPDATE
        r3 = requests.put(
            f"{BASE_URL}/api/announcements/{aid}",
            json={"text": f"{unique} UPDATED"},
            headers=auth_headers,
            timeout=10,
        )
        assert r3.status_code == 200, r3.text
        assert "UPDATED" in r3.json()["text"]

        # DELETE
        r4 = requests.delete(f"{BASE_URL}/api/announcements/{aid}", headers=auth_headers, timeout=10)
        assert r4.status_code in (200, 204), r4.text

        # verify gone
        r5 = requests.get(f"{BASE_URL}/api/announcements", timeout=10)
        assert not any(a["id"] == aid for a in r5.json())


# ---------- Events ----------
class TestEvents:
    def test_crud_event(self, auth_headers):
        title = f"TEST_event_{uuid.uuid4().hex[:6]}"
        payload = {
            "title": title,
            "description": "This is a test event description with enough length.",
            "event_date": "2026-12-01",
            "event_time": "10:00 AM",
            "location": "Chandigarh Test Venue",
        }
        r = requests.post(f"{BASE_URL}/api/events", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code in (200, 201), r.text
        eid = r.json()["id"]

        r2 = requests.get(f"{BASE_URL}/api/events", timeout=10)
        assert r2.status_code == 200
        assert any(e["id"] == eid for e in r2.json())

        r3 = requests.put(
            f"{BASE_URL}/api/events/{eid}",
            json={"title": title + "_UPD"},
            headers=auth_headers,
            timeout=10,
        )
        assert r3.status_code == 200, r3.text
        assert r3.json()["title"].endswith("_UPD")

        r4 = requests.delete(f"{BASE_URL}/api/events/{eid}", headers=auth_headers, timeout=10)
        assert r4.status_code in (200, 204)


# ---------- Team ----------
class TestTeam:
    def test_crud_team_member(self, auth_headers):
        name = f"TEST_team_{uuid.uuid4().hex[:6]}"
        payload = {"name": name, "title": "QA Engineer", "bio": "Automated test member."}
        r = requests.post(f"{BASE_URL}/api/team", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code in (200, 201), r.text
        tid = r.json()["id"]

        r2 = requests.get(f"{BASE_URL}/api/team", timeout=10)
        assert r2.status_code == 200
        assert any(t["id"] == tid for t in r2.json())

        r3 = requests.put(
            f"{BASE_URL}/api/team/{tid}", json={"title": "Senior QA"}, headers=auth_headers, timeout=10
        )
        assert r3.status_code == 200, r3.text

        r4 = requests.delete(f"{BASE_URL}/api/team/{tid}", headers=auth_headers, timeout=10)
        assert r4.status_code in (200, 204)


# ---------- Reviews ----------
class TestReviews:
    def test_crud_review(self, auth_headers):
        student = f"TEST_review_{uuid.uuid4().hex[:6]}"
        payload = {
            "student_name": student,
            "course": "Python Programming",
            "review_text": "Great course, learned a lot from ETI Educom!",
            "rating": 5,
        }
        r = requests.post(f"{BASE_URL}/api/reviews", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code in (200, 201), r.text
        rid = r.json()["id"]

        r2 = requests.get(f"{BASE_URL}/api/reviews", timeout=10)
        assert r2.status_code == 200
        assert any(rv["id"] == rid for rv in r2.json())

        r3 = requests.put(
            f"{BASE_URL}/api/reviews/{rid}", json={"rating": 4}, headers=auth_headers, timeout=10
        )
        assert r3.status_code == 200, r3.text
        assert r3.json()["rating"] == 4

        r4 = requests.delete(f"{BASE_URL}/api/reviews/{rid}", headers=auth_headers, timeout=10)
        assert r4.status_code in (200, 204)


# ---------- Blogs ----------
class TestBlogs:
    def test_crud_blog(self, auth_headers):
        slug = f"test-blog-{uuid.uuid4().hex[:6]}"
        payload = {
            "title": f"TEST Blog {slug}",
            "slug": slug,
            "excerpt": "This is a test blog excerpt for automated testing.",
            "content": "<p>This is the full blog content for testing purposes.</p>",
            "category": "Testing",
            "author": "QA Bot",
        }
        r = requests.post(f"{BASE_URL}/api/blogs", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["id"]

        r2 = requests.get(f"{BASE_URL}/api/blogs", timeout=10)
        assert r2.status_code == 200
        assert any(b["id"] == bid for b in r2.json()), "Blog not returned in public list"

        r3 = requests.put(
            f"{BASE_URL}/api/blogs/{bid}",
            json={"title": f"TEST Blog {slug} UPDATED"},
            headers=auth_headers,
            timeout=10,
        )
        assert r3.status_code == 200, r3.text
        assert "UPDATED" in r3.json()["title"]

        r4 = requests.delete(f"{BASE_URL}/api/blogs/{bid}", headers=auth_headers, timeout=10)
        assert r4.status_code in (200, 204)


# ---------- Auth negative ----------
class TestAuth:
    def test_admin_endpoint_requires_auth(self):
        r = requests.post(
            f"{BASE_URL}/api/events",
            json={"title": "no auth", "description": "x" * 20, "event_date": "2026-01-01", "event_time": "10", "location": "x"},
            timeout=10,
        )
        assert r.status_code == 401
