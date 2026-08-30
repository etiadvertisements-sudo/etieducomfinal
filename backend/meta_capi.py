"""
Meta Conversions API (server-side) — fire-and-forget Lead event sender.

Complements browser-side Meta Pixel: catches conversions even when the browser
pixel is blocked (iOS 14.5+, ad-blockers, network failures). Deduplicated with
the browser Pixel via shared `event_id`.

Configuration (backend/.env):
    META_PIXEL_ID=<your pixel id>             # required
    META_CAPI_ACCESS_TOKEN=<EAA... token>     # required to actually send
    META_TEST_EVENT_CODE=<TESTxxxx>           # optional, for /events test mode

If either META_PIXEL_ID or META_CAPI_ACCESS_TOKEN is missing the helper is a
no-op: every call logs once and returns. Form endpoints stay functional.
"""
from __future__ import annotations

import os
import re
import time
import hashlib
import logging
import asyncio
from typing import Any, Dict, Optional

import httpx
from fastapi import Request

logger = logging.getLogger("meta_capi")

META_GRAPH_VERSION = "v21.0"
META_GRAPH_BASE = f"https://graph.facebook.com/{META_GRAPH_VERSION}"

PIXEL_ID = (os.environ.get("META_PIXEL_ID") or "").strip()
ACCESS_TOKEN = (os.environ.get("META_CAPI_ACCESS_TOKEN") or "").strip()
TEST_EVENT_CODE = (os.environ.get("META_TEST_EVENT_CODE") or "").strip()
SITE_PUBLIC_URL = (os.environ.get("SITE_PUBLIC_URL") or "https://www.etieducom.com").rstrip("/")

CAPI_ENABLED = bool(PIXEL_ID and ACCESS_TOKEN)
if not CAPI_ENABLED:
    logger.info(
        "Meta CAPI disabled (missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN). "
        "Form submissions will still work; CAPI events will be skipped silently."
    )


# ─────────────── PII normalization + SHA-256 hashing ───────────────

def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _hash_email(email: Optional[str]) -> Optional[str]:
    if not email:
        return None
    normalized = email.strip().lower()
    if not normalized or "@" not in normalized:
        return None
    return _sha256(normalized)


def _hash_phone(phone: Optional[str], default_country_code: str = "91") -> Optional[str]:
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    if not digits:
        return None
    # Add India country code if 10-digit local number
    if len(digits) == 10:
        digits = default_country_code + digits
    return _sha256(digits)


def _hash_name(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    normalized = re.sub(r"\s+", " ", name.strip()).lower()
    if not normalized:
        return None
    return _sha256(normalized)


def _split_name(full_name: Optional[str]):
    if not full_name:
        return None, None
    parts = full_name.strip().split()
    if not parts:
        return None, None
    if len(parts) == 1:
        return parts[0], None
    return parts[0], parts[-1]


def _client_ip_from_request(request: Optional[Request]) -> Optional[str]:
    if not request:
        return None
    # Honor X-Forwarded-For from ingress
    xff = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip
    try:
        return request.client.host if request.client else None
    except Exception:
        return None


# ─────────────── Shared async HTTP client (reused across requests) ───────────────

_http_client: Optional[httpx.AsyncClient] = None


def _get_client() -> httpx.AsyncClient:
    global _http_client
    if _http_client is None:
        _http_client = httpx.AsyncClient(timeout=2.5)
    return _http_client


async def _post_event(payload: Dict[str, Any]) -> None:
    """POST to Meta /events. Errors are logged, never raised."""
    url = f"{META_GRAPH_BASE}/{PIXEL_ID}/events"
    try:
        client = _get_client()
        r = await client.post(url, params={"access_token": ACCESS_TOKEN}, json=payload)
        if r.is_error:
            logger.warning("Meta CAPI %s: %s", r.status_code, (r.text or "")[:500])
        else:
            logger.info("Meta CAPI ok: %s", (r.text or "")[:200])
    except httpx.RequestError as e:
        logger.error("Meta CAPI request error: %s", e)
    except Exception as e:
        logger.error("Meta CAPI unexpected error: %s", e)


# ─────────────── Public helper ───────────────

async def send_lead_event(
    *,
    lead_type: str,
    request: Optional[Request] = None,
    name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    city: Optional[str] = None,
    external_id: Optional[str] = None,
    event_id: Optional[str] = None,
    event_source_url: Optional[str] = None,
    value: float = 0.0,
    currency: str = "INR",
    custom_fields: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Fire-and-forget Meta Lead event. Safe to call from any endpoint.

    Schedules the actual HTTPS call via asyncio.create_task so it never blocks
    the form response. If CAPI is not configured this is a no-op.
    """
    if not CAPI_ENABLED:
        return

    first_name, last_name = _split_name(name)
    user_data: Dict[str, Any] = {}

    h = _hash_email(email)
    if h: user_data["em"] = [h]
    h = _hash_phone(phone)
    if h: user_data["ph"] = [h]
    h = _hash_name(first_name)
    if h: user_data["fn"] = [h]
    h = _hash_name(last_name)
    if h: user_data["ln"] = [h]
    h = _hash_name(city)
    if h: user_data["ct"] = [h]
    if external_id:
        user_data["external_id"] = [str(external_id)]

    if request is not None:
        ip = _client_ip_from_request(request)
        if ip: user_data["client_ip_address"] = ip
        ua = request.headers.get("user-agent")
        if ua: user_data["client_user_agent"] = ua
        fbp = request.cookies.get("_fbp")
        if fbp: user_data["fbp"] = fbp
        fbc = request.cookies.get("_fbc")
        if fbc: user_data["fbc"] = fbc

    # Per Meta spec: include event_source_url for website action_source
    if not event_source_url and request is not None:
        try:
            referer = request.headers.get("referer")
            event_source_url = referer or SITE_PUBLIC_URL
        except Exception:
            event_source_url = SITE_PUBLIC_URL
    event_source_url = event_source_url or SITE_PUBLIC_URL

    custom_data: Dict[str, Any] = {
        "lead_type": lead_type,
        "value": float(value or 0.0),
        "currency": currency or "INR",
        "content_category": lead_type,
    }
    if custom_fields:
        custom_data.update({k: v for k, v in custom_fields.items() if v is not None})

    event = {
        "event_name": "Lead",
        "event_time": int(time.time()),
        "event_id": event_id or f"lead_{int(time.time())}_{os.urandom(4).hex()}",
        "action_source": "website",
        "event_source_url": event_source_url,
        "user_data": user_data,
        "custom_data": custom_data,
    }
    payload: Dict[str, Any] = {"data": [event]}
    if TEST_EVENT_CODE:
        payload["test_event_code"] = TEST_EVENT_CODE

    # Truly fire-and-forget — schedule on event loop and return immediately
    try:
        asyncio.create_task(_post_event(payload))
    except RuntimeError:
        # No running loop (shouldn't happen inside FastAPI request); fall back to sync log
        logger.warning("Meta CAPI: no event loop, event dropped")
