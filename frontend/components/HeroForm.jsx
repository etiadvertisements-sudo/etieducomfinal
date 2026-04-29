'use client';

import { useState } from 'react';
import { Send, Users, Award } from 'lucide-react';
import { toast } from 'sonner';
import { trackHeroFormSubmission } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function HeroForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.interest) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/counselling-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          education: 'Not specified',
          preferred_track: formData.interest
        })
      });
      
      if (response.ok) {
        // Track conversion event
        trackHeroFormSubmission({ interest: formData.interest }, { name: formData.name, phone: formData.phone });
        toast.success('Thank you! We will contact you shortly.');
        setFormData({ name: '', phone: '', interest: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Quick Enquiry</h3>
        <p className="text-gray-500 text-sm">Get a callback within 24 hours</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <select
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            className="form-input"
            required
          >
            <option value="">Interested In *</option>
            <option value="IT Foundation">IT Foundation</option>
            <option value="Software Development">Software Development</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Submitting...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Enquiry
            </>
          )}
        </button>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-4">
        We respect your privacy. No spam calls.
      </p>
      
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3 text-primary" />
          5000+ Students
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Award className="w-3 h-3 text-primary" />
          Since 2017
        </div>
      </div>
    </div>
  );
}
