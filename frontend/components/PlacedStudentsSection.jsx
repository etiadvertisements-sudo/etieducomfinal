'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function PlacedStudentsSection() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/placed-students`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setStudents(data);
        }
      } catch {}
    })();
  }, []);

  if (!students.length) return null;

  return (
    <section className="section-padding bg-gray-50 overflow-hidden" data-testid="placed-students-section">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Success Stories
          </div>
          <h2 className="section-title">Our Students, Placed</h2>
          <p className="section-subtitle mx-auto">
            Real people, real careers — meet some of the students we&apos;ve helped launch into industry
          </p>
        </div>
      </div>

      <div
        className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-[max(1rem,calc((100vw-1200px)/2))] snap-x snap-mandatory scrollbar-hide"
        data-testid="placed-students-track"
      >
        {students.map((s) => (
          <div
            key={s.id}
            className="snap-start flex-shrink-0 w-64 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            data-testid={`placed-student-${s.id}`}
          >
            <div className="relative h-64 bg-gray-100">
              <img
                src={s.photo_url}
                alt={s.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-9 h-9 bg-primary/90 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{s.name}</h3>
              <p className="text-primary font-semibold text-sm mt-1">{s.position}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                {s.company_logo_url ? (
                  <img src={s.company_logo_url} alt={s.company_name} className="h-6 w-auto object-contain" />
                ) : (
                  <Briefcase className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">{s.company_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
