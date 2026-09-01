'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarCheck, MapPin, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function RecentEventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/events?when=past&limit=4`);
        if (r.ok) {
          const data = await r.json();
          setEvents(data.slice(0, 4));
        }
      } catch {}
    })();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (events.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50" data-testid="recent-events-section">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CalendarCheck className="w-4 h-4" />
              Recent Highlights
            </div>
            <h2 className="section-title">Our Recent Events</h2>
            <p className="section-subtitle">
              A look back at the workshops, seminars and drives we recently hosted
            </p>
          </div>
          <Link href="/events" className="btn-secondary mt-4 md:mt-0" data-testid="recent-events-view-all">
            View All Events
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              data-testid="recent-event-card"
            >
              <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CalendarCheck className="w-10 h-10 text-primary/40" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {formatDate(event.event_date)}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3 flex-1">{event.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
