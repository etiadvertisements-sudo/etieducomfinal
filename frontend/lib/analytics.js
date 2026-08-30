// ============================================================
// ETI Educom — Unified Analytics & Conversion Tracking
// ============================================================
// All events are pushed to window.dataLayer for Google Tag Manager.
// GTM Container: GTM-TRDQQ98M (handles GA4, Meta Pixel, Google Ads, etc.)
// 
// In GTM Dashboard, create triggers on these custom events:
//   - lead_form_submit  (all forms — generic)
//   - course_view       (program detail pages — for dynamic remarketing)
//   - phone_click       (call now buttons)
//   - whatsapp_click    (whatsapp floating button)
//   - blog_read         (30s+ on blog detail)
//   - site_search       (search box usage)
//   - outbound_click    (external links)
//
// Each form also pushes a specific event with form_name, e.g.:
//   - lead_counselling, lead_contact, lead_franchise, lead_hero, etc.
// ============================================================

const isBrowser = typeof window !== 'undefined';

/**
 * Push an event to GTM dataLayer.
 * GTM listens and forwards to GA4 / Meta Pixel / Google Ads via configured tags.
 */
const push = (event, payload = {}) => {
  if (!isBrowser) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
    page_path: window.location.pathname,
    page_url: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  });
};

/**
 * SHA-256 hash for Enhanced Conversions (Google Ads + Meta Advanced Matching).
 * GTM tags can read these hashed values from dataLayer for better attribution.
 */
const sha256Hash = async (value) => {
  if (!value || !isBrowser || !crypto?.subtle) return undefined;
  const trimmed = String(value).trim().toLowerCase();
  if (!trimmed) return undefined;
  try {
    const data = new TextEncoder().encode(trimmed);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return undefined;
  }
};

/** Build hashed user_data block for Enhanced Conversions / Meta Advanced Matching */
const buildUserData = async (userData = {}) => {
  const out = {};
  if (userData.email) out.sha256_email_address = await sha256Hash(userData.email);
  if (userData.phone) {
    let phone = String(userData.phone).replace(/\D/g, '');
    if (phone.length === 10) phone = '+91' + phone;
    else if (!phone.startsWith('+')) phone = '+' + phone;
    out.sha256_phone_number = await sha256Hash(phone);
  }
  if (userData.name) {
    const parts = userData.name.trim().split(/\s+/);
    if (parts[0]) out.sha256_first_name = await sha256Hash(parts[0]);
    if (parts.length > 1) out.sha256_last_name = await sha256Hash(parts[parts.length - 1]);
  }
  return out;
};

/* ============================================================
 * UTM / Click ID Capture (auto-attached to every lead)
 * ============================================================ */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];

/** Capture UTM/click params on first visit and persist for 30 days */
export const captureUtmParams = () => {
  if (!isBrowser) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    UTM_KEYS.forEach((k) => { if (params.get(k)) utm[k] = params.get(k); });
    if (Object.keys(utm).length > 0) {
      utm._captured_at = new Date().toISOString();
      localStorage.setItem('eti_utm', JSON.stringify(utm));
    }
  } catch { /* ignore */ }
};

/** Get stored UTM (auto-expires after 30d) */
export const getStoredUtm = () => {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem('eti_utm');
    if (!raw) return {};
    const utm = JSON.parse(raw);
    const ageDays = utm._captured_at
      ? (Date.now() - new Date(utm._captured_at).getTime()) / 86400000
      : 0;
    if (ageDays > 30) { localStorage.removeItem('eti_utm'); return {}; }
    const { _captured_at, ...rest } = utm;
    return rest;
  } catch { return {}; }
};

/* ============================================================
 * GENERIC TRACKERS
 * ============================================================ */

/** Track any custom event (escape hatch) */
export const trackEvent = (eventName, params = {}) => push(eventName, params);

/** Page view — usually not needed (GTM has built-in History trigger) */
export const trackPageView = (url) => {
  push('page_view_custom', { page_path: url });
};

/** Generic conversion event */
export const trackConversion = (eventName, eventParams = {}) => {
  push(eventName, { event_category: 'conversion', ...eventParams });
};

/* ============================================================
 * LEAD / FORM TRACKING (used by all forms)
 * ============================================================ */

/**
 * Track a form submission as a Lead.
 * Pushes both a generic `lead_form_submit` event AND a form-specific event.
 *
 * @param {string} formName - human-readable form name (e.g. "Free Counselling")
 * @param {object} details - extra params (course_interest, lead_id, etc.)
 * @param {{name?:string, email?:string, phone?:string}} userData - PII for hashing
 */
export const trackFormSubmission = async (formName, details = {}, userData = {}) => {
  const user_data = await buildUserData(userData);
  const utm = getStoredUtm();

  // Specific event (e.g. lead_free_counselling, lead_contact_form)
  const slug = String(formName).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const specificEvent = `lead_${slug}`;

  const payload = {
    form_name: formName,
    value: details.value || 500,
    currency: 'INR',
    content_name: formName,
    content_category: details.content_category || 'lead',
    user_data,
    ...utm,
    ...details,
  };

  // Fire specific event (allows separate triggers in GTM if needed)
  push(specificEvent, payload);
  // Fire generic event (single trigger captures all leads)
  push('lead_form_submit', payload);
};

/* ============================================================
 * SPECIFIC FORM TRACKERS (kept for backward-compatibility)
 * ============================================================ */

export const trackCounsellingLead = (details = {}, userData = {}) =>
  trackFormSubmission('Free Counselling', { content_category: 'counselling_lead', value: 800, ...details }, userData);

export const trackContactEnquiry = (details = {}, userData = {}) =>
  trackFormSubmission('Contact Form', { content_category: 'contact_enquiry', value: 500, ...details }, userData);

export const trackFranchiseEnquiry = (details = {}, userData = {}) =>
  trackFormSubmission('Franchise Enquiry', { content_category: 'franchise_enquiry', value: 5000, ...details }, userData);

export const trackHeroFormSubmission = (details = {}, userData = {}) =>
  trackFormSubmission('Hero Quick Enquiry', { content_category: 'quick_enquiry', value: 600, ...details }, userData);

export const trackHiringApplication = (details = {}, userData = {}) =>
  trackFormSubmission('Hiring Application', { content_category: 'job_application', value: 2000, ...details }, userData);

export const trackEduConnectEnquiry = (details = {}, userData = {}) =>
  trackFormSubmission('EduConnect Enquiry', { content_category: 'educonnect_lead', value: 1000, ...details }, userData);

export const trackIndustrialTraining = (details = {}, userData = {}) =>
  trackFormSubmission('Industrial Training', { content_category: 'industrial_training_lead', value: 1200, ...details }, userData);

export const trackSummerTraining = (details = {}, userData = {}) =>
  trackFormSubmission('Summer Training', { content_category: 'summer_training_lead', value: 1000, ...details }, userData);

/* ============================================================
 * HIGH-INTENT MICRO-CONVERSIONS
 * ============================================================ */

/** Course / program detail page view — for dynamic remarketing */
export const trackCourseView = ({ course_slug, course_name, category, duration, value = 1500 } = {}) => {
  push('course_view', {
    course_slug,
    course_name,
    category,
    duration,
    value,
    currency: 'INR',
    // Google Ads dynamic remarketing fields
    ecomm_prodid: course_slug,
    ecomm_pagetype: 'product',
    ecomm_totalvalue: value,
    // GA4 ecommerce
    items: [{
      item_id: course_slug, item_name: course_name, item_category: category,
      price: value, quantity: 1,
    }],
  });
};

/** Phone "Call Now" click */
export const trackPhoneClick = ({ phone = '+91-9646727676', location = 'unknown' } = {}) => {
  push('phone_click', {
    phone_number: phone,
    cta_location: location,
    value: 2000,
    currency: 'INR',
  });
};

/** WhatsApp click (high intent) */
export const trackWhatsAppClick = ({ location = 'whatsapp_floating_button' } = {}) => {
  push('whatsapp_click', {
    cta_location: location,
    value: 1500,
    currency: 'INR',
  });
};

/** Blog reader engagement (fire on 30s read) */
export const trackBlogRead = ({ slug, title, category } = {}) => {
  push('blog_read', { blog_slug: slug, blog_title: title, blog_category: category });
};

/** Site search */
export const trackSearch = (query, context = 'site') => {
  push('site_search', { search_term: query, search_context: context });
};

/** Outbound link click */
export const trackOutboundClick = (url, label) => {
  push('outbound_click', { outbound_url: url, link_label: label });
};

/** Programs filter usage */
export const trackProgramsFilter = (filter) => {
  push('programs_filter', { filter_value: filter });
};
