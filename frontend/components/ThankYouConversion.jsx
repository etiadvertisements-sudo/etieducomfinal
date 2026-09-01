'use client';

import { useEffect, useRef } from 'react';
import { trackFormSubmission, trackConversion } from '@/lib/analytics';

/**
 * Fires conversion events on the /thank-you page so that ad platforms
 * (Google Ads, Meta, GA4) record a successful lead even if a form
 * submission handler missed firing client-side (e.g. browser unload).
 *
 * Works by reading ?source= and ?program= search params already set by
 * all forms on this site. Idempotent: only fires once per page load.
 *
 * Events pushed to dataLayer (GTM container handles forwarding):
 *   - `conversion`           — generic, picked up by Google Ads conversion tag
 *   - `lead_thank_you`       — backup specific event
 *   - `lead_form_submit`     — same generic event the form fires (for de-dup
 *                              GTM uses transaction_id below)
 */
const SOURCE_VALUE_MAP = {
  contact:     { value: 500,  category: 'contact_enquiry',        form: 'Contact Form' },
  enquiry:     { value: 600,  category: 'program_enquiry',         form: 'Program Enquiry' },
  counselling: { value: 800,  category: 'counselling_lead',        form: 'Free Counselling' },
  summer:      { value: 1000, category: 'summer_training_lead',    form: 'Summer Training' },
  industrial:  { value: 1200, category: 'industrial_training_lead',form: 'Industrial Training' },
  cyber:       { value: 700,  category: 'cyber_warriors_lead',     form: 'Cyber Warriors' },
  hiring:      { value: 2500, category: 'hiring_request',          form: 'Hire From Us' },
  franchise:   { value: 5000, category: 'franchise_enquiry',       form: 'Franchise Enquiry' },
  refer:       { value: 400,  category: 'referral',                form: 'Refer & Earn' },
  join_team:   { value: 2000, category: 'job_application',         form: 'Join Our Team' },
  brochure:    { value: 300,  category: 'brochure_download',       form: 'Brochure Download' },
  educonnect:  { value: 1000, category: 'educonnect_lead',         form: 'EduConnect Enquiry' },
  quiz:        { value: 400,  category: 'career_quiz_lead',        form: 'Career Quiz' },
  review:      { value: 100,  category: 'review_submitted',        form: 'Student Review' },
  hero:        { value: 600,  category: 'quick_enquiry',           form: 'Hero Quick Enquiry' },
};

export default function ThankYouConversion() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const source = (params.get('source') || 'unknown').toLowerCase();
    const program = params.get('program') || '';
    const txId = params.get('lead_id') || `ty-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const cfg = SOURCE_VALUE_MAP[source] || { value: 500, category: 'lead', form: 'Website Lead' };
    const details = {
      content_category: cfg.category,
      value: cfg.value,
      currency: 'INR',
      transaction_id: txId,
      program: program || undefined,
      thank_you_page: true,
    };

    // 1. Generic Google Ads conversion event — single tag in GTM listens for `conversion`
    trackConversion('conversion', {
      send_to: 'lead',            // GTM tag can route to AW-XXX/yyyy
      value: cfg.value,
      currency: 'INR',
      transaction_id: txId,
      form_name: cfg.form,
      content_category: cfg.category,
      program: program || undefined,
    });

    // 2. Backward-compatible form submission event (in case the form-side fire was lost
    //    e.g. user closed tab mid-submit but server still got the lead)
    trackFormSubmission(cfg.form, details, {});

    // 3. Specific thank-you event for granular GTM/GA4 reporting
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'lead_thank_you',
        ...details,
        form_name: cfg.form,
        source,
      });
    }
  }, []);

  return null;
}
