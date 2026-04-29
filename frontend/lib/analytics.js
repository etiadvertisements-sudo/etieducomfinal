// Analytics and Conversion Tracking Utility
// GA4 Measurement ID: G-T07GBKZGLL
// Meta Pixel ID: 1290011752822133
// Google Ads Conversion ID: AW-XXXXXXXXX (replace with your actual ID)
// Google Ads Conversion Label: XXXXXXXXXXX (replace with your actual label)

const GA_MEASUREMENT_ID = 'G-T07GBKZGLL';
const META_PIXEL_ID = '1290011752822133';
const GOOGLE_ADS_ID = 'AW-XXXXXXXXX';
const GOOGLE_ADS_CONVERSION_LABEL = 'XXXXXXXXXXX';

/**
 * SHA-256 hash for Enhanced Conversions
 * Google Ads Enhanced Conversions require hashed user data
 */
const sha256Hash = async (value) => {
  if (!value || typeof window === 'undefined') return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(trimmed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return undefined;
  }
};

/**
 * Set Enhanced Conversion user data (hashed email/phone)
 * Call this before firing a conversion event for better attribution
 */
const setEnhancedConversionData = async (userData = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const enhancedData = {};

  if (userData.email) {
    const hashedEmail = await sha256Hash(userData.email);
    if (hashedEmail) enhancedData.sha256_email_address = hashedEmail;
  }

  if (userData.phone) {
    // Normalize phone: add +91 prefix for Indian numbers
    let phone = userData.phone.replace(/\D/g, '');
    if (phone.length === 10) phone = '+91' + phone;
    else if (!phone.startsWith('+')) phone = '+' + phone;
    const hashedPhone = await sha256Hash(phone);
    if (hashedPhone) enhancedData.sha256_phone_number = hashedPhone;
  }

  if (userData.name) {
    const nameParts = userData.name.trim().split(/\s+/);
    if (nameParts.length > 0) {
      const hashedFirst = await sha256Hash(nameParts[0]);
      if (hashedFirst) enhancedData.address = { sha256_first_name: hashedFirst };
    }
    if (nameParts.length > 1) {
      const hashedLast = await sha256Hash(nameParts[nameParts.length - 1]);
      if (hashedLast) enhancedData.address = { ...enhancedData.address, sha256_last_name: hashedLast };
    }
  }

  if (Object.keys(enhancedData).length > 0) {
    window.gtag('set', 'user_data', enhancedData);
  }
};

/**
 * Track Google Ads conversion with Enhanced Conversions
 */
const trackGoogleAdsConversion = async (formName, value = 500, userData = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Set enhanced conversion data first
  await setEnhancedConversionData(userData);

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    value: value,
    currency: 'INR',
    transaction_id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  });
};

/**
 * Track form submission as a Lead conversion across all platforms
 * - GA4: generate_lead event
 * - Meta Pixel: Lead event
 * - Google Ads: conversion event with Enhanced Conversions (hashed PII)
 *
 * @param {string} formName - Name of the form
 * @param {object} details - Event details
 * @param {object} userData - User PII for Enhanced Conversions { name, email, phone }
 */
export const trackFormSubmission = (formName, details = {}, userData = {}) => {
  // GA4: generate_lead
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'form_submission',
      event_label: formName,
      currency: 'INR',
      value: 500,
      ...details,
    });
  }

  // Meta Pixel: Lead
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
      content_category: 'form_submission',
      ...details,
    });
  }

  // Google Ads: conversion + Enhanced Conversions
  trackGoogleAdsConversion(formName, 500, userData);
};

/**
 * Track a generic conversion event
 */
export const trackConversion = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, { event_category: 'conversion', ...eventParams });
  }
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, eventParams);
  }
};

/**
 * Track page view
 */
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    window.gtag('event', 'page_view', { send_to: GOOGLE_ADS_ID });
  }
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Specific form trackers — all include Enhanced Conversion data
 */
export const trackCounsellingLead = (details = {}, userData = {}) => {
  trackFormSubmission('Free Counselling', { content_category: 'counselling_lead', ...details }, userData);
};

export const trackContactEnquiry = (details = {}, userData = {}) => {
  trackFormSubmission('Contact Form', { content_category: 'contact_enquiry', ...details }, userData);
};

export const trackFranchiseEnquiry = (details = {}, userData = {}) => {
  trackFormSubmission('Franchise Enquiry', { content_category: 'franchise_enquiry', ...details }, userData);
};

export const trackHeroFormSubmission = (details = {}, userData = {}) => {
  trackFormSubmission('Hero Quick Enquiry', { content_category: 'quick_enquiry', ...details }, userData);
};

export const trackHiringApplication = (details = {}, userData = {}) => {
  trackFormSubmission('Hiring Application', { content_category: 'job_application', ...details }, userData);
};

export const trackEduConnectEnquiry = (details = {}, userData = {}) => {
  trackFormSubmission('EduConnect Enquiry', { content_category: 'educonnect_lead', ...details }, userData);
};

export const trackIndustrialTraining = (details = {}, userData = {}) => {
  trackFormSubmission('Industrial Training', { content_category: 'industrial_training_lead', ...details }, userData);
};

export const trackSummerTraining = (details = {}, userData = {}) => {
  trackFormSubmission('Summer Training', { content_category: 'summer_training_lead', ...details }, userData);
};
