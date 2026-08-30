import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from '@/lib/whatsapp';
import ThankYouConversion from '@/components/ThankYouConversion';

const SITE_URL = 'https://www.etieducom.com';

export const metadata = {
  title: 'Thank You | ETI Educom',
  description: 'Thanks for your interest in ETI Educom. Our team will get back to you soon.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/thank-you` },
};

const INTEREST_LABEL = {
  contact: 'reaching out to us',
  enquiry: null,            // uses "the {program} programme" when program supplied
  counselling: 'our free counselling',
  summer: 'our Summer Training programme',
  industrial: 'our Industrial Training programme',
  cyber: 'the Cyber Warriors programme',
  hiring: 'hiring from ETI Educom',
  franchise: 'an ETI Educom franchise',
  refer: 'referring a friend to ETI Educom',
  join_team: 'joining the ETI Educom team',
  brochure: null,
  educonnect: 'ETI Educonnect',
  quiz: 'our courses',
  review: 'sharing your experience',
};

function firstName(raw) {
  if (!raw) return null;
  const first = String(raw).trim().split(/\s+/)[0];
  // Capitalise first letter, keep the rest as typed
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export default function ThankYouPage({ searchParams }) {
  const source = (searchParams?.source || '').toString().toLowerCase();
  const name = firstName(searchParams?.name);
  const program = (searchParams?.program || '').toString().trim();

  // Build the natural-language interest phrase
  let interest;
  if (program) interest = `the ${program} programme`;
  else interest = INTEREST_LABEL[source] || 'our programmes';

  return (
    <div className="min-h-[88vh] flex items-center justify-center bg-white px-5 py-16" data-testid="thank-you-page">
      {/* Fires Google Ads / Meta / GA4 conversion events from the dedicated thank-you URL */}
      <ThankYouConversion />
      <div className="w-full max-w-xl text-center">
        {/* Soft accent dot */}
        <div className="flex justify-center mb-7">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-40" />
          </div>
        </div>

        {/* Greeting */}
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5 leading-tight"
          data-testid="thank-you-title"
          style={{ fontFamily: 'var(--font-display, ui-sans-serif), sans-serif' }}
        >
          {name ? <>Hey <span className="text-primary">{name}</span>,</> : <>Thank you,</>} <br />
          thank you for showing interest in {interest}.
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
          Our team will get back to you soon — usually within a few working hours.
        </p>

        {/* Minimal contact strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            data-testid="thankyou-call"
          >
            <Phone className="w-4 h-4" /> Call us at {PHONE_DISPLAY}
          </a>
          <a
            href={whatsappLink(
              name
                ? `Hi ETI Educom, this is ${name}. I just enquired about ${program || 'your courses'}.`
                : `Hi ETI Educom, I just submitted an enquiry${program ? ` for ${program}` : ''}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
            data-testid="thankyou-whatsapp"
          >
            <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
          </a>
        </div>

        {/* Subtle onward link */}
        <div className="mt-12">
          <Link
            href="/programs"
            className="text-sm text-gray-400 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            ← Back to all programmes
          </Link>
        </div>
      </div>
    </div>
  );
}
