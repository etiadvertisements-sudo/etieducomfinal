'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Megaphone } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AnnouncementBar() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/announcements`);
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data) && data.length) setItems(data);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const active = items.length > 0 && !dismissed;
    const root = document.documentElement;
    if (active) {
      document.body.classList.add('has-announcement');
    } else {
      document.body.classList.remove('has-announcement');
      root.style.removeProperty('--announcement-h');
    }
    return () => {
      document.body.classList.remove('has-announcement');
      root.style.removeProperty('--announcement-h');
    };
  }, [items, dismissed]);

  // Keep header/content offset in sync with the bar's actual height (handles wrapping on mobile)
  useEffect(() => {
    if (!barRef.current || !items.length || dismissed) return;
    const root = document.documentElement;
    const setH = () => root.style.setProperty('--announcement-h', `${barRef.current.offsetHeight}px`);
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(barRef.current);
    window.addEventListener('resize', setH);
    return () => { ro.disconnect(); window.removeEventListener('resize', setH); };
  }, [items, dismissed, idx]);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items]);

  if (!items.length || dismissed) return null;
  const a = items[idx % items.length];

  return (
    <div className="announcement-bar" data-testid="announcement-bar" ref={barRef}>
      <div className="container-main relative flex items-center justify-center gap-2">
        <Megaphone className="w-4 h-4 flex-shrink-0 hidden sm:block" />
        <span data-testid="announcement-text" className="text-xs sm:text-sm px-6 sm:px-0">{a.text}</span>
        {a.link && (
          <Link
            href={a.link}
            className="underline font-semibold whitespace-nowrap hover:opacity-80"
            data-testid="announcement-link"
          >
            {a.link_text || 'Learn more'}
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-0 p-1 hover:opacity-70"
          aria-label="Dismiss announcement"
          data-testid="announcement-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
