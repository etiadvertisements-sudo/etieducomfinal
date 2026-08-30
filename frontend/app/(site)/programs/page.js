import Link from 'next/link';
import { 
  Monitor, 
  Palette, 
  Network, 
  Code,
  Shield,
  TrendingUp,
  Globe,
  Cpu,
  PenTool,
  BarChart3,
  Bot,
  Calculator,
  MessageCircle,
  Star,
  Briefcase,
  Award,
  Clock,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const metadata = {
  title: 'Programs & Courses — Industry-Ready IT Training',
  description: 'Explore 50+ industry-aligned IT programs at ETI Educom — Software Development, Cybersecurity, Data Analytics, Digital Marketing, AI, UI/UX & more. Get certified, get placed.',
  keywords: 'IT programs, IT courses Pathankot, certifications, career tracks, software development course, cybersecurity training, digital marketing course, data analytics course, AI course',
  openGraph: {
    title: 'Programs & Courses',
    description: 'Industry-aligned IT training programs for your career. 50+ certifications, 100% placement support.',
    url: 'https://www.etieducom.com/programs',
    type: 'website',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programs & Courses | ETI Educom®',
    description: '50+ industry-aligned IT training programs with certifications and placement support.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.etieducom.com/programs',
  },
};

const programCategories = [
  {
    id: 'career_tracks',
    title: 'Career Tracks',
    description: 'Comprehensive pathways for complete career transformation',
    featured: true,
    programs: [
      { id: 'it-foundation', title: 'IT Foundation', icon: Monitor, duration: '6 Months', desc: 'Digital literacy, MS Office, and computing fundamentals' },
      { id: 'digital-design', title: 'Digital Design & Marketing', icon: Palette, duration: '9-12 Months', desc: 'Adobe tools, UI/UX design, SEO, and digital marketing' },
      { id: 'it-networking', title: 'IT Support & Cybersecurity', icon: Shield, duration: '9-12 Months', desc: 'Networking, IT support, and cybersecurity protocols' },
      { id: 'software-development', title: 'Software Development', icon: Code, duration: '9-12 Months', desc: 'Programming, web development, and software engineering' }
    ]
  },
  {
    id: 'tech_programs',
    title: 'Tech Programs',
    description: 'Specialized technical training for IT professionals',
    programs: [
      { id: 'python', title: 'Python Programming', icon: Code, duration: '3 Months', desc: 'Python fundamentals to advanced programming' },
      { id: 'web-designing', title: 'Web Designing', icon: Globe, duration: '3 Months', desc: 'HTML, CSS, responsive design' },
      { id: 'web-development', title: 'Web Development', icon: Code, duration: '6 Months', desc: 'Full-stack web development' },
      { id: 'data-analytics', title: 'Data Analytics', icon: BarChart3, duration: '4 Months', desc: 'Data analysis, visualization, and insights' },
      { id: 'ai-beginners', title: 'AI For Beginners', icon: Bot, duration: '2 Months', desc: 'Introduction to artificial intelligence' },
      { id: 'ai-engineering', title: 'AI Engineering', icon: Cpu, duration: '6 Months', desc: 'Advanced AI and machine learning' }
    ]
  },
  {
    id: 'design_marketing',
    title: 'Design & Marketing',
    description: 'Creative and digital marketing courses',
    programs: [
      { id: 'digital-marketing', title: 'Digital Marketing', icon: TrendingUp, duration: '4 Months', desc: 'SEO, SEM, social media marketing' },
      { id: 'graphic-designing', title: 'Graphic Designing', icon: Palette, duration: '3 Months', desc: 'Adobe Photoshop, Illustrator, InDesign' },
      { id: 'ui-ux-designing', title: 'UI & UX Designing', icon: PenTool, duration: '4 Months', desc: 'User interface and experience design' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Security and ethical hacking certifications',
    programs: [
      { id: 'soc-analyst', title: 'SOC Analyst', icon: Shield, duration: '6 Months', desc: 'Security operations and threat analysis' },
      { id: 'ethical-hacking', title: 'Ethical Hacking', icon: Network, duration: '6 Months', desc: 'Penetration testing and security auditing' }
    ]
  },
  {
    id: 'office_accounting',
    title: 'Office & Accounting',
    description: 'Essential office and financial software training',
    programs: [
      { id: 'ms-office', title: 'MS-Office with AI', icon: Award, duration: '2 Months', desc: 'Microsoft Office suite with AI tools' },
      { id: 'e-accounting', title: 'E-Accounting', icon: Calculator, duration: '3 Months', desc: 'Tally, GST, and financial accounting' }
    ]
  },
  {
    id: 'soft_skills',
    title: 'Soft Skills',
    description: 'Communication and professional development',
    programs: [
      { id: 'spoken-english', title: 'Spoken English', icon: MessageCircle, duration: '3 Months', desc: 'English communication skills' },
      { id: 'personality-development', title: 'Personality Development', icon: Star, duration: '2 Months', desc: 'Professional grooming and confidence' },
      { id: 'interview-preparation', title: 'Interview Preparation', icon: Briefcase, duration: '1 Month', desc: 'Interview skills and resume building' }
    ]
  }
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Our Programs
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Transform Your Career with<br />
              <span className="text-primary">Industry-Ready Skills</span>
            </h1>
            <p className="text-xl text-gray-600">
              Choose from 50+ programs designed with industry requirements. 
              Get certified, get skilled, get placed.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      {programCategories.map((category) => (
        <section 
          key={category.id} 
          className={`section-padding ${category.featured ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {category.title}
                  {category.featured && (
                    <span className="ml-3 text-xs bg-primary text-white px-2 py-1 rounded-full font-medium align-middle">
                      FEATURED
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className={`grid gap-6 ${category.featured ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {category.programs.map((program) => {
                const IconComponent = program.icon;
                return (
                  <Link 
                    key={program.id}
                    href={`/programs/${program.id}`}
                    className={`group card hover:border-primary transition-all duration-300 ${category.featured ? 'p-6' : 'p-5'}`}
                  >
                    <div className={`${category.featured ? 'w-14 h-14' : 'w-12 h-12'} bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className={category.featured ? 'w-6 h-6' : 'w-5 h-5'} />
                    </div>
                    <h3 className={`${category.featured ? 'text-xl' : 'text-lg'} font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors`}>
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{program.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {program.duration}
                      </span>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Program to Choose?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get free career counselling from our experts and find the perfect program for your goals.
          </p>
          <Link href="/free-counselling" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Get Free Counselling
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
