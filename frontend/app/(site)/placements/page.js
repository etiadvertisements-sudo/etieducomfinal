import { Briefcase, Award, TrendingUp } from 'lucide-react';
import PlacementsPageClient from '@/components/PlacementsPageClient';

export const metadata = {
  title: 'Our Placements | Student Success Stories - ETI Educom®',
  description: 'Meet the ETI Educom students who launched successful tech careers. Explore our placement records across leading companies in Software Development, IT, Cybersecurity and more.',
  keywords: 'ETI Educom placements, placed students, IT placement records, student success stories, job placement Pathankot',
  openGraph: {
    title: 'Our Placements | ETI Educom®',
    description: 'Student success stories and placement records at ETI Educom.',
    url: 'https://www.etieducom.com/placements',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/placements' },
};

export default function PlacementsPage() {
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
            <Briefcase className="w-4 h-4" />
            Placements
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Students, Placed &amp; Thriving
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Real careers, real companies. Meet the ETI Educom graduates who turned training into opportunity.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                <span className="text-3xl font-bold">95%</span>
              </div>
              <p className="text-white/70 text-sm mt-1">Placement Rate</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white">
                <Award className="w-5 h-5" />
                <span className="text-3xl font-bold">5000+</span>
              </div>
              <p className="text-white/70 text-sm mt-1">Students Trained</p>
            </div>
          </div>
        </div>
      </section>

      {/* Placements Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <PlacementsPageClient />
        </div>
      </section>
    </div>
  );
}
