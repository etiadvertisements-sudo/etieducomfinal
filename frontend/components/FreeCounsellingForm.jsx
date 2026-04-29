'use client';

import { useState } from 'react';
import { Send, CheckCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { trackCounsellingLead } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function FreeCounsellingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    education: '',
    preferred_track: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.education || !formData.preferred_track) {
      toast.error('Please fill all required fields');
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/counselling-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Track conversion event
        trackCounsellingLead({ 
          education: formData.education, 
          preferred_track: formData.preferred_track 
        }, { name: formData.name, phone: formData.phone });
        setSubmitted(true);
        toast.success('Thank you! Our counsellor will contact you within 24 hours.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600 mb-6">
          Our career counsellor will call you within 24 hours to schedule your free session.
        </p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
          <a 
            href="tel:+919646727676"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Phone className="w-4 h-4" />
            +91 9646727676
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="top">
      <div>
        <input
          type="text"
          placeholder="Your Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-input text-lg py-4"
          required
          data-testid="counselling-name-input"
        />
      </div>
      
      <div>
        <input
          type="tel"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input text-lg py-4"
          required
          data-testid="counselling-phone-input"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <select
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          className="form-input"
          required
          data-testid="counselling-education-select"
        >
          <option value="">Education *</option>
          <option value="10th Pass">10th Pass</option>
          <option value="12th Pass">12th Pass</option>
          <option value="Graduate">Graduate</option>
          <option value="Post Graduate">Post Graduate</option>
          <option value="Working Professional">Working Professional</option>
        </select>
        
        <select
          value={formData.preferred_track}
          onChange={(e) => setFormData({ ...formData, preferred_track: e.target.value })}
          className="form-input"
          required
          data-testid="counselling-track-select"
        >
          <option value="">Preferred Track *</option>
          <option value="Software Development">Software Development</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="IT Foundation">IT Foundation</option>
          <option value="Not Sure">Not Sure - Need Guidance</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
        data-testid="counselling-submit-btn"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Booking Session...
          </span>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Book My Free Session
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to receive calls from ETI Educom regarding your career counselling.
      </p>
    </form>
  );
}
