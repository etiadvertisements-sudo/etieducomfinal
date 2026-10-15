# Fix: Google Tag Manager Not Detected on the Live Site

Restore Google Tag Manager (container GTM-NW9SKWNV) on www.etieducom.com so Tag Assistant, GA4, Meta Pixel and the Meta Conversions API tags set up in GTM receive data again.
The official GTM snippet goes into every public page exactly as Google provides it. Visitors who click "Opt out" on the cookie banner stay untracked.

## Who it's for
- The ETI Educom marketing team, who run GA4, Meta Pixel and Meta Conversions API through GTM and track ad leads.
- Site visitors. Tracking runs by default, and they can still opt out.

## What's wrong today
- Tag Assistant connects to www.etieducom.com but reports "No Google tags found".
- The live site is running the latest release: the new cookie banner is visible. But the published page does not contain the GTM container.
- Likely cause: the site only adds the container when the GTM ID setting is present while the live site is being built. That setting is missing from the live build, so the GTM code is silently left out of every page.

## Core features and experience
- **Always-present GTM snippet:** Google's official GTM code (the one you shared) sits at the top of the page head on every public page. The "noscript" part sits right after the body opens. Both are built into the site, so they no longer depend on a separate live-build setting.
- **Loads once per page:** the container loads a single time, with no duplicate page views.
- **Cookie banner respected:** tracking stays on by default. If a visitor clicks "Opt out", GTM does not load for them on later pages.
- **Security rules allow GTM's tools:** the site's security settings are checked so they don't block Tag Assistant / GTM Preview mode, GA4 or Meta Pixel. Any missing Google or Meta address is added.
- **Admin pages:** GTM stays off on the admin panel, as before.

## User flow
1. A visitor opens any page on www.etieducom.com and GTM-NW9SKWNV loads immediately.
2. GTM fires the GA4, Meta Pixel and Conversions API tags already configured in your GTM account.
3. When the visitor submits a form, the existing lead events go to GTM as they do today.
4. If the visitor clicks "Opt out", the page reloads without GTM, and GTM stays off for that visitor.
5. You open Tag Assistant on www.etieducom.com. It now finds the GTM-NW9SKWNV container and shows your tags firing.

## UI/UX feel
- Nothing visible changes. The cookie banner, layout and forms stay exactly as they are now.

## Implementation phases
- **Phase 1 (MVP, built now):** build the GTM snippet into every public page and keep the opt-out check. Confirm the security settings allow Tag Assistant, GA4 and Meta. Check in a production-style build that the container appears once in the page source and that Tag Assistant can detect it. Then you redeploy, and the live site is checked again.
- **Phase 2:** a "Tracking settings" panel in the admin to see or change the GTM container ID without a redeploy.
- **Phase 3:** a simple health check in the admin that warns if the GTM container is missing from the live pages.

## Assumptions
- Confirmed by you: the GTM ID GTM-NW9SKWNV is built into the site directly instead of relying only on a live-build setting. Changing the container later means a small code update and a redeploy.
- Confirmed by you: GTM runs on public pages only, not on the admin panel.
- The fix uses your snippet exactly as given (same container, same "dataLayer" name). The only addition is the existing check that skips loading for visitors who opted out.
- You'll redeploy after the fix. The live site can't change until it's redeployed.
- Your GTM container's latest version is published in your GTM account. If it isn't, Tag Assistant will find the container but no tags will fire. That has to be done in your GTM account, not on the website.
- No server-side GTM container is used. Meta Conversions API runs from the web container, as you confirmed.
- No new backend Meta Conversions API is added, as you decided earlier.
