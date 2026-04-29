import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import AnalyticsBootstrap from '@/components/AnalyticsBootstrap';

const inter = Inter({ subsets: ['latin'] });

// Google Tag Manager Container ID — manages GA4, Meta Pixel, Google Ads, etc.
const GTM_ID = 'GTM-TRDQQ98M';

export const metadata = {
  metadataBase: new URL('https://www.etieducom.com'),
  title: {
    default: 'ETI Educom® | The Computer Career School',
    template: '%s | ETI Educom®',
  },
  description: 'ETI Educom® - India\'s premier Computer Career School since 2017. Offering certified training in Software Development, Cybersecurity, Digital Marketing & IT Support with 100% placement assistance.',
  keywords: ['ETI Educom', 'computer institute', 'IT training', 'software development course', 'cybersecurity training', 'digital marketing course', 'computer career school', 'best computer institute Pathankot', 'IT certification', 'programming courses'],
  authors: [{ name: 'ETI Educom' }],
  creator: 'ETI Educom',
  publisher: 'ETI Educom',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.etieducom.com',
    siteName: 'ETI Educom',
    title: 'ETI Educom® | The Computer Career School',
    description: 'India\'s leading Computer Career School offering certified training in Software Development, Cybersecurity, Digital Marketing & IT Support since 2017.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ETI Educom - The Computer Career School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETI Educom® | The Computer Career School',
    description: 'India\'s leading Computer Career School offering certified training in Software Development, Cybersecurity, Digital Marketing & IT Support.',
    images: ['/images/og-image.jpg'],
  },
  // Add your real Google Search Console verification code here
  // verification: { google: 'YOUR_VERIFICATION_CODE' },
  alternates: {
    canonical: 'https://www.etieducom.com',
  },
  other: {
    'geo.region': 'IN-PB',
    'geo.placename': 'Pathankot',
    'geo.position': '32.2643;75.6421',
    'ICBM': '32.2643, 75.6421',
  },
};

// JSON-LD Structured Data — EducationalOrganization + LocalBusiness combined
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': 'https://www.etieducom.com/#organization',
  name: 'ETI Educom',
  alternateName: ['ETI Educom®', 'ETI Educom Pathankot', 'Educational Training Institute'],
  url: 'https://www.etieducom.com',
  logo: 'https://www.etieducom.com/images/logo-blue.png',
  image: 'https://www.etieducom.com/images/og-image.jpg',
  description:
    'India\'s premier Computer Career School offering certified training in Software Development, Cybersecurity, Digital Marketing, Python, Tally, Web Development, Data Analytics, AI, Graphic Design & IT Support since 2017. Best computer institute in Pathankot.',
  foundingDate: '2017',
  slogan: 'The Computer Career School — Training | Certification | Placement',
  telephone: '+91-9646727676',
  email: 'helpdesk@etieducom.com',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jodhamal Colony, Dhangu Road',
    addressLocality: 'Pathankot',
    addressRegion: 'Punjab',
    postalCode: '145001',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 32.2643, longitude: 75.6421 },
  areaServed: [
    { '@type': 'City', name: 'Pathankot' },
    { '@type': 'City', name: 'Gurdaspur' },
    { '@type': 'City', name: 'Dalhousie' },
    { '@type': 'City', name: 'Kathua' },
    { '@type': 'City', name: 'Jammu' },
    { '@type': 'AdministrativeArea', name: 'Punjab' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9646727676',
    contactType: 'customer service',
    email: 'helpdesk@etieducom.com',
    availableLanguage: ['English', 'Hindi', 'Punjabi'],
    areaServed: 'IN',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '5000',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.facebook.com/etieducom',
    'https://www.instagram.com/etieducom/',
    'https://www.linkedin.com/company/etieducom',
    'https://www.youtube.com/@ETIEducomofficial',
  ],
};

// JSON-LD: WebSite with SearchAction (sitelinks search box)
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.etieducom.com/#website',
  name: 'ETI Educom',
  url: 'https://www.etieducom.com',
  publisher: { '@id': 'https://www.etieducom.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.etieducom.com/blogs?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {/* Google Tag Manager — manages GA4, Meta Pixel, Google Ads, etc. */}
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        <AnalyticsBootstrap />

        {children}
      </body>
    </html>
  );
}
