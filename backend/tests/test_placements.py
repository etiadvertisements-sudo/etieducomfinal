"""
Placements API tests: public GET, admin POST/PUT/DELETE with TOTP 2FA auth,
plus ?latest=true ordering and auth negative case.
"""
import os
import uuid
import time
import pytest
import pyotp
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://eti-edu-com.preview.emergentagent.com").rstrip("/")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ETIadmin@2026")


def _login_and_get_token() -> str:
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
        return r2.json()["token"]
    if data.get("requires_otp"):
        pytest.skip("2FA already enabled and secret unavailable.")
    return data["token"]


@pytest.fixture(scope="module")
def token():
    return _login_and_get_token()


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


class TestPlacementsPublic:
    def test_public_get_returns_seeded(self):
        r = requests.get(f"{BASE_URL}/api/placements", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # 5 seeded
        names = {p["name"] for p in data}
        for expected in ["Rahul Sharma", "Simran Kaur", "Amanpreet Singh", "Neha Verma", "Karan Mehta"]:
            assert expected in names, f"Seed missing: {expected} — got {names}"

    def test_latest_limit_4(self):
        r = requests.get(f"{BASE_URL}/api/placements?latest=true&limit=4", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4, f"Expected 4 latest, got {len(data)}"
        # descending created_at
        for i in range(len(data) - 1):
            assert data[i]["created_at"] >= data[i + 1]["created_at"], "Not sorted desc by created_at"

    def test_no_mongo_id_leak(self):
        r = requests.get(f"{BASE_URL}/api/placements", timeout=10)
        for p in r.json():
            assert "_id" not in p


class TestPlacementsAuth:
    def test_post_requires_auth(self):
        r = requests.post(f"{BASE_URL}/api/placements", json={"name": "X", "company": "Y"}, timeout=10)
        assert r.status_code == 401

    def test_put_requires_auth(self):
        r = requests.put(f"{BASE_URL}/api/placements/does-not-exist", json={"name": "X"}, timeout=10)
        assert r.status_code == 401

    def test_delete_requires_auth(self):
        r = requests.delete(f"{BASE_URL}/api/placements/does-not-exist", timeout=10)
        assert r.status_code == 401


class TestPlacementsCRUD:
    def test_full_crud_and_visibility(self, auth_headers):
        unique = f"TEST_placement_{uuid.uuid4().hex[:6]}"
        payload = {
            "name": unique,
            "company": "TestCorp Ltd",
            "role": "SDE Intern",
            "package": "6 LPA",
            "course": "Python Programming",
            "testimonial": "Great experience at ETI Educom!",
            "order": 99,
        }
        # CREATE
        r = requests.post(f"{BASE_URL}/api/placements", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code in (200, 201), r.text
        created = r.json()
        pid = created["id"]
        assert created["name"] == unique
        assert created["company"] == "TestCorp Ltd"
        assert created["is_active"] is True

        # GET public reflects
        r2 = requests.get(f"{BASE_URL}/api/placements", timeout=10)
        assert r2.status_code == 200
        assert any(p["id"] == pid for p in r2.json()), "Created placement missing from public list"

        # newest should appear in latest=true limit=4
        r3 = requests.get(f"{BASE_URL}/api/placements?latest=true&limit=4", timeout=10)
        assert r3.status_code == 200
        latest4 = r3.json()
        assert any(p["id"] == pid for p in latest4), f"New placement not in latest 4: {[p['name'] for p in latest4]}"

        # UPDATE
        r4 = requests.put(
            f"{BASE_URL}/api/placements/{pid}",
            json={"company": "TestCorp Updated"},
            headers=auth_headers,
            timeout=10,
        )
        assert r4.status_code == 200, r4.text
        assert r4.json()["company"] == "TestCorp Updated"

        # verify persistence via GET
        r5 = requests.get(f"{BASE_URL}/api/placements", timeout=10)
        one = next(p for p in r5.json() if p["id"] == pid)
        assert one["company"] == "TestCorp Updated"

        # DELETE
        r6 = requests.delete(f"{BASE_URL}/api/placements/{pid}", headers=auth_headers, timeout=10)
        assert r6.status_code in (200, 204), r6.text

        # verify gone
        r7 = requests.get(f"{BASE_URL}/api/placements", timeout=10)
        assert not any(p["id"] == pid for p in r7.json()), "Deleted placement still in list"

    def test_update_nonexistent_returns_404(self, auth_headers):
        r = requests.put(
            f"{BASE_URL}/api/placements/does-not-exist-{uuid.uuid4().hex[:6]}",
            json={"company": "X"},
            headers=auth_headers,
            timeout=10,
        )
        assert r.status_code == 404
