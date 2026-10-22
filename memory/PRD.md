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


## Update — Jun 2026 (Cookie consent, Lead source, Marquees)
- Cookie consent banner (`components/CookieConsent.jsx`, site layout): accepted by default, GTM loads immediately; "Opt out" stores `eti_cookie_consent=rejected` and GTM no longer loads (guard in `app/layout.js`).
- Lead attribution: frontend sets first-party `eti_attr` cookie (UTM / gclid / fbclid / referrer / direct) in `lib/analytics.js`; backend middleware reads it, `queue_crm_lead` stores it in `lead_attributions` (keyed by lead_id) and sends campaign to the CRM. Admin `GET /api/admin/lead-attributions`. When a lead is deleted, its attribution record is deleted too.
- Admin All Leads now covers 11 forms and has Form / Lead Source (+medium) / Campaign columns, Form and Lead Source filters, and a quoted CSV export.
- Marquee (`components/Marquee.jsx`, `.marquee` CSS): certification partner logos in color (local defaults in `/public/images/partners`), placement partners from admin (`partner_type=placement`), and homepage placed-student cards (up to 12). Pauses on hover; shows a static row when there are fewer than 4 items.
- The user decided to skip backend Meta CAPI (GTM handles CAPI).
- Tested: iteration_6 (backend 100%, frontend 100%).

## Fix — Jun 2026: GTM missing on live site
- Live www.etieducom.com (self-hosted nginx/Next.js) had no GTM code: `.env` is gitignored, so `NEXT_PUBLIC_GTM_ID` was missing at build time. `app/layout.js` now falls back to `GTM-NW9SKWNV`. The user must push the code, then rebuild and restart on their server.
- Follow-up: GTM is now the official snippet as a plain inline `<script id="gtm-head">` at the top of `<head>` (no next/script), with the official noscript iframe right after `<body>`. Verified in preview: gtm.js loads once and GA4 fires. Live site still needs a pull, rebuild and restart.
- Live outage (CSS/JS returning 400 text/html): the server's cached HTML came from an old build while `.next` on disk held a newer one (rebuilt with no restart). Added `frontend/deploy.sh` (builds into `.next-new` via `NEXT_DIST_DIR`, swaps it in, then runs `pm2 restart`) and `distDir` env support in next.config.js. Tested a renamed build locally: assets return 200 with the right MIME types.
- CSP fix (next.config.js): `connect-src` now allows googleadservices, *.doubleclick.net, google.com, google.co.in, *.google.com, pagead2, *.facebook.com and connect.facebook.net. `script-src` adds cdn.jsdelivr.net and unpkg.com (Meta CAPI param builder). `frame-src` adds td.doubleclick.net. Preview /thank-you shows 0 CSP violations, AW-18497546445 conversion hits return 200, and Meta fbevents loads.
- Live `/api/placements` returns 404 because the live backend runs an old server.py; the backend must be redeployed.

## Fix — Jun 2026: Admin login lockout on live site
- Perpetual lockout bug: localStorage `admin_attempts` stayed at 5 after the 15-min lock expired, so the next wrong attempt re-locked instantly. Now expiry resets attempts (on load, on submit, and by a 5s timer that auto-unlocks the panel). A 429 now shows "wait 1 minute". The countdown shows seconds/minutes.
- Rate limiter `client_ip()`: uses X-Real-IP, else the last X-Forwarded-For entry, so spoofing the header doesn't bypass it.
- `backend/reset_admin.py`: resets the admin password to ADMIN_PASSWORD from .env and clears 2FA (for the live server).
- Tested: iteration_7 and iteration_8 (all pass); the XFF fix was verified with curl.
