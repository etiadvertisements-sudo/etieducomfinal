import Link from 'next/link';
import { 
  Zap, 
  Award, 
  Clock, 
  Users, 
  CheckCircle,
  Code,
  Globe,
  TrendingUp,
  Shield,
  Palette,
  Database,
  Monitor,
  Cpu,
  Phone,
  ChevronRight,
  Building2,
  Briefcase
} from 'lucide-react';
import IndustrialTrainingForm from '@/components/IndustrialTrainingForm';

export const metadata = {
  title: 'Industrial Training | 6 Weeks & 6 Months Programs',
  description: 'Get industry-recognized industrial training in Python, Web Development, Cybersecurity & more. Perfect for college students & graduates. Get certified from ETI Educom®!',
  keywords: 'industrial training, IT training, Python course, web development training, cybersecurity course, 6 months industrial training',
  openGraph: {
    title: 'Industrial Training Programs',
    description: 'Industry-aligned IT training for students and freshers. Get certified and job-ready.',
    url: 'https://www.etieducom.com/industrial-training',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/industrial-training' },
};

const programs = [
  { name: 'Python Programming', icon: Code, color: 'bg-yellow-500' },
  { name: 'Web Development', icon: Globe, color: 'bg-blue-500' },
  { name: 'Digital Marketing', icon: TrendingUp, color: 'bg-green-500' },
  { name: 'Ethical Hacking', icon: Shield, color: 'bg-red-500' },
  { name: 'Graphic Design', icon: Palette, color: 'bg-pink-500' },
  { name: 'Data Science', icon: Database, color: 'bg-indigo-500' },
  { name: 'MS Office Advanced', icon: Monitor, color: 'bg-emerald-500' },
  { name: 'AI & Machine Learning', icon: Cpu, color: 'bg-amber-500' },
];

const benefits = [
  { icon: Award, title: 'Industry Certificate', desc: 'Get certified upon completion' },
  { icon: Clock, title: 'Flexible Duration', desc: '6 Weeks or 6 Months options' },
  { icon: Users, title: 'Expert Faculty', desc: 'Learn from industry professionals' },
  { icon: Zap, title: 'Hands-on Projects', desc: 'Real-world practical training' }
];

const highlights = [
  'International certifications from Microsoft, Adobe, EC-Council',
  'Real-world projects to build your portfolio',
  'Industry expert trainers with 5+ years experience',
  'Placement assistance for eligible students',
  'Flexible batch timings - morning, evening, weekend',
  'Modern computer labs with high-speed internet',
  'Certificate valid for academic credits',
  'Small batch sizes for personalized attention'
];

const forWhom = [
  { icon: Building2, title: 'College Students', desc: 'Complete your academic project requirements' },
  { icon: Briefcase, title: 'Fresh Graduates', desc: 'Get industry-ready skills for placements' },
  { icon: Users, title: 'Career Changers', desc: 'Switch to IT with hands-on training' },
  { icon: Award, title: 'Working Professionals', desc: 'Upskill for better opportunities' }
];

export default function IndustrialTrainingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Briefcase className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Industrial Training</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                6 Weeks & 6 Months
                <span className="block text-yellow-400">Industrial Training</span>
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Get industry-aligned training in trending technologies. Build real projects, 
                earn certifications, and kickstart your IT career.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{benefit.title}</h3>
                        <p className="text-xs text-blue-200">{benefit.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5000+ Students Trained</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Since 2017</span>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <IndustrialTrainingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Is This For?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our industrial training programs are designed for various career stages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forWhom.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
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

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from a wide range of trending technologies and skills
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 ${program.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{program.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose ETI Educom Industrial Training?
              </h2>
              <div className="grid gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Duration Options</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">6 Weeks Program</span>
                    <span className="text-primary font-semibold">Short-term</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Intensive training covering fundamentals and one project. 
                    Perfect for college students during semester break.
                  </p>
                </div>
                <div className="border-2 border-primary rounded-xl p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">6 Months Program</span>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Comprehensive training with multiple projects, certification, 
                    and placement assistance. Industry-ready skills guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Limited Seats Available!
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Industrial training batches fill up fast. Register now to secure your spot and 
            kickstart your IT career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#top" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Register Now
              <ChevronRight className="w-5 h-5" />
            </a>
            <a href="tel:+919646727676" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              <Phone className="w-5 h-5" />
              Call: +91 9646727676
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
