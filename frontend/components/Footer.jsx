import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Instagram,
  Youtube,
  ChevronRight,
  Building,
  Gift,
  Shield,
  Award,
  BadgeCheck
} from 'lucide-react';

const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/etieducom',
  instagram: 'https://www.instagram.com/etieducom/',
  linkedin: 'https://www.linkedin.com/company/etieducom',
  youtube: 'https://www.youtube.com/@ETIEducomofficial'
};

const CONTACT_INFO = {
  phone: '+91 9646727676',
  email: 'helpdesk@etieducom.com',
  address: 'ETI Educom, Jodhamal Colony, Dhangu Road, Pathankot'
};

export default function Footer() {
  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Events', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Refer & Earn', href: '/refer-and-earn' }
  ];

  const programs = [
    { label: 'Computer Career Foundation', href: '/programs/computer-foundation' },
    { label: 'Digital Design & Marketing', href: '/programs/digital-design' },
    { label: 'IT Support & Networking', href: '/programs/it-networking' },
    { label: 'Software Development', href: '/programs/software-development' },
    { label: 'Summer Training', href: '/summer-training' }
  ];

  const resources = [
    { label: 'Blogs', href: '/blogs' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Cyber Warriors', href: '/cyber-warriors' },
    { label: 'Hire From Us', href: '/hire-from-us' },
    { label: 'Join ETI Team', href: '/join-team' },
    { label: 'Franchise', href: '/franchise' },
    { label: 'ETI EduConnect', href: '/eti-educonnect' }
  ];

  const branches = [
    { label: 'Pathankot', href: '/best-institute-in-pathankot' }
  ];

  const certifications = [
    { icon: <Shield className="w-4 h-4" />, label: 'ISO Certified' },
    { icon: <Award className="w-4 h-4" />, label: 'MSME Registered' },
    { icon: <BadgeCheck className="w-4 h-4" />, label: 'Trusted Website' },
    { icon: <Shield className="w-4 h-4" />, label: 'Copyscape Protected' },
    { icon: <BadgeCheck className="w-4 h-4" />, label: 'DMCA Protected' }
  ];

  return (
    <footer className="footer-main" data-testid="footer">
      <div className="container-main">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 pb-12 border-b border-gray-700">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Image 
              src="/images/logo-white.png" 
              alt="ETI Educom" 
              width={160}
              height={64}
              className="h-16 w-auto mb-6 object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              ETI Educom is India&apos;s leading Computer Career School, offering structured 
              career pathways through certified training programs since 2017.
            </p>
            <p className="text-gray-400 text-xs">
              <strong className="text-white">Training | Certification | Placement</strong>
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a 
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="footer-heading">Programs</h4>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div>
            <h4 className="footer-heading">Our Branches</h4>
            <ul className="space-y-3">
              {branches.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link flex items-center gap-1 hover:text-white">
                    <Building className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Call Us</p>
              <p className="text-white font-medium">{CONTACT_INFO.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Us</p>
              <p className="text-white font-medium">{CONTACT_INFO.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Head Office</p>
              <p className="text-white font-medium text-sm">{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>

        {/* Certifications Bar */}
        <div className="py-6 border-b border-gray-700">
          <div className="flex flex-wrap justify-center gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  {cert.icon}
                </div>
                <span className="text-sm font-medium">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ETI Educom®. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              A unit of <span className="text-white font-medium">ETI Career & Tech Solutions</span>
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-gray-500 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-500">|</span>
            <Link href="/terms-and-conditions" className="text-gray-500 text-sm hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-500">|</span>
            <Link href="/refer-and-earn" className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1">
              <Gift className="w-4 h-4" />
              Refer & Earn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
