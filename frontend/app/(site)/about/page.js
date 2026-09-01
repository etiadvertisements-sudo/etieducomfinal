import Link from 'next/link';
import Image from 'next/image';
import { 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Building2, 
  GraduationCap,
  ChevronRight,
  CheckCircle,
  Calendar
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Computer Career School Since 2017',
  description: 'Learn about ETI Educom®, a computer career school focused on structured IT career education through software, cybersecurity, digital and networking tracks.',
  keywords: 'about ETI Educom, computer institute about, IT training institute India, computer career school',
  openGraph: {
    title: 'About ETI Educom®',
    description: 'Discover the vision, mission and philosophy behind ETI Educom®.',
    url: 'https://www.etieducom.com/about',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://www.etieducom.com/about',
  },
};

const values = [
  { 
    icon: Target, 
    title: 'Excellence', 
    desc: 'Committed to delivering world-class IT education' 
  },
  { 
    icon: Heart, 
    title: 'Student-Centric', 
    desc: 'Every decision focused on student success' 
  },
  { 
    icon: Award, 
    title: 'Quality', 
    desc: 'Industry-aligned curriculum and certifications' 
  },
  { 
    icon: Users, 
    title: 'Community', 
    desc: 'Building a network of successful professionals' 
  }
];

const stats = [
  { value: '2017', label: 'Founded' },
  { value: '5000+', label: 'Students Trained' },
  { value: '4', label: 'Career Tracks' },
  { value: '40+', label: 'Certifications' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="container-main">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              About Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Where Dreams Meet<br />
              <span className="text-primary">Digital Excellence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              ETI Educom® is not just an institute—it&apos;s a launchpad for tech careers. 
              Since 2017, we&apos;ve been transforming aspirations into achievements through 
              structured, industry-aligned computer education.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2017, ETI Educom® emerged from a simple observation: traditional 
                  computer education wasn&apos;t preparing students for real-world IT careers. 
                  We saw graduates with degrees but without the practical skills employers need.
                </p>
                <p>
                  Our founder envisioned a different approach—structured career tracks that 
                  combine theoretical knowledge with hands-on training, industry certifications, 
                  and direct placement support.
                </p>
                <p>
                  Today, with over 5,000 successful alumni working in top companies, we&apos;ve 
                  proven that focused, career-oriented IT education creates real results.
                </p>
              </div>
              
              <Link href="/founder" className="btn-primary mt-6">
                Meet Our Founder
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <GraduationCap className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-bold text-gray-900 mb-1">Career-First</h3>
                    <p className="text-sm text-gray-600">Education designed for employment</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Award className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-bold text-gray-900 mb-1">Certified</h3>
                    <p className="text-sm text-gray-600">International certifications</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Users className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-bold text-gray-900 mb-1">Expert Faculty</h3>
                    <p className="text-sm text-gray-600">Industry professionals</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Target className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-bold text-gray-900 mb-1">Placement</h3>
                    <p className="text-sm text-gray-600">100% assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading computer career school in India, recognized for transforming 
                students into industry-ready IT professionals through innovative, practical, 
                and industry-aligned education.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, high-quality IT education that bridges the gap between 
                academic learning and industry requirements, empowering every student with 
                the skills, certifications, and confidence to build successful tech careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with ETI Educom.
          </p>
          <Link href="/free-counselling" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Get Free Counselling
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
