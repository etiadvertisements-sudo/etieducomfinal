'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { whatsappLink, PHONE_NUMBER } from '@/lib/whatsapp';
import { trackEvent, EVENTS } from '@/lib/track';

/**
 * Sticky mobile-only bottom bar with Call · WhatsApp · Enquire
 * Hidden on desktop (md:hidden). Bumps body padding so content isn't covered.
 */
export default function MobileStickyBar() {
  return (
    <>
      <div className="md:hidden h-16" aria-hidden="true" />
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        data-testid="mobile-sticky-cta"
        aria-label="Quick contact"
      >
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() => trackEvent(EVENTS.PHONE_CLICK, { source: 'sticky_bar' })}
            className="flex flex-col items-center justify-center py-2.5 text-primary hover:bg-primary/5 transition-colors"
            data-testid="sticky-call"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-0.5">Call</span>
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(EVENTS.WHATSAPP_CLICK, { source: 'sticky_bar' })}
            className="flex flex-col items-center justify-center py-2.5 text-green-600 hover:bg-green-50 transition-colors"
            data-testid="sticky-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-0.5">WhatsApp</span>
          </a>
          <Link
            href="/free-counselling"
            className="flex flex-col items-center justify-center py-2.5 text-white bg-primary hover:bg-primary/90 transition-colors"
            data-testid="sticky-enquire"
          >
            <Send className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-0.5">Enquire</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
