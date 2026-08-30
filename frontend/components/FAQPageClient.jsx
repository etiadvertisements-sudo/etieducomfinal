'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleFAQs = [
  {
    id: '1',
    question: 'What is ETI Educom and what courses do you offer?',
    answer: 'ETI Educom is India\'s leading Computer Career School established in 2017. We offer structured career pathways including Computer Career Foundation, Digital Design & Marketing, IT Support & Cybersecurity, and Software Development tracks. We also provide short-term certification programs and corporate training.',
    category: 'General'
  },
  {
    id: '2',
    question: 'What are the eligibility criteria for your programs?',
    answer: 'Our programs are designed for students from various educational backgrounds. The Computer Career Foundation is suitable for 10th pass students and above. Other specialized tracks typically require 12th pass or graduation. We conduct a counselling session to help you choose the right program based on your background.',
    category: 'Admissions'
  },
  {
    id: '3',
    question: 'Do you provide placement assistance?',
    answer: 'Yes, we provide comprehensive placement support including resume building, interview preparation, and job referrals. Our placement cell actively works with industry partners to connect trained students with job opportunities.',
    category: 'Placements'
  },
  {
    id: '4',
    question: 'What certifications can I get from ETI Educom?',
    answer: 'We are a Certiport Authorized Testing Center (CATC), which means students can earn globally recognized Microsoft, Adobe, and other industry certifications.',
    category: 'Certifications'
  },
  {
    id: '5',
    question: 'What is the duration of your courses?',
    answer: 'Course duration varies: Computer Career Foundation (3-6 months), Digital Design & Marketing (6-12 months), IT Support & Cybersecurity (6-12 months), and Software Development (9-18 months). Short-term programs range from 1-3 months.',
    category: 'Programs'
  },
  {
    id: '6',
    question: 'What are the fees and payment options?',
    answer: 'Fees vary by program. We offer flexible payment options including monthly installments. Contact our admissions team or visit our center for detailed fee structure.',
    category: 'Fees'
  },
  {
    id: '7',
    question: 'Do you offer online classes?',
    answer: 'We primarily focus on classroom-based practical training as it provides the best learning experience. However, we do offer blended learning options for certain programs.',
    category: 'Programs'
  },
  {
    id: '8',
    question: 'How can I enroll in a course?',
    answer: 'You can enroll by: 1) Visiting our center for counselling, 2) Calling our helpline, 3) Filling the contact form on our website, or 4) Booking a free career counselling session online.',
    category: 'Admissions'
  }
];

export default function FAQPageClient() {
  const [faqs, setFaqs] = useState(sampleFAQs);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/faqs`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setFaqs(data);
          }
        }
      } catch (error) {
        console.log('Using sample FAQs');
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const categories = ['all', ...new Set(faqs.map(f => f.category))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openItems.includes(faq.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <span className="inline-block mt-3 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
