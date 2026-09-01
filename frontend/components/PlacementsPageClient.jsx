'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Building2, GraduationCap, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function initials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function PlacementCard({ s }) {
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      data-testid="placement-card"
    >
      <div className="relative h-56 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        {s.photo_url ? (
          <img
            src={s.photo_url}
            alt={s.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-24 h-24 rounded-full bg-primary/20 text-primary text-3xl font-bold flex items-center justify-center">
              {initials(s.name)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
        {s.role && <p className="text-sm font-medium text-primary mt-0.5">{s.role}</p>}

        <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
          <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="font-medium">{s.company}</span>
        </div>
        {s.course && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{s.course}</span>
          </div>
        )}

        {s.testimonial && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 text-sm text-gray-600 italic">
            <Quote className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
            <p className="line-clamp-3">{s.testimonial}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlacementsPageClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/placements`);
        if (r.ok) setItems(await r.json());
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20" data-testid="placements-empty">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Placement Stories Coming Soon</h3>
        <p className="text-gray-600">We&apos;re updating our placement records. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="placements-grid">
      {items.map((s) => (
        <PlacementCard key={s.id} s={s} />
      ))}
    </div>
  );
}
