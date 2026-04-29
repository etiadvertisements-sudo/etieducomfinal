'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleReviews = [
  {
    id: 's1',
    student_name: 'Rahul Sharma',
    course: 'Software Development',
    review_text: 'ETI Educom transformed my career. The structured curriculum and practical training helped me land my dream job as a developer at a top startup.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
  },
  {
    id: 's2',
    student_name: 'Priya Patel',
    course: 'Digital Design & Marketing',
    review_text: 'The Adobe certification I earned here opened many doors. Faculty support was exceptional throughout my journey — truly life-changing.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5,
  },
  {
    id: 's3',
    student_name: 'Amit Kumar',
    course: 'IT Support & Networking',
    review_text: 'From zero IT knowledge to a Network Administrator role in 8 months. ETI\'s structured approach made all the difference.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
  },
  {
    id: 's4',
    student_name: 'Neha Verma',
    course: 'Cybersecurity',
    review_text: 'Hands-on labs, real attack simulations, and amazing mentors. Got placed at a SOC team within weeks of finishing my course.',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    rating: 5,
  },
  {
    id: 's5',
    student_name: 'Karan Singh',
    course: 'Data Analytics',
    review_text: 'The way concepts are explained with real datasets is brilliant. Power BI projects in my portfolio sealed the deal at my interview.',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
  },
];

const AUTOPLAY_MS = 5000;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(sampleReviews);
  const [activeIndex, setActiveIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [isHovering, setIsHovering] = useState(false);

  // Fetch live reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reviews`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) setReviews(data);
        }
      } catch (e) {
        // fall back to samples
      }
    };
    fetchReviews();
  }, []);

  // Responsive cards-per-view
  useEffect(() => {
    const updatePerView = () => {
      const w = window.innerWidth;
      if (w < 768) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  const totalSlides = Math.max(reviews.length - perView + 1, 1);

  // Autoplay
  useEffect(() => {
    if (isHovering || totalSlides <= 1) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % totalSlides), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isHovering, totalSlides]);

  // Reset index if it goes out of range after resize
  useEffect(() => {
    if (activeIndex >= totalSlides) setActiveIndex(0);
  }, [totalSlides, activeIndex]);

  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + totalSlides) % totalSlides), [totalSlides]);
  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % totalSlides), [totalSlides]);

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top left, rgba(37,99,235,0.08), transparent 55%), radial-gradient(ellipse at bottom right, rgba(168,85,247,0.08), transparent 55%), #fafbff',
      }}
      data-testid="reviews-carousel-section"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-blue-100 px-4 py-1.5 rounded-full text-sm font-medium text-blue-700 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" /> Real Stories. Real Results.
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from thousands of learners who upgraded their skills, switched careers, and unlocked new opportunities.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Slides container */}
          <div className="overflow-hidden -mx-3">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * (100 / perView)}%)` }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / perView}%` }}
                  data-testid={`review-card-${review.id}`}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows (desktop) */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous reviews"
                data-testid="reviews-prev-btn"
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next reviews"
                data-testid="reviews-next-btn"
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  data-testid={`reviews-dot-${idx}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Mobile arrow row */}
          {totalSlides > 1 && (
            <div className="flex md:hidden items-center justify-center gap-3 mt-6">
              <button
                onClick={goPrev}
                aria-label="Previous"
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next"
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  const initials = (review.student_name || 'A B')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="group relative h-full bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      {/* Gradient ring on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />

      {/* Decorative big quote */}
      <div className="absolute -top-3 -right-3 text-blue-100 group-hover:text-blue-200 transition-colors">
        <Quote className="w-24 h-24" strokeWidth={1} />
      </div>

      <div className="relative z-10">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Review text */}
        <p className="text-gray-700 leading-relaxed mb-6 line-clamp-5 italic">
          “{review.review_text}”
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50" />
            {review.photo_url ? (
              <img
                src={cloudImg(review.photo_url, 'thumb')}
                alt={review.student_name}
                className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-md">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-gray-900 truncate">{review.student_name}</h4>
            <p className="text-xs font-medium text-blue-600 truncate">{review.course}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
