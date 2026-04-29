'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleEvents = [
  {
    id: '1',
    title: 'Career Guidance Workshop',
    description: 'Expert career counseling session covering IT industry trends',
    event_date: '2026-02-15',
    event_time: '10:00 AM',
    location: 'ETI Educom, Pathankot'
  },
  {
    id: '2',
    title: 'Cybersecurity Awareness Seminar',
    description: 'Learn about the latest cybersecurity threats and protection',
    event_date: '2026-02-20',
    event_time: '2:00 PM',
    location: 'ETI Educom, Pathankot'
  }
];

export default function EventsSection() {
  const [events, setEvents] = useState(sampleEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events?upcoming=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setEvents(data.slice(0, 2));
          }
        }
      } catch (error) {
        console.log('Using sample events');
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
              Join our workshops, seminars, and career guidance sessions
            </p>
          </div>
          <Link href="/events" className="btn-secondary mt-4 md:mt-0">
            View All Events
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 flex-shrink-0 bg-primary/10 rounded-2xl flex flex-col items-center justify-center">
                <Calendar className="w-6 h-6 text-primary mb-1" />
                <span className="text-xs text-gray-500">{formatDate(event.event_date)}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.event_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
