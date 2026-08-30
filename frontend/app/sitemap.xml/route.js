// Sitemap INDEX — points crawlers to per-section sitemaps for faster indexing.
// Convention: https://www.example.com/sitemap.xml lists all sub-sitemaps.

const SITE_URL = 'https://www.etieducom.com';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date().toISOString();
  const sitemaps = [
    { loc: `${SITE_URL}/static-sitemap.xml`, lastmod: now },
    { loc: `${SITE_URL}/program-sitemap.xml`, lastmod: now },
    { loc: `${SITE_URL}/location-sitemap.xml`, lastmod: now },
    { loc: `${SITE_URL}/blog-sitemap.xml`, lastmod: now },
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemaps
      .map(
        (s) =>
          `  <sitemap><loc>${s.loc}</loc><lastmod>${s.lastmod}</lastmod></sitemap>`
      )
      .join('\n') +
    `\n</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
