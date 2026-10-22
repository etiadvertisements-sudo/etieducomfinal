# Admin login + reset_admin.py regression (iteration 7)
import os
import subprocess
import time
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
ADMIN_PW = "ETIadmin@2026"


def _login(pw):
    for _ in range(3):
        r = requests.post(f"{BASE_URL}/api/admin/login", json={"password": pw}, timeout=20)
        if r.status_code != 429:
            return r
        time.sleep(61)
    return r


# reset_admin.py script
def test_reset_admin_script_runs():
    out = subprocess.run(["python3", "/app/backend/reset_admin.py"], capture_output=True, text=True, cwd="/app/backend")
    assert out.returncode == 0, out.stderr
    assert "Admin reset" in out.stdout


# Correct password after reset -> requires_setup
def test_login_after_reset_requires_setup():
    r = _login(ADMIN_PW)
    assert r.status_code == 200
    d = r.json()
    assert d["requires_setup"] is True
    assert isinstance(d["secret"], str) and len(d["secret"]) >= 16
    assert d["qr_data_url"].startswith("data:image/png;base64,")


# Wrong password -> 401
def test_wrong_password_401():
    r = _login("definitely-wrong")
    assert r.status_code == 401
