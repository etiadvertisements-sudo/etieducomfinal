'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, GraduationCap, Award } from 'lucide-react';

const stats = [
  { value: 5000, suffix: '+', label: 'Students Trained', icon: Users },
  { value: 4, suffix: '', label: 'Career Tracks', icon: Briefcase },
  { value: 40, suffix: '+', label: 'Certification Programs', icon: GraduationCap },
  { value: 15, suffix: '+', label: 'Certification Partners', icon: Award }
];

function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (!startOnView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, hasStarted]);

  return { count, ref };
}

function StatCard({ stat, index }) {
  const { count, ref } = useCountUp(stat.value, 2000);
  const IconComponent = stat.icon;

  return (
    <div 
      ref={ref}
      className="text-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
        <IconComponent className="w-7 h-7 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-white/80 text-sm font-medium">{stat.label}</div>
    </div>
  );
}

export default function AnimatedStatsSection() {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container-main relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
