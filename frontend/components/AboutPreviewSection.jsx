import Link from 'next/link';
import { Play, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPreviewSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Video/Image */}
          <div className="relative">
            {/* Main Image/Video Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-primary to-primary-dark rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-lg font-medium">Watch Our Story</p>
                  <p className="text-sm text-white/70">2 min video</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-2xl -z-10"></div>
            </div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Since 2017</p>
                  <p className="text-sm text-gray-500">Training Excellence</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              About ETI Educom
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Building Careers Through
              <span className="text-primary"> Industry-Ready Training</span>
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              ETI Educom is a professionally managed Computer Career School committed to delivering 
              high-quality IT education. Our structured approach combines theoretical knowledge with 
              practical application, ensuring our graduates are fully prepared for industry demands.
            </p>
            
            {/* Key Points */}
            <div className="space-y-4 mb-8">
              {[
                'Certiport Authorized Testing Center (CATC) for global certifications',
                'ISO 9001:2015 certified quality management system',
                'Curriculum designed in collaboration with industry experts',
                'Dedicated placement cell with strong corporate partnerships'
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary">
                Learn More About Us
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/founder" className="btn-secondary">
                Meet Our Founder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
