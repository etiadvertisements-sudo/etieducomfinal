import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.etieducom.com';
// Server-side fetches must hit backend directly, NOT through the public domain (would loop / time out)
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

export async function generateMetadata({ params }) {
  const url = `${SITE_URL}/blogs/${params.slug}`;
  const blog = await fetchBlog(params.slug);

  if (!blog) {
    // 404 metadata — combined with notFound() in page.js triggers a real 404
    return {
      title: 'Blog Not Found',
      robots: { index: false, follow: false },
      alternates: { canonical: url },
    };
  }

  const description = (blog.meta_description || blog.excerpt || blog.title || '').slice(0, 160);
  const image = blog.og_image || blog.featured_image || `${SITE_URL}/images/og-image.jpg`;
  const publishedAt = blog.published_at || blog.created_at;
  const updatedAt = blog.updated_at || blog.created_at;
  const authorName = blog.author || 'ETI Educom';
  const robotsStr = blog.robots || 'index, follow';

  return {
    title: blog.meta_title || blog.title,
    description,
    keywords: (blog.secondary_keywords && blog.secondary_keywords.length
      ? blog.secondary_keywords
      : blog.tags || []
    ).join(', '),
    authors: [{ name: authorName }],
    alternates: { canonical: blog.canonical_url || url },
    openGraph: {
      title: blog.meta_title || blog.title,
      description,
      url,
      type: blog.og_type || 'article',
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
      title: blog.meta_title || blog.title,
      description,
      images: [image],
    },
    robots: {
      index: !robotsStr.includes('noindex'),
      follow: !robotsStr.includes('nofollow'),
      googleBot: {
        index: !robotsStr.includes('noindex'),
        follow: !robotsStr.includes('nofollow'),
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'article:published_time': publishedAt,
      'article:modified_time': updatedAt,
      'article:author': authorName,
      'article:section': blog.category || 'Education',
    },
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}
