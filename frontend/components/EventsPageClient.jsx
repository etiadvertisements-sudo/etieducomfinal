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

const sampleEvents = [
  {
    id: '1',
    title: 'Career Guidance Workshop',
    description: 'Join our expert counsellors for a comprehensive career guidance session covering IT industry trends and opportunities.',
    event_date: '2026-02-15',
    event_time: '10:00 AM',
    location: 'ETI Educom Head Office',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    description: 'A hands-on bootcamp introducing the fundamentals of web development using modern technologies.',
    event_date: '2026-02-22',
    event_time: '9:00 AM',
    location: 'Online',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Cybersecurity Awareness Seminar',
    description: 'Learn about the latest cybersecurity threats and best practices to protect yourself and your organization.',
    event_date: '2026-03-05',
    event_time: '2:00 PM',
    location: 'ETI Educom Head Office',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'
  }
];

export default function EventsPageClient() {
  const [events, setEvents] = useState(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setEvents(data);
          }
        }
      } catch (error) {
        console.log('Using sample events');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
          <p className="text-gray-600">Check back later for new events</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
          ))}
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
