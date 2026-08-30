'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ReviewSubmitForm({ token, studentName, course }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating < 1) return setError('Please pick a rating from 1 to 5 stars.');
    if (text.trim().length < 10) return setError('Review should be at least 10 characters.');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/review-requests/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review_text: text.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || 'Submission failed');
      }
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center" data-testid="review-submit-success">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you, {studentName}!</h2>
        <p className="text-gray-600">Your review has been submitted and will appear after moderation.</p>
        <p className="text-gray-500 text-sm mt-4">If you’d also like to leave us a Google review, you can do so <a className="text-primary font-semibold hover:underline" href="https://search.google.com/local/writereview?placeid=YOUR_GBP_PLACE_ID" target="_blank" rel="noopener noreferrer">here</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" data-testid="review-submit-form">
      <label className="block">
        <span className="text-sm font-semibold text-gray-700 block mb-2">Your overall rating</span>
        <div className="flex gap-1" data-testid="review-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-1"
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              data-testid={`star-${n}`}
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  (hover || rating) >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </label>

      <label className="block mt-6">
        <span className="text-sm font-semibold text-gray-700 block mb-2">Tell us about your experience</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          maxLength={1500}
          placeholder={`What did you like about your ${course} course at ETI Educom? Any specific outcomes — placement, skills, projects?`}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          data-testid="review-text"
        />
        <div className="text-xs text-gray-400 text-right mt-1">{text.length}/1500</div>
      </label>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        data-testid="review-submit-button"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Review'}
      </button>
    </form>
  );
}
