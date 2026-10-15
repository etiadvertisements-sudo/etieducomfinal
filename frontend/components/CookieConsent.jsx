'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const KEY = 'eti_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setVisible(true); } catch {}
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(KEY, 'rejected');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cookie_consent_rejected' });
    window.location.reload();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:right-auto md:max-w-md z-[60] bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 animate-fade-in"
      role="dialog"
      aria-label="Cookie consent"
      data-testid="cookie-consent-banner"
    >
      <button onClick={accept} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Close" data-testid="cookie-consent-close">
        <X className="w-4 h-4" />
      </button>
      <div className="flex gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
          <Cookie className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">We use cookies</p>
          <p className="text-sm text-gray-600 mt-1">
            We use cookies for analytics and to improve your experience. You can opt out of tracking cookies anytime.{' '}
            <Link href="/privacy-policy" className="text-primary underline" data-testid="cookie-consent-policy-link">Privacy Policy</Link>
          </p>
          <div className="flex gap-2 mt-4">
            <button onClick={accept} className="btn-primary text-sm py-2 px-4" data-testid="cookie-consent-accept">Accept</button>
            <button onClick={reject} className="btn-secondary text-sm py-2 px-4" data-testid="cookie-consent-reject">Opt out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
