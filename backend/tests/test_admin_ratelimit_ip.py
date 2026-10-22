# Admin login rate limiter keyed on real client IP (X-Real-IP / X-Forwarded-For)
import os
import time
import uuid
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
URL = f"{BASE_URL}/api/admin/login"


def _ip():
    u = uuid.uuid4().int
    return f"203.{u % 250}.{(u >> 8) % 250}.{(u >> 16) % 250 + 1}"


def _post(pw, xff):
    return requests.post(URL, json={"password": pw}, headers={"X-Forwarded-For": xff}, timeout=20)


def _wait_window_start():
    # fixed window: start right after a minute boundary to avoid split
    s = time.time() % 60
    if s > 45:
        time.sleep(61 - s)


class TestRateLimitPerIP:
    def test_sixth_request_429_other_ip_401(self):
        _wait_window_start()
        ip_a = _ip()
        codes = [_post("TEST_wrong", ip_a).status_code for _ in range(6)]
        print("ip_a codes", codes)
        assert codes[:5] == [401] * 5, codes
        assert codes[5] == 429, codes
        r = _post("TEST_wrong", _ip())
        print("ip_b", r.status_code, r.text[:200])
        assert r.status_code == 401
        assert "detail" in r.json()

    def test_correct_password_requires_setup(self):
        r = _post("ETIadmin@2026", _ip())
        print(r.status_code, r.text[:300])
        assert r.status_code == 200
        d = r.json()
        assert d.get("requires_setup") is True
