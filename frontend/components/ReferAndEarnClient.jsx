'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  BadgePercent, 
  PartyPopper,
  Send,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const steps = [
  {
    icon: <UserPlus className="w-10 h-10" />,
    step: '1',
    title: 'Refer a Friend',
    description: 'Share this opportunity with friends, family, or anyone looking to upgrade their skills and career.',
    color: 'bg-blue-500'
  },
  {
    icon: <BadgePercent className="w-10 h-10" />,
    step: '2',
    title: 'They Get Benefits',
    description: 'When they enroll using your referral, they receive exclusive fee discounts and special benefits.',
    color: 'bg-green-500'
  },
  {
    icon: <PartyPopper className="w-10 h-10" />,
    step: '3',
    title: 'You Get Rewarded',
    description: 'You unlock your well-deserved cash reward 30 days after their course begins!',
    color: 'bg-yellow-500'
  }
];

const rewards = [
  { program: 'Career Tracks (6-12 Months)', reward: 'Up to Rs. 2,000' },
  { program: 'Tech Programs (3-6 Months)', reward: 'Up to Rs. 1,000' },
  { program: 'Short Courses (1-3 Months)', reward: 'Up to Rs. 500' }
];

export default function ReferAndEarnClient() {
  const [formData, setFormData] = useState({
    referrer_name: '',
    referrer_phone: '',
    referrer_email: '',
    friend_name: '',
    friend_phone: '',
    program_interest: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.referrer_name || !formData.referrer_phone || !formData.friend_name || !formData.friend_phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        toast.success('Referral submitted successfully! We\'ll contact your friend soon.');
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
    <>
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              3 Simple Steps to Earn
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              It&apos;s super easy to earn rewards by helping your friends build their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-gray-200 z-0"></div>
                )}
                
                <div className="card h-full text-center relative z-10 hover:shadow-xl transition-all">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg`}>
                    {step.icon}
                  </div>
                  <span className="inline-block w-10 h-10 bg-gray-100 rounded-full text-xl font-bold text-primary leading-10 mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-gray-900 text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Reward Structure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Earn Up to Rs. 2,000 Per Referral
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                The more you refer, the more you earn! There&apos;s no limit on how many 
                friends you can refer. Help them build careers while you build rewards.
              </p>
              
              <div className="space-y-4">
                {rewards.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-900">{item.program}</span>
                    <span className="flex items-center text-primary font-bold">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {item.reward.replace('Up to Rs. ', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Form */}
            <div id="refer-form" className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PartyPopper className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Referral Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;ll contact your friend soon. You&apos;ll be notified when they enroll!
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        referrer_name: '',
                        referrer_phone: '',
                        referrer_email: '',
                        friend_name: '',
                        friend_phone: '',
                        program_interest: ''
                      });
                    }}
                    className="btn-primary"
                  >
                    Refer Another Friend
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Refer a Friend Now
                  </h3>
                  <p className="text-gray-500 text-center mb-6">
                    Fill in the details below and start earning
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Your Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Your Details</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your Name *"
                          value={formData.referrer_name}
                          onChange={(e) => setFormData({ ...formData, referrer_name: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Your Phone *"
                          value={formData.referrer_phone}
                          onChange={(e) => setFormData({ ...formData, referrer_phone: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={formData.referrer_email}
                          onChange={(e) => setFormData({ ...formData, referrer_email: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Friend's Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Friend&apos;s Details</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Friend's Name *"
                          value={formData.friend_name}
                          onChange={(e) => setFormData({ ...formData, friend_name: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Friend's Phone *"
                          value={formData.friend_phone}
                          onChange={(e) => setFormData({ ...formData, friend_phone: e.target.value })}
                          className="form-input"
                          required
                        />
                        <select
                          value={formData.program_interest}
                          onChange={(e) => setFormData({ ...formData, program_interest: e.target.value })}
                          className="form-input"
                        >
                          <option value="">Program Interest (Optional)</option>
                          <option value="Software Development">Software Development</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="IT Foundation">IT Foundation</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
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
                          Submit Referral
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
