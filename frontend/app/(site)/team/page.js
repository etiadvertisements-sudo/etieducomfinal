import { Users } from 'lucide-react';
import TeamPageClient from '@/components/TeamPageClient';

export const metadata = {
  title: 'Our Team | Meet the Experts Behind ETI Educom®',
  description: 'Meet the dedicated professionals who make ETI Educom a leading IT training institute. Expert faculty and staff committed to your success.',
  keywords: 'ETI Educom team, faculty, trainers, IT educators, computer training experts',
  openGraph: {
    title: 'Our Team - ETI Educom®',
    description: 'Meet our amazing team of educators and industry experts.',
    url: 'https://etieducom.com/team',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://etieducom.com/team' },
};

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container-main relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet Our Amazing Team
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Passionate educators and industry experts dedicated to shaping the future of tech education
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <TeamPageClient />
        </div>
      </section>
    </div>
  );
}
