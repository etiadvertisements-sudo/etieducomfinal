import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Award, 
  CheckCircle,
  Building2,
  ChevronRight,
  Phone
} from 'lucide-react';
import HiringForm from '@/components/HiringForm';

export const metadata = {
  title: 'Hire From Us | Recruit Trained IT Professionals',
  description: 'Recruit trained IT professionals from ETI Educom® for your organization. Access pre-trained candidates in software development, digital marketing, and more.',
  keywords: 'hire IT professionals, recruit trained candidates, campus recruitment, ETI Educom placement',
  openGraph: {
    title: 'Hire From ETI Educom®',
    description: 'Recruit skilled, trained IT professionals for your organization.',
    url: 'https://www.etieducom.com/hire-from-us',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/hire-from-us' },
};

const benefits = [
  'Pre-trained candidates with industry certifications',
  'Reduced training time and cost for your organization',
  'Access to diverse skill sets - development, design, marketing',
  'Rigorous screening and assessment process',
  'Post-placement support and feedback'
];

const skillPools = [
  { title: 'Software Development', count: '500+' },
  { title: 'Web Development', count: '400+' },
  { title: 'Digital Marketing', count: '300+' },
  { title: 'Graphic Design', count: '350+' },
  { title: 'IT Support', count: '250+' },
  { title: 'Data Entry', count: '200+' }
];

export default function HireFromUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Hiring Partners
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hire Pre-Trained<br />
                <span className="text-primary">IT Professionals</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Access a pool of trained, certified candidates ready to contribute 
                from day one. Reduce your training costs and time-to-productivity.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-4">
                <a href="tel:+919646727676" className="btn-primary">
                  <Phone className="w-4 h-4" />
                  Call Placement Cell
                </a>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Submit Hiring Request
                </h2>
                <p className="text-gray-500 text-center mb-6">
                  Tell us your requirements and we&apos;ll connect you with suitable candidates
                </p>
                <HiringForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Pools */}
      <section className="py-16 bg-primary">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Available Talent Pool</h2>
            <p className="text-white/80">Trained candidates across various IT domains</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skillPools.map((pool, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{pool.count}</div>
                <div className="text-white/80 text-sm">{pool.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Partner with ETI Educom
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join our network of hiring partners and get priority access to 
            skilled candidates. We offer customized training programs aligned 
            with your organization&apos;s needs.
          </p>
          <Link href="/contact" className="btn-secondary">
            Contact Us
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
