# ETI Educom — Project Setup Record

## Original Problem Statement
> Clone https://github.com/etiadvertisements-sudo/etieducomfinal.git and make it running.

## Architecture
- **Frontend**: Next.js 14.2.5 (App Router) + React 19 + Tailwind + Radix UI + Lucide icons. Port 3000 via supervisor `yarn start` → `next dev -p 3000`.
- **Backend**: FastAPI 0.110 (motor/MongoDB async), bcrypt + JWT + mandatory TOTP admin 2FA, slowapi rate limiting, Cloudinary uploads, MSG91 WhatsApp, Meta Conversions API, IndexNow/Google Indexing SEO pings, emergentintegrations LLM chatbot, sitemap routes. Port 8001 via supervisor uvicorn.
- **DB**: Local MongoDB `mongodb://localhost:27017`, db = `test_database`.
- **Proxy**: `next.config.js` rewrites `/api/*` → `http://localhost:8001/api/*`.

## Setup Session — 2026-09-01 (clone & run in fresh env)
- Cloned repo into /app; copied backend/ and Next.js frontend/, removed stale CRA files (src/, craco.config.js, old yarn.lock).
- Created /app/backend/.env: MONGO_URL, DB_NAME (preserved), CORS_ORIGINS, EMERGENT_LLM_KEY (wired), ADMIN_PASSWORD=ETIadmin@2026, JWT_SECRET, TOTP_ISSUER, SITE_PUBLIC_URL; integration keys (Cloudinary/Meta/Google/IndexNow) left blank as chosen by user.
- Preserved /app/frontend/.env (REACT_APP_BACKEND_URL). Frontend uses relative /api (client) + localhost:8001 (SSR) fallbacks.
- Installed backend requirements.txt (pip) + frontend deps (yarn), restarted supervisor.
- Seeded content via admin endpoints: 20 programs (`/api/programs/seed-all`) + 17 SEO settings (`/api/seo/seed-all`).
- Reset admin 2FA so user gets fresh TOTP setup on first login.

## Services Status (verified)
- backend RUNNING — `/api/health` healthy, MongoDB indexes ensured, admin auto-seeded.
- frontend RUNNING — Next.js Ready, homepage & /programs render with seeded content.
- mongodb RUNNING.
- Verified: `/api/health`, `/api/programs` (20), `/api/quick-enquiry` POST persists, `/api/reviews/stats`, admin login+2FA setup flow.

## Data note
- Code-baked programs + SEO are seeded. User-generated content (blogs, reviews, authors, past enquiries) from the production DB is NOT present — no DB dump exists in the repo. Import a mongodump to restore live data.

## Admin Access
- Path `/eti-manage-x9k2m` (or `/admin`), password `ETIadmin@2026`, mandatory TOTP 2FA on first login. See `/app/memory/test_credentials.md`.

## Backlog / Optional
- Import production MongoDB dump to restore blogs/reviews/authors/enquiries.
- Plug in real integration keys (Cloudinary, Meta CAPI + Pixel ID, MSG91 WhatsApp, Google Indexing service account) when available.
