const SITE_URL = 'https://www.etieducom.com';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || SITE_URL;

export async function generateMetadata({ params }) {
  const url = `${SITE_URL}/blogs/${params.slug}`;

  // Fetch blog by slug for proper SEO metadata
  let blog = null;
  try {
    const res = await fetch(`${API_BASE}/api/blogs/${params.slug}`, { next: { revalidate: 1800 } });
    if (res.ok) blog = await res.json();
  } catch {
    blog = null;
  }

  if (!blog) {
    return {
      title: 'Blog Article',
      description: 'Read the latest insights on IT careers, programming, and industry trends from ETI Educom.',
      alternates: { canonical: url },
      robots: { index: true, follow: true },
    };
  }

  const description = (blog.excerpt || blog.title || '').slice(0, 160);
  const image = blog.featured_image || `${SITE_URL}/images/og-image.jpg`;
  const publishedAt = blog.published_at || blog.created_at;
  const updatedAt = blog.updated_at || blog.created_at;
  const authorName = blog.author || 'ETI Educom';

  // Build article schema (rendered via head)
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: blog.title,
    description,
    image: [image],
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: 'ETI Educom',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo-blue.png` },
    },
    keywords: (blog.tags || []).join(', '),
    articleSection: blog.category || 'Education',
  };

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || description,
    keywords: (blog.keywords && blog.keywords.length ? blog.keywords : blog.tags || []).join(', '),
    alternates: { canonical: blog.canonical_url || url },
    openGraph: {
      title: blog.title,
      description,
      url,
      type: 'article',
      siteName: 'ETI Educom',
      locale: 'en_IN',
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [authorName],
      tags: blog.tags || [],
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [image],
    },
    robots: blog.robots
      ? { index: !blog.robots.includes('noindex'), follow: !blog.robots.includes('nofollow') }
      : { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1 } },
    other: { 'article:published_time': publishedAt, 'article:modified_time': updatedAt },
    // Embed the JSON-LD as a script via metadata.other? Next.js metadata doesn't support raw scripts, so do it inline below.
    _articleLd: articleLd, // unused by Next, just for reference
  };
}

export default function BlogPostLayout({ children, params }) {
  // Minimal layout — actual JSON-LD is rendered inside the page.js.
  // This layout exists primarily for generateMetadata().
  return children;
}
