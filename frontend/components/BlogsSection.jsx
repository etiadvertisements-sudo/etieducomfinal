'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function BlogsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs?limit=3`);
        if (response.ok) {
          const data = await response.json();
          if (!cancelled && Array.isArray(data)) {
            // Only show real published blogs that have a valid slug — never fall back to sample/demo
            // content (broken links to non-existent posts cause "no article" issues for users).
            setBlogs(data.filter((b) => b && b.slug).slice(0, 3));
          }
        }
      } catch {
        // network error — keep blogs empty; section will hide
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    fetchBlogs();
    return () => { cancelled = true; };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const readTimeLabel = (rt) => {
    if (!rt && rt !== 0) return '5 min read';
    if (typeof rt === 'string') return rt.includes('min') ? rt : `${rt} min read`;
    return `${rt} min read`;
  };

  // Hide section entirely until real blogs are loaded (avoids broken links from placeholder data)
  if (!loaded || blogs.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white" data-testid="home-blogs-section">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Latest Articles
            </div>
            <h2 className="section-title">From Our Blog</h2>
            <p className="section-subtitle">
              Insights, tips, and career guidance from industry experts
            </p>
          </div>
          <Link href="/blogs" className="btn-secondary mt-4 md:mt-0" data-testid="home-view-all-blogs">
            View All Blogs
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id || blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              data-testid={`home-blog-card-${blog.slug}`}
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {blog.featured_image ? (
                  <img
                    src={cloudImg(blog.featured_image, 'card')}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <BookOpen className="w-12 h-12 text-primary/30" />
                  </div>
                )}
                {blog.category && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(blog.published_at || blog.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readTimeLabel(blog.read_time)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
