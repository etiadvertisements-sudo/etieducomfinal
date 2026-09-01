import Link from 'next/link';
import { Home, Search, ArrowRight, BookOpen, GraduationCap, Phone } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404)',
  description: 'The page you are looking for could not be found. Browse our programs, blogs, or contact ETI Educom for help.',
  robots: { index: false, follow: true }, // don't index 404 but follow links to keep crawl flowing
  alternates: { canonical: 'https://www.etieducom.com/404' },
};

const popularLinks = [
  { href: '/programs', label: 'All Programs', icon: GraduationCap },
  { href: '/best-institute-in-pathankot', label: 'Pathankot Institute', icon: Home },
  { href: '/blogs', label: 'Latest Blogs', icon: BookOpen },
  { href: '/free-counselling', label: 'Free Counselling', icon: Phone },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16" data-testid="not-found-page">
      <div className="max-w-3xl w-full">
        <div className="text-center">
          {/* Big 404 with gradient */}
          <h1 className="text-[180px] md:text-[240px] font-extrabold leading-none tracking-tight bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent select-none">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 -mt-6">
            Oops, this page took a wrong turn
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
            We couldn&apos;t find what you were looking for. Don&apos;t worry — your career journey
            with ETI Educom doesn&apos;t end here. Explore our most-visited pages below.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" /> Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              <Search className="w-5 h-5" /> Need Help? Contact Us
            </Link>
          </div>

          {/* Popular Links Grid */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-xl">
            <p className="text-sm text-gray-500 mb-5 font-medium uppercase tracking-wider">Popular destinations</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
