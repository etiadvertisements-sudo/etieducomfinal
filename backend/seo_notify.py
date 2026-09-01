"""
SEO Notifier — pings IndexNow (Bing/Yandex/Naver/Seznam) and Google Indexing API
whenever blogs are published or updated.

- IndexNow:   https://www.indexnow.org/  (no auth, just a key file at site root)
- Google API: https://developers.google.com/search/apis/indexing-api/v3/quickstart
              (officially supports JobPosting + BroadcastEvent; many sites use it
               for blog updates as a strong recrawl signal — Google may or may not
               act on the signal but it doesn't hurt SEO)

Configuration (in backend/.env):
    SITE_PUBLIC_URL=https://www.etieducom.com   # required (canonical host)
    INDEXNOW_KEY=<32-char hex>                  # required for IndexNow
    GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON=<json> # optional (raw JSON OR path)
"""
import os
import json
import logging
from typing import List, Dict, Any
import httpx

logger = logging.getLogger(__name__)


def _site_public_url() -> str:
    return (os.environ.get("SITE_PUBLIC_URL") or "https://www.etieducom.com").rstrip("/")


def _indexnow_key() -> str:
    return os.environ.get("INDEXNOW_KEY", "").strip()


def _google_sa_raw() -> str:
    return os.environ.get("GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON", "").strip()


def build_blog_url(slug: str) -> str:
    return f"{_site_public_url()}/blogs/{slug}"


# ─────────────── IndexNow (Bing / Yandex / Naver / Seznam) ───────────────

async def ping_indexnow(urls: List[str]) -> Dict[str, Any]:
    """Submit URLs to IndexNow. Single endpoint pushes to all participating engines."""
    indexnow_key = _indexnow_key()
    site_url = _site_public_url()
    if not indexnow_key:
        return {"ok": False, "skipped": True, "reason": "INDEXNOW_KEY not configured"}
    if not urls:
        return {"ok": False, "skipped": True, "reason": "No URLs"}

    host = site_url.split("://", 1)[-1].split("/", 1)[0]
    payload = {
        "host": host,
        "key": indexnow_key,
        "keyLocation": f"{site_url}/{indexnow_key}.txt",
        "urlList": urls,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                "https://api.indexnow.org/IndexNow",
                json=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
            )
        ok = r.status_code in (200, 202)
        # 200 = received, 202 = accepted (queued), 400 = bad request, 403 = key invalid,
        # 422 = URLs do not match host, 429 = too many requests
        logger.info(f"IndexNow ping → {r.status_code} for {len(urls)} URL(s)")
        return {"ok": ok, "status": r.status_code, "body": (r.text or "")[:500], "count": len(urls)}
    except Exception as e:
        logger.error(f"IndexNow error: {e}")
        return {"ok": False, "error": str(e)}


# ─────────────── Google Indexing API ───────────────

def _load_google_credentials():
    """Load Google service-account credentials. Accepts raw JSON or a file path."""
    raw = _google_sa_raw()
    if not raw:
        return None
    try:
        from google.oauth2 import service_account
    except ImportError:
        logger.warning("google-auth not installed; Google Indexing API disabled")
        return None
    SCOPES = ["https://www.googleapis.com/auth/indexing"]
    try:
        if raw.startswith("{"):
            info = json.loads(raw)
            return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        if os.path.exists(raw):
            return service_account.Credentials.from_service_account_file(raw, scopes=SCOPES)
    except Exception as e:
        logger.error(f"Google service-account load error: {e}")
    return None


async def ping_google_indexing(url: str, action: str = "URL_UPDATED") -> Dict[str, Any]:
    """Notify Google Indexing API about a URL update (or deletion)."""
    creds = _load_google_credentials()
    if not creds:
        return {"ok": False, "skipped": True, "reason": "Google service account not configured"}

    try:
        from google.auth.transport.requests import Request as GAuthRequest
        creds.refresh(GAuthRequest())
        token = creds.token

        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                "https://indexing.googleapis.com/v3/urlNotifications:publish",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                json={"url": url, "type": action},
            )
        ok = r.status_code == 200
        logger.info(f"Google Indexing API → {r.status_code} for {url}")
        return {"ok": ok, "status": r.status_code, "body": (r.text or "")[:500]}
    except Exception as e:
        logger.error(f"Google Indexing API error: {e}")
        return {"ok": False, "error": str(e)}


# ─────────────── Combined helper ───────────────

async def notify_search_engines(urls: List[str], action: str = "URL_UPDATED") -> Dict[str, Any]:
    """Fire-and-forget notify both IndexNow + Google Indexing API for a list of URLs.
    Always succeeds (errors are logged, never raised) so callers don't see failures."""
    if isinstance(urls, str):
        urls = [urls]
    urls = [u for u in urls if u]
    if not urls:
        return {"indexnow": {"skipped": True}, "google": {"skipped": True}}

    indexnow_result = await ping_indexnow(urls)

    google_results = []
    for u in urls:
        google_results.append(await ping_google_indexing(u, action=action))

    return {
        "indexnow": indexnow_result,
        "google": google_results if len(google_results) > 1 else (google_results[0] if google_results else {}),
        "urls": urls,
        "action": action,
    }
