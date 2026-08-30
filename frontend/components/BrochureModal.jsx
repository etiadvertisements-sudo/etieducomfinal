'use client';

import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { trackEvent, EVENTS } from '@/lib/track';

const API = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Email-gated brochure download modal.
 * Triggered by <BrochureButton /> on every program page.
 * On submit: creates a lead, then redirects to /programs/[id]/brochure (print-ready).
 */
export default function BrochureModal({ programId, programTitle, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/brochure-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          program_id: programId,
          program_name: programTitle,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      trackEvent(EVENTS.BROCHURE_REQUEST, { program_id: programId, program: programTitle });
      trackEvent(EVENTS.LEAD_SUBMIT, { source: 'brochure', program: programTitle });
      setDone(true);
      // Open the print-ready brochure in a new tab
      setTimeout(() => {
        window.open(`/programs/${programId}/brochure`, '_blank', 'noopener');
      }, 600);
    } catch (err) {
      trackEvent(EVENTS.ENQUIRY_FAIL, { source: 'brochure' });
      setError('Could not submit. Please call +91 96467 27676.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-4 py-6 bg-black/50 backdrop-blur-sm" data-testid="brochure-modal">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex items-start justify-between p-5 pb-3 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
              <Download className="w-3 h-3" /> Free Curriculum PDF
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              Get the {programTitle} brochure
            </h2>
            <p className="text-sm text-gray-500 mt-1">Modules, fees, schedule & placement record — instant view.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700" data-testid="brochure-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Opening your brochure…</h3>
            <p className="text-sm text-gray-500">A counsellor will also call you on {form.phone}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <input
              type="text" required placeholder="Your name *"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              data-testid="brochure-name"
            />
            <input
              type="tel" required placeholder="Phone number *"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              data-testid="brochure-phone"
            />
            <input
              type="email" placeholder="Email (optional)"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              data-testid="brochure-email"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              data-testid="brochure-submit"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Get Brochure Now</>}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              We respect your privacy. No spam — counsellor will call once with course details.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function BrochureButton({ programId, programTitle, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button" onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors ${className}`}
        data-testid="brochure-trigger"
      >
        <Download className="w-4 h-4" /> Download Curriculum PDF
      </button>
      {open && <BrochureModal programId={programId} programTitle={programTitle} onClose={() => setOpen(false)} />}
    </>
  );
}
