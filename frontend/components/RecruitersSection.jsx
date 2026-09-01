'use client';

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function RecruitersSection() {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/partners?partner_type=recruiter`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setRecruiters(data);
        }
      } catch {}
    })();
  }, []);

  if (!recruiters.length) return null;

  // Duplicate the list to create a seamless infinite marquee
  const loop = [...recruiters, ...recruiters];

  return (
    <section className="section-padding bg-white overflow-hidden" data-testid="recruiters-section">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Trusted Hiring Partners
          </div>
          <h2 className="section-title">Our Recruiters</h2>
          <p className="section-subtitle mx-auto">
            Companies that hire our trained and certified professionals
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex w-max marquee-track gap-6" data-testid="recruiters-track">
          {loop.map((r, i) => (
            <div
              key={`${r.id}-${i}`}
              className="flex items-center justify-center h-24 min-w-[180px] px-8 bg-gray-50 rounded-2xl border border-gray-100"
              title={r.name}
              data-testid={`recruiter-logo-${r.id}`}
            >
              {r.logo_url ? (
                <img
                  src={r.logo_url}
                  alt={r.name}
                  className="max-h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fb = e.currentTarget.nextElementSibling;
                    if (fb) fb.style.display = 'inline';
                  }}
                />
              ) : null}
              <span
                className="text-lg font-bold text-gray-700"
                style={{ display: r.logo_url ? 'none' : 'inline' }}
              >
                {r.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
