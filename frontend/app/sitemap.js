// Dynamic sitemap that auto-includes blogs, programs (DB + static), and all key pages.
// Next.js 13+ App Router convention: served at /sitemap.xml
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

const SITE_URL = 'https://www.etieducom.com';

// Internal API base — calls FastAPI directly (server-side fetch within container)
// Falls back to public site URL if env var is missing.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || SITE_URL;

// Static program slugs (defined in /programs/[programId]/page.js programsData)
// Keep in sync with that file.
const STATIC_PROGRAM_SLUGS = [
  'it-foundation', 'digital-design', 'it-networking', 'software-development',
  'python', 'web-designing', 'web-development', 'data-analytics',
  'ai-beginners', 'ai-engineering',
  'digital-marketing', 'graphic-designing', 'ui-ux-designing',
  'soc-analyst', 'ethical-hacking',
  'ms-office', 'e-accounting',
  'spoken-english', 'personality-development', 'interview-preparation',
];

const STATIC_PAGES = [
  { path: '/',                          changeFrequency: 'daily',   priority: 1.0 },
  { path: '/about',                     changeFrequency: 'monthly', priority: 0.9 },
  { path: '/founder',                   changeFrequency: 'monthly', priority: 0.7 },
  { path: '/team',                      changeFrequency: 'monthly', priority: 0.7 },
  { path: '/programs',                  changeFrequency: 'weekly',  priority: 0.95 },
  { path: '/eti-educonnect',            changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/educonnect',                changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/cyber-warriors',            changeFrequency: 'weekly',  priority: 0.85 },
  { path: '/warriors',                  changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/industrial-training',       changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/summer-training',           changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/free-counselling',          changeFrequency: 'monthly', priority: 0.85 },
  { path: '/blogs',                     changeFrequency: 'daily',   priority: 0.9 },
  { path: '/events',                    changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/faq',                       changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact',                   changeFrequency: 'monthly', priority: 0.85 },
  { path: '/franchise',                 changeFrequency: 'monthly', priority: 0.8 },
  { path: '/hire-from-us',              changeFrequency: 'monthly', priority: 0.8 },
  { path: '/join-team',                 changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/refer-and-earn',            changeFrequency: 'monthly', priority: 0.7 },
  { path: '/best-institute-in-pathankot', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy-policy',            changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/terms-and-conditions',      changeFrequency: 'yearly',  priority: 0.3 },
];

async function safeFetch(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // ISR: refresh hourly
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  // Static pages
  const entries = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Static program pages (always included regardless of DB state)
  const programSlugs = new Set(STATIC_PROGRAM_SLUGS);

  // Dynamic: programs (by slug from DB — adds any extra DB-only programs)
  const programs = await safeFetch(`${API_BASE}/api/programs`);
  for (const prog of programs) {
    if (!prog?.slug) continue;
    programSlugs.add(prog.slug);
  }

  for (const slug of programSlugs) {
    entries.push({
      url: `${SITE_URL}/programs/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // Dynamic: blogs (by slug)
  const blogs = await safeFetch(`${API_BASE}/api/blogs`);
  for (const blog of blogs) {
    if (!blog?.slug) continue;
    entries.push({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: blog.updated_at
        ? new Date(blog.updated_at)
        : blog.created_at
        ? new Date(blog.created_at)
        : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}

// Cache the sitemap on the edge for 1 hour
export const revalidate = 3600;
