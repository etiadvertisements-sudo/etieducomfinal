// Programs sitemap (/programs/[programId])

import { PROGRAM_SLUGS } from '@/lib/programs-summary';

const SITE_URL = 'https://www.etieducom.com';
const PROGRAMS_LASTMOD = '2026-05-06T00:00:00.000Z';

export const dynamic = 'force-dynamic';

export async function GET() {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    PROGRAM_SLUGS.map(
      (slug) =>
        `  <url>\n    <loc>${SITE_URL}/programs/${slug}</loc>\n    <lastmod>${PROGRAMS_LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
    ).join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
