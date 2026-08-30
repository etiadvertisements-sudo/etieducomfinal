import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail,
} from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const SITE_URL = 'https://www.etieducom.com';
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchAuthor(slug) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/authors/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAuthorArticles(slug) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/authors/${slug}/articles`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const a = await fetchAuthor(params.slug);
  const url = `${SITE_URL}/authors/${params.slug}`;
  if (!a) return { title: 'Author Not Found', robots: { index: false, follow: false } };
  const description = (a.bio || `${a.name} is a contributor at ETI Educom — articles on IT careers, programming, and tech.`).slice(0, 160);
  return {
    title: `${a.name}${a.title ? ` — ${a.title}` : ''} | ETI Educom`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${a.name} — ETI Educom`,
      description,
      url,
      type: 'profile',
      siteName: 'ETI Educom',
      images: a.photo_url ? [{ url: a.photo_url, alt: a.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: a.name, description },
    robots: { index: true, follow: true },
  };
}

const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export default async function AuthorPage({ params }) {
  const author = await fetchAuthor(params.slug);
  if (!author) notFound();
  const articles = await fetchAuthorArticles(params.slug);
  const url = `${SITE_URL}/authors/${params.slug}`;

  // JSON-LD: Person schema (Google E-E-A-T signal)
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#person`,
    name: author.name,
    url,
    image: author.photo_url || undefined,
    jobTitle: author.title || undefined,
    description: author.bio || undefined,
    knowsAbout: author.expertise || undefined,
    sameAs: [author.linkedin_url, author.twitter_url].filter(Boolean),
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'ETI Educom',
      url: SITE_URL,
    },
    hasCredential: (author.credentials || []).map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
    })),
  };

  return (
    <div className="min-h-screen bg-white" data-testid="author-profile-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="bg-gradient-to-br from-gray-50 to-white py-14 lg:py-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/blogs" className="hover:text-primary">Blog</Link><span>/</span>
            <span className="text-gray-900 font-medium">{author.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {author.photo_url && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-gray-100">
                <Image src={author.photo_url} alt={author.name} fill sizes="160px" className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{author.name}</h1>
              {author.title && <p className="text-lg text-primary font-medium mb-4">{author.title}</p>}
              {author.bio && <p className="text-gray-600 leading-relaxed max-w-2xl mb-5">{author.bio}</p>}

              {(author.credentials?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {author.credentials.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      <Award className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
              )}

              {(author.expertise?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {author.expertise.map((e, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      <Briefcase className="w-3 h-3 inline mr-1" /> {e}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                {author.linkedin_url && (
                  <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {author.twitter_url && (
                  <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.email && (
                  <a href={`mailto:${author.email}`} className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors" aria-label="Email">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Articles by {author.name} ({articles.length})
        </h2>
        <p className="text-gray-600 mb-8">All published pieces — newest first.</p>

        {articles.length === 0 ? (
          <p className="text-gray-500">No articles published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((b) => (
              <Link
                key={b.id || b.slug}
                href={`/blogs/${b.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-lg transition-all"
              >
                {b.featured_image && (
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <Image src={cloudImg(b.featured_image, 'card')} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5">
                  <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{b.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500 gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.read_time || 5} min</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.published_at || b.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export const revalidate = 600;
export const dynamicParams = true;
