// Static & marketing pages sitemap

const SITE_URL = 'https://www.etieducom.com';
// Last-meaningful-update timestamp for static pages.
// Bumping this value tells Google these pages have changed (don't use new Date()
// every request — that lies to Google about the modification frequency).
const STATIC_LASTMOD = '2026-05-06T00:00:00.000Z';

const STATIC_PAGES = [
  { path: '/',                            changefreq: 'weekly',  priority: 1.0 },
  { path: '/about',                       changefreq: 'monthly', priority: 0.9 },
  { path: '/founder',                     changefreq: 'monthly', priority: 0.7 },
  { path: '/team',                        changefreq: 'monthly', priority: 0.7 },
  { path: '/programs',                    changefreq: 'weekly',  priority: 0.95 },
  { path: '/eti-educonnect',              changefreq: 'weekly',  priority: 0.9 },
  { path: '/educonnect',                  changefreq: 'weekly',  priority: 0.7 },
  { path: '/cyber-warriors',              changefreq: 'weekly',  priority: 0.85 },
  { path: '/warriors',                    changefreq: 'weekly',  priority: 0.7 },
  { path: '/industrial-training',         changefreq: 'weekly',  priority: 0.9 },
  { path: '/summer-training',             changefreq: 'weekly',  priority: 0.9 },
  { path: '/free-counselling',            changefreq: 'monthly', priority: 0.85 },
  { path: '/blogs',                       changefreq: 'daily',   priority: 0.9 },
  { path: '/events',                      changefreq: 'weekly',  priority: 0.8 },
  { path: '/faq',                         changefreq: 'monthly', priority: 0.7 },
  { path: '/contact',                     changefreq: 'monthly', priority: 0.85 },
  { path: '/franchise',                   changefreq: 'monthly', priority: 0.8 },
  { path: '/hire-from-us',                changefreq: 'monthly', priority: 0.8 },
  { path: '/join-team',                   changefreq: 'weekly',  priority: 0.7 },
  { path: '/refer-and-earn',              changefreq: 'monthly', priority: 0.7 },
  { path: '/career-quiz',                 changefreq: 'monthly', priority: 0.9 },
  { path: '/best-institute-in-pathankot', changefreq: 'monthly', priority: 0.8 },
  { path: '/privacy-policy',              changefreq: 'yearly',  priority: 0.3 },
  { path: '/terms-and-conditions',        changefreq: 'yearly',  priority: 0.3 },
];

export const dynamic = 'force-dynamic';

export async function GET() {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    STATIC_PAGES.map(
      (p) =>
        `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${STATIC_LASTMOD}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(2)}</priority>\n  </url>`
    ).join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
