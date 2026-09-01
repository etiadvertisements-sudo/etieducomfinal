'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Trophy, Loader2 } from 'lucide-react';

// ─── Quiz definition ───
// Each option assigns weights to one or more programme slugs.
// Top-3 highest scoring slugs are returned as the recommendation.
const QUESTIONS = [
  {
    id: 'interest',
    title: "What kind of work excites you most?",
    options: [
      { label: 'Building websites & apps',                 weights: { 'web-development': 3, 'web-designing': 2, 'software-development': 2, 'ui-ux-designing': 1 } },
      { label: 'Designing logos, posters, social media',   weights: { 'graphic-designing': 3, 'digital-design': 2, 'ui-ux-designing': 1 } },
      { label: 'Marketing, ads & social media growth',     weights: { 'digital-marketing': 3, 'digital-design': 2 } },
      { label: 'Hacking, security & defending systems',    weights: { 'ethical-hacking': 3, 'soc-analyst': 3, 'it-networking': 1 } },
      { label: 'Working with data, charts & reports',      weights: { 'data-analytics': 3, 'python': 1, 'ai-engineering': 1 } },
      { label: 'AI, ChatGPT, automation',                  weights: { 'ai-beginners': 2, 'ai-engineering': 3, 'python': 2 } },
      { label: 'Office work, accounting, documentation',   weights: { 'ms-office': 3, 'e-accounting': 3, 'it-foundation': 1 } },
    ],
  },
  {
    id: 'experience',
    title: "What's your current experience level?",
    options: [
      { label: 'Complete beginner — never coded or designed', weights: { 'it-foundation': 3, 'ms-office': 2, 'web-designing': 1, 'graphic-designing': 1, 'spoken-english': 1 } },
      { label: 'Some basics — used computer, excel etc',      weights: { 'python': 2, 'web-development': 2, 'digital-marketing': 2, 'data-analytics': 2 } },
      { label: 'Intermediate — a bit of coding/design',       weights: { 'web-development': 2, 'ai-engineering': 2, 'ethical-hacking': 2, 'soc-analyst': 2 } },
      { label: 'Advanced — already working in IT',            weights: { 'ai-engineering': 3, 'ethical-hacking': 3, 'soc-analyst': 3, 'software-development': 2 } },
    ],
  },
  {
    id: 'time',
    title: "How much time can you commit?",
    options: [
      { label: '1–2 months — quick result',           weights: { 'ms-office': 2, 'ai-beginners': 2, 'personality-development': 1, 'interview-preparation': 2 } },
      { label: '3–4 months — short course',           weights: { 'python': 2, 'web-designing': 2, 'graphic-designing': 2, 'data-analytics': 2, 'digital-marketing': 1, 'spoken-english': 1, 'e-accounting': 1 } },
      { label: '6 months — meaningful skill',         weights: { 'web-development': 2, 'soc-analyst': 2, 'ethical-hacking': 2, 'ai-engineering': 2, 'it-foundation': 1 } },
      { label: '9–12 months — full career programme', weights: { 'software-development': 3, 'digital-design': 3, 'it-networking': 3 } },
    ],
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    options: [
      { label: 'Get a tech job',                weights: { 'software-development': 3, 'web-development': 2, 'data-analytics': 2, 'ai-engineering': 2, 'soc-analyst': 2 } },
      { label: 'Freelance / start my own',      weights: { 'graphic-designing': 2, 'digital-marketing': 3, 'web-development': 2, 'ui-ux-designing': 2 } },
      { label: 'Side income while studying',    weights: { 'graphic-designing': 2, 'digital-marketing': 2, 'web-designing': 2, 'ai-beginners': 1 } },
      { label: 'Improve my skills at work',     weights: { 'ms-office': 2, 'e-accounting': 2, 'ai-beginners': 2, 'spoken-english': 1, 'personality-development': 1 } },
    ],
  },
  {
    id: 'creativity',
    title: 'Do you see yourself as more…',
    options: [
      { label: 'Creative & visual',  weights: { 'graphic-designing': 2, 'ui-ux-designing': 2, 'digital-design': 2, 'web-designing': 1 } },
      { label: 'Logical & analytical', weights: { 'python': 2, 'data-analytics': 2, 'ai-engineering': 2, 'software-development': 2, 'ethical-hacking': 1 } },
      { label: 'Detail-oriented & organised', weights: { 'ms-office': 2, 'e-accounting': 2, 'soc-analyst': 2 } },
      { label: 'People-person & communicator', weights: { 'digital-marketing': 2, 'spoken-english': 2, 'personality-development': 2 } },
    ],
  },
  {
    id: 'env',
    title: "What kind of work environment do you prefer?",
    options: [
      { label: 'Office team in IT company',  weights: { 'software-development': 2, 'soc-analyst': 2, 'data-analytics': 2, 'web-development': 1 } },
      { label: 'Marketing / agency',          weights: { 'digital-marketing': 3, 'digital-design': 2, 'graphic-designing': 1 } },
      { label: 'Bank / accounting / govt',   weights: { 'e-accounting': 3, 'ms-office': 2, 'spoken-english': 1, 'personality-development': 1 } },
      { label: 'Remote / freelance',          weights: { 'graphic-designing': 2, 'web-development': 2, 'digital-marketing': 2, 'ui-ux-designing': 2 } },
    ],
  },
  {
    id: 'budget',
    title: 'Approximate budget (rough idea):',
    options: [
      { label: 'Under ₹10,000',     weights: { 'ms-office': 2, 'ai-beginners': 1, 'spoken-english': 1, 'personality-development': 1, 'interview-preparation': 1, 'web-designing': 1, 'python': 1 } },
      { label: '₹10,000 – ₹20,000', weights: { 'graphic-designing': 1, 'digital-marketing': 2, 'data-analytics': 1, 'web-development': 1, 'ui-ux-designing': 1 } },
      { label: '₹20,000 – ₹35,000', weights: { 'web-development': 2, 'soc-analyst': 1, 'ethical-hacking': 1, 'ai-engineering': 1, 'software-development': 1 } },
      { label: '₹35,000+',          weights: { 'software-development': 3, 'digital-design': 2, 'it-networking': 2, 'ai-engineering': 2 } },
    ],
  },
  {
    id: 'eng',
    title: "Comfort with English communication?",
    options: [
      { label: "I'd like to improve",      weights: { 'spoken-english': 3, 'personality-development': 1, 'ms-office': 1 } },
      { label: 'Comfortable',              weights: { 'digital-marketing': 1, 'web-development': 1, 'data-analytics': 1, 'graphic-designing': 1 } },
      { label: 'Fluent',                    weights: { 'software-development': 2, 'ai-engineering': 2, 'soc-analyst': 1, 'ethical-hacking': 1, 'ui-ux-designing': 1 } },
    ],
  },
];

// Programme metadata used to render result cards.
const PROGRAM_INFO = {
  'it-foundation':         { title: 'IT Foundation', duration: '6 Months' },
  'digital-design':        { title: 'Design & Marketing (Career Track)', duration: '9–12 Months' },
  'it-networking':         { title: 'IT Support & Cybersecurity (Career Track)', duration: '9–12 Months' },
  'software-development':  { title: 'Software Development (Career Track)', duration: '9–12 Months' },
  'python':                { title: 'Python Programming', duration: '3 Months' },
  'web-designing':         { title: 'Web Designing', duration: '3 Months' },
  'web-development':       { title: 'Full Stack Web Development', duration: '6 Months' },
  'data-analytics':        { title: 'Data Analytics', duration: '4 Months' },
  'ai-beginners':          { title: 'AI for Beginners', duration: '2 Months' },
  'ai-engineering':        { title: 'AI & ML Engineering', duration: '6 Months' },
  'digital-marketing':     { title: 'Digital Marketing', duration: '4 Months' },
  'graphic-designing':     { title: 'Graphic Designing', duration: '3 Months' },
  'ui-ux-designing':       { title: 'UI/UX Design', duration: '4 Months' },
  'soc-analyst':           { title: 'SOC Analyst', duration: '6 Months' },
  'ethical-hacking':       { title: 'Ethical Hacking', duration: '6 Months' },
  'ms-office':             { title: 'MS Office with AI Tools', duration: '2 Months' },
  'e-accounting':          { title: 'E-Accounting (Tally Prime)', duration: '3 Months' },
  'spoken-english':        { title: 'Spoken English', duration: '3 Months' },
  'personality-development':{ title: 'Personality Development', duration: '2 Months' },
  'interview-preparation': { title: 'Interview Preparation', duration: '1 Month' },
};

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function CareerQuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  const recommended = (() => {
    const scores = {};
    Object.values(answers).forEach((opt) => {
      Object.entries(opt.weights || {}).forEach(([slug, w]) => {
        scores[slug] = (scores[slug] || 0) + w;
      });
    });
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([slug, score]) => ({ slug, score, ...PROGRAM_INFO[slug] }))
      .filter((r) => r.title);
  })();

  const pickAnswer = (opt) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (step < total - 1) setStep(step + 1);
    else setShowLead(true);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setShowLead(false);
    setSubmitted(false);
    setError('');
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setError('');
    if (lead.name.trim().length < 2 || lead.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/career-quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v.label])),
          recommended_programs: recommended.map((r) => r.title),
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError('Could not submit. Please try again or call +91 96467 27676.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((Object.keys(answers).length) / total) * 100;

  // ── Final result view ──
  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8" data-testid="quiz-results">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your top programme matches</h2>
          <p className="text-gray-600">Based on your answers, these courses are the strongest fit for your goals:</p>
        </div>

        <div className="space-y-3 mb-6">
          {recommended.map((r, i) => (
            <Link
              key={r.slug}
              href={`/programs/${r.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              data-testid={`recommendation-${r.slug}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-blue-400'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {r.title}
                </div>
                <div className="text-xs text-gray-500">{r.duration} · Match score {r.score}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl p-5 text-center mb-4">
          <p className="text-sm text-gray-700 mb-3">
            ✅ A counsellor will call you on <strong>{lead.phone}</strong> with detailed fees, schedule and scholarship info.
          </p>
          <a href="tel:+919646727676" className="inline-block text-primary font-semibold text-sm hover:underline">
            Or call us directly: +91 96467 27676
          </a>
        </div>

        <button onClick={restart} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mx-auto" data-testid="quiz-restart">
          <RotateCcw className="w-4 h-4" /> Take quiz again
        </button>
      </div>
    );
  }

  // ── Lead form (after last question) ──
  if (showLead) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" data-testid="quiz-lead-form">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <CheckCircle2 className="w-3 h-3" /> Quiz complete
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Where should we send your results?</h2>
          <p className="text-gray-600 text-sm">
            We’ll show your top 3 matches instantly + a counsellor will call to walk you through them in detail.
          </p>
        </div>

        <form onSubmit={submitLead} className="space-y-3">
          <input
            type="text"
            placeholder="Your name *"
            value={lead.name}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            data-testid="quiz-lead-name"
          />
          <input
            type="tel"
            placeholder="Phone number *"
            value={lead.phone}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            data-testid="quiz-lead-phone"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={lead.email}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            data-testid="quiz-lead-submit"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Show My Results <ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-xs text-gray-500 text-center">No spam. We respect your privacy.</p>
        </form>
      </div>
    );
  }

  // ── Question view ──
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" data-testid="quiz-question">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{q.title}</h2>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pickAnswer(opt)}
            className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-between group"
            data-testid={`quiz-option-${q.id}-${i}`}
          >
            <span className="text-gray-800 group-hover:text-primary font-medium">{opt.label}</span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
      )}
    </div>
  );
}
