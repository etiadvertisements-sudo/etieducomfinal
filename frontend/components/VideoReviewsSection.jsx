'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, Video, Star, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function VideoReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchVideoReviews();
  }, []);

  const fetchVideoReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cyber-warriors/video-reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching video reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Function to extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  // Function to get embed URL for shorts/reels
  const getEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container-main">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="container-main">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              Video Testimonials
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Real Stories, Real Impact
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Watch what our participants have to say about the Cyber Warriors program
            </p>
          </div>

          {/* Video Reels Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors -ml-4 lg:ml-0"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors -mr-4 lg:mr-0"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review, index) => (
                <div 
                  key={review._id || index}
                  className="flex-shrink-0 w-[280px] snap-center"
                >
                  {/* Reel Card */}
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group">
                    {/* Video Thumbnail - 9:16 aspect ratio for reels */}
                    <div className="relative aspect-[9/16] bg-gray-900">
                      {review.video_url && (
                        <img 
                          src={getYouTubeThumbnail(review.video_url) || '/images/video-placeholder.jpg'}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Play Overlay */}
                      <div 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-colors"
                        onClick={() => setActiveVideo(review)}
                      >
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>

                      {/* Gradient Overlay for text */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent"></div>

                      {/* Review Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                          ))}
                        </div>
                        <h3 className="text-white font-bold text-sm truncate">{review.name}</h3>
                        <p className="text-gray-300 text-xs truncate">{review.designation}</p>
                        {review.location && (
                          <p className="text-gray-400 text-xs mt-1 truncate">{review.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors"
            >
              <span className="text-lg">Close</span>
            </button>

            {/* Video Container - 9:16 aspect ratio */}
            <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden">
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="text-white font-bold text-lg">{activeVideo.name}</h3>
              <p className="text-gray-400 text-sm">{activeVideo.designation}</p>
              {activeVideo.location && (
                <p className="text-gray-500 text-xs mt-1">{activeVideo.location}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
