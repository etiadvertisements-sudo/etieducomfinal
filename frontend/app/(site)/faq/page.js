import Link from 'next/link';
import { HelpCircle, ChevronRight } from 'lucide-react';
import FAQPageClient from '@/components/FAQPageClient';

export const metadata = {
  title: 'Frequently Asked Questions | Admissions, Programs & More',
  description: 'Find answers to frequently asked questions about ETI Educom® programs, admissions, certifications, fees, and placement assistance.',
  keywords: 'ETI Educom FAQ, computer institute questions, IT training FAQ, admission questions, placement FAQ',
  openGraph: {
    title: 'FAQ',
    description: 'Find answers to common questions about our programs and admissions.',
    url: 'https://www.etieducom.com/faq',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/faq' },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our programs, admissions, certifications, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <FAQPageClient />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-main text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
