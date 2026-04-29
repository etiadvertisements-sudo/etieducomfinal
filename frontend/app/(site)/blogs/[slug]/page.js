'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/blogs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setBlog(data);

        // Page title
        document.title = data.meta_title || `${data.title} | ETI Educom Blog`;

        // Meta tags helper
        const setMeta = (attr, name, content) => {
          if (!content) return;
          let el = document.querySelector(`meta[${attr}="${name}"]`);
          if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
          el.setAttribute('content', content);
        };

        // Basic meta
        setMeta('name', 'description', data.meta_description || data.excerpt);
        setMeta('name', 'keywords', (data.tags || []).join(', '));
        setMeta('name', 'author', data.author || 'ETI Educom');
        setMeta('name', 'robots', data.robots || 'index, follow');

        // Open Graph
        setMeta('property', 'og:title', data.meta_title || data.title);
        setMeta('property', 'og:description', data.meta_description || data.excerpt);
        setMeta('property', 'og:type', data.og_type || 'article');
        setMeta('property', 'og:url', `https://etieducom.com/blogs/${data.slug}`);
        setMeta('property', 'og:site_name', 'ETI Educom');
        setMeta('property', 'og:locale', 'en_IN');
        if (data.og_image || data.featured_image) {
          setMeta('property', 'og:image', cloudImg(data.og_image || data.featured_image, 'hero'));
          setMeta('property', 'og:image:width', '1200');
          setMeta('property', 'og:image:height', '630');
        }
        setMeta('property', 'article:published_time', data.published_at || data.created_at);
        setMeta('property', 'article:modified_time', data.updated_at);
        setMeta('property', 'article:author', data.author || 'ETI Educom');
        setMeta('property', 'article:section', data.category);
        (data.tags || []).forEach(tag => setMeta('property', 'article:tag', tag));

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', data.meta_title || data.title);
        setMeta('name', 'twitter:description', data.meta_description || data.excerpt);
        if (data.og_image || data.featured_image) {
          setMeta('name', 'twitter:image', cloudImg(data.og_image || data.featured_image, 'hero'));
        }

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
        canonical.setAttribute('href', data.canonical_url || `https://etieducom.com/blogs/${data.slug}`);

        // JSON-LD BlogPosting
        const blogJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description: data.meta_description || data.excerpt,
          image: data.og_image || data.featured_image || '',
          datePublished: data.published_at || data.created_at,
          dateModified: data.updated_at,
          author: { '@type': 'Organization', name: data.author || 'ETI Educom', url: 'https://etieducom.com' },
          publisher: { '@type': 'Organization', name: 'ETI Educom', logo: { '@type': 'ImageObject', url: 'https://etieducom.com/images/logo-blue.png' } },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://etieducom.com/blogs/${data.slug}` },
          wordCount: data.word_count || 0,
          articleSection: data.category,
          keywords: (data.tags || []).join(', '),
          inLanguage: 'en-IN',
        };
        addJsonLd('blog-posting', blogJsonLd);

        // JSON-LD BreadcrumbList
        const breadcrumbJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://etieducom.com' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://etieducom.com/blogs' },
            { '@type': 'ListItem', position: 3, name: data.title, item: `https://etieducom.com/blogs/${data.slug}` },
          ]
        };
        addJsonLd('breadcrumb', breadcrumbJsonLd);

        // JSON-LD FAQPage (if FAQs exist)
        if (data.faq_items && data.faq_items.length > 0) {
          const faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: data.faq_items.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer }
            }))
          };
          addJsonLd('faq-page', faqJsonLd);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const addJsonLd = (id, data) => {
    let existing = document.getElementById(`jsonld-${id}`);
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = `jsonld-${id}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error || !blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
      <p className="text-gray-500">The article you are looking for does not exist.</p>
      <Link href="/blogs" className="text-primary font-semibold hover:underline">Back to All Articles</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-50 to-white py-10 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/blogs" className="hover:text-primary">Blog</Link><span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{blog.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{blog.category}</span>
            <span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.read_time} min read</span>
            <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(blog.published_at || blog.created_at)}</span>
            {blog.word_count > 0 && <span className="text-sm text-gray-400">{blog.word_count} words</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">{blog.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">{blog.excerpt}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{blog.author || 'ETI Educom'}</p>
              <p className="text-xs text-gray-500">Published on {formatDate(blog.published_at || blog.created_at)}</p>
            </div>
          </div>
        </div>
      </section>

      {blog.featured_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-8">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={cloudImg(blog.featured_image, 'full')} alt={blog.title} className="w-full h-auto object-cover" loading="lazy" />
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* FAQ Section */}
        {blog.faq_items && blog.faq_items.length > 0 && (
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {blog.faq_items.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-primary group-open:rotate-180 transition-transform">+</span>
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
              {blog.tags.map((tag, i) => (<span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{tag}</span>))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
