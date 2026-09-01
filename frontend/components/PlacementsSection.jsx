'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, ChevronRight } from 'lucide-react';
import { PlacementCard } from '@/components/PlacementsPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function PlacementsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/placements?latest=true&limit=4`);
        if (r.ok) {
          const data = await r.json();
          setItems(data.slice(0, 4));
        }
      } catch {}
    })();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-white" data-testid="placements-home-section">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              Placement Success
            </div>
            <h2 className="section-title">Our Recently Placed Students</h2>
            <p className="section-subtitle">
              Fresh success stories from graduates now working at leading companies
            </p>
          </div>
          <Link href="/placements" className="btn-secondary mt-4 md:mt-0" data-testid="placements-view-all">
            View All Placements
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((s) => (
            <PlacementCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
