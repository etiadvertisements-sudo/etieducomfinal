'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { trackIndustrialTraining } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const programs = [
  'Python Programming',
  'Web Development',
  'Digital Marketing',
  'Ethical Hacking',
  'Graphic Design',
  'Data Science',
  'MS Office Advanced',
  'AI & Machine Learning',
  'Networking (CCNA)',
  'Cybersecurity'
];

export default function IndustrialTrainingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    program_interest: '',
    duration: '6 months'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.program_interest) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/industrial-training-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Track conversion event
        trackIndustrialTraining({ 
          program: formData.program_interest,
          duration: formData.duration 
        });
        setSubmitted(true);
        toast.success('Registration submitted! We\'ll contact you soon.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for registering. Our team will contact you within 24 hours with program details.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="top" className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Register Now</h3>
        <p className="text-gray-500 text-sm">Limited seats available</p>
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
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-input"
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
          type="text"
          placeholder="College/University Name"
          value={formData.college}
          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
          className="form-input"
        />

        <select
          value={formData.program_interest}
          onChange={(e) => setFormData({ ...formData, program_interest: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Select Program *</option>
          {programs.map((program) => (
            <option key={program} value={program}>{program}</option>
          ))}
        </select>

        <div className="flex gap-4">
          <label className="flex-1">
            <input
              type="radio"
              name="duration"
              value="6 weeks"
              checked={formData.duration === '6 weeks'}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="sr-only peer"
            />
            <div className="border-2 border-gray-200 rounded-xl p-3 text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 transition-colors">
              <span className="font-semibold text-gray-900">6 Weeks</span>
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              name="duration"
              value="6 months"
              checked={formData.duration === '6 months'}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="sr-only peer"
            />
            <div className="border-2 border-gray-200 rounded-xl p-3 text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 transition-colors">
              <span className="font-semibold text-gray-900">6 Months</span>
            </div>
          </label>
        </div>

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
              Register Now
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        By registering, you agree to receive calls from ETI Educom
      </p>
    </div>
  );
}
