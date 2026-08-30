// Lightweight GTM/dataLayer event tracker.
// Use trackEvent('lead_submitted', { source: 'quick_enquiry', program: 'Python' })
// from any form / button.

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      ...params,
      _ts: Date.now(),
    });
  } catch (_) {
    // never throw from analytics
  }
}

// Standard event constants — use these to keep names consistent.
export const EVENTS = {
  LEAD_SUBMIT: 'lead_submitted',          // any lead form succeeded
  QUIZ_COMPLETE: 'career_quiz_completed', // career quiz lead form submitted
  BROCHURE_REQUEST: 'brochure_requested', // brochure modal email gate submitted
  PHONE_CLICK: 'phone_clicked',           // tap-to-call
  WHATSAPP_CLICK: 'whatsapp_clicked',     // wa.me link
  COURSE_VIEW: 'course_viewed',           // program detail page mounted
  ENQUIRY_FAIL: 'enquiry_failed',         // form submit returned non-2xx
  REVIEW_SUBMIT: 'review_submitted',
};

/**
 * After a successful form submission: fire the lead event then redirect to the
 * shared /thank-you page. Centralises behaviour so every form behaves the same way.
 * Pass extras.name to personalise the greeting and extras.program for course context.
 */
export function redirectToThankYou(source, extras = {}) {
  try {
    trackEvent(EVENTS.LEAD_SUBMIT, { source, ...extras });
  } catch (_) {}
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams({ source });
    if (extras.name) params.set('name', extras.name);
    if (extras.program) params.set('program', extras.program);
    window.location.href = `/thank-you?${params.toString()}`;
  }
}
