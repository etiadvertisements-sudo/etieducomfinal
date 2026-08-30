import { FileText } from 'lucide-react';
import BlogsPageClient from '@/components/BlogsPageClient';

const SITE_URL = 'https://www.etieducom.com';
// Server-side fetches must hit backend directly (avoids loops via public domain)
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchBlogs() {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// JSON-LD CollectionPage / Blog (helps Google understand this is a blog index)
function blogIndexJsonLd(blogs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blogs`,
    url: `${SITE_URL}/blogs`,
    name: 'ETI Educom Blog',
    description:
      "Latest articles on IT careers, programming, cybersecurity, digital marketing & AI from India's leading Computer Career School.",
    publisher: {
      '@type': 'Organization',
      name: 'ETI Educom',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-blue.png`,
      },
    },
    blogPost: blogs.slice(0, 20).map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: `${SITE_URL}/blogs/${b.slug || b.id}`,
      datePublished: b.published_at || b.created_at,
      dateModified: b.updated_at || b.created_at,
      image: b.featured_image || `${SITE_URL}/images/og-image.jpg`,
      author: { '@type': 'Organization', name: b.author || 'ETI Educom' },
      articleSection: b.category,
      description: b.excerpt,
    })),
  };
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();

  return (
    <div className="min-h-screen" data-testid="blogs-listing-page">
      {/* Server-rendered JSON-LD so Google sees the full blog index on first byte */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd(blogs)) }}
      />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Knowledge Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Blogs &amp; <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest trends, tips, and insights in the world of IT
              education and careers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Server-rendered SEO list (visible & crawlable even before JS loads) */}
          {blogs.length > 0 && (
            <ul className="sr-only" aria-hidden="false">
              {blogs.map((b) => (
                <li key={b.id}>
                  <a href={`/blogs/${b.slug || b.id}`}>{b.title}</a>
                  {b.excerpt ? <span> — {b.excerpt}</span> : null}
                </li>
              ))}
            </ul>
          )}

          {/* Interactive grid (search + filter) hydrated from SSR data */}
          <BlogsPageClient initialBlogs={blogs} />
        </div>
      </section>
    </div>
  );
}

// Re-validate the page every 5 min so newly-published blogs appear quickly
export const revalidate = 300;
