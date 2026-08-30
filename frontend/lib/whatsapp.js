// Centralized WhatsApp deep-link helpers — ensures every CTA carries
// page-specific context so leads arrive pre-qualified.

const WHATSAPP_NUMBER = '919646727676'; // ETI Educom official WhatsApp

export function whatsappLink(message) {
  const text = encodeURIComponent(
    message || "Hi, I'd like to know more about ETI Educom courses."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function whatsappForProgram(programTitle) {
  return whatsappLink(
    `Hi ETI Educom, I'd like to know more about the ${programTitle} course — fees, schedule and placement details.`
  );
}

export function whatsappForCity(programTitle, cityName) {
  return whatsappLink(
    `Hi ETI Educom, I'm from ${cityName} and interested in the ${programTitle} course. Please share fees, schedule, and how I can attend.`
  );
}

export function whatsappForBlog(blogTitle) {
  return whatsappLink(
    `Hi ETI Educom, I just read your article "${blogTitle}" and would like to know more about your courses.`
  );
}

export const PHONE_NUMBER = '+919646727676';
export const PHONE_DISPLAY = '+91 96467 27676';
