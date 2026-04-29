'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { trackHiringApplication } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function HiringForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    designation: '',
    hiring_for: '',
    requirements: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.contact_person || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/hire-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          email: formData.email,
          phone: formData.phone,
          requirements: formData.requirements || `Hiring for: ${formData.hiring_for || 'Not specified'}`
        })
      });
      
      if (response.ok) {
        // Track conversion event
        trackHiringApplication({ 
          company: formData.company_name, 
          hiring_for: formData.hiring_for 
        });
        toast.success('Thank you! Our placement team will contact you soon.');
        setFormData({
          company_name: '',
          contact_person: '',
          email: '',
          phone: '',
          designation: '',
          hiring_for: '',
          requirements: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Company Name *"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="text"
          placeholder="Contact Person *"
          value={formData.contact_person}
          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
          className="form-input"
          required
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        type="text"
        placeholder="Your Designation"
        value={formData.designation}
        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        className="form-input"
      />
      
      <select
        value={formData.hiring_for}
        onChange={(e) => setFormData({ ...formData, hiring_for: e.target.value })}
        className="form-input"
      >
        <option value="">Hiring For (Select Skills)</option>
        <option value="Software Development">Software Development</option>
        <option value="Web Development">Web Development</option>
        <option value="Digital Marketing">Digital Marketing</option>
        <option value="Graphic Design">Graphic Design</option>
        <option value="Data Entry">Data Entry / Office Work</option>
        <option value="IT Support">IT Support / Help Desk</option>
        <option value="Cybersecurity">Cybersecurity</option>
        <option value="Multiple Roles">Multiple Roles</option>
      </select>
      
      <textarea
        placeholder="Requirements / Job Description"
        value={formData.requirements}
        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
        className="form-input min-h-[120px]"
      ></textarea>
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-primary justify-center"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Submitting...
          </span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Hiring Request
          </>
        )}
      </button>
    </form>
  );
}
