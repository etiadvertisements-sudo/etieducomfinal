'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, ChevronRight } from 'lucide-react';
import { PlacementCard } from '@/components/PlacementsPageClient';
import Marquee from '@/components/Marquee';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function PlacementsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/placements?latest=true&limit=12`);
        if (r.ok) {
          const data = await r.json();
          setItems(data.slice(0, 12));
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

        <Marquee
          items={items}
          minItems={8}
          duration={Math.max(30, items.length * 8)}
          testid="placements-marquee"
          renderItem={(s) => <div className="w-72 h-full py-2 [&>div]:h-full"><PlacementCard s={s} /></div>}
        />
      </div>
    </section>
  );
}
