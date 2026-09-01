// Brochure page — print-friendly. User reaches this after submitting BrochureModal.
// We attempt to fetch program details; falls back to slug if module not available.

import { notFound } from 'next/navigation';
import PrintTrigger from '@/components/PrintTrigger';
import { PROGRAM_BY_SLUG } from '@/lib/programs-summary';

export const metadata = {
  title: 'Course Brochure | ETI Educom',
  robots: { index: false, follow: false },
};

export default function BrochurePage({ params }) {
  const program = PROGRAM_BY_SLUG[params.programId];
  if (!program) notFound();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { size: A4; margin: 18mm 14mm; }
        }
        .brochure-root { font-family: -apple-system, system-ui, sans-serif; color: #111827; }
        .brochure-h { font-weight: 800; }
      `}</style>

      <PrintTrigger autoOpen={true} />

      <div className="brochure-root max-w-3xl mx-auto px-6 py-10 bg-white" data-testid="brochure-page">
        {/* Header */}
        <header className="border-b-2 border-primary pb-5 mb-7 flex items-start justify-between">
          <div>
            <div className="text-2xl brochure-h text-primary">ETI Educom®</div>
            <div className="text-sm text-gray-500 mt-1">The Computer Career School · Pathankot · Since 2017</div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>www.etieducom.com</div>
            <div>+91 96467 27676</div>
            <div>helpdesk@etieducom.com</div>
          </div>
        </header>

        {/* Course title */}
        <section className="mb-7">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Course Brochure</div>
          <h1 className="text-3xl brochure-h text-gray-900 leading-tight mb-2">{program.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span><strong>Duration:</strong> {program.duration}</span>
            <span>·</span>
            <span><strong>Category:</strong> {program.category}</span>
            <span>·</span>
            <span><strong>Fees from:</strong> ₹{program.priceFrom.toLocaleString('en-IN')}</span>
          </div>
        </section>

        {/* What you'll learn */}
        <section className="mb-7">
          <h2 className="text-xl brochure-h text-gray-900 mb-3">What you’ll learn</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            The {program.title} programme is delivered live by industry trainers and built around
            hands-on projects. You will graduate with a portfolio you can showcase in interviews and
            be ready for {program.category} roles in north India and beyond.
          </p>
        </section>

        {/* Why ETI */}
        <section className="mb-7">
          <h2 className="text-xl brochure-h text-gray-900 mb-3">Why students choose ETI Educom</h2>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Live instructor-led classes (not pre-recorded videos)</li>
            <li>• 5,000+ students trained · 200+ hiring partners</li>
            <li>• Industry certifications: Microsoft, Google, Cisco, Adobe partner</li>
            <li>• 100% placement assistance — resume reviews, mock interviews, referrals</li>
            <li>• EMI options + scholarships for deserving candidates</li>
            <li>• Onsite, online and blended delivery modes</li>
          </ul>
        </section>

        {/* What's next */}
        <section className="mb-7 p-5 rounded-xl bg-primary/5 border border-primary/20">
          <h2 className="text-lg brochure-h text-gray-900 mb-2">Next step</h2>
          <p className="text-sm text-gray-700">
            A counsellor will call you within working hours to walk through fees, the next batch
            schedule and answer questions. To speed things up, save +91 96467 27676 in your contacts
            and message us on WhatsApp.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-xs text-gray-400 text-center mt-10 pt-4 border-t border-gray-100">
          ETI Educom · Jodhamal Colony, Dhangu Road, Pathankot, Punjab 145001 · Generated {new Date().toLocaleDateString('en-IN')}
        </footer>
      </div>
    </>
  );
}
