# ETI Educom - Product Requirements Document

## Original Problem Statement
Clone ETI Educom GitHub repo, set up on Emergent. Add image uploads, JWT auth, Cloudinary CDN, advanced blog SEO, and comprehensive security hardening.

## Architecture
- **Frontend:** Next.js 14 (App Router)
- **Backend:** FastAPI + MongoDB
- **CDN:** Cloudinary
- **Auth:** JWT + bcrypt

## Security Hardening (Latest Session)
| Vulnerability | Fix | Status |
|---------------|-----|--------|
| Unprotected admin CRUD endpoints | JWT auth via `Depends(get_current_admin)` on ALL create/update/delete routes | Done |
| Brute force login | Rate limiting 5/minute via slowapi | Done |
| Spam form submissions | Rate limiting 10/minute on public forms | Done |
| No security headers | SecurityHeadersMiddleware (X-Frame-Options DENY, X-XSS-Protection, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy) | Done |
| SVG upload (XSS vector) | Removed .svg from ALLOWED_EXTENSIONS | Done |
| Stored XSS via blog content | HTML sanitization via bleach on create | Done |
| CORS wildcard | Restricted to configured origins | Done |
| Frontend token leakage | adminFetch helper sends JWT Bearer token | Done |
| Admin cache exposure | Cache-Control: no-store on /api/admin routes | Done |

## Testing Status
- Security: 100% (33/33 tests passed - iteration 3)
- All admin endpoints return 401 without JWT
- Public endpoints still accessible without auth
- Rate limiting verified (429 after limit)
- Security headers verified

## Deployment Checklist
1. Git push from Emergent → git pull on VPS
2. Backend: `pip install slowapi bleach cloudinary`
3. Backend .env: add JWT_SECRET, CLOUDINARY vars
4. Frontend: `npm install && npm run build`
5. Restart both services

## Last Updated
April 27, 2026
