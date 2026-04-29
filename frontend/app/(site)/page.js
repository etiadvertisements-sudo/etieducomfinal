import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Monitor, 
  Palette, 
  Network, 
  Code,
  Award,
  Users,
  CheckCircle,
  Shield,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Clock,
  Phone,
  ArrowRight,
  Building2,
  Target,
  Zap
} from 'lucide-react';
import HeroForm from '@/components/HeroForm';
import ReviewsSection from '@/components/ReviewsSection';
import EventsSection from '@/components/EventsSection';
import BlogsSection from '@/components/BlogsSection';
import AnimatedStatsSection from '@/components/AnimatedStatsSection';
import PartnersSection from '@/components/PartnersSection';
import AboutPreviewSection from '@/components/AboutPreviewSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: { absolute: 'ETI Educom® | The Computer Career School - Professional IT Training Institute in India' },
  description: 'ETI Educom® is India\'s premier Computer Career School since 2017. We offer industry-certified training programs in Software Development, Cybersecurity, Digital Marketing & IT Support with guaranteed placement assistance.',
  keywords: 'ETI Educom, computer training institute India, IT training, software development course, cybersecurity training, digital marketing course, professional IT training, best computer institute Punjab',
  openGraph: {
    title: 'ETI Educom® | Professional IT Training Institute',
    description: 'India\'s leading Computer Career School offering industry-certified training in Software Development, Cybersecurity, Digital Marketing & IT Support since 2017.',
    url: 'https://www.etieducom.com',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://www.etieducom.com',
  },
};

const careerTracks = [
  {
    id: 'it-foundation',
    title: 'IT Foundation',
    shortDesc: 'Digital Literacy & Office Productivity',
    fullDesc: 'Build a strong foundation in computing, MS Office Suite, and essential digital skills required for any modern workplace.',
    icon: Monitor,
    duration: '6 Months'
  },
  {
    id: 'digital-design',
    title: 'Design & Marketing',
    shortDesc: 'Creative Design + Digital Strategy',
    fullDesc: 'Master Adobe Creative Suite, UI/UX principles, SEO, and performance marketing for creative industry roles.',
    icon: Palette,
    duration: '9-12 Months'
  },
  {
    id: 'it-networking',
    title: 'IT & Cybersecurity',
    shortDesc: 'Infrastructure + Security',
    fullDesc: 'Develop expertise in network administration, system management, and cybersecurity operations.',
    icon: Network,
    duration: '9-12 Months'
  },
  {
    id: 'software-development',
    title: 'Software Development',
    shortDesc: 'Programming + Application Development',
    fullDesc: 'Learn industry-standard programming languages, frameworks, and software engineering best practices.',
    icon: Code,
    duration: '9-12 Months'
  }
];

const trendingSkills = [
  { id: 'digital-marketing', title: 'Digital Marketing', tag: 'High Demand', icon: TrendingUp },
  { id: 'ethical-hacking', title: 'Ethical Hacking', tag: 'Certification', icon: Shield },
  { id: 'soc-analyst', title: 'SOC Analyst', tag: 'Cybersecurity', icon: Network },
  { id: 'graphic-designing', title: 'Graphic Design', tag: 'Creative', icon: Palette },
  { id: 'data-analytics', title: 'Data Analytics', tag: 'Analytics', icon: Monitor },
  { id: 'web-development', title: 'Full Stack Development', tag: 'Development', icon: Code }
];

const whyChooseUs = [
  { title: 'Industry-Aligned Curriculum', desc: 'Programs designed in consultation with industry experts to match current market requirements', icon: Target },
  { title: 'International Certifications', desc: 'Authorized testing center for Microsoft, Adobe, EC-Council, and Tally certifications', icon: Award },
  { title: 'Hands-On Training', desc: 'Project-based learning with real-world scenarios and industry case studies', icon: Code },
  { title: 'Placement Assistance', desc: 'Dedicated placement cell with 95% placement rate for eligible candidates', icon: Briefcase },
  { title: 'Expert Faculty', desc: 'Learn from certified trainers with extensive industry experience', icon: Users },
  { title: 'Flexible Learning', desc: 'Multiple batch options including morning, evening, and weekend schedules', icon: Clock }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - White/Light Background */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-200/50 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="container-main relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Building Careers in
                <span className="block mt-2 text-primary">Technology</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                ETI Educom is a premier Computer Career School dedicated to bridging the gap between 
                academic education and industry requirements. We deliver structured, certification-focused 
                training programs that prepare professionals for successful careers in technology.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/free-counselling" className="btn-primary">
                  Request Free Consultation
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/programs" className="btn-secondary">
                  View Programs
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">5000+</p>
                  <p className="text-sm text-gray-500">Students Trained</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-500">Career Tracks</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">40+</p>
                  <p className="text-sm text-gray-500">Certifications</p>
                </div>
              </div>
            </div>
            
            {/* Right - Enquiry Form */}
            <div className="lg:pl-8">
              <HeroForm />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <AnimatedStatsSection />

      {/* Career Tracks Section */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              Structured Learning Pathways
            </div>
            <h2 className="section-title">Career-Focused Training Tracks</h2>
            <p className="section-subtitle mx-auto">
              Comprehensive programs designed to take you from fundamentals to industry-ready expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerTracks.map((track, index) => {
              const IconComponent = track.icon;
              return (
                <Link 
                  key={track.id}
                  href={`/programs/${track.id}`}
                  className="group relative bg-white rounded-3xl p-8 transition-all duration-500 border border-gray-100 hover:border-transparent hover:shadow-2xl overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full group-hover:bg-white/10 transition-colors duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110">
                      <IconComponent className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    
                    {/* Duration badge */}
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:text-white/90 bg-primary/10 group-hover:bg-white/20 px-3 py-1 rounded-full mb-4 transition-colors duration-500">
                      <Clock className="w-3 h-3" />
                      {track.duration}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-500">
                      {track.title}
                    </h3>
                    
                    {/* Short description */}
                    <p className="text-sm font-medium text-primary group-hover:text-white/90 mb-3 transition-colors duration-500">
                      {track.shortDesc}
                    </p>
                    
                    {/* Full description */}
                    <p className="text-gray-600 group-hover:text-white/80 text-sm mb-6 transition-colors duration-500 line-clamp-3">
                      {track.fullDesc}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-primary group-hover:text-white font-semibold text-sm transition-colors duration-500">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/programs" className="btn-primary">
              Explore All Programs
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Skills */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Market-Driven Skills
            </div>
            <h2 className="section-title">In-Demand Technology Skills</h2>
            <p className="section-subtitle mx-auto">
              Specialized courses aligned with current industry requirements and job market trends
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingSkills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <Link 
                  key={skill.id}
                  href={`/programs/${skill.id}`}
                  className="group bg-white rounded-2xl p-5 text-center hover:shadow-lg border border-gray-200 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors">{skill.title}</h3>
                  <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-medium">
                    {skill.tag}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <AboutPreviewSection />

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Our Differentiators
            </div>
            <h2 className="section-title">Why ETI Educom is the First Choice of Students</h2>
            <p className="section-subtitle mx-auto">
              A commitment to excellence that has made us the preferred training institute for aspiring IT professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="group flex gap-4 p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="w-14 h-14 flex-shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Events Section */}
      <EventsSection />

      {/* Blogs Section */}
      <BlogsSection />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="container-main relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium text-white mb-6">
            <Zap className="w-4 h-4" />
            Begin Your Transformation
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Advance Your Career?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully transitioned into rewarding IT careers 
            with ETI Educom. Schedule a free consultation with our career advisors today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/free-counselling" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl transition-all hover:bg-gray-100">
              Schedule Free Consultation
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="tel:+919646727676" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20">
              <Phone className="w-5 h-5" />
              +91 9646-727676
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}
