import { Calendar } from 'lucide-react';
import EventsPageClient from '@/components/EventsPageClient';

export const metadata = {
  title: 'Events & Activities | Workshops & Seminars',
  description: 'Explore workshops, seminars and learning events organized by ETI Educom®. Stay updated with our career guidance sessions and tech bootcamps.',
  keywords: 'ETI Educom events, IT workshops, tech seminars, career guidance workshop, cybersecurity seminar',
  openGraph: {
    title: 'Events at ETI Educom®',
    description: 'Join our workshops, seminars, and career guidance sessions.',
    url: 'https://www.etieducom.com/events',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/events' },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Events & <span className="text-primary">Activities</span>
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with our workshops, seminars, and training events
            </p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <EventsPageClient />
        </div>
      </section>
    </div>
  );
}
