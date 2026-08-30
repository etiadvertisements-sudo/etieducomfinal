'use client';

import { trackPhoneClick } from '@/lib/analytics';

/**
 * Reusable phone-click anchor that auto-fires `phone_click` event in GTM.
 * Drop-in replacement for <a href="tel:..."> wherever you want tracking.
 */
export default function PhoneLink({
  phone = '+91-9646727676',
  location = 'unknown',
  className,
  children,
  ...rest
}) {
  const tel = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const handleClick = () => trackPhoneClick({ phone, location });
  return (
    <a href={tel} onClick={handleClick} className={className} data-testid={`phone-link-${location}`} {...rest}>
      {children}
    </a>
  );
}
