// Blog sitemap — uses real per-blog updated_at / created_at for accurate lastmod
// so Google only re-crawls when content actually changed.

const SITE_URL = 'https://www.etieducom.com';
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchBlogs() {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const blogs = await fetchBlogs();

  const items = blogs
    .filter((b) => b?.slug)
    .map((b) => {
      const lastmod =
        (b.updated_at && new Date(b.updated_at).toISOString()) ||
        (b.created_at && new Date(b.created_at).toISOString()) ||
        new Date().toISOString();
      return { url: `${SITE_URL}/blogs/${b.slug}`, lastmod };
    });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items
      .map(
        (i) =>
          `  <url>\n    <loc>${i.url}</loc>\n    <lastmod>${i.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
