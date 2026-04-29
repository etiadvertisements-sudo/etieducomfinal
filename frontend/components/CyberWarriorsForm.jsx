'use client';

import { useState } from 'react';
import { Send, CheckCircle, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CyberWarriorsForm() {
  const [registrationType, setRegistrationType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    organization_type: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Use counselling-leads with appropriate field mapping
      const payload = {
        name: formData.name,
        phone: formData.phone,
        education: registrationType === 'organization' 
          ? `${formData.organization_type} - ${formData.organization_name}` 
          : 'Individual Registration',
        preferred_track: 'Cyber Warriors Program'
      };

      const response = await fetch(`${API_URL}/api/counselling-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Registration successful! We\'ll contact you soon.');
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
          Thank you for joining Cyber Warriors. We&apos;ll contact you with session details.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Register for Session</h3>
        <p className="text-gray-500 text-sm">100% Free | No Charges</p>
      </div>

      {/* Registration Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRegistrationType('individual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
            registrationType === 'individual'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <User className="w-4 h-4" />
          Individual
        </button>
        <button
          type="button"
          onClick={() => setRegistrationType('organization')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
            registrationType === 'organization'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Organization
        </button>
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

        {registrationType === 'organization' && (
          <>
            <input
              type="text"
              placeholder="Organization Name *"
              value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              className="form-input"
              required
            />
            <select
              value={formData.organization_type}
              onChange={(e) => setFormData({ ...formData, organization_type: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Organization Type *</option>
              <option value="School">School</option>
              <option value="College">College / University</option>
              <option value="Corporate">Corporate / Business</option>
              <option value="Government">Government Body</option>
              <option value="NGO">NGO / Non-Profit</option>
              <option value="Other">Other</option>
            </select>
          </>
        )}

        <input
          type="tel"
          placeholder="Contact Number *"
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
        This is a free initiative by ETI Educom
      </p>
    </div>
  );
}
