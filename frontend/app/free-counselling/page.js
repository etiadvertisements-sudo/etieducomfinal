import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle, 
  Phone, 
  Award, 
  Users, 
  Briefcase,
  GraduationCap,
  ChevronRight,
  Shield,
  Clock,
  Star,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import FreeCounsellingForm from '@/components/FreeCounsellingForm';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Free Career Counselling | Get Expert IT Career Guidance | ETI Educom®',
  description: 'Book your FREE career counselling session with ETI Educom® experts. Get personalized IT career guidance, program recommendations, and placement support. Limited slots!',
  keywords: 'free counselling, career guidance, IT career, consultation, career counselling Pathankot',
  openGraph: {
    title: 'Free Career Counselling - ETI Educom®',
    description: 'Get expert guidance for your IT career journey. Book your FREE session now!',
    url: 'https://etieducom.com/free-counselling',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://etieducom.com/free-counselling',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const benefits = [
  { icon: Target, text: 'Discover your ideal career path in IT' },
  { icon: GraduationCap, text: 'Get personalized program recommendations' },
  { icon: Award, text: 'Learn about industry certifications (Microsoft, Adobe, EC-Council)' },
  { icon: Briefcase, text: 'Understand placement opportunities & salary packages' },
  { icon: Clock, text: 'Flexible batch timings to suit your schedule' },
  { icon: Shield, text: 'Zero obligation - 100% free consultation' }
];

const stats = [
  { value: '5000+', label: 'Students Counselled', icon: Users },
  { value: '95%', label: 'Satisfaction Rate', icon: Star },
  { value: '24hrs', label: 'Response Time', icon: Clock },
  { value: '100%', label: 'Free of Cost', icon: CheckCircle }
];

const urgencyPoints = [
  'New batch starting soon - Limited seats!',
  'Early bird discounts available',
  'Free certification included for first 20 students'
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Web Developer at TCS',
    text: 'The counselling session helped me choose the right course. Now I\'m working as a developer!',
    rating: 5
  },
  {
    name: 'Priya Gupta',
    role: 'Digital Marketing Executive',
    text: 'Best decision I made. The career guidance was spot-on and I got placed within 3 months.',
    rating: 5
  },
  {
    name: 'Amit Kumar',
    role: 'Cybersecurity Analyst',
    text: 'From confused graduate to cybersecurity professional - ETI made it possible.',
    rating: 5
  }
];

export default function FreeCounsellingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      {/* Sticky Header for Landing Page */}
      <header className="sticky top-0 bg-white border-b border-gray-100 py-3 z-50 shadow-sm">
        <div className="container-main flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/logo-blue.png"
              alt="ETI Educom"
              width={120}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-green-600 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Counsellors Available Now
            </div>
            <a 
              href="tel:+919646727676" 
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+91 9646727676</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Form */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Urgency Banner */}
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                <Zap className="w-4 h-4" />
                Limited Time Offer - Free Expert Session!
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Confused About Your
                <span className="block text-primary">IT Career Path?</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Get <span className="text-yellow-400 font-bold">FREE</span> personalized career counselling from 
                industry experts. Discover the right program for your goals and start earning 
                <span className="text-green-400 font-bold"> ₹4-15 LPA</span> in just 6-12 months!
              </p>
              
              {/* Benefits List */}
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-300">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right - Form */}
            <div>
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-primary/20">
                {/* Form Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <CheckCircle className="w-4 h-4" />
                    100% Free - No Hidden Charges
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Book Your Free Session</h2>
                  <p className="text-gray-500 text-sm">Our expert will call you within 24 hours</p>
                </div>
                
                <FreeCounsellingForm />
                
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Award className="w-4 h-4 text-yellow-500" />
                    ISO Certified
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-4 h-4 text-blue-500" />
                    5000+ Trained
                  </div>
                </div>
              </div>
              
              {/* Urgency Points Below Form */}
              <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Don&apos;t Miss Out!
                </h4>
                <ul className="space-y-2">
                  {urgencyPoints.map((point, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories from Our Students
            </h2>
            <p className="text-gray-600">
              Join thousands of students who transformed their careers with ETI Educom
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You&apos;ll Get in Your Free Session
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Career Assessment</h3>
              <p className="text-gray-600">
                Understand your strengths, interests, and the best IT career path for you
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Program Roadmap</h3>
              <p className="text-gray-600">
                Get a customized learning path with timeline and certification details
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Salary Insights</h3>
              <p className="text-gray-600">
                Learn about job opportunities, companies hiring, and expected salary packages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Don&apos;t let confusion hold you back. Book your free counselling session now and 
            take the first step towards a successful IT career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#top" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Book Free Session Now
              <ChevronRight className="w-5 h-5" />
            </a>
            <a 
              href="tel:+919646727676" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call: +91 9646727676
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer for Landing Page */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-white.png"
                alt="ETI Educom"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-gray-400 text-sm">
                India&apos;s Leading Computer Career School
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-white">Terms</Link>
              <span>© {new Date().getFullYear()} ETI Educom®</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
