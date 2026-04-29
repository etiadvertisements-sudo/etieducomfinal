'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { trackCounsellingLead } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CounsellingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    education: '',
    preferred_track: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.education || !formData.preferred_track) {
      toast.error('Please fill all required fields');
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
        toast.success('Thank you! Our counsellor will contact you within 24 hours.');
        setFormData({ name: '', phone: '', education: '', preferred_track: '' });
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
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Your Education *</option>
          <option value="10th Pass">10th Pass</option>
          <option value="12th Pass">12th Pass</option>
          <option value="Graduate">Graduate</option>
          <option value="Post Graduate">Post Graduate</option>
          <option value="Working Professional">Working Professional</option>
        </select>
      </div>
      
      <div>
        <select
          value={formData.preferred_track}
          onChange={(e) => setFormData({ ...formData, preferred_track: e.target.value })}
          className="form-input"
          required
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
        className="w-full btn-primary justify-center py-4"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Submitting...
          </span>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Book Free Session
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to receive calls from ETI Educom
      </p>
    </form>
  );
}
