'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleJobs = [
  {
    id: '1',
    title: 'Academic Coordinator',
    department: 'Academics',
    location: 'Head Office, Pathankot',
    type: 'Full-time',
    description: 'We are looking for an experienced Academic Coordinator to manage our curriculum development and student progress tracking. The ideal candidate will have strong organizational skills and a passion for education.',
    requirements: [
      "Bachelor's degree in Education or related field",
      "2+ years of experience in academic administration",
      "Strong communication and leadership skills",
      "Proficiency in MS Office and educational software"
    ]
  },
  {
    id: '2',
    title: 'IT Trainer - Networking & Cybersecurity',
    department: 'Training',
    location: 'Multiple Locations',
    type: 'Full-time',
    description: 'Join our training team to deliver high-quality networking and cybersecurity courses. You will be responsible for conducting classes, preparing study materials, and mentoring students.',
    requirements: [
      "CCNA/CompTIA Network+ certification required",
      "2+ years of training or industry experience",
      "Hands-on networking and security skills",
      "Excellent presentation abilities"
    ]
  },
  {
    id: '3',
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    location: 'Head Office, Pathankot',
    type: 'Full-time',
    description: 'Help us grow our digital presence and reach more students through effective marketing strategies. You will manage social media, SEO, and paid advertising campaigns.',
    requirements: [
      "Google/Meta certifications preferred",
      "1+ years of digital marketing experience",
      "Portfolio of successful campaigns",
      "Knowledge of analytics tools"
    ]
  },
  {
    id: '4',
    title: 'Front Desk Executive',
    department: 'Administration',
    location: 'Pathankot',
    type: 'Full-time',
    description: 'Be the first point of contact for students and visitors. Handle enquiries, manage admissions, and provide excellent customer service.',
    requirements: [
      "Graduate in any discipline",
      "Excellent communication skills in English and Hindi",
      "Basic computer proficiency",
      "Pleasant personality and professional demeanor"
    ]
  }
];

export default function JoinTeamClient() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cover_letter: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setJobs(data);
          }
        }
      } catch (error) {
        console.log('Using sample jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          job_id: selectedJob.id,
          job_title: selectedJob.title
        })
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setShowApplyModal(false);
        setFormData({ name: '', email: '', phone: '', cover_letter: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
          <p className="text-gray-600">Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-primary font-medium">{job.department}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {job.type}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              
              <button
                onClick={() => handleApply(job)}
                className="btn-primary w-full justify-center text-sm"
              >
                Apply Now
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Apply for Position</h3>
                  <p className="text-primary">{selectedJob.title}</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
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
                <textarea
                  placeholder="Cover Letter / Why should we hire you?"
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  className="form-input min-h-[100px]"
                />
                
                <p className="text-xs text-gray-500">
                  * Send your resume to careers@etieducom.com with job title in subject
                </p>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
