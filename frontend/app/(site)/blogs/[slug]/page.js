import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import { cloudImg } from '@/lib/utils';
import ReadingProgress from '@/components/ReadingProgress';

const SITE_URL = 'https://www.etieducom.com';
// For server-side fetches, prefer internal backend URL (avoids loops through the public domain)
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchBlog(slug) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBlogRedirect(slug) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs/redirect/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchRelatedBlogs(currentSlug, category) {
  if (!category) return [];
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const all = await res.json();
    if (!Array.isArray(all)) return [];
    return all
      .filter((b) => b?.slug && b.slug !== currentSlug && b.category === category)
      .slice(0, 3);
  } catch {
    return [];
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default async function BlogDetailPage({ params }) {
  const blog = await fetchBlog(params.slug);

  // If blog not found, check 301-redirect table (e.g. slug was changed in admin).
  if (!blog) {
    const redir = await fetchBlogRedirect(params.slug);
    if (redir?.new_slug) {
      const { redirect } = await import('next/navigation');
      redirect(`/blogs/${redir.new_slug}`);
    }
    notFound();
  }

  const relatedBlogs = await fetchRelatedBlogs(blog.slug, blog.category);

  const canonical = blog.canonical_url || `${SITE_URL}/blogs/${blog.slug}`;
  const heroImage = blog.featured_image ? cloudImg(blog.featured_image, 'full') : null;
  const ogImage = blog.og_image || blog.featured_image;

  // JSON-LD: BlogPosting
  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.excerpt,
    image: ogImage ? [ogImage] : [],
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      '@type': 'Organization',
      name: blog.author || 'ETI Educom',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ETI Educom',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-blue.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    wordCount: blog.word_count || 0,
    articleSection: blog.category,
    keywords: (blog.tags || []).join(', '),
    inLanguage: 'en-IN',
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blogs` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: canonical },
    ],
  };

  // JSON-LD: FAQPage (only if FAQs exist)
  const faqLd =
    blog.faq_items && blog.faq_items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: blog.faq_items.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <div className="min-h-screen" data-testid="blog-detail-page">
      {/* Reading progress bar (client component, hydrates after SSR) */}
      <ReadingProgress />

      {/* JSON-LD structured data — rendered server-side so Google sees it on first byte */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <section className="bg-gradient-to-br from-gray-50 to-white py-10 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-sm text-gray-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-primary">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {blog.title}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {blog.read_time} min read
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(blog.published_at || blog.created_at)}
            </span>
            {blog.word_count > 0 && (
              <span className="text-sm text-gray-400">{blog.word_count} words</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {blog.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">{blog.excerpt}</p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {blog.author || 'ETI Educom'}
              </p>
              <p className="text-xs text-gray-500">
                Published on {formatDate(blog.published_at || blog.created_at)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {heroImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-8">
          <div className="rounded-2xl overflow-hidden shadow-lg relative aspect-[16/9] bg-gray-100">
            <Image
              src={heroImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* FAQ Section */}
        {blog.faq_items && blog.faq_items.length > 0 && (
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {blog.faq_items.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl p-4 border border-gray-200 group"
                >
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </article>

      {/* Related posts — SSR for crawlable internal links */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200 py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wider">
                  Continue reading
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  Related articles in {blog.category}
                </h2>
              </div>
              <Link
                href="/blogs"
                className="text-primary text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  href={`/blogs/${rel.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-lg transition-all"
                  data-testid={`related-blog-${rel.slug}`}
                >
                  {rel.featured_image && (
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      <Image
                        src={cloudImg(rel.featured_image, 'card')}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {rel.category}
                    </span>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                      {rel.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{rel.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rel.read_time || 5} min read
                      </span>
                      <span>·</span>
                      <span>{formatDate(rel.published_at || rel.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Re-validate the page every 5 min so freshly published / updated blogs appear quickly
export const revalidate = 300;

// Generate dynamic params at build time (optional, not strictly needed)
export const dynamicParams = true;
