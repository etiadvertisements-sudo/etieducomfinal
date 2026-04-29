'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Send, 
  CheckCircle, 
  Phone, 
  GraduationCap,
  Clock,
  Award,
  Users,
  Star,
  ChevronRight,
  BookOpen,
  Shield,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  Building2
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { trackEduConnectEnquiry } from '@/lib/analytics';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const PHONE_NUMBER = '8699391076';

const defaultUniversities = [
  { id: '1', name: 'Lovely Professional University', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png' },
  { id: '2', name: 'Manipal University Jaipur', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Manipal_University_Jaipur_logo.png' },
  { id: '3', name: 'Amity University', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Amity_University_logo.png' },
  { id: '4', name: 'Chandigarh University', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Chandigarh_University_Seal.png' },
  { id: '5', name: 'Jain University', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Jain_University_logo.png' },
  { id: '6', name: 'NMIMS University', logo: 'https://upload.wikimedia.org/wikipedia/en/1/1c/NMIMS_logo.png' },
  { id: '7', name: 'Sharda University', logo: 'https://upload.wikimedia.org/wikipedia/en/2/24/Sharda_University_logo.png' },
  { id: '8', name: 'Sikkim Manipal University', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Sikkim_Manipal_University_logo.svg/1200px-Sikkim_Manipal_University_logo.svg.png' },
];

const programCards = [
  {
    type: 'UG',
    title: 'Undergraduate Programs',
    subtitle: 'Start Your Career Journey',
    duration: '3 Years',
    programs: ['BBA', 'BCA', 'B.Com', 'BA', 'B.Sc'],
    icon: BookOpen,
    features: ['No Entrance Exam', '10+2 Eligible', 'EMI Available'],
    popular: 'BBA & BCA'
  },
  {
    type: 'PG',
    title: 'Postgraduate Programs',
    subtitle: 'Advance Your Career',
    duration: '2 Years',
    programs: ['MBA', 'MCA', 'M.Com', 'MA', 'M.Sc'],
    icon: GraduationCap,
    features: ['Work & Study', 'Global Recognition', 'Career Support'],
    popular: 'MBA'
  },
  {
    type: 'Diploma',
    title: 'Professional Diplomas',
    subtitle: 'Quick Skill Upgrade',
    duration: '1 Year',
    programs: ['PGDM', 'PG Diploma in IT', 'Diploma in Management'],
    icon: Award,
    features: ['Industry Focused', 'Fast Track', 'Job Ready'],
    popular: 'PGDM'
  },
  {
    type: 'Certificate',
    title: 'Certification Courses',
    subtitle: 'Specialized Skills',
    duration: '6 Months',
    programs: ['Digital Marketing', 'Data Analytics', 'Cyber Security'],
    icon: Star,
    features: ['Trending Skills', 'High Demand', 'Quick ROI'],
    popular: 'Digital Marketing'
  }
];

const stats = [
  { value: '5000+', label: 'Students Trained', icon: Users },
  { value: '15+', label: 'Partner Universities', icon: Building2 },
  { value: '40+', label: 'Programs Available', icon: BookOpen },
  { value: '4', label: 'Career Tracks', icon: TrendingUp }
];

const whyChoose = [
  { icon: BadgeCheck, title: 'UGC-DEB Approved', desc: 'All programs are government recognized' },
  { icon: Shield, title: 'NAAC Accredited', desc: 'Quality assured partner universities' },
  { icon: Clock, title: 'Flexible Learning', desc: 'Study at your own pace, anywhere' },
  { icon: Award, title: 'Valid Degrees', desc: 'Equivalent to regular degrees' }
];

export default function EduConnectLanding() {
  const [universities, setUniversities] = useState(defaultUniversities);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program_interest: '',
    qualification: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${API_URL}/api/educonnect/universities`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setUniversities(data);
        }
      } catch (error) {
        console.log('Using default universities');
      }
    };
    fetchUniversities();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/educonnect/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Track conversion event
        trackEduConnectEnquiry({ 
          program: formData.program_interest,
          qualification: formData.qualification 
        }, { name: formData.name, phone: formData.phone });
        setSubmitted(true);
        toast.success('Enquiry submitted! We\'ll contact you soon.');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">ETI EduConnect</span>
              </div>
            </Link>
            <button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              Get Free Counselling
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-medium text-white">Distance Learning Made Easy</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Get Your Degree
                <span className="block text-blue-300">
                  From Top Universities
                </span>
              </h1>
              
              <p className="text-lg text-blue-100/80 mb-8 max-w-lg mx-auto lg:mx-0">
                UGC-approved distance learning programs. Study while you work. 
                Upgrade your career with degrees that matter.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button 
                  onClick={scrollToForm}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-2xl"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href={`tel:+91${PHONE_NUMBER}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  {PHONE_NUMBER}
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div ref={formRef} className="lg:pl-8">
              {submitted ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                  <p className="text-gray-600 mb-6">
                    Our education counsellor will contact you within 24 hours.
                  </p>
                  <Link href="/" className="btn-primary">Back to Home</Link>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Free Counselling
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Get Expert Guidance</h3>
                    <p className="text-gray-500 text-sm mt-1">Fill the form, we'll call you back</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <select
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-600"
                    >
                      <option value="">Your Qualification</option>
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </select>
                    <select
                      value={formData.program_interest}
                      onChange={(e) => setFormData({ ...formData, program_interest: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-600"
                    >
                      <option value="">Interested Program</option>
                      <option value="MBA">MBA</option>
                      <option value="BBA">BBA</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Com">B.Com</option>
                      <option value="M.Com">M.Com</option>
                      <option value="BA">BA</option>
                      <option value="MA">MA</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 shadow-lg shadow-primary/25"
                    >
                      {submitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Get Free Counselling
                        </>
                      )}
                    </button>
                  </form>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By submitting, you agree to receive calls from ETI EduConnect
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* University Logos - Auto Scroll */}
      <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Partnered with India's Top Universities
          </p>
        </div>
        <div className="relative">
          <div className="flex animate-marquee">
            {[...universities, ...universities].map((uni, i) => (
              <div 
                key={i}
                className="flex-shrink-0 mx-8 flex items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-40 h-20"
              >
                {uni.logo ? (
                  <Image
                    src={cloudImg(uni.logo, 'logo')}
                    alt={uni.name}
                    width={100}
                    height={50}
                    className="max-h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-xs text-gray-500 text-center font-medium">{uni.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amazing Program Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Programs We Offer
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path to Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From undergraduate to professional certifications, find the perfect program for your career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-primary/30 hover:-translate-y-2"
                >
                  {/* Blue Gradient Header */}
                  <div className="bg-gradient-to-br from-primary to-blue-800 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-2">
                        {card.duration}
                      </div>
                      <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      <p className="text-blue-100 text-sm">{card.subtitle}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Popular Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-medium text-gray-500">Most Popular:</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                        {card.popular}
                      </span>
                    </div>

                    {/* Programs List */}
                    <div className="space-y-2 mb-6">
                      {card.programs.map((program, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {program}
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {card.features.map((feature, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button 
                      onClick={scrollToForm}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-lg"
                    >
                      Enquire Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Why ETI EduConnect
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Your Trusted Partner in Distance Education
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                We partner with India's leading universities to bring quality education to your doorstep. 
                Our team supports you from admission to graduation.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {whyChoose.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Eligibility Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                Eligibility Criteria
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    UG Programs
                  </h4>
                  <p className="text-sm text-gray-600">
                    10+2 or equivalent from any recognized board. No minimum percentage for most programs.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    PG Programs
                  </h4>
                  <p className="text-sm text-gray-600">
                    Graduate in any discipline. Some programs may require relevant work experience.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    Diploma & Certificate
                  </h4>
                  <p className="text-sm text-gray-600">
                    Varies by program. Generally 10+2 for diploma, graduation for PG diploma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-700 to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Future?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards your dream career. Our expert counsellors are here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToForm}
              className="group inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-2xl"
            >
              Get Free Counselling
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href={`tel:+91${PHONE_NUMBER}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call: {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">ETI EduConnect</span>
                <p className="text-xs text-gray-400">A unit of ETI Career & Tech Solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href={`tel:+91${PHONE_NUMBER}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{PHONE_NUMBER}</span>
              </a>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Visit ETI Educom
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} ETI EduConnect. All rights reserved. A unit of ETI Career & Tech Solutions
            </p>
          </div>
        </div>
      </footer>

      {/* CSS for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
