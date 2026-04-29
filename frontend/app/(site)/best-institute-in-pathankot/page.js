import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award,
  Users,
  GraduationCap,
  CheckCircle,
  ChevronRight,
  Monitor,
  Wifi,
  BookOpen,
  Building2,
  Star,
  Navigation
} from 'lucide-react';

export const metadata = {
  title: 'Best Computer Institute in Pathankot | ETI Educom® - IT Training Center',
  description: 'ETI Educom Pathankot - Punjab\'s leading computer training institute. Get certified IT courses in Web Development, Cybersecurity, Digital Marketing & more. 5000+ students trained.',
  keywords: 'best computer institute pathankot, IT training pathankot, computer courses pathankot, ETI Educom pathankot',
  openGraph: {
    title: 'Best Computer Institute in Pathankot - ETI Educom®',
    description: 'Transform your career with industry-leading IT education at ETI Educom Pathankot.',
    url: 'https://etieducom.com/best-institute-in-pathankot',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://etieducom.com/best-institute-in-pathankot' },
};

const branchInfo = {
  name: "ETI Educom Pathankot",
  tagline: "Best Computer Institute in Pathankot",
  address: "Jodhamal Colony, Dhangu Road, Pathankot, Punjab - 145001",
  phone: "+91 9646727676",
  email: "helpdesk@etieducom.com",
  timings: "Mon-Sat: 9:00 AM - 7:00 PM",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.8!2d75.6389!3d32.2733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDE2JzI0LjAiTiA3NcKwMzgnMjAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
};

const facilities = [
  { icon: Monitor, title: "Modern Computer Labs", desc: "Latest hardware with high-speed internet" },
  { icon: Wifi, title: "High-Speed Internet", desc: "Uninterrupted connectivity for online learning" },
  { icon: BookOpen, title: "Digital Library", desc: "Access to e-books and learning resources" },
  { icon: Users, title: "Small Batch Sizes", desc: "Personalized attention for every student" },
];

const highlights = [
  "Certiport Authorized Testing Center (CATC)",
  "ISO Certified Institute",
  "MSME Registered",
  "5000+ Students Trained",
  "95% Placement Rate",
  "Industry Expert Faculty",
  "Hands-on Project Training",
  "Flexible Batch Timings"
];

const popularPrograms = [
  { name: "IT Foundation", duration: "6 Months", slug: "it-foundation" },
  { name: "Web Development", duration: "6 Months", slug: "web-development" },
  { name: "Digital Marketing", duration: "4 Months", slug: "digital-marketing" },
  { name: "Python Programming", duration: "3 Months", slug: "python" },
];

const stats = [
  { icon: GraduationCap, value: '5000+', label: 'Students Trained' },
  { icon: Award, value: '15+', label: 'Certification Partners' },
  { icon: Star, value: '4', label: 'Career Tracks' },
  { icon: Clock, value: '40+', label: 'Certifications' }
];

export default function PathankotBranchPage() {
  return (
    <div className="min-h-screen" data-testid="pathankot-branch-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Head Office
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Best Computer Institute in <span className="text-yellow-400">Pathankot</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your career with industry-leading IT education at ETI Educom Pathankot. 
              Punjab&apos;s premier destination for structured computer career training.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <Icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-blue-100">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/free-counselling"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Book Free Counselling
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a 
                href={`tel:${branchInfo.phone}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                Visit Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Pathankot Center
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">{branchInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <a href={`tel:${branchInfo.phone}`} className="text-primary hover:underline">
                      {branchInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a href={`mailto:${branchInfo.email}`} className="text-primary hover:underline">
                      {branchInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Timings</h4>
                    <p className="text-gray-600">{branchInfo.timings}</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=ETI+Educom+Pathankot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
              <iframe
                src={branchInfo.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ETI Educom Pathankot Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Facilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              State-of-the-Art Infrastructure
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{facility.title}</h3>
                  <p className="text-sm text-gray-600">{facility.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why ETI Educom Pathankot?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                We&apos;re not just another computer institute. We&apos;re a career transformation center 
                that has helped thousands of students achieve their dreams.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Programs</h3>
              <div className="space-y-4">
                {popularPrograms.map((program, index) => (
                  <Link 
                    key={index}
                    href={`/programs/${program.slug}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary">{program.name}</h4>
                      <p className="text-sm text-gray-500">{program.duration}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
              
              <Link href="/programs" className="block mt-6">
                <button className="btn-primary w-full justify-center">
                  View All Programs
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Your Career Journey Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-lg">
            Visit our Pathankot center for a free career counselling session and discover 
            the right path for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-counselling" className="btn-primary px-8 py-4 text-lg justify-center">
              Book Free Counselling
            </Link>
            <a 
              href={`tel:${branchInfo.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              {branchInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
