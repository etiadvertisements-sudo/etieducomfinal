import Link from 'next/link';
import { 
  TrendingUp, 
  Building2, 
  Users, 
  Award,
  CheckCircle,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react';
import FranchiseForm from '@/components/FranchiseForm';

export const metadata = {
  title: 'Franchise Opportunity | Computer Career School Network',
  description: 'Partner with ETI Educom® to establish a computer career school in your city. Start your own IT training institute.',
  keywords: 'ETI Educom franchise, computer institute franchise, education franchise, IT training franchise',
  openGraph: {
    title: 'ETI Educom® Franchise Opportunity',
    description: 'Build a structured computer education center with ETI Educom®.',
    url: 'https://etieducom.com/franchise',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://etieducom.com/franchise',
  },
};

const benefits = [
  'Proven business model with 8+ years of success',
  'Complete training and curriculum support',
  'International certification programs',
  'Marketing and branding assistance',
  'Ongoing technical support',
  'Placement network access'
];

const steps = [
  { step: 1, title: 'Enquiry', desc: 'Submit your interest and location details' },
  { step: 2, title: 'Discussion', desc: 'Meet with our team to discuss terms' },
  { step: 3, title: 'Agreement', desc: 'Complete documentation and setup' },
  { step: 4, title: 'Launch', desc: 'Start your ETI Educom center' }
];

export default function FranchisePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Franchise Opportunity
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Be Your<br />
                <span className="text-primary">Own Boss?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Partner with ETI Educom® and start your journey as an education entrepreneur. 
                Build a successful IT training center in your city with our proven model.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Start Your Journey
                </h2>
                <p className="text-gray-500 text-center mb-6">
                  Fill the form and we&apos;ll get in touch
                </p>
                <FranchiseForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">Simple 4-step process to become an ETI Educom partner</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Entrepreneurship Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join the ETI Educom network and make a difference in IT education.
          </p>
          <a href="tel:+919646727676" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
            <Phone className="w-5 h-5" />
            Call: +91 9646727676
          </a>
        </div>
      </section>
    </div>
  );
}
