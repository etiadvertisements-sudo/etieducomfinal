'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Monitor, 
  Palette, 
  Network, 
  Code,
  Calendar,
  Users,
  Briefcase,
  ChevronRight,
  Award,
  Clock,
  Building2,
  GraduationCap,
  FileText,
  HelpCircle,
  Shield,
  TrendingUp,
  Globe,
  Cpu,
  PenTool,
  BarChart3,
  Bot,
  Calculator,
  MessageCircle,
  Star
} from 'lucide-react';

const programCategories = [
  {
    id: 'career_tracks',
    title: 'Career Tracks',
    highlight: true,
    programs: [
      { id: 'it-foundation', title: 'IT Foundation', icon: Monitor, duration: '6 Months' },
      { id: 'digital-design', title: 'Digital Design & Marketing', icon: Palette, duration: '9-12 Months' },
      { id: 'it-networking', title: 'IT Support & Cybersecurity', icon: Shield, duration: '9-12 Months' },
      { id: 'software-development', title: 'Software Development', icon: Code, duration: '9-12 Months' }
    ]
  },
  {
    id: 'tech_programs',
    title: 'Tech Programs',
    programs: [
      { id: 'python', title: 'Python Programming', icon: Code, duration: '3 Months' },
      { id: 'web-designing', title: 'Web Designing', icon: Globe, duration: '3 Months' },
      { id: 'web-development', title: 'Web Development', icon: Code, duration: '6 Months' },
      { id: 'data-analytics', title: 'Data Analytics', icon: BarChart3, duration: '4 Months' },
      { id: 'ai-beginners', title: 'AI For Beginners', icon: Bot, duration: '2 Months' },
      { id: 'ai-engineering', title: 'AI Engineering', icon: Cpu, duration: '6 Months' }
    ]
  },
  {
    id: 'design_marketing',
    title: 'Design & Marketing',
    programs: [
      { id: 'digital-marketing', title: 'Digital Marketing', icon: TrendingUp, duration: '4 Months' },
      { id: 'graphic-designing', title: 'Graphic Designing', icon: Palette, duration: '3 Months' },
      { id: 'ui-ux-designing', title: 'UI & UX Designing', icon: PenTool, duration: '4 Months' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    programs: [
      { id: 'soc-analyst', title: 'SOC Analyst', icon: Shield, duration: '6 Months' },
      { id: 'ethical-hacking', title: 'Ethical Hacking', icon: Network, duration: '6 Months' }
    ]
  },
  {
    id: 'office_accounting',
    title: 'Office & Accounting',
    programs: [
      { id: 'ms-office-ai', title: 'MS-Office with AI', icon: Award, duration: '2 Months' },
      { id: 'e-accounting', title: 'E-Accounting', icon: Calculator, duration: '3 Months' }
    ]
  },
  {
    id: 'soft_skills',
    title: 'Soft Skills',
    programs: [
      { id: 'spoken-english', title: 'Spoken English', icon: MessageCircle, duration: '3 Months' },
      { id: 'personality-development', title: 'Personality Development', icon: Star, duration: '2 Months' },
      { id: 'interview-preparation', title: 'Interview Preparation', icon: Briefcase, duration: '1 Month' }
    ]
  }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <header 
        className={`header-main ${scrolled ? 'scrolled' : ''}`}
        data-testid="main-header"
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" data-testid="logo-link">
              <Image 
                src="/images/logo-blue.png" 
                alt="ETI Educom" 
                width={120}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>
            
            {/* Cyber Warriors Logo - Only on /cyber-warriors page */}
            {pathname === '/cyber-warriors' && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-gray-200" data-testid="cyber-warriors-logo">
                <img 
                  src="/images/cyber-warriors-logo.png" 
                  alt="Cyber Warriors" 
                  className="h-14 w-auto object-contain"
                />
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
              <Link href="/" className="nav-link">Home</Link>
              
              {/* About Dropdown */}
              <div 
                className="nav-item relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1">
                  About
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'about' ? 'open' : ''}`}>
                  <Link href="/about" className="dropdown-item flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    About Us
                  </Link>
                  <Link href="/founder" className="dropdown-item flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Founder&apos;s Desk
                  </Link>
                  <Link href="/team" className="dropdown-item flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Our Team
                  </Link>
                </div>
              </div>
              
              {/* Programs Mega Menu */}
              <div 
                className="nav-item static"
                onMouseEnter={() => setActiveDropdown('programs')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1" data-testid="programs-menu">
                  Programs
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Full Width Mega Menu */}
                <div className={`fixed left-0 right-0 top-[72px] bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 z-50 ${activeDropdown === 'programs' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Explore Our Programs</h3>
                          <p className="text-sm text-gray-500">Industry-aligned courses with international certifications</p>
                        </div>
                      </div>
                      <Link href="/programs" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                        View All Programs
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Career Tracks - Featured */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-bold text-primary uppercase tracking-wider">Career Tracks</span>
                        <span className="text-[10px] bg-gradient-to-r from-primary to-primary-dark text-white px-2 py-0.5 rounded-full font-medium">FEATURED</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {programCategories[0].programs.map((program) => {
                          const IconComponent = program.icon;
                          return (
                            <Link 
                              key={program.id}
                              href={`/programs/${program.id}`}
                              className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full"></div>
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-lg">
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{program.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{program.duration}</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Programs Grid */}
                    <div className="grid grid-cols-5 gap-6">
                      {programCategories.slice(1).map((category) => (
                        <div key={category.id}>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {category.title}
                          </h4>
                          <div className="space-y-1">
                            {category.programs.map((program) => {
                              const IconComponent = program.icon;
                              return (
                                <Link 
                                  key={program.id}
                                  href={`/programs/${program.id}`}
                                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors flex-shrink-0">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors truncate">{program.title}</p>
                                    <p className="text-[10px] text-gray-500">{program.duration}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Award className="w-4 h-4 text-primary" />
                          <span>International Certifications</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4 text-primary" />
                          <span>Expert Trainers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span>Placement Support</span>
                        </div>
                      </div>
                      <Link href="/free-counselling" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                        Get Free Career Counselling
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Dropdown */}
              <div 
                className="nav-item relative"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1">
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'open' : ''}`}>
                  <Link href="/events" className="dropdown-item flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Events
                  </Link>
                  <Link href="/blogs" className="dropdown-item flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Blogs
                  </Link>
                  <Link href="/faq" className="dropdown-item flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </Link>
                </div>
              </div>

              {/* Careers Dropdown */}
              <div 
                className="nav-item relative"
                onMouseEnter={() => setActiveDropdown('careers')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1">
                  Careers
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'careers' ? 'open' : ''}`}>
                  <Link href="/hire-from-us" className="dropdown-item flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Hire From Us
                  </Link>
                  <Link href="/join-team" className="dropdown-item flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Join Our Team
                  </Link>
                </div>
              </div>

              <Link href="/franchise" className="nav-link">Franchise</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/free-counselling"
                className="hidden md:inline-flex btn-primary text-sm"
                data-testid="counselling-cta"
              >
                Free Counselling
              </Link>
              
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-900" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="p-4">
          <nav className="space-y-2">
            <Link href="/" className="mobile-nav-link block">Home</Link>
            
            {/* About */}
            <div>
              <button
                className="mobile-nav-link w-full flex items-center justify-between"
                onClick={() => setExpandedCategory(expandedCategory === 'about' ? null : 'about')}
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'about' && (
                <div className="mobile-submenu">
                  <Link href="/about" className="mobile-submenu-item">About Us</Link>
                  <Link href="/founder" className="mobile-submenu-item">Founder&apos;s Desk</Link>
                  <Link href="/team" className="mobile-submenu-item">Our Team</Link>
                </div>
              )}
            </div>

            {/* Programs */}
            <div>
              <button
                className="mobile-nav-link w-full flex items-center justify-between"
                onClick={() => setExpandedCategory(expandedCategory === 'programs' ? null : 'programs')}
              >
                Programs
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === 'programs' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'programs' && (
                <div className="mobile-submenu">
                  {programCategories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 px-4">{category.title}</p>
                      {category.programs.map((program) => {
                        const IconComponent = program.icon;
                        return (
                          <Link
                            key={program.id}
                            href={`/programs/${program.id}`}
                            className="mobile-submenu-item flex items-center gap-2"
                          >
                            <IconComponent className="w-4 h-4" />
                            {program.title}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                  <Link href="/programs" className="mobile-submenu-item text-primary font-semibold">
                    View All Programs
                  </Link>
                </div>
              )}
            </div>

            {/* Resources */}
            <div>
              <button
                className="mobile-nav-link w-full flex items-center justify-between"
                onClick={() => setExpandedCategory(expandedCategory === 'resources' ? null : 'resources')}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'resources' && (
                <div className="mobile-submenu">
                  <Link href="/events" className="mobile-submenu-item">Events</Link>
                  <Link href="/blogs" className="mobile-submenu-item">Blogs</Link>
                  <Link href="/faq" className="mobile-submenu-item">FAQ</Link>
                </div>
              )}
            </div>

            {/* Careers */}
            <div>
              <button
                className="mobile-nav-link w-full flex items-center justify-between"
                onClick={() => setExpandedCategory(expandedCategory === 'careers' ? null : 'careers')}
              >
                Careers
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === 'careers' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'careers' && (
                <div className="mobile-submenu">
                  <Link href="/hire-from-us" className="mobile-submenu-item">Hire From Us</Link>
                  <Link href="/join-team" className="mobile-submenu-item">Join Our Team</Link>
                </div>
              )}
            </div>

            <Link href="/franchise" className="mobile-nav-link block">Franchise</Link>
            <Link href="/contact" className="mobile-nav-link block">Contact</Link>
          </nav>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link href="/free-counselling" className="btn-primary w-full justify-center">
              Free Counselling
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
