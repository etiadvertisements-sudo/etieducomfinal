import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Award,
  CheckCircle,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  ChevronRight,
  Briefcase,
  Star,
  Users,
} from 'lucide-react';
import ProgramEnquiryForm from '@/components/ProgramEnquiryForm';
import {
  PROGRAMS,
  PROGRAM_BY_SLUG,
} from '@/lib/programs-summary';
import { LOCATIONS, LOCATION_BY_SLUG } from '@/lib/locations';

const SITE_URL = 'https://www.etieducom.com';
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchReviewStats() {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/reviews/stats`, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ── slug parser ──
   format: <programSlug>-course-in-<citySlug>
   e.g. "python-course-in-gurdaspur"  → { program: "python", city: "gurdaspur" }
   e.g. "ui-ux-designing-course-in-jammu" → { program: "ui-ux-designing", city: "jammu" }
*/
function parseSlug(slug) {
  if (!slug) return null;
  const marker = '-course-in-';
  const idx = slug.lastIndexOf(marker);
  if (idx < 0) return null;
  const programSlug = slug.slice(0, idx);
  const citySlug = slug.slice(idx + marker.length);
  if (!programSlug || !citySlug) return null;
  return { programSlug, citySlug };
}

function buildSlug(programSlug, citySlug) {
  return `${programSlug}-course-in-${citySlug}`;
}

export async function generateStaticParams() {
  // Pre-build the most popular combinations at build time;
  // the remaining ones render on first request via ISR (dynamicParams=true).
  const popular = ['python', 'digital-marketing', 'web-development', 'graphic-designing', 'ai-beginners'];
  const params = [];
  for (const p of popular) {
    for (const l of LOCATIONS) {
      params.push({ slug: buildSlug(p, l.slug) });
    }
  }
  return params;
}

export const dynamicParams = true;
export const revalidate = 86400; // re-render once a day

export async function generateMetadata({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: 'Course Not Found', robots: { index: false, follow: false } };
  const program = PROGRAM_BY_SLUG[parsed.programSlug];
  const city = LOCATION_BY_SLUG[parsed.citySlug];
  if (!program || !city) return { title: 'Course Not Found', robots: { index: false, follow: false } };

  const url = `${SITE_URL}/courses/${params.slug}`;
  const title = `${program.title} Course in ${city.name}, ${city.stateShort} | ETI Educom`;
  const description = `Best ${program.title} course in ${city.name}. ${program.duration} certified training with placement assistance, expert trainers, and hands-on projects. Enroll today at ETI Educom — Pathankot’s leading computer institute serving ${city.name}.`;
  const keywords = [
    `${program.short} course in ${city.name}`,
    `${program.short} training in ${city.name}`,
    `${program.short} institute in ${city.name}`,
    `${program.short} classes ${city.name}`,
    `best ${program.short} course in ${city.name}`,
    `${program.category} course in ${city.name}`,
    `computer course in ${city.name}`,
    `IT institute in ${city.name}`,
    'ETI Educom',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'ETI Educom',
      locale: 'en_IN',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/og-image.jpg'] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default async function CityCoursePage({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();
  const program = PROGRAM_BY_SLUG[parsed.programSlug];
  const city = LOCATION_BY_SLUG[parsed.citySlug];
  if (!program || !city) notFound();

  const stats = await fetchReviewStats();
  const pageUrl = `${SITE_URL}/courses/${params.slug}`;

  // Other related courses in the same city (max 6 — for internal linking)
  const otherCoursesInCity = PROGRAMS.filter((p) => p.slug !== program.slug)
    .slice(0, 6)
    .map((p) => ({
      title: p.title,
      url: `${SITE_URL}/courses/${buildSlug(p.slug, city.slug)}`,
      duration: p.duration,
    }));

  // The same course in nearby cities (max 5)
  const sameCourseNearby = LOCATIONS.filter((l) => l.slug !== city.slug)
    .slice(0, 5)
    .map((l) => ({
      city: l.name,
      state: l.stateShort,
      url: `${SITE_URL}/courses/${buildSlug(program.slug, l.slug)}`,
    }));

  // ── JSON-LD ──
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${program.title} Course in ${city.name}`,
    description: `Industry-certified ${program.title} training for students from ${city.name} and surrounding areas (${city.nearby}). ${program.duration} program with placement support.`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'ETI Educom',
      sameAs: SITE_URL,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-blue.png`,
    },
    url: pageUrl,
    timeRequired: program.duration,
    inLanguage: 'en-IN',
    educationalLevel: 'Beginner to Advanced',
    isAccessibleForFree: false,
    hasCourseInstance: [{
      '@type': 'CourseInstance',
      courseMode: ['Onsite', 'Blended', 'Online'],
      location: {
        '@type': 'Place',
        name: `ETI Educom — for students in ${city.name}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jodhamal Colony, Dhangu Road',
          addressLocality: 'Pathankot',
          addressRegion: 'Punjab',
          postalCode: '145001',
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 32.2643, longitude: 75.6421 },
      },
      courseSchedule: program.duration,
    }],
    offers: [{
      '@type': 'Offer',
      category: 'Paid',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      priceCurrency: 'INR',
    }],
    aggregateRating: (stats && stats.review_count >= 5) ? {
      '@type': 'AggregateRating',
      ratingValue: String(stats.average_rating),
      reviewCount: String(stats.review_count),
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: `${SITE_URL}/programs` },
      { '@type': 'ListItem', position: 3, name: `${program.title} Course in ${city.name}`, item: pageUrl },
    ],
  };

  // EducationalOccupationalProgram — richer than Course schema, helps Google show
  // duration, credential, and educational level directly in search results.
  const programSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: `${program.title} Course in ${city.name}`,
    description: `Industry-certified ${program.title} programme for ${city.name} students. ${program.duration} of training including hands-on projects and 100% placement assistance.`,
    url: pageUrl,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'ETI Educom',
      sameAs: SITE_URL,
      url: SITE_URL,
    },
    educationalProgramMode: ['Onsite', 'Blended', 'Online'],
    timeToComplete: program.duration,
    inLanguage: 'en-IN',
    occupationalCategory: program.category,
    programType: 'Certificate',
    educationalLevel: 'Beginner to Advanced',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is the ${program.title} course available for students in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ETI Educom’s ${program.title} programme is available for students in ${city.name}, ${city.state} and the surrounding region. Our main campus is in Pathankot (${city.distanceKm > 0 ? `${city.distanceKm} km from ${city.name}` : 'in your city'}). We also offer blended online + onsite delivery so students from ${city.name} can attend without relocating.`,
        },
      },      {
        '@type': 'Question',
        name: `What is the duration of the ${program.title} course?`,
        acceptedAnswer: { '@type': 'Answer', text: `${program.duration}, including practical projects and placement support.` },
      },
      {
        '@type': 'Question',
        name: `Do I get placement assistance after the ${program.title} course in ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — every full programme includes our 100% placement assistance: resume building, mock interviews, and direct referrals to our 200+ hiring partners across India.' },
      },
      {
        '@type': 'Question',
        name: `Why should ${city.name} students choose ETI Educom?`,
        acceptedAnswer: { '@type': 'Answer', text: `Since 2017, ETI Educom has trained 5,000+ students in IT careers. We are ISO-certified, MSME-registered, and offer industry-recognised certifications (Microsoft, Google, Cisco, Adobe). For ${city.name} students, our central Pathankot location is easily accessible (${city.landmark} → Pathankot is a short commute) and we also offer online classes.` },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="city-course-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(programSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 lg:py-20">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/programs" className="hover:text-white">Courses</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white truncate max-w-[200px]">{program.title} in {city.name}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">{program.category}</span>
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {city.name}, {city.stateShort}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {program.title} Course in {city.name}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {program.duration} certified training programme — by Pathankot’s most-trusted IT institute, designed for students from {city.name}, {city.state}.
              </p>

              <p className="text-blue-100 mb-8 leading-relaxed">
                Looking for a top-rated <strong className="text-white">{program.title} course in {city.name}</strong>?
                ETI Educom delivers industry-aligned training, hands-on projects, and 100% placement
                assistance — without the hassle of relocating. Our flagship campus near {city.landmark}
                is just {city.distanceKm > 0 ? `${city.distanceKm} km from ${city.name}` : 'in your city'},
                and we also offer online + blended classes so {city.name} students can attend from home.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Duration</p>
                  <p className="font-bold">{program.duration}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Mode</p>
                  <p className="font-bold text-sm">Onsite + Online</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Placement</p>
                  <p className="font-bold text-sm">100% Support</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#enquiry" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors" data-testid="hero-enquiry-cta">
                  Book a Free Counselling
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a href="tel:+919646727676" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                  <Phone className="w-5 h-5" /> Call +91 96467 27676
                </a>
              </div>
            </div>

            <div id="enquiry" className="lg:pl-8">
              <ProgramEnquiryForm programName={`${program.title} in ${city.name}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Why ETI Educom for this city */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" /> Serving {city.name} since 2017
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why students from {city.name} choose ETI Educom
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ETI Educom is one of the most-recommended IT training institutes for students across
                {' '}{city.name}, {city.nearby}, and the wider {city.state} region. Our flagship campus is
                located {city.distanceKm > 0 ? `${city.distanceKm} km from ${city.name}` : 'right in your city'} —
                a short, well-connected commute — and we also run a structured online programme so you can
                attend without relocating.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over <strong>5,000 students</strong> trained, <strong>200+ hiring partners</strong>, and a focused
                placement team make ETI Educom’s {program.title} course in {city.name} one of the most outcome-driven
                programmes in north India.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                `Industry-aligned ${program.title} curriculum updated for 2026 hiring trends`,
                'Live, instructor-led classes (not pre-recorded videos)',
                'Hands-on capstone projects you can showcase in interviews',
                'Recognised certifications (Microsoft, Google, Adobe, Cisco partners)',
                '100% placement assistance — resume reviews, mock interviews, referrals',
                'Flexible EMI options and scholarships for deserving candidates',
                `Convenient for ${city.name} students — onsite, online, or blended attendance`,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 bg-blue-50/40 border-y border-blue-100">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, num: '5,000+', label: 'Students Trained' },
            { icon: Briefcase, num: '200+', label: 'Hiring Partners' },
            { icon: Star, num: '4.8/5', label: 'Average Rating' },
            { icon: Award, num: '15+', label: 'Certifications' },
          ].map(({ icon: I, num, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <I className="w-7 h-7 text-primary mb-1" />
              <div className="text-2xl font-bold text-gray-900">{num}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum brief + link to full program */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What you’ll learn — {program.title}
            </h2>
            <p className="text-gray-600">
              Our {program.duration} {program.title} programme is structured for {city.name}-based students
              who want job-ready skills without compromising on depth.
            </p>
          </div>
          <div className="text-center">
            <Link
              href={`/programs/${program.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              data-testid="full-curriculum-link"
            >
              See Full Curriculum & Modules
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Other courses in the same city — internal linking + crawl signals */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Other popular courses in {city.name}
          </h2>
          <p className="text-gray-600 mb-8">
            Explore more career-oriented programmes available for {city.name} students.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCoursesInCity.map((c, i) => (
              <Link
                key={i}
                href={c.url}
                className="block p-5 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {c.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {c.duration}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Same course in nearby cities */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {program.title} course in nearby cities
          </h2>
          <p className="text-gray-600 mb-8">
            Available across the Pathankot region — pick the location closest to you.
          </p>
          <div className="flex flex-wrap gap-3">
            {sameCourseNearby.map((c, i) => (
              <Link
                key={i}
                href={c.url}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {program.title} in {c.city}, {c.state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ visible on page (matches schema) */}
      <section className="py-16 bg-white">
        <div className="container-main max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((q, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-200 group">
                <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between list-none">
                  {q.name}
                  <span className="text-primary group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{q.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
