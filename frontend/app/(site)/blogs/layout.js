const SITE_URL = 'https://www.etieducom.com';

export const metadata = {
  title: 'Blog | IT Career Insights, Tutorials & Industry News',
  description:
    'Read the latest blogs from ETI Educom on IT careers, programming, cybersecurity, digital marketing, AI, and emerging tech. Tips, tutorials, and industry insights from Punjab\'s top computer career school.',
  keywords:
    'IT blogs, programming blog, career tips, cybersecurity blog, digital marketing blog, ETI Educom blog, IT industry insights, computer course tips, IT career guidance India',
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    title: 'ETI Educom Blog | IT Career Insights & Tutorials',
    description:
      'Latest blogs on IT careers, programming, cybersecurity, digital marketing, AI, and emerging tech.',
    url: `${SITE_URL}/blogs`,
    type: 'website',
    siteName: 'ETI Educom',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'ETI Educom Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETI Educom Blog',
    description: 'Latest IT career insights, tutorials & industry news from Punjab\'s premier IT institute.',
    images: ['/images/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function BlogsLayout({ children }) {
  return children;
}
