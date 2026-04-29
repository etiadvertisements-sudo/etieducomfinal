'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '@/lib/analytics';

/**
 * Boot-time analytics: captures UTM/click IDs on first visit (and on every URL change).
 * Mount once near the top of the layout tree.
 */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
