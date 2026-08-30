# ETI Educom — Project Setup Record

## Original Problem Statement
> Clone https://github.com/etiadvertisements-sudo/etieducomfinal.git and make it running.

## Architecture
- **Frontend**: Next.js 14.2.5 (App Router) + React 19 + Tailwind + Radix UI + Lucide icons. Port 3000 via supervisor `yarn start` → `next dev -p 3000`.
- **Backend**: FastAPI 0.110 (motor/MongoDB async), bcrypt + JWT + mandatory TOTP admin 2FA, slowapi rate limiting, Cloudinary uploads, MSG91 WhatsApp, Meta Conversions API (server-side), IndexNow/Google Indexing SEO pings, emergentintegrations LLM chatbot, sitemap routes. Port 8001 via supervisor uvicorn.
- **DB**: Local MongoDB `mongodb://localhost:27017`, db = `test_database`.
- **Proxy**: `next.config.js` rewrites `/api/*` → `http://localhost:8001/api/*`; external traffic via Kubernetes ingress (`/api` → 8001).

## Setup Session — 2026-08-22 (clone & run in fresh env)
- Cloned repo; copied `backend/` and Next.js `frontend/` into `/app`, removed stale CRA files (`src/`, `craco.config.js`, old `yarn.lock`).
- Created `/app/backend/.env`: MONGO_URL, DB_NAME (preserved), CORS_ORIGINS, EMERGENT_LLM_KEY (wired), ADMIN_PASSWORD, JWT_SECRET, TOTP_ISSUER, SITE_PUBLIC_URL, INDEXNOW_KEY; integration keys (Cloudinary/Meta/Google) left blank as chosen by user.
- Preserved `/app/frontend/.env` (REACT_APP_BACKEND_URL). Frontend uses `/api` relative (client) and `localhost:8001` (SSR) fallbacks — no extra config needed.
- Installed backend `requirements.txt` + frontend deps (yarn), restarted supervisor.

## Services Status (verified)
- backend RUNNING — `/api/health` → healthy, MongoDB indexes ensured, admin auto-seeded.
- frontend RUNNING — Next.js Ready, homepage 200 with full content + hero enquiry form.
- mongodb RUNNING.
- Verified APIs: `/api/health`, `/api/reviews/stats`, `/api/admin/login` (rejects wrong pass, returns 2FA setup for correct pass).

## Admin Access
- Path `/eti-manage-x9k2m` (or `/admin`), password `ETIadmin@2026`, mandatory TOTP 2FA on first login. See `/app/memory/test_credentials.md`.

## Backlog / Optional
- Plug in real integration keys (Cloudinary uploads, Meta CAPI token + Pixel ID, MSG91 WhatsApp, Google Indexing service account) when available.
