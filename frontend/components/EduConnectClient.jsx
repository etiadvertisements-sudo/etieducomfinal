'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

const defaultPrograms = [
  { id: '1', name: 'MBA', type: 'PG', duration: '2 Years' },
  { id: '2', name: 'BBA', type: 'UG', duration: '3 Years' },
  { id: '3', name: 'BCA', type: 'UG', duration: '3 Years' },
  { id: '4', name: 'MCA', type: 'PG', duration: '2 Years' },
  { id: '5', name: 'B.Com', type: 'UG', duration: '3 Years' },
  { id: '6', name: 'M.Com', type: 'PG', duration: '2 Years' },
  { id: '7', name: 'BA', type: 'UG', duration: '3 Years' },
  { id: '8', name: 'MA', type: 'PG', duration: '2 Years' },
];

export default function EduConnectClient() {
  const [universities, setUniversities] = useState(defaultUniversities);
  const [programs, setPrograms] = useState(defaultPrograms);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program_interest: '',
    qualification: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, progRes] = await Promise.all([
          fetch(`${API_URL}/api/educonnect/universities`),
          fetch(`${API_URL}/api/educonnect/programs`)
        ]);
        
        if (uniRes.ok) {
          const uniData = await uniRes.json();
          if (uniData.length > 0) setUniversities(uniData);
        }
        
        if (progRes.ok) {
          const progData = await progRes.json();
          if (progData.length > 0) setPrograms(progData);
        }
      } catch (error) {
        console.log('Using default data');
      }
    };
    fetchData();
  }, []);

  // Auto-slide universities
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.ceil(universities.length / 4));
    }, 3000);
    return () => clearInterval(timer);
  }, [universities.length]);

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
        setSubmitted(true);
        toast.success('Enquiry submitted! We\'ll contact you soon.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleUniversities = universities.slice(currentSlide * 4, currentSlide * 4 + 4);
  const totalSlides = Math.ceil(universities.length / 4);

  if (submitted) {
    return (
      <div id="top" className="bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Enquiry Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your interest. Our education counsellor will contact you within 24 hours.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="top" className="space-y-6">
      {/* University Logos Slider */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">OUR PARTNER UNIVERSITIES</h3>
        <div className="relative">
          <div className="grid grid-cols-4 gap-4">
            {visibleUniversities.map((uni) => (
              <div 
                key={uni.id}
                className="flex items-center justify-center p-2 bg-gray-50 rounded-lg h-16"
              >
                {uni.logo ? (
                  <Image
                    src={uni.logo}
                    alt={uni.name}
                    width={80}
                    height={40}
                    className="max-h-10 w-auto object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-xs text-gray-500 text-center">{uni.name}</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Slider Controls */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Get Free Counselling</h3>
          <p className="text-gray-500 text-sm">Fill the form to know more about programs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
          />

          <select
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            className="form-input"
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
            className="form-input"
          >
            <option value="">Interested Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.name}>
                {program.name} ({program.type}) - {program.duration}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary justify-center py-4"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Submitting...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Get Free Counselling
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          By submitting, you agree to receive calls from ETI Educom
        </p>
      </div>
    </div>
  );
}
