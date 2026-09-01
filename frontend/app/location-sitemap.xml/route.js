// Programmatic SEO: every program × every city = /courses/[program]-course-in-[city]

import { PROGRAMS } from '@/lib/programs-summary';
import { LOCATIONS } from '@/lib/locations';

const SITE_URL = 'https://www.etieducom.com';
const LASTMOD = '2026-05-06T00:00:00.000Z';

export const dynamic = 'force-dynamic';

export async function GET() {
  const urls = [];
  for (const p of PROGRAMS) {
    for (const l of LOCATIONS) {
      urls.push(`${SITE_URL}/courses/${p.slug}-course-in-${l.slug}`);
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
