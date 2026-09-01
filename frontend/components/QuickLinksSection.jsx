import Link from 'next/link';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Briefcase,
  BookOpen,
  Shield,
  ChevronRight
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Free Counselling',
    desc: 'Get expert career guidance',
    href: '/free-counselling',
    icon: GraduationCap,
    color: 'bg-blue-500',
    tag: 'Popular'
  },
  {
    title: 'Summer Training',
    desc: '6 weeks intensive program',
    href: '/summer-training',
    icon: BookOpen,
    color: 'bg-orange-500',
    tag: 'For Students'
  },
  {
    title: 'Industrial Training',
    desc: '6 months with placement',
    href: '/industrial-training',
    icon: Building2,
    color: 'bg-green-500',
    tag: 'Internship'
  },
  {
    title: 'Cyber Warriors',
    desc: 'Free awareness sessions',
    href: '/cyber-warriors',
    icon: Shield,
    color: 'bg-red-500',
    tag: 'Free'
  },
  {
    title: 'Hire From Us',
    desc: 'Recruit trained freshers',
    href: '/hire-from-us',
    icon: Briefcase,
    color: 'bg-purple-500',
    tag: 'Employers'
  },
  {
    title: 'Refer & Earn',
    desc: 'Earn rewards for referrals',
    href: '/refer-and-earn',
    icon: Users,
    color: 'bg-pink-500',
    tag: 'Rewards'
  }
];

export default function QuickLinksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="section-title">Quick Access</h2>
          <p className="section-subtitle mx-auto">
            Explore our popular services and programs
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Link 
                key={index}
                href={link.href}
                className="group bg-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 relative overflow-hidden"
              >
                {/* Tag */}
                <span className="absolute top-3 right-3 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {link.tag}
                </span>
                
                {/* Icon */}
                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors text-sm">
                  {link.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{link.desc}</p>
                
                {/* Arrow */}
                <div className="flex items-center text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
