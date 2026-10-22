"""Reset the admin password to ADMIN_PASSWORD from backend/.env and clear 2FA.

Usage (on the server, inside /backend):  python3 reset_admin.py
"""
import os
import sys
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).parent / ".env")

password = os.environ.get("ADMIN_PASSWORD")
if not password or len(password) < 8:
    sys.exit("Set ADMIN_PASSWORD (min 8 chars) in backend/.env first.")

db = MongoClient(os.environ["MONGO_URL"])[os.environ["DB_NAME"]]
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
result = db.admin_users.update_many(
    {"role": "admin"},
    {"$set": {"password_hash": hashed, "totp_secret": None, "totp_enabled": False}},
)
if result.matched_count == 0:
    sys.exit("No admin user found. Start the backend once so it creates the admin, then re-run.")
print(f"Admin reset ({result.modified_count} updated). Log in with ADMIN_PASSWORD and scan the new 2FA QR code.")
