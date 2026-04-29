import Link from 'next/link';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users,
  ChevronRight,
  CheckCircle,
  Building2,
  Award,
  Heart
} from 'lucide-react';
import JoinTeamClient from '@/components/JoinTeamClient';

export const metadata = {
  title: 'Careers at ETI Educom® | Join Our Team',
  description: 'Build your career with India\'s leading Computer Career School. Explore current job openings at ETI Educom® and join our mission to transform IT education.',
  keywords: 'ETI Educom careers, IT trainer jobs, education jobs Pathankot, computer institute jobs',
  openGraph: {
    title: 'Careers at ETI Educom®',
    description: 'Join our team of passionate educators and industry experts.',
    url: 'https://www.etieducom.com/join-team',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/join-team' },
};

const whyJoinUs = [
  { icon: Heart, title: 'Meaningful Work', desc: 'Shape the careers of thousands of students' },
  { icon: Users, title: 'Great Team', desc: 'Work with passionate educators and professionals' },
  { icon: Award, title: 'Growth Opportunities', desc: 'Continuous learning and career advancement' },
  { icon: Building2, title: 'Stable Environment', desc: 'Part of a growing, established institution' }
];

export default function JoinTeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Careers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Join the ETI Team
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Build your career with India&apos;s leading Computer Career School. 
            Be part of a team that&apos;s shaping the future of IT education.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>50+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Multiple Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Since 2017</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join ETI Educom?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be part of a mission to transform IT education in India
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJoinUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                  <div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-gray-600">Explore opportunities to grow with us</p>
          </div>
          
          <JoinTeamClient />
        </div>
      </section>

      {/* No Matching Role CTA */}
      <section className="py-16 bg-white">
        <div className="container-main text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don&apos;t See a Matching Role?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals. Send us your resume and 
            we&apos;ll reach out when a suitable position opens up.
          </p>
          <a 
            href="mailto:careers@etieducom.com?subject=General Application" 
            className="btn-primary"
          >
            Send Your Resume
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
