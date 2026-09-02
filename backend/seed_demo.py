"""
Seed demo content (announcements, recruiters/partners, placed students, events)
into the MongoDB used by the backend. Safe to re-run: upserts by `id`.

Usage on the VPS (from the backend folder, with the same venv/env as the app):
    python seed_demo.py

It reads MONGO_URL and DB_NAME from the environment (or backend/.env).
"""
import os
import json
import asyncio
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except Exception:
    pass

DATA_FILE = Path(__file__).parent / "demo_seed_data.json"


async def main():
    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "test_database")

    with open(DATA_FILE) as f:
        data = json.load(f)

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    for collection, docs in data.items():
        col = db[collection]
        inserted = 0
        for doc in docs:
            await col.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)
            inserted += 1
        total = await col.count_documents({})
        print(f"{collection}: upserted {inserted}, total now {total}")

    print("Done. Demo content seeded.")


if __name__ == "__main__":
    asyncio.run(main())
