'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { trackFranchiseEnquiry } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function FranchiseForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    investment: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const why = formData.message && formData.message.trim().length >= 50
        ? formData.message.trim()
        : `Interested in opening an ETI Educom franchise in ${formData.city}. Investment capacity: ${formData.investment || 'to be discussed'}. Please share partnership details.`;
      const response = await fetch(`${API_URL}/api/franchise-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || 'not-provided@example.com',
          phone: formData.phone,
          location: formData.city,
          city: formData.city,
          experience: formData.message && formData.message.trim().length >= 10 ? formData.message.trim() : 'Not specified yet',
          investment_budget: formData.investment || 'Not specified',
          why_franchise: why
        })
      });
      
      if (response.ok) {
        // Track conversion event
        trackFranchiseEnquiry({ city: formData.city, investment: formData.investment });
        const { redirectToThankYou } = await import('@/lib/track');
        redirectToThankYou('franchise', { name: formData.name });
        return;
      } else {
        const err = await response.json().catch(() => null);
        const msg = Array.isArray(err?.detail) ? err.detail[0]?.msg : err?.detail;
        toast.error(msg || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
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
          placeholder="Phone *"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input"
          required
        />
      </div>
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="form-input"
      />
      
      <input
        type="text"
        placeholder="City / Location *"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="form-input"
        required
      />
      
      <select
        value={formData.investment}
        onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
        className="form-input"
      >
        <option value="">Investment Capacity</option>
        <option value="5-10 Lakhs">5-10 Lakhs</option>
        <option value="10-20 Lakhs">10-20 Lakhs</option>
        <option value="20+ Lakhs">20+ Lakhs</option>
      </select>
      
      <textarea
        placeholder="Your Message (Optional)"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="form-input min-h-[100px]"
      ></textarea>
      
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
  );
}
