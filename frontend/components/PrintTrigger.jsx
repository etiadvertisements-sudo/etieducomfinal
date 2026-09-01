'use client';

import { useEffect } from 'react';

/**
 * Print-ready brochure page (server-rendered shell from page.js +
 * client-side `window.print()` trigger after mount). User can save as PDF
 * via browser print dialog.
 */
export default function PrintTrigger({ autoOpen = true }) {
  useEffect(() => {
    if (autoOpen) {
      // Slight delay so styles / images are ready
      const t = setTimeout(() => {
        try { window.print(); } catch (_) {}
      }, 800);
      return () => clearTimeout(t);
    }
  }, [autoOpen]);
  return (
    <button
      onClick={() => window.print()}
      className="no-print fixed top-4 right-4 z-50 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-primary/90"
      data-testid="brochure-print-button"
    >
      Print / Save PDF
    </button>
  );
}
