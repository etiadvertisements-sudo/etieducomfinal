'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight,
  X
} from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EventsPageClient() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (error) {
        // section will show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events
    .filter((e) => e.event_date && new Date(e.event_date) >= today)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const past = events
    .filter((e) => e.event_date && new Date(e.event_date) < today)
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const EventCard = ({ event }) => (
    <div
      key={event.id}
      className="card cursor-pointer hover:border-primary"
      onClick={() => setSelectedEvent(event)}
      data-testid={`event-${event.id}`}
    >
      {event.image_url && (
        <div className="h-48 overflow-hidden rounded-t-2xl -mx-6 -mt-6 mb-4">
          <Image
            src={cloudImg(event.image_url, 'card')}
            alt={event.title}
            width={400}
            height={200}
            unoptimized
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          {event.event_date}
        </span>
        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          <Clock className="w-3 h-3 mr-1" />
          {event.event_time}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{event.description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <MapPin className="w-4 h-4 mr-1" />
        {event.location}
      </div>
    </div>
  );

  return (
    <>
      {events.length === 0 ? (
        <div className="text-center py-12" data-testid="events-empty">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-600">Check back later for new events</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Upcoming Events */}
          <div data-testid="upcoming-events-section">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <span className="text-xs bg-primary text-white px-2.5 py-1 rounded-full font-medium">{upcoming.length}</span>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl" data-testid="no-upcoming-events">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming events right now — check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </div>

          {/* Past Events */}
          {past.length > 0 && (
            <div data-testid="past-events-section">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
                <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">{past.length}</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {selectedEvent.image_url && (
                <Image
                  src={cloudImg(selectedEvent.image_url, 'full')}
                  alt={selectedEvent.title}
                  width={800}
                  height={400}
                  unoptimized
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(selectedEvent.event_date)}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedEvent.event_time}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedEvent.location}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
              <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="/free-counselling" className="btn-primary w-full justify-center">
                  Register Interest
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
