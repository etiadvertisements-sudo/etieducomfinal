'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Calendar, Clock, ArrowRight, Search, Loader2 } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const sampleBlogs = [
  {
    id: '1', title: 'Top 10 IT Skills in Demand for 2025', slug: 'top-10-it-skills-2025',
    excerpt: 'Discover the most sought-after IT skills that employers are looking for in 2025.',
    featured_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    category: 'Career Tips', tags: ['IT Skills', 'Career'], author: 'ETI Educom', read_time: 5, created_at: '2025-02-15'
  },
  {
    id: '2', title: 'How to Choose the Right Career Track', slug: 'choose-right-career-track',
    excerpt: 'A comprehensive guide to help you select the best career path based on your interests and goals.',
    featured_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    category: 'Career Guidance', tags: ['Career', 'Guidance'], author: 'ETI Educom', read_time: 7, created_at: '2025-02-10'
  },
  {
    id: '3', title: 'The Future of Digital Marketing in India', slug: 'future-digital-marketing-india',
    excerpt: 'Explore the evolving landscape of digital marketing and the opportunities it presents.',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    category: 'Industry Insights', tags: ['Digital Marketing', 'Trends'], author: 'ETI Educom', read_time: 6, created_at: '2025-02-05'
  }
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setBlogs(data && data.length > 0 ? data : sampleBlogs))
      .catch(() => setBlogs(sampleBlogs))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(blogs.map(b => b.category))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Knowledge Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Blogs & <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest trends, tips, and insights in the world of IT education and careers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                data-testid="blog-search"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className="bg-white border border-gray-100 rounded-2xl p-6 group hover:border-primary hover:shadow-lg transition-all duration-300">
                  {blog.featured_image && (
                    <div className="h-48 overflow-hidden rounded-xl -mx-2 -mt-2 mb-4">
                      <img
                        src={cloudImg(blog.featured_image, 'card')}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {blog.read_time} min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(blog.created_at)}
                    </span>
                    <Link
                      href={`/blogs/${blog.slug || blog.id}`}
                      className="text-primary text-sm font-medium flex items-center hover:gap-2 transition-all"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
