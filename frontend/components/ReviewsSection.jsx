'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleReviews = [
  {
    id: '1',
    student_name: 'Rahul Sharma',
    course: 'Software Development',
    review_text: 'ETI Educom transformed my career. The structured curriculum and practical training helped me land my dream job as a developer.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5
  },
  {
    id: '2',
    student_name: 'Priya Patel',
    course: 'Digital Design & Marketing',
    review_text: 'The Adobe certification I earned here opened many doors. Faculty support was exceptional throughout my journey.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5
  },
  {
    id: '3',
    student_name: 'Amit Kumar',
    course: 'IT Support & Networking',
    review_text: 'From zero IT knowledge to a Network Administrator role in 8 months. ETI\'s structured approach made all the difference.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 5
  }
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(sampleReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reviews?is_featured=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setReviews(data.slice(0, 3));
          }
        }
      } catch (error) {
        console.log('Using sample reviews');
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="section-title">Student Success Stories</h2>
          <p className="section-subtitle mx-auto">
            Hear from our students who have transformed their careers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-gray-600 mb-6 line-clamp-4">{review.review_text}</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {review.photo_url && (
                    <Image
                      src={cloudImg(review.photo_url, 'thumb')}
                      alt={review.student_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.student_name}</h4>
                  <p className="text-sm text-primary">{review.course}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-4">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
