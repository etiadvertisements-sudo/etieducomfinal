'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (response.ok) {
          const data = await response.json();
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          // Completed events (event date in the past), most recent first
          const completed = (Array.isArray(data) ? data : [])
            .filter((e) => e.event_date && new Date(e.event_date) <= today)
            .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
          const list = (completed.length ? completed : (Array.isArray(data) ? data : []))
            .slice(0, 4);
          setEvents(list);
        }
      } catch (error) {
        // no-op: section hides if nothing to show
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!events.length) return null;

  return (
    <section className="section-padding bg-white" data-testid="events-section">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="section-title">Recent Events</h2>
            <p className="section-subtitle">
              A look back at our latest workshops, seminars and career sessions
            </p>
          </div>
          <Link href="/events" className="btn-secondary mt-4 md:mt-0" data-testid="view-all-events">
            View All Events
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              data-testid={`event-card-${event.id}`}
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-gray-800">{formatDate(event.event_date)}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                {event.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
