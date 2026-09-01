'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  Download,
  RotateCcw,
  Trophy,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CYBER_WARRIORS_LOGO = '/images/cyber-warriors-logo.png';

// Indian phone validation - must be 10 digits starting with 6, 7, 8, or 9
const validateIndianPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Must be exactly 10 digits and start with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleanPhone);
};

// Format phone number for display (e.g., 98765 43210)
const formatIndianPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
};

// 10 Cybersecurity Quiz Questions
const quizQuestions = [
  {
    id: 1,
    question: "What is phishing?",
    options: [
      "A type of fishing sport",
      "A cyber attack that tricks users into revealing sensitive information",
      "A software for editing photos",
      "A type of computer virus"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which of the following is the strongest password?",
    options: [
      "password123",
      "john1990",
      "Tr0ub4dor&3#Secure!",
      "qwerty"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "What does 2FA stand for?",
    options: [
      "Two Factor Authentication",
      "Two File Access",
      "Transfer File Application",
      "Two Finger Access"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "What should you do if you receive an email from your 'bank' asking for your password?",
    options: [
      "Reply with your password immediately",
      "Click on the link and enter your details",
      "Ignore it and contact your bank directly through official channels",
      "Forward it to all your contacts"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "What is a firewall?",
    options: [
      "A wall that prevents fire",
      "A security system that monitors and controls network traffic",
      "A type of computer screen",
      "An antivirus software"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "Which of these is a sign of a fake/scam website?",
    options: [
      "URL starts with HTTPS",
      "Has a padlock icon",
      "Misspelled domain name (amaz0n.com instead of amazon.com)",
      "Has a privacy policy"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "What is ransomware?",
    options: [
      "Software that gives you free stuff",
      "Malware that encrypts files and demands payment for decryption",
      "A tool for backing up data",
      "An online shopping platform"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "What should you do before clicking a link in an email?",
    options: [
      "Click immediately if it looks interesting",
      "Hover over it to see the actual URL destination",
      "Forward it to friends first",
      "Delete the email without reading"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "Which is the safest practice for online banking?",
    options: [
      "Use public WiFi for convenience",
      "Save password in browser on shared computers",
      "Use a secure, private network and enable 2FA",
      "Share OTP with bank callers"
    ],
    correct: 2
  },
  {
    id: 10,
    question: "What is social engineering in cybersecurity?",
    options: [
      "Building social media apps",
      "Manipulating people to reveal confidential information",
      "Engineering social networks",
      "Creating dating websites"
    ],
    correct: 1
  }
];

export default function WarriorsAssessmentClient() {
  const [step, setStep] = useState('register'); // register, quiz, result
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const certificateRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!studentData.name || !studentData.phone || !studentData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate Indian phone number
    if (!validateIndianPhone(studentData.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStep('quiz');
    toast.success('Registration successful! Starting assessment...');
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (answers[quizQuestions[currentQuestion].id] === undefined) {
      toast.error('Please select an answer');
      return;
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < quizQuestions.length) {
      toast.error('Please answer all questions');
      return;
    }

    setSubmitting(true);

    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);

    // Generate certificate ID
    const certId = `CW-${Date.now().toString(36).toUpperCase()}`;
    setCertificateId(certId);

    // Save to database
    try {
      await fetch(`${API_URL}/api/cyber-warriors/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentData,
          score: correctCount,
          total: quizQuestions.length,
          passed: correctCount >= 7,
          completed_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('Failed to save assessment');
    }

    setSubmitting(false);
    setStep('result');
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    toast.loading('Generating certificate...');
    
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `CyberWarrior_Certificate_${studentData.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.dismiss();
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.dismiss();
      toast.error('Failed to generate certificate. Please try again.');
    }
  };

  const restartAssessment = () => {
    setStep('register');
    setStudentData({ name: '', email: '', phone: '', college: '' });
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setCertificateId('');
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src={CYBER_WARRIORS_LOGO} 
                alt="Cyber Warriors by ETI Educom" 
                width={180} 
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <Link href="/cyber-warriors" className="text-sm text-gray-600 hover:text-primary transition-colors">
              ← Back to Cyber Warriors
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Registration Step */}
        {step === 'register' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Free Assessment
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cyber Warrior Assessment
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
              Test your cybersecurity knowledge with our 10-question quiz. 
              Score 7 or more to earn your Cyber Warrior Certificate!
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Details</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={studentData.name}
                    onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Mobile Number (10 digits) *"
                    value={studentData.phone}
                    onChange={(e) => {
                      // Only allow digits and limit to 10
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setStudentData({ ...studentData, phone: value });
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                    maxLength={10}
                  />
                  {studentData.phone && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {studentData.phone.length}/10
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="College/Organization Name (Optional)"
                    value={studentData.college}
                    onChange={(e) => setStudentData({ ...studentData, college: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mt-6 shadow-lg shadow-primary/25"
                >
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ~5 minutes
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificate on pass
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Step */}
        {step === 'quiz' && (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {quizQuestions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[quizQuestions[currentQuestion].id] === index
                        ? 'bg-primary/10 border-primary text-gray-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[quizQuestions[currentQuestion].id] === index
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {answers[quizQuestions[currentQuestion].id] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {currentQuestion < quizQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-green-600/25"
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                    <Award className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {quizQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                    currentQuestion === index
                      ? 'bg-primary text-white shadow-lg'
                      : answers[quizQuestions[index].id] !== undefined
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-primary'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && (
          <div className="text-center">
            {score >= 7 ? (
              <>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Congratulations, Cyber Warrior!
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  You scored <span className="text-green-600 font-bold">{score}/10</span>
                </p>
                <p className="text-gray-500 mb-8">
                  You&apos;ve demonstrated excellent cybersecurity awareness. Download your certificate below!
                </p>

                {/* Certificate - A4 Landscape Format (297mm x 210mm) */}
                <div 
                  ref={certificateRef}
                  className="bg-white rounded-lg mx-auto mb-8 shadow-2xl border border-gray-300 overflow-visible"
                  style={{ width: '842px', height: '595px', padding: '0' }}
                >
                  <div className="w-full h-full border-8 border-primary/20 p-5 flex flex-col bg-gradient-to-br from-white via-blue-50/20 to-white relative">
                    {/* Decorative Corners */}
                    <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-primary/40 rounded-tl-lg"></div>
                    <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-primary/40 rounded-tr-lg"></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-primary/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-primary/40 rounded-br-lg"></div>

                    {/* Header with Logo */}
                    <div className="text-center mb-3">
                      <img 
                        src={CYBER_WARRIORS_LOGO} 
                        alt="Cyber Warriors by ETI Educom" 
                        className="h-12 w-auto object-contain mx-auto mb-1"
                        crossOrigin="anonymous"
                      />
                      <h1 className="text-xl font-black text-gray-900 tracking-wider uppercase">Cyber Warriors Initiative</h1>
                      <p className="text-xs text-gray-500 italic">(A Program by ETI Educom)</p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                      <Shield className="w-4 h-4 text-primary" />
                      <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </div>

                    {/* Certificate Title */}
                    <div className="text-center mb-3">
                      <h2 className="text-lg font-bold text-primary uppercase tracking-[0.25em]">Certificate of Completion</h2>
                    </div>

                    {/* Recipient Section */}
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <p className="text-gray-600 text-sm mb-2">This is to proudly certify that</p>
                      <h3 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
                        {studentData.name}
                      </h3>
                      <div className="w-56 h-0.5 bg-primary mx-auto mb-3"></div>
                      <p className="text-gray-700 text-sm max-w-xl mx-auto leading-relaxed">
                        has successfully participated in the <strong>Cyber Warriors Awareness Session</strong><br/>
                        and completed the <strong>Cyber Security Assessment</strong> conducted by <strong>ETI Educom</strong>
                      </p>
                    </div>

                    {/* Topics Covered */}
                    <div className="bg-gray-50/80 rounded-lg py-2 px-4 mb-3">
                      <p className="text-[10px] text-gray-500 text-center mb-1">Knowledge Areas Covered:</p>
                      <div className="flex justify-center gap-6 text-xs text-gray-700">
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Online Safety</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Social Media Protection</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Cyber Threats</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Ethical Hacking</span>
                      </div>
                    </div>

                    {/* Appreciation */}
                    <p className="text-center text-[11px] text-gray-500 italic mb-2">
                      We appreciate their commitment to becoming a responsible digital citizen and taking a step towards a secure digital future.
                    </p>

                    {/* Signature Section */}
                    <div className="text-center mb-2">
                      <div className="border-b-2 border-gray-400 w-40 mx-auto mb-1"></div>
                      <p className="text-sm font-bold text-gray-900">Mr. Krishna Mahajan</p>
                      <p className="text-xs text-primary font-medium">Cyber Security Researcher</p>
                    </div>

                    {/* Quote */}
                    <p className="text-center text-[10px] text-gray-500 italic mb-2">
                      "Don't Just Use Technology — Secure It."
                    </p>

                    {/* Footer with Address */}
                    <div className="text-center pt-2 border-t border-primary/20">
                      <p className="text-[9px] text-gray-600">
                        <strong>Registered Address:</strong> ETI Educom, Jodhamal Colony, Dhangu Road, Pathankot
                      </p>
                      <p className="text-[9px] text-gray-600">
                        <span className="text-primary font-medium">www.etieducom.com</span> | helpdesk@etieducom.com | 9646727676
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={downloadCertificate}
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
                  >
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </button>
                  <button
                    onClick={restartAssessment}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Take Again
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Keep Learning!
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  You scored <span className="text-red-500 font-bold">{score}/10</span>
                </p>
                <p className="text-gray-500 mb-8">
                  You need 7 or more correct answers to earn the Cyber Warrior certificate. 
                  Don&apos;t worry, you can try again!
                </p>

                {/* Show Correct Answers */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-left mb-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Answers:</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {quizQuestions.map((q, index) => (
                      <div key={q.id} className="flex items-start gap-3 text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answers[q.id] === q.correct ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {answers[q.id] === q.correct ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-700">Q{index + 1}: {q.question}</p>
                          {answers[q.id] !== q.correct && (
                            <p className="text-green-600 text-xs mt-1">
                              Correct: {q.options[q.correct]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={restartAssessment}
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                  <Link
                    href="/cyber-warriors"
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center gap-2 transition-all"
                  >
                    Learn More
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ETI Educom® | Cyber Warriors Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
