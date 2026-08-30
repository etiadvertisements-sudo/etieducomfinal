import CareerQuizClient from '@/components/CareerQuizClient';

const SITE_URL = 'https://www.etieducom.com';

export const metadata = {
  title: 'Career Path Quiz — Find Your Right IT Course in 2 Minutes | ETI Educom',
  description:
    'Take our free 60-second career quiz and get a personalised IT course recommendation. 20 programmes, 200+ hiring partners, instant guidance from ETI Educom.',
  keywords:
    'IT career quiz, which IT course should I take, career recommendation, IT course finder, ETI Educom quiz, find right course',
  alternates: { canonical: `${SITE_URL}/career-quiz` },
  openGraph: {
    title: 'Free IT Career Quiz — Find Your Right Course in 2 Minutes',
    description: 'Personalised programme recommendation based on your interests, goals & experience.',
    url: `${SITE_URL}/career-quiz`,
    type: 'website',
    siteName: 'ETI Educom',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'ETI Educom Career Quiz' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free IT Career Quiz — ETI Educom',
    description: 'Find your right IT course in under 2 minutes.',
  },
  robots: { index: true, follow: true },
};

export default function CareerQuizPage() {
  // SSR-rendered intro + client-side quiz interactivity
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'ETI Educom Career Path Quiz',
    description: 'Personalised IT course recommendation in under 2 minutes.',
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalLevel', targetName: 'Beginner to Advanced' },
    publisher: { '@type': 'Organization', name: 'ETI Educom', url: SITE_URL },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" data-testid="career-quiz-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }} />

      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            🎯 Free · 60-second quiz
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find your <span className="text-primary">perfect IT course</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer 8 quick questions about your interests, goals and experience —
            we’ll match you to one of our 20+ programmes with the best career fit.
          </p>
        </div>

        <CareerQuizClient />
      </section>
    </div>
  );
}
