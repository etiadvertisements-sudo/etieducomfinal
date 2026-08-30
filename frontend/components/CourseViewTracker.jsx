'use client';

import { useEffect } from 'react';
import { trackCourseView } from '@/lib/analytics';

/**
 * Client-side tracker — fires `course_view` once when a program page mounts.
 * Used inside server-rendered program detail pages.
 */
export default function CourseViewTracker({ slug, name, category, duration, value }) {
  useEffect(() => {
    if (!slug) return;
    trackCourseView({
      course_slug: slug,
      course_name: name,
      category,
      duration,
      value,
    });
  }, [slug, name, category, duration, value]);

  return null;
}
