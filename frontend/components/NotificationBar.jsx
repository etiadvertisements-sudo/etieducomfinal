'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, X, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function NotificationBar() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/announcements`);
        if (r.ok && active) {
          const data = await r.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const visible = !dismissed && items.length > 0;

  // Offset the fixed header and main content when the bar is shown.
  // Use a body-level class so Header's own className updates (on scroll) don't wipe it.
  useEffect(() => {
    if (visible) {
      document.body.classList.add('has-announcement');
    } else {
      document.body.classList.remove('has-announcement');
    }
    return () => document.body.classList.remove('has-announcement');
  }, [visible]);

  // Rotate through multiple announcements
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!visible) return null;

  const item = items[index % items.length];

  return (
    <div className="announcement-bar" data-testid="notification-bar" role="region" aria-label="Site announcement">
      <div className="container-main flex items-center justify-center gap-2 relative">
        <Megaphone className="w-4 h-4 shrink-0 hidden sm:block" />
        <span className="truncate" data-testid="notification-bar-text">{item.text}</span>
        {item.link && (
          <Link
            href={item.link}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90 shrink-0"
            data-testid="notification-bar-link"
          >
            {item.link_text || 'Learn more'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss announcement"
          data-testid="notification-bar-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
