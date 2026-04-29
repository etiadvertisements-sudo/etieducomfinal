import Link from 'next/link';
import {
  MapPin, Phone, Mail, Clock, Award, Users, GraduationCap, CheckCircle,
  ChevronRight, Monitor, Wifi, BookOpen, Building2, Star, Navigation,
  Code, Calculator, TrendingUp, Shield, Briefcase, Target, Sparkles,
  ThumbsUp
} from 'lucide-react';

const SITE_URL = 'https://www.etieducom.com';
const PAGE_URL = `${SITE_URL}/best-institute-in-pathankot`;

export const metadata = {
  title: 'Best Computer Institute in Pathankot | Computer Courses Near Me',
  description:
    'Top-rated computer institute in Pathankot since 2017. ETI Educom offers Python, Tally, Digital Marketing, Web Development, Cybersecurity & summer training courses with 100% placement support. Visit our Pathankot center on Dhangu Road. Call 9646727676.',
  keywords: [
    'best computer institute in pathankot',
    'computer institutes in pathankot',
    'computer institutes pathankot',
    'institutes in pathankot',
    'computer courses in pathankot',
    'computer institute near me',
    'institutes near me',
    'IT institute in pathankot',
    'IT training pathankot',
    'python course in pathankot',
    'python training in pathankot',
    'tally course in pathankot',
    'tally course near me',
    'digital marketing institute in pathankot',
    'digital marketing institutes near me',
    'summer training in pathankot',
    'industrial training in pathankot',
    'web development course pathankot',
    'cybersecurity training pathankot',
    'graphic design course pathankot',
    'data analytics course pathankot',
    'AI course pathankot',
    'best IT training institute pathankot punjab',
    'ETI Educom pathankot',
    'computer training pathankot',
  ].join(', '),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Best Computer Institute in Pathankot',
    description:
      'Punjab\'s premier Computer Career School. Python, Tally, Digital Marketing, Web Development, Cybersecurity courses with placement support. 5000+ students trained.',
    url: PAGE_URL,
    type: 'website',
    siteName: 'ETI Educom',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'ETI Educom - Best Computer Institute in Pathankot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Computer Institute in Pathankot - ETI Educom®',
    description:
      'Top-rated computer institute in Pathankot. Python, Tally, Digital Marketing courses. Call 9646727676.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    'geo.region': 'IN-PB',
    'geo.placename': 'Pathankot',
    'geo.position': '32.2643;75.6421',
    'ICBM': '32.2643, 75.6421',
  },
};

const branchInfo = {
  name: 'ETI Educom Pathankot',
  tagline: 'Best Computer Institute in Pathankot',
  address: 'Jodhamal Colony, Dhangu Road, Pathankot, Punjab - 145001',
  phone: '+91 9646727676',
  email: 'helpdesk@etieducom.com',
  timings: 'Mon-Sat: 9:00 AM - 7:00 PM',
  geo: { lat: 32.2643, lng: 75.6421 },
  mapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.8!2d75.640!3d32.264!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDE1JzU0LjUiTiA3NcKwMzgnMzEuNiJF!5e0!3m2!1sen!2sin!4v1700000000000',
};

const facilities = [
  { icon: Monitor, title: 'Modern Computer Labs', desc: 'Latest hardware with high-speed internet' },
  { icon: Wifi, title: 'High-Speed Internet', desc: 'Uninterrupted connectivity for online learning' },
  { icon: BookOpen, title: 'Digital Library', desc: 'Access to e-books and learning resources' },
  { icon: Users, title: 'Small Batch Sizes', desc: 'Personalized attention for every student' },
];

const highlights = [
  'Certiport Authorized Testing Center (CATC)',
  'ISO 9001:2015 Certified Institute',
  'MSME Registered Organization',
  '5000+ Students Trained Since 2017',
  '95% Placement Rate (Top Recruiters)',
  'Industry Expert Faculty',
  'Hands-on Project Training',
  'Flexible Batch Timings (Morning/Evening/Weekend)',
];

const popularCoursesPathankot = [
  { name: 'Python Course in Pathankot', duration: '3 Months', slug: 'python', icon: Code, desc: 'Master Python programming with hands-on projects, web scraping, automation, and Django/Flask. PCEP/PCAP certifications included.' },
  { name: 'Tally Course in Pathankot', duration: '3 Months', slug: 'e-accounting', icon: Calculator, desc: 'Tally Prime + GST, TDS, payroll, e-way bills, financial accounting. Get certified Tally Professional & GST Practitioner certificates.' },
  { name: 'Digital Marketing in Pathankot', duration: '4 Months', slug: 'digital-marketing', icon: TrendingUp, desc: 'SEO, Google Ads, Meta Ads, social media marketing & analytics. Google + Meta Blueprint certified course in Pathankot.' },
  { name: 'Web Development in Pathankot', duration: '6 Months', slug: 'web-development', icon: Code, desc: 'Full-stack development with React.js, Node.js, MongoDB. Build real production-grade web applications.' },
  { name: 'Cybersecurity & Ethical Hacking', duration: '6 Months', slug: 'ethical-hacking', icon: Shield, desc: 'CEH, CompTIA Security+ track. Learn penetration testing, network security, ethical hacking in Pathankot.' },
  { name: 'Graphic Designing Course', duration: '3 Months', slug: 'graphic-designing', icon: Sparkles, desc: 'Adobe Photoshop, Illustrator, InDesign + brand design. Adobe Certified Professional curriculum.' },
];

const stats = [
  { icon: GraduationCap, value: '5000+', label: 'Students Trained' },
  { icon: Award, value: '40+', label: 'Certifications' },
  { icon: Briefcase, value: '95%', label: 'Placement Rate' },
  { icon: Star, value: '4.8/5', label: 'Student Rating' },
];

const faqs = [
  {
    q: 'Which is the best computer institute in Pathankot?',
    a: 'ETI Educom is widely regarded as the best computer institute in Pathankot, established in 2017. With over 5000+ students trained, 95% placement rate, ISO 9001:2015 certification, and a 4.8/5 rating on Justdial, it is Punjab\'s premier Computer Career School. ETI Educom offers career-focused courses in Python, Tally, Digital Marketing, Web Development, Cybersecurity, and more — all with industry-recognized certifications and placement assistance.',
  },
  {
    q: 'Where can I find the best Python course in Pathankot?',
    a: 'ETI Educom offers a comprehensive Python course in Pathankot lasting 3 months. The curriculum covers Python fundamentals, OOP, web scraping, automation, and frameworks like Django and Flask. Students get certified for PCEP and PCAP (Python Institute) along with hands-on projects. Located on Dhangu Road, our Pathankot Python training is taught by industry-expert faculty with flexible batch timings.',
  },
  {
    q: 'Is there a Tally course near me in Pathankot?',
    a: 'Yes — ETI Educom\'s Pathankot center on Dhangu Road, Jodhamal Colony, offers an industry-leading Tally course (e-Accounting) in Pathankot. The 3-month program covers Tally Prime, GST compliance, TDS/TCS, payroll, and financial reporting with certifications including Tally Certified Professional and GST Practitioner. Call 9646727676 to enroll.',
  },
  {
    q: 'Do you provide summer training in Pathankot for college students?',
    a: 'Absolutely. ETI Educom Pathankot offers summer training programs (4-6 weeks) every year for B.Tech, BCA, MCA, and B.Sc students from Pathankot, Gurdaspur, Jammu, and surrounding areas. Choose from Python, Java, Web Development, Data Analytics, AI, Digital Marketing, and Cybersecurity. Includes live projects, certificates, and internship opportunities.',
  },
  {
    q: 'Where are digital marketing institutes near me in Pathankot?',
    a: 'ETI Educom Pathankot (Dhangu Road) is one of the top digital marketing institutes near you in Pathankot. The 4-month Digital Marketing course covers SEO, SEM, Google Ads, Meta Ads, social media marketing, content marketing, and Google Analytics 4. Get Google Ads, Google Analytics, Meta Blueprint, and HubSpot certifications.',
  },
  {
    q: 'What computer courses are available at ETI Educom Pathankot?',
    a: 'ETI Educom offers 50+ computer courses in Pathankot including: IT Foundation, Python Programming, Web Designing, Web Development, Tally + e-Accounting, Digital Marketing, Graphic Designing, UI/UX Designing, Data Analytics, AI Engineering, SOC Analyst, Ethical Hacking, MS Office, Spoken English, and Personality Development. We also run summer & industrial training programs.',
  },
  {
    q: 'Where is ETI Educom located in Pathankot?',
    a: 'ETI Educom Pathankot is located at Jodhamal Colony, Dhangu Road, Pathankot, Punjab - 145001. The institute is easily accessible from all parts of the city. We are open Monday to Saturday from 9:00 AM to 7:00 PM. Call us on +91-9646727676 or visit etieducom.com to book a free counselling session.',
  },
  {
    q: 'Does ETI Educom Pathankot provide job placement?',
    a: 'Yes, ETI Educom has a 95% placement record. We have tie-ups with 50+ companies across India and offer dedicated placement assistance, mock interviews, resume building, and career counselling. Students from our Pathankot center have been placed in roles like Software Developer, Digital Marketer, Data Analyst, SOC Analyst, Graphic Designer, and Tally Operator.',
  },
];

// JSON-LD: LocalBusiness + EducationalOrganization combined (richer signal)
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': PAGE_URL,
  name: 'ETI Educom — Best Computer Institute in Pathankot',
  alternateName: ['ETI Educom Pathankot', 'ETI Educom®', 'Educational Training Institute'],
  description:
    'ETI Educom is the best computer institute in Pathankot offering certified IT courses in Python, Tally, Digital Marketing, Web Development, Cybersecurity, AI, Data Analytics, Graphic Design and more. ISO 9001:2015 certified with 5000+ students trained and 95% placement rate.',
  url: PAGE_URL,
  logo: `${SITE_URL}/images/logo-blue.png`,
  image: [`${SITE_URL}/images/og-image.jpg`],
  telephone: '+91-9646727676',
  email: 'helpdesk@etieducom.com',
  priceRange: '₹₹',
  foundingDate: '2017',
  slogan: 'The Computer Career School — Training | Certification | Placement',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jodhamal Colony, Dhangu Road',
    addressLocality: 'Pathankot',
    addressRegion: 'Punjab',
    postalCode: '145001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.2643,
    longitude: 75.6421,
  },
  areaServed: [
    { '@type': 'City', name: 'Pathankot' },
    { '@type': 'City', name: 'Gurdaspur' },
    { '@type': 'City', name: 'Dalhousie' },
    { '@type': 'City', name: 'Kathua' },
    { '@type': 'City', name: 'Jammu' },
    { '@type': 'AdministrativeArea', name: 'Punjab' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/etieducom',
    'https://www.instagram.com/etieducom/',
    'https://www.linkedin.com/company/etieducom',
    'https://www.youtube.com/@ETIEducomofficial',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Computer Courses in Pathankot',
    itemListElement: popularCoursesPathankot.map((c, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Course',
        name: c.name,
        url: `${SITE_URL}/programs/${c.slug}`,
        description: c.desc,
        provider: { '@type': 'EducationalOrganization', name: 'ETI Educom', sameAs: SITE_URL },
      },
    })),
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '5000',
    bestRating: '5',
    worstRating: '1',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9646727676',
    contactType: 'customer service',
    email: 'helpdesk@etieducom.com',
    availableLanguage: ['English', 'Hindi', 'Punjabi'],
    areaServed: 'IN',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Best Computer Institute in Pathankot', item: PAGE_URL },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function PathankotBranchPage() {
  return (
    <div className="min-h-screen" data-testid="pathankot-branch-page">
      {/* SEO: Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-main relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              ISO 9001:2015 Certified · MSME Registered · Since 2017
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Best Computer Institute in <span className="text-yellow-400">Pathankot</span>
            </h1>
            <p className="text-xl text-blue-100 mb-2 max-w-3xl mx-auto leading-relaxed">
              ETI Educom — Punjab&apos;s #1 Computer Career School delivering certified training in
              <strong className="text-white"> Python, Tally, Digital Marketing, Web Development, Cybersecurity</strong>,
              and more — with 100% placement assistance.
            </p>
            <p className="text-base text-blue-200 mb-8">5000+ students trained · 95% placement rate · 40+ certifications · 4.8/5 rating on Justdial</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <Icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-blue-100">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/free-counselling" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Book Free Counselling
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a href={`tel:${branchInfo.phone}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> Call 9646727676
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro / About Pathankot Center */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-main max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Top-Rated Computer Institute in Pathankot Since 2017
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              Looking for the <strong>best computer institute in Pathankot</strong>? ETI Educom is a
              Punjab-based computer career school dedicated to bridging the gap between academic
              education and industry requirements. Located at Jodhamal Colony, Dhangu Road, our
              Pathankot branch has trained over <strong>5000+ students</strong> since 2017 in
              cutting-edge IT skills with industry-recognized certifications.
            </p>
            <p>
              Whether you are searching for <em>computer institutes in Pathankot</em>,
              <em> institutes near me</em>, a <em>Python course in Pathankot</em>,
              <em> Tally course near me</em>, or a <em>digital marketing institute in Pathankot</em> —
              ETI Educom offers career-focused programs designed for placement, not just education.
              Our students have been hired by leading companies across India in roles such as
              Software Developer, Digital Marketer, Data Analyst, SOC Analyst, Graphic Designer,
              Tally Operator, and Network Engineer.
            </p>
            <p>
              ETI Educom is an <strong>ISO 9001:2015 Certified institute</strong>,
              <strong> MSME registered</strong>, and a <strong>Certiport Authorized Testing Center
              (CATC)</strong>. We partner with global certification bodies including Microsoft,
              Adobe, Google, Meta, EC-Council, CompTIA, Cisco, Tally, and HubSpot — ensuring
              students leave with certifications that employers recognize and value.
            </p>
          </div>
        </div>
      </section>

      {/* Most-Searched Courses in Pathankot */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" /> Most Popular in Pathankot
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Computer Courses in Pathankot
            </h2>
            <p className="text-gray-600 text-lg">
              From Python and Tally to Digital Marketing — explore the most enrolled courses at our Pathankot center.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCoursesPathankot.map((course, idx) => {
              const Icon = course.icon;
              return (
                <Link
                  key={idx}
                  href={`/programs/${course.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary hover:shadow-xl transition-all"
                  data-testid={`course-card-${course.slug}`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.desc}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/programs" className="btn-primary inline-flex items-center gap-2">
              View All 50+ Courses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Summer Training & Industrial Training Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-main max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/summer-training" className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-100 hover:shadow-xl transition-all" data-testid="summer-training-link">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                Summer Training in Pathankot
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                4-6 week summer training programs for B.Tech, BCA, MCA, and B.Sc students from
                Pathankot, Gurdaspur, Dalhousie, and Jammu region. Choose Python, Java, Web Development,
                Data Analytics, Digital Marketing, AI, or Cybersecurity. Live projects, certificates &
                internship opportunities included.
              </p>
              <span className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                Apply for Summer Training <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/industrial-training" className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 hover:shadow-xl transition-all" data-testid="industrial-training-link">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-4">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Industrial Training in Pathankot
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                6-month industrial training programs for engineering and CS students. PTU, GNDU, and
                IK Gujral PTU approved curriculum with hands-on real-world projects, mentorship from
                industry professionals, and final-year project support. Perfect for placement preparation.
              </p>
              <span className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Explore Industrial Training <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" /> Visit Our Pathankot Center
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Computer Institute Near You in Pathankot
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                ETI Educom Pathankot is centrally located on Dhangu Road, easily accessible from
                Sukhdev Nagar, Bhatia Chowk, Salwa Pul, and all surrounding areas. Walk in for a
                free campus tour and counselling session.
              </p>

              <div className="space-y-5 mb-8">
                <ContactRow icon={MapPin} label="Address" value={branchInfo.address} />
                <ContactRow icon={Phone} label="Phone" value={branchInfo.phone} href={`tel:${branchInfo.phone}`} />
                <ContactRow icon={Mail} label="Email" value={branchInfo.email} href={`mailto:${branchInfo.email}`} />
                <ContactRow icon={Clock} label="Timings" value={branchInfo.timings} />
              </div>

              <a href={`https://www.google.com/maps/dir/?api=1&destination=${branchInfo.geo.lat},${branchInfo.geo.lng}&destination_place_id=ETI+Educom+Pathankot`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl h-[500px]">
              <iframe
                src={branchInfo.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ETI Educom Pathankot - Best Computer Institute Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" /> Our Facilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              State-of-the-Art Infrastructure in Pathankot
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern labs, certified faculty, and student-first amenities — everything you need to learn and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all border border-gray-100">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{facility.title}</h3>
                  <p className="text-sm text-gray-600">{facility.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                <ThumbsUp className="w-4 h-4" /> Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why ETI Educom is the Best Computer Institute in Pathankot
              </h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                We&apos;re not just another computer training institute in Pathankot — we&apos;re a
                career transformation center that has helped thousands of students from Punjab,
                Himachal Pradesh, and Jammu region achieve their career dreams since 2017.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Trending Programs This Month</h3>
              <div className="space-y-4">
                {popularCoursesPathankot.slice(0, 4).map((course, index) => (
                  <Link key={index} href={`/programs/${course.slug}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors group">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary">{course.name}</h4>
                      <p className="text-sm text-gray-500">{course.duration}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>

              <Link href="/programs" className="block mt-6">
                <button className="btn-primary w-full justify-center">
                  View All Computer Courses in Pathankot <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Questions About Computer Courses in Pathankot
            </h2>
            <p className="text-gray-600">
              Got questions? We&apos;ve answered the most common queries from students across Pathankot, Gurdaspur, and Jammu region.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900 text-lg">{faq.q}</h3>
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center group-open:rotate-180 transition-transform">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container-main max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Serving Students Across the Region
            </h2>
            <p className="text-gray-600">
              ETI Educom Pathankot welcomes students from these surrounding areas:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Pathankot City', 'Sukhdev Nagar', 'Dhangu Road', 'Jodhamal Colony',
              'Bhoa', 'Sujanpur', 'Dinanagar', 'Gurdaspur', 'Batala', 'Amritsar',
              'Dalhousie', 'Banikhet', 'Chamba', 'Nurpur', 'Kathua', 'Samba',
              'Jammu', 'Udhampur',
            ].map((area, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-main text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join the Best Computer Institute in Pathankot?
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Visit our Pathankot center for a free career counselling session. Talk to our experts,
            tour the facility, and discover the right computer course for your career goals.
            Walk-ins welcome Monday to Saturday, 9 AM to 7 PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-counselling" className="btn-primary px-8 py-4 text-lg justify-center">
              Book Free Counselling
            </Link>
            <a href={`tel:${branchInfo.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-colors">
              <Phone className="w-5 h-5" /> Call {branchInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const inner = (
    <>
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{label}</h4>
        {href ? (
          <a href={href} className="text-primary hover:underline">{value}</a>
        ) : (
          <p className="text-gray-600">{value}</p>
        )}
      </div>
    </>
  );
  return <div className="flex items-start gap-4">{inner}</div>;
}
