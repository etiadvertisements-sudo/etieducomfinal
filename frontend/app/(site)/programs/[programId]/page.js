import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Award, 
  Users, 
  CheckCircle, 
  ChevronRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Monitor,
  Palette,
  Network,
  Code,
  Shield,
  TrendingUp,
  Database,
  Globe,
  Cpu,
  FileText,
  Phone,
  Target,
  Layers,
  Zap
} from 'lucide-react';
import ProgramEnquiryForm from '@/components/ProgramEnquiryForm';

// Complete program data with advanced content
const programsData = {
  // Career Tracks
  'it-foundation': {
    title: 'IT Foundation',
    tagline: 'Digital Literacy & Office Productivity',
    description: 'Build a rock-solid foundation in computing with our comprehensive IT Foundation program. This program transforms complete beginners into confident computer users, equipping them with essential digital skills demanded by every modern workplace. From mastering productivity suites to understanding hardware-software ecosystems, you\'ll gain the competencies that form the backbone of any IT career.',
    duration: '6 Months',
    icon: Monitor,
    category: 'Career Track',
    level: 'Beginner',
    certifications: ['Microsoft Office Specialist (MOS) - Word', 'Microsoft Office Specialist (MOS) - Excel', 'Microsoft Office Specialist (MOS) - PowerPoint', 'IC3 Digital Literacy Certification', 'Google Workspace Certification'],
    salary: '₹2.5 - 4.5 LPA',
    highlights: [
      'Complete computer architecture and operating systems fundamentals',
      'Advanced Microsoft Office Suite with automation and macros',
      'Cloud computing basics with Google Workspace and Microsoft 365',
      'Professional email management and digital communication protocols',
      'Hardware troubleshooting and system maintenance',
      'Cybersecurity awareness and safe computing practices'
    ],
    curriculum: [
      { module: 'Computer Architecture & OS', topics: ['CPU, RAM, Storage internals', 'Windows 10/11 administration', 'File systems (NTFS, FAT32)', 'System optimization & maintenance', 'Device drivers & peripherals'] },
      { module: 'Microsoft Word Advanced', topics: ['Complex document formatting', 'Styles, templates & themes', 'Mail merge with database integration', 'Track changes & collaboration', 'Forms and content controls', 'Macro basics for automation'] },
      { module: 'Microsoft Excel Advanced', topics: ['Advanced formulas (VLOOKUP, INDEX-MATCH)', 'Pivot Tables & Pivot Charts', 'Data validation & conditional formatting', 'Power Query introduction', 'Dashboard creation', 'VBA macro fundamentals'] },
      { module: 'Microsoft PowerPoint & Outlook', topics: ['Professional presentation design', 'Animation & multimedia integration', 'Presenter view mastery', 'Email management strategies', 'Calendar & task management', 'Meeting scheduling automation'] },
      { module: 'Cloud & Collaboration Tools', topics: ['OneDrive & SharePoint basics', 'Google Workspace essentials', 'Real-time collaboration', 'Cloud storage management', 'Version control concepts'] },
      { module: 'Digital Security & Productivity', topics: ['Password management', 'Phishing awareness', 'Data backup strategies', 'Typing speed optimization (50+ WPM)', 'Time management tools'] }
    ],
    careers: ['Data Entry Specialist', 'Office Administrator', 'Computer Operator', 'Executive Assistant', 'Documentation Specialist', 'Back Office Executive'],
    prerequisites: 'No prior experience required. Basic English reading ability recommended.',
    projects: ['Automated business report with macros', 'Interactive sales dashboard in Excel', 'Corporate presentation with multimedia', 'Document management system setup']
  },

  'digital-design': {
    title: 'Design & Marketing',
    tagline: 'Creative Design + Digital Growth Strategy',
    description: 'Master the complete spectrum of visual communication and digital marketing in this intensive program. You\'ll learn to create compelling brand identities, design user-centric interfaces, and execute data-driven marketing campaigns. This dual-track approach makes you invaluable to any organization seeking creative professionals who understand business growth.',
    duration: '9-12 Months',
    icon: Palette,
    category: 'Career Track',
    level: 'Beginner to Advanced',
    certifications: ['Adobe Certified Professional - Photoshop', 'Adobe Certified Professional - Illustrator', 'Adobe Certified Professional - InDesign', 'Google Ads Certification', 'Google Analytics Certification', 'Meta Blueprint Certification', 'HubSpot Content Marketing Certification', 'Hootsuite Social Marketing Certification'],
    salary: '₹3.5 - 10 LPA',
    highlights: [
      'Complete Adobe Creative Cloud mastery (Photoshop, Illustrator, InDesign, XD)',
      'UI/UX design with Figma including prototyping and design systems',
      'Brand identity development from concept to execution',
      'Full-funnel digital marketing strategy and implementation',
      'SEO, SEM, and programmatic advertising expertise',
      'Marketing analytics and conversion rate optimization'
    ],
    curriculum: [
      { module: 'Design Fundamentals & Theory', topics: ['Color psychology and theory', 'Typography and font pairing', 'Grid systems and layout principles', 'Visual hierarchy', 'Gestalt principles', 'Design thinking methodology'] },
      { module: 'Adobe Photoshop Mastery', topics: ['Non-destructive editing workflow', 'Advanced compositing techniques', 'Photo retouching and manipulation', 'Digital painting fundamentals', 'Web and mobile asset creation', 'Batch processing automation'] },
      { module: 'Adobe Illustrator & Vector Design', topics: ['Pen tool mastery', 'Logo design principles', 'Icon and illustration creation', 'Pattern and texture design', 'Print-ready artwork', 'SVG optimization for web'] },
      { module: 'UI/UX Design', topics: ['User research methodologies', 'Information architecture', 'Wireframing techniques', 'Figma advanced features', 'Interactive prototyping', 'Design system creation', 'Usability testing'] },
      { module: 'Digital Marketing Strategy', topics: ['Marketing funnel optimization', 'Content marketing strategy', 'Social media marketing', 'Email marketing automation', 'Influencer marketing', 'Brand storytelling'] },
      { module: 'SEO & Paid Advertising', topics: ['Technical SEO audit', 'On-page optimization', 'Link building strategies', 'Google Ads (Search, Display, Shopping)', 'Facebook & Instagram Ads', 'LinkedIn advertising', 'Remarketing strategies'] },
      { module: 'Analytics & Optimization', topics: ['Google Analytics 4 mastery', 'Tag Manager implementation', 'A/B testing frameworks', 'Conversion tracking', 'Attribution modeling', 'Data-driven decision making'] }
    ],
    careers: ['Graphic Designer', 'UI/UX Designer', 'Digital Marketing Manager', 'Social Media Strategist', 'Brand Designer', 'Creative Director', 'Performance Marketing Specialist', 'Content Strategist'],
    prerequisites: 'Basic computer knowledge. Creative mindset and willingness to learn.',
    projects: ['Complete brand identity package', 'E-commerce website UI design', 'Multi-channel marketing campaign', 'Social media content strategy', 'SEO audit and optimization plan']
  },

  'it-networking': {
    title: 'IT & Cybersecurity',
    tagline: 'Network Infrastructure + Security Operations',
    description: 'Become a dual-skilled professional in network administration and cybersecurity operations. This comprehensive program covers everything from designing enterprise networks to defending them against sophisticated cyber threats. You\'ll gain hands-on experience with industry-standard tools and technologies used by Fortune 500 companies, preparing you for roles in IT infrastructure and security teams.',
    duration: '9-12 Months',
    icon: Network,
    category: 'Career Track',
    level: 'Beginner to Advanced',
    certifications: ['CompTIA A+', 'CompTIA Network+', 'CompTIA Security+', 'Cisco CCNA', 'EC-Council Certified Ethical Hacker (CEH)', 'CompTIA CySA+', 'Microsoft Azure Fundamentals (AZ-900)', 'AWS Cloud Practitioner'],
    salary: '₹4 - 15 LPA',
    highlights: [
      'Enterprise network design, implementation, and troubleshooting',
      'Windows Server and Linux system administration',
      'Firewall configuration and network security architecture',
      'Ethical hacking and penetration testing methodologies',
      'Security Operations Center (SOC) procedures and SIEM tools',
      'Cloud security fundamentals (AWS, Azure)'
    ],
    curriculum: [
      { module: 'Network Fundamentals', topics: ['OSI and TCP/IP models deep dive', 'IPv4/IPv6 addressing and subnetting', 'Routing protocols (OSPF, EIGRP, BGP)', 'Switching concepts (VLANs, STP)', 'Wireless networking (802.11)', 'Network troubleshooting methodology'] },
      { module: 'System Administration', topics: ['Windows Server 2019/2022', 'Active Directory design', 'Group Policy management', 'Linux administration (Ubuntu, CentOS)', 'Shell scripting', 'Virtualization (VMware, Hyper-V)'] },
      { module: 'Network Security', topics: ['Firewall architecture (Cisco ASA, pfSense)', 'IDS/IPS implementation', 'VPN technologies', 'Network segmentation', 'Zero trust architecture', 'Security policy development'] },
      { module: 'Ethical Hacking', topics: ['Reconnaissance techniques', 'Vulnerability scanning (Nessus, OpenVAS)', 'Exploitation frameworks (Metasploit)', 'Web application security testing', 'Wireless security assessment', 'Social engineering techniques'] },
      { module: 'Security Operations', topics: ['SIEM platforms (Splunk, QRadar)', 'Log analysis and correlation', 'Incident response procedures', 'Threat hunting techniques', 'Malware analysis basics', 'Digital forensics introduction'] },
      { module: 'Cloud Security', topics: ['AWS security services', 'Azure security center', 'Cloud architecture security', 'Identity and access management', 'Container security basics', 'Compliance frameworks (ISO 27001, NIST)'] }
    ],
    careers: ['Network Administrator', 'System Administrator', 'Security Analyst', 'SOC Analyst', 'Network Security Engineer', 'IT Infrastructure Specialist', 'Cloud Security Analyst', 'Penetration Tester'],
    prerequisites: 'Basic computer knowledge. Analytical and problem-solving mindset.',
    projects: ['Enterprise network design and simulation', 'Comprehensive security audit report', 'Penetration testing engagement', 'SOC playbook development', 'Incident response tabletop exercise']
  },

  'software-development': {
    title: 'Software Development',
    tagline: 'Full Stack Engineering + Modern DevOps',
    description: 'Transform into a complete software engineer capable of architecting and building production-grade applications. This intensive program covers the entire software development lifecycle—from writing clean, maintainable code to deploying scalable applications on cloud infrastructure. You\'ll master both frontend and backend technologies, work with modern frameworks, and learn industry best practices followed by top tech companies.',
    duration: '9-12 Months',
    icon: Code,
    category: 'Career Track',
    level: 'Beginner to Advanced',
    certifications: ['Microsoft Certified: Azure Developer Associate', 'AWS Certified Developer - Associate', 'Oracle Certified Professional Java SE', 'MongoDB Certified Developer', 'Meta Front-End Developer Certificate', 'GitHub Foundations Certification', 'Kubernetes Application Developer (CKAD)'],
    salary: '₹5 - 18 LPA',
    highlights: [
      'Multiple programming paradigms (OOP, Functional, Reactive)',
      'Modern frontend development with React.js ecosystem',
      'Backend engineering with Node.js, Python, or Java',
      'Database design (SQL and NoSQL) and optimization',
      'RESTful API and GraphQL development',
      'CI/CD pipelines and cloud deployment (AWS/Azure)'
    ],
    curriculum: [
      { module: 'Programming Fundamentals', topics: ['Data structures implementation', 'Algorithm design and analysis', 'Time and space complexity', 'Design patterns', 'Clean code principles', 'Test-driven development'] },
      { module: 'Python Programming', topics: ['Advanced Python features', 'Object-oriented design', 'Decorators and generators', 'Multithreading and async', 'Package management', 'Django/FastAPI frameworks'] },
      { module: 'Frontend Engineering', topics: ['Advanced JavaScript (ES6+)', 'React.js and hooks', 'State management (Redux, Zustand)', 'TypeScript', 'CSS-in-JS and Tailwind', 'Performance optimization', 'Testing (Jest, React Testing Library)'] },
      { module: 'Backend Development', topics: ['Node.js architecture', 'Express.js/NestJS', 'Authentication (JWT, OAuth)', 'API security best practices', 'Microservices introduction', 'Message queues (Redis, RabbitMQ)'] },
      { module: 'Database Engineering', topics: ['SQL advanced queries', 'Database normalization', 'PostgreSQL administration', 'MongoDB document design', 'Redis caching strategies', 'Database performance tuning'] },
      { module: 'DevOps & Cloud', topics: ['Git workflow strategies', 'Docker containerization', 'Kubernetes basics', 'CI/CD with GitHub Actions', 'AWS services (EC2, S3, RDS, Lambda)', 'Infrastructure as Code (Terraform basics)'] }
    ],
    careers: ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Application Architect', 'Technical Lead'],
    prerequisites: 'Basic computer knowledge. Mathematical and logical aptitude helpful.',
    projects: ['E-commerce platform with payment integration', 'Real-time chat application', 'RESTful API with authentication', 'Microservices-based application', 'CI/CD pipeline setup']
  },

  // Individual Programs
  'python': {
    title: 'Python Programming',
    tagline: 'Versatile Programming for Modern Applications',
    description: 'Master Python, the world\'s most versatile programming language powering everything from web applications to artificial intelligence. This comprehensive program takes you from writing your first line of code to building production-ready applications. Python\'s elegant syntax and powerful libraries make it the ideal first language and a must-have skill for developers, data scientists, and automation engineers alike.',
    duration: '3 Months',
    icon: Code,
    category: 'Programming',
    level: 'Beginner to Intermediate',
    certifications: ['PCEP - Certified Entry-Level Python Programmer', 'PCAP - Certified Associate in Python Programming', 'Microsoft Technology Associate - Python', 'IBM Python for Data Science Certificate'],
    salary: '₹4 - 12 LPA',
    highlights: [
      'Python 3.x fundamentals with industry best practices',
      'Object-oriented programming and design patterns',
      'File handling, automation, and scripting',
      'Web scraping and data extraction techniques',
      'Web framework introduction (Django/Flask)',
      'Data manipulation with Pandas and NumPy'
    ],
    curriculum: [
      { module: 'Python Fundamentals', topics: ['Variables, data types, operators', 'Control flow and loops', 'Functions and modules', 'List comprehensions', 'Error handling', 'Virtual environments'] },
      { module: 'Object-Oriented Python', topics: ['Classes and objects', 'Inheritance and polymorphism', 'Magic methods', 'Abstract classes', 'Design patterns in Python'] },
      { module: 'Advanced Python', topics: ['Decorators and generators', 'Context managers', 'Regular expressions', 'Multithreading basics', 'File I/O and serialization'] },
      { module: 'Python Applications', topics: ['Web scraping (BeautifulSoup, Scrapy)', 'API interaction', 'Automation scripts', 'Flask/Django basics', 'Data analysis with Pandas'] }
    ],
    careers: ['Python Developer', 'Automation Engineer', 'Backend Developer', 'Data Analyst', 'DevOps Engineer', 'QA Automation Engineer'],
    prerequisites: 'Basic computer knowledge. No prior programming experience required.',
    projects: ['Automation script suite', 'Web scraper for data collection', 'REST API development', 'Data analysis project']
  },

  'web-designing': {
    title: 'Web Designing',
    tagline: 'Craft Beautiful & Responsive Web Experiences',
    description: 'Learn to create visually stunning, responsive websites that captivate users across all devices. This program focuses on modern web design principles, CSS frameworks, and the latest frontend technologies. You\'ll develop an eye for design while mastering the technical skills to bring creative visions to life, preparing you for roles in web design studios and digital agencies.',
    duration: '3 Months',
    icon: Globe,
    category: 'Web Development',
    level: 'Beginner',
    certifications: ['Adobe Certified Professional - Web Design', 'W3Schools HTML/CSS Certification', 'freeCodeCamp Responsive Web Design', 'Google UX Design Certificate'],
    salary: '₹2.5 - 6 LPA',
    highlights: [
      'HTML5 semantic markup and accessibility standards',
      'CSS3 advanced styling including Grid and Flexbox',
      'Responsive design and mobile-first methodology',
      'CSS frameworks (Bootstrap 5, Tailwind CSS)',
      'Basic JavaScript for interactivity',
      'Design tools and prototyping'
    ],
    curriculum: [
      { module: 'HTML5 Mastery', topics: ['Semantic elements', 'Forms and validation', 'Accessibility (WCAG)', 'SEO-friendly markup', 'Media elements'] },
      { module: 'CSS3 Advanced', topics: ['Flexbox layouts', 'CSS Grid systems', 'Animations and transitions', 'CSS variables', 'Responsive typography', 'Media queries'] },
      { module: 'CSS Frameworks', topics: ['Bootstrap 5 components', 'Tailwind CSS utility classes', 'Custom theming', 'Component libraries'] },
      { module: 'Design & Deployment', topics: ['Color theory application', 'UI design principles', 'Figma basics', 'Version control with Git', 'Web hosting and deployment'] }
    ],
    careers: ['Web Designer', 'UI Designer', 'Frontend Developer', 'Email Template Designer', 'WordPress Developer'],
    prerequisites: 'Basic computer knowledge.',
    projects: ['Personal portfolio website', 'Business landing page', 'Responsive e-commerce mockup', 'Email newsletter template']
  },

  'web-development': {
    title: 'Full Stack Web Development',
    tagline: 'Build Production-Ready Web Applications',
    description: 'Become a complete web developer capable of building full-featured web applications from scratch. This intensive program covers the entire web development stack—React.js for dynamic frontends, Node.js for scalable backends, and both SQL and NoSQL databases. You\'ll learn industry workflows, collaborate using Git, and deploy applications to cloud platforms.',
    duration: '6 Months',
    icon: Code,
    category: 'Web Development',
    level: 'Intermediate',
    certifications: ['Meta Front-End Developer Certificate', 'Meta Back-End Developer Certificate', 'MongoDB Certified Developer', 'AWS Certified Cloud Practitioner', 'Node.js Certified Developer'],
    salary: '₹5 - 18 LPA',
    highlights: [
      'React.js with hooks, context, and Redux',
      'Node.js and Express.js backend development',
      'MongoDB and PostgreSQL database management',
      'RESTful API and GraphQL implementation',
      'Authentication, authorization, and security',
      'Docker and cloud deployment'
    ],
    curriculum: [
      { module: 'Advanced Frontend', topics: ['React.js fundamentals', 'Hooks and custom hooks', 'State management (Redux Toolkit)', 'React Router v6', 'API integration', 'Performance optimization'] },
      { module: 'Backend Engineering', topics: ['Node.js event loop', 'Express.js middleware', 'RESTful API design', 'GraphQL basics', 'Error handling patterns', 'Security best practices'] },
      { module: 'Database Design', topics: ['MongoDB document modeling', 'Mongoose ODM', 'PostgreSQL advanced queries', 'Database indexing', 'Data relationships', 'Caching with Redis'] },
      { module: 'Full Stack Integration', topics: ['JWT authentication', 'OAuth 2.0 integration', 'File upload handling', 'Real-time with WebSockets', 'Docker containerization', 'CI/CD deployment'] }
    ],
    careers: ['Full Stack Developer', 'MERN Stack Developer', 'Backend Developer', 'Frontend Developer', 'Software Engineer', 'Technical Consultant'],
    prerequisites: 'HTML, CSS, JavaScript basics. Programming fundamentals.',
    projects: ['E-commerce platform', 'Social media application', 'Project management tool', 'Real-time chat application']
  },

  'digital-marketing': {
    title: 'Digital Marketing',
    tagline: 'Data-Driven Marketing Excellence',
    description: 'Master the art and science of digital marketing with a focus on measurable results. This comprehensive program covers every aspect of online marketing—from SEO and content strategy to paid advertising and marketing automation. You\'ll learn to create data-driven campaigns that generate leads, drive conversions, and deliver ROI across all digital channels.',
    duration: '4 Months',
    icon: TrendingUp,
    category: 'Marketing',
    level: 'Beginner to Intermediate',
    certifications: ['Google Ads Search Certification', 'Google Ads Display Certification', 'Google Analytics Certification', 'Meta Certified Digital Marketing Associate', 'HubSpot Inbound Marketing Certification', 'Hootsuite Social Marketing Certification', 'SEMrush SEO Toolkit Certification'],
    salary: '₹3 - 10 LPA',
    highlights: [
      'Search Engine Optimization (Technical + On-page + Off-page)',
      'Google Ads mastery (Search, Display, Shopping, Video)',
      'Social media advertising (Meta, LinkedIn, Twitter)',
      'Content marketing and copywriting',
      'Email marketing automation',
      'Analytics, attribution, and ROI measurement'
    ],
    curriculum: [
      { module: 'SEO Mastery', topics: ['Keyword research tools', 'On-page optimization', 'Technical SEO audit', 'Link building strategies', 'Local SEO', 'Core Web Vitals'] },
      { module: 'Paid Advertising', topics: ['Google Ads account structure', 'Search campaign optimization', 'Display and remarketing', 'Shopping campaigns', 'YouTube advertising', 'Bid strategies'] },
      { module: 'Social Media Marketing', topics: ['Platform-specific strategies', 'Meta Ads Manager', 'LinkedIn advertising', 'Content calendar creation', 'Community management', 'Influencer marketing'] },
      { module: 'Analytics & Automation', topics: ['Google Analytics 4', 'Tag Manager setup', 'Conversion tracking', 'A/B testing', 'Marketing automation tools', 'Reporting dashboards'] }
    ],
    careers: ['Digital Marketing Manager', 'SEO Specialist', 'PPC Specialist', 'Social Media Manager', 'Content Marketing Manager', 'Growth Marketing Manager'],
    prerequisites: 'Basic computer and internet knowledge.',
    projects: ['Complete SEO audit', 'Google Ads campaign', 'Social media strategy', 'Marketing analytics dashboard']
  },

  'graphic-designing': {
    title: 'Graphic Designing',
    tagline: 'Visual Communication & Brand Design',
    description: 'Develop your creative potential and master industry-standard design tools in this comprehensive graphic design program. From brand identity to digital media, you\'ll learn to communicate ideas visually and create compelling designs that resonate with audiences. Build a professional portfolio that showcases your unique creative voice.',
    duration: '3 Months',
    icon: Palette,
    category: 'Design',
    level: 'Beginner to Intermediate',
    certifications: ['Adobe Certified Professional - Photoshop', 'Adobe Certified Professional - Illustrator', 'Adobe Certified Professional - InDesign', 'Canva Design Certification', 'Coursera Graphic Design Specialization'],
    salary: '₹2.5 - 8 LPA',
    highlights: [
      'Adobe Photoshop advanced techniques',
      'Adobe Illustrator vector mastery',
      'Brand identity and logo design',
      'Print design (brochures, packaging)',
      'Social media and digital graphics',
      'Professional portfolio development'
    ],
    curriculum: [
      { module: 'Design Principles', topics: ['Elements of design', 'Color theory', 'Typography fundamentals', 'Composition and layout', 'Visual hierarchy', 'Design psychology'] },
      { module: 'Adobe Photoshop', topics: ['Layer management', 'Selection techniques', 'Photo retouching', 'Compositing', 'Digital painting', 'Export optimization'] },
      { module: 'Adobe Illustrator', topics: ['Pen tool mastery', 'Logo design process', 'Icon creation', 'Pattern design', 'Typography design', 'Print preparation'] },
      { module: 'Brand & Portfolio', topics: ['Brand identity development', 'Style guide creation', 'Mockup presentation', 'Portfolio curation', 'Client communication'] }
    ],
    careers: ['Graphic Designer', 'Visual Designer', 'Brand Designer', 'Marketing Designer', 'Packaging Designer', 'Freelance Designer'],
    prerequisites: 'Basic computer knowledge. Interest in visual arts.',
    projects: ['Complete brand identity', 'Social media design kit', 'Print marketing materials', 'Portfolio website']
  },

  'data-analytics': {
    title: 'Data Analytics',
    tagline: 'Transform Data into Business Intelligence',
    description: 'Learn to extract actionable insights from complex datasets and drive business decisions through data. This program combines statistical analysis, visualization, and business intelligence tools to prepare you for one of the most in-demand roles in the modern economy. You\'ll work with real datasets and learn to tell compelling stories with data.',
    duration: '4 Months',
    icon: Database,
    category: 'Analytics',
    level: 'Beginner to Intermediate',
    certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Data Analyst Associate (Power BI)', 'IBM Data Analyst Professional Certificate', 'Tableau Desktop Specialist', 'SAS Certified Specialist'],
    salary: '₹4 - 12 LPA',
    highlights: [
      'Advanced Excel for business analytics',
      'SQL for data extraction and manipulation',
      'Python for data analysis (Pandas, NumPy)',
      'Data visualization (Tableau, Power BI)',
      'Statistical analysis and hypothesis testing',
      'Business intelligence and reporting'
    ],
    curriculum: [
      { module: 'Excel Analytics', topics: ['Advanced formulas', 'Pivot Tables', 'Power Query', 'Data modeling', 'What-if analysis', 'Dashboard creation'] },
      { module: 'SQL for Analytics', topics: ['Complex queries', 'Joins and subqueries', 'Window functions', 'CTEs', 'Query optimization', 'Stored procedures'] },
      { module: 'Python for Data', topics: ['Pandas fundamentals', 'Data cleaning', 'Exploratory analysis', 'NumPy operations', 'Matplotlib/Seaborn', 'Jupyter notebooks'] },
      { module: 'Visualization & BI', topics: ['Tableau fundamentals', 'Power BI reports', 'Dashboard design', 'Storytelling with data', 'KPI development', 'Presentation skills'] }
    ],
    careers: ['Data Analyst', 'Business Analyst', 'BI Analyst', 'Marketing Analyst', 'Financial Analyst', 'Operations Analyst'],
    prerequisites: 'Basic computer knowledge. Numerical aptitude.',
    projects: ['Sales performance dashboard', 'Customer segmentation analysis', 'Financial reporting system', 'Marketing campaign analysis']
  },

  'ethical-hacking': {
    title: 'Ethical Hacking',
    tagline: 'Offensive Security & Penetration Testing',
    description: 'Master the art of ethical hacking and become a certified penetration tester. This intensive program teaches you to think like an attacker to defend organizations from cyber threats. You\'ll learn industry-standard methodologies, work with professional tools, and conduct simulated attacks in controlled environments. Prepare for one of the most exciting and rewarding careers in cybersecurity.',
    duration: '6 Months',
    icon: Shield,
    category: 'Cybersecurity',
    level: 'Intermediate to Advanced',
    certifications: ['EC-Council Certified Ethical Hacker (CEH)', 'CompTIA PenTest+', 'Offensive Security Certified Professional (OSCP)', 'GIAC Penetration Tester (GPEN)', 'Certified Penetration Testing Professional (CPENT)', 'eLearnSecurity Junior Penetration Tester (eJPT)'],
    salary: '₹6 - 20 LPA',
    highlights: [
      'Penetration testing methodology (PTES, OWASP)',
      'Advanced reconnaissance and OSINT techniques',
      'Exploitation frameworks (Metasploit, Cobalt Strike)',
      'Web application security testing (OWASP Top 10)',
      'Wireless and network penetration testing',
      'Report writing and client communication'
    ],
    curriculum: [
      { module: 'Security Foundations', topics: ['CIA triad and security principles', 'Attack lifecycle', 'Threat modeling', 'Legal and ethical considerations', 'Lab environment setup'] },
      { module: 'Reconnaissance & Scanning', topics: ['Passive reconnaissance', 'OSINT techniques', 'Active scanning (Nmap)', 'Vulnerability assessment', 'Enumeration techniques'] },
      { module: 'Exploitation', topics: ['Metasploit Framework', 'Payload development', 'Privilege escalation', 'Post-exploitation', 'Persistence mechanisms', 'Lateral movement'] },
      { module: 'Web Application Security', topics: ['OWASP Top 10', 'SQL injection', 'XSS attacks', 'Authentication bypass', 'API security testing', 'Burp Suite mastery'] },
      { module: 'Specialized Testing', topics: ['Wireless security', 'Social engineering', 'Physical security', 'Cloud penetration testing', 'Mobile app testing'] }
    ],
    careers: ['Ethical Hacker', 'Penetration Tester', 'Security Consultant', 'Red Team Operator', 'Vulnerability Researcher', 'Application Security Engineer'],
    prerequisites: 'Networking fundamentals. Linux basics recommended.',
    projects: ['Full penetration test engagement', 'Web application security assessment', 'Wireless security audit', 'Social engineering campaign']
  },

  'soc-analyst': {
    title: 'SOC Analyst',
    tagline: 'Security Operations & Threat Detection',
    description: 'Prepare for a frontline role in cybersecurity as a Security Operations Center analyst. This program trains you to monitor, detect, analyze, and respond to security incidents in real-time. You\'ll master SIEM platforms, develop threat hunting skills, and learn incident response procedures used by enterprise security teams worldwide.',
    duration: '6 Months',
    icon: Shield,
    category: 'Cybersecurity',
    level: 'Intermediate',
    certifications: ['CompTIA Security+', 'CompTIA CySA+ (Cybersecurity Analyst)', 'Splunk Core Certified User', 'IBM QRadar SIEM Foundation', 'Microsoft Security Operations Analyst (SC-200)', 'GIAC Security Essentials (GSEC)'],
    salary: '₹4 - 14 LPA',
    highlights: [
      'Security monitoring and alert triage',
      'SIEM platform mastery (Splunk, QRadar, Sentinel)',
      'Incident response and handling procedures',
      'Threat intelligence analysis',
      'Log analysis and correlation',
      'Security automation and orchestration (SOAR)'
    ],
    curriculum: [
      { module: 'SOC Fundamentals', topics: ['SOC roles and responsibilities', 'Security monitoring', 'Alert triage process', 'Escalation procedures', 'Shift handover', 'Documentation'] },
      { module: 'SIEM Platforms', topics: ['Splunk SPL queries', 'Dashboard creation', 'Correlation rules', 'Use case development', 'QRadar basics', 'Azure Sentinel'] },
      { module: 'Incident Response', topics: ['IR lifecycle (NIST)', 'Containment strategies', 'Evidence collection', 'Root cause analysis', 'Recovery procedures', 'Lessons learned'] },
      { module: 'Threat Analysis', topics: ['Threat intelligence platforms', 'IOC analysis', 'MITRE ATT&CK framework', 'Threat hunting techniques', 'Malware analysis basics'] }
    ],
    careers: ['SOC Analyst (L1/L2/L3)', 'Security Analyst', 'Incident Responder', 'Threat Hunter', 'Security Engineer', 'SIEM Engineer'],
    prerequisites: 'Basic networking and security knowledge.',
    projects: ['SOC playbook development', 'SIEM use case creation', 'Incident analysis report', 'Threat hunting exercise']
  },

  'ui-ux-designing': {
    title: 'UI/UX Design',
    tagline: 'User-Centered Design Excellence',
    description: 'Master the complete UX design process from user research to high-fidelity prototypes. This program combines design thinking methodology with hands-on tools like Figma to create intuitive, user-centered digital experiences. You\'ll learn to conduct user research, create wireframes, build interactive prototypes, and validate designs through testing.',
    duration: '4 Months',
    icon: Palette,
    category: 'Design',
    level: 'Beginner to Intermediate',
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Certification', 'Interaction Design Foundation Certification', 'Figma Professional Certification', 'Adobe XD Certification'],
    salary: '₹4 - 14 LPA',
    highlights: [
      'Design thinking and human-centered design',
      'User research methodologies',
      'Information architecture and user flows',
      'Figma advanced features and prototyping',
      'Usability testing and iteration',
      'Design system creation'
    ],
    curriculum: [
      { module: 'UX Foundations', topics: ['Design thinking process', 'User research methods', 'Personas and user journeys', 'Competitive analysis', 'Information architecture'] },
      { module: 'UI Design', topics: ['Visual design principles', 'Color and typography', 'Component design', 'Responsive design', 'Design systems', 'Accessibility'] },
      { module: 'Figma Mastery', topics: ['Interface design', 'Auto layout', 'Components and variants', 'Interactive prototyping', 'Design tokens', 'Collaboration'] },
      { module: 'Testing & Iteration', topics: ['Usability testing methods', 'A/B testing', 'Analytics integration', 'Design iteration', 'Stakeholder presentations', 'Portfolio development'] }
    ],
    careers: ['UX Designer', 'UI Designer', 'Product Designer', 'Interaction Designer', 'UX Researcher', 'Design Lead'],
    prerequisites: 'Basic design sense. No prior experience required.',
    projects: ['Mobile app redesign', 'Web application UI', 'Design system creation', 'UX case study']
  },

  'ms-office': {
    title: 'MS Office with AI Tools',
    tagline: 'Modern Productivity Suite Mastery',
    description: 'Master Microsoft Office Suite enhanced with modern AI capabilities. This program goes beyond basics to teach you advanced features, automation techniques, and AI-powered tools like Microsoft Copilot. Become a power user capable of dramatically improving workplace productivity and efficiency.',
    duration: '2 Months',
    icon: FileText,
    category: 'Productivity',
    level: 'Beginner to Intermediate',
    certifications: ['Microsoft Office Specialist - Word Expert', 'Microsoft Office Specialist - Excel Expert', 'Microsoft Office Specialist - PowerPoint', 'Microsoft 365 Certified: Fundamentals', 'IC3 Digital Literacy'],
    salary: '₹2 - 4 LPA',
    highlights: [
      'Microsoft Word advanced document automation',
      'Excel data analysis and business intelligence',
      'PowerPoint professional presentation design',
      'Outlook productivity optimization',
      'Microsoft 365 Copilot integration',
      'Cross-application workflows'
    ],
    curriculum: [
      { module: 'Word Expert', topics: ['Advanced formatting', 'Document templates', 'Mail merge mastery', 'Long document management', 'Forms and fields', 'Collaboration features'] },
      { module: 'Excel Expert', topics: ['Advanced formulas', 'Pivot Table analytics', 'Power Query', 'Dashboard design', 'Macro basics', 'What-if analysis'] },
      { module: 'PowerPoint & Outlook', topics: ['Presentation design', 'Animation techniques', 'Video integration', 'Email management', 'Calendar optimization', 'Task management'] },
      { module: 'AI & Productivity', topics: ['Copilot features', 'AI-assisted writing', 'Smart data analysis', 'Automation workflows', 'Teams integration'] }
    ],
    careers: ['Administrative Executive', 'Executive Assistant', 'Office Manager', 'Data Entry Specialist', 'Documentation Specialist'],
    prerequisites: 'Basic computer knowledge.',
    projects: ['Automated report system', 'Business dashboard', 'Professional presentation', 'Workflow automation']
  },

  'e-accounting': {
    title: 'E-Accounting (Tally Prime)',
    tagline: 'Computerized Accounting & GST Expert',
    description: 'Become proficient in computerized accounting with Tally Prime, India\'s most widely used accounting software. This program covers everything from basic bookkeeping to advanced GST compliance, inventory management, and financial reporting. Prepare for roles in accounting, taxation, and business management.',
    duration: '3 Months',
    icon: FileText,
    category: 'Accounting',
    level: 'Beginner to Intermediate',
    certifications: ['Tally Certified Professional', 'Tally Prime Professional', 'GST Practitioner Certification', 'Accounts Executive Certification', 'NACEN GST Certificate'],
    salary: '₹2.5 - 6 LPA',
    highlights: [
      'Tally Prime comprehensive training',
      'GST compliance and return filing',
      'TDS/TCS management',
      'Inventory and stock management',
      'Payroll processing',
      'MIS reporting and analysis'
    ],
    curriculum: [
      { module: 'Accounting Fundamentals', topics: ['Accounting principles', 'Journal entries', 'Ledger management', 'Trial balance', 'Final accounts', 'Cost concepts'] },
      { module: 'Tally Prime', topics: ['Company setup', 'Voucher entry', 'Inventory management', 'Order processing', 'Report generation', 'Data management'] },
      { module: 'GST in Tally', topics: ['GST configuration', 'GST invoicing', 'Input tax credit', 'GSTR-1, 2B, 3B', 'E-way bills', 'GST reconciliation'] },
      { module: 'Advanced Features', topics: ['TDS/TCS', 'Payroll management', 'Banking reconciliation', 'Multi-currency', 'Branch accounting', 'Audit features'] }
    ],
    careers: ['Accountant', 'Accounts Executive', 'GST Practitioner', 'Taxation Executive', 'Audit Assistant', 'Finance Executive'],
    prerequisites: 'Basic accounting knowledge preferred.',
    projects: ['Complete company accounts', 'GST compliance setup', 'Financial statements preparation', 'Payroll system implementation']
  },

  'ai-beginners': {
    title: 'AI for Beginners',
    tagline: 'Harness Artificial Intelligence in Your Work',
    description: 'Understand and leverage artificial intelligence tools to supercharge your productivity. This program demystifies AI for non-technical professionals, teaching you to use ChatGPT, image generators, and AI-powered tools effectively. Learn prompt engineering, understand AI capabilities and limitations, and integrate AI into your daily workflows.',
    duration: '2 Months',
    icon: Cpu,
    category: 'AI & ML',
    level: 'Beginner',
    certifications: ['Google AI Essentials', 'LinkedIn AI Academy Certificate', 'IBM AI Foundations for Business', 'Microsoft AI Fundamentals (AI-900)', 'Coursera AI for Everyone'],
    salary: '₹3 - 7 LPA',
    highlights: [
      'Understanding AI, ML, and generative AI concepts',
      'ChatGPT and LLM effective usage',
      'Prompt engineering techniques',
      'AI image and video generation tools',
      'AI in business applications',
      'Ethics and responsible AI use'
    ],
    curriculum: [
      { module: 'AI Fundamentals', topics: ['What is AI/ML', 'Types of AI', 'How LLMs work', 'AI capabilities', 'Limitations', 'Industry applications'] },
      { module: 'Generative AI Tools', topics: ['ChatGPT mastery', 'Claude, Gemini comparison', 'Image generation (DALL-E, Midjourney)', 'AI writing assistants', 'Presentation tools'] },
      { module: 'Prompt Engineering', topics: ['Effective prompting', 'Chain of thought', 'Role-based prompts', 'Iterative refinement', 'System prompts'] },
      { module: 'Practical Applications', topics: ['Content creation', 'Research assistance', 'Coding help', 'Data analysis', 'Workflow automation', 'Ethics and bias'] }
    ],
    careers: ['AI-Enhanced Professional', 'Content Creator', 'Marketing Specialist', 'Prompt Engineer (Entry)', 'Digital Consultant'],
    prerequisites: 'Basic computer and internet knowledge.',
    projects: ['AI content strategy', 'Prompt library creation', 'AI-powered workflow design', 'Comparative tool analysis']
  },

  'ai-engineering': {
    title: 'AI & Machine Learning Engineering',
    tagline: 'Build Intelligent Systems & Applications',
    description: 'Become an AI engineer capable of building, training, and deploying machine learning models. This advanced program covers the complete ML pipeline from data preprocessing to production deployment. You\'ll work with deep learning frameworks, natural language processing, and computer vision while learning MLOps best practices.',
    duration: '6 Months',
    icon: Cpu,
    category: 'AI & ML',
    level: 'Advanced',
    certifications: ['AWS Certified Machine Learning - Specialty', 'Google Cloud Professional ML Engineer', 'TensorFlow Developer Certificate', 'Microsoft Certified: Azure AI Engineer Associate', 'IBM Machine Learning Professional Certificate', 'Deep Learning Specialization (Coursera)'],
    salary: '₹8 - 25 LPA',
    highlights: [
      'Machine learning algorithms and mathematics',
      'Deep learning with TensorFlow and PyTorch',
      'Natural Language Processing (NLP)',
      'Computer Vision fundamentals',
      'Model optimization and deployment',
      'MLOps and production systems'
    ],
    curriculum: [
      { module: 'ML Foundations', topics: ['Linear algebra and statistics', 'Supervised learning', 'Unsupervised learning', 'Model evaluation', 'Feature engineering', 'Scikit-learn'] },
      { module: 'Deep Learning', topics: ['Neural network architecture', 'CNNs for vision', 'RNNs and LSTMs', 'Transformers', 'TensorFlow/PyTorch', 'GPU training'] },
      { module: 'NLP', topics: ['Text preprocessing', 'Word embeddings', 'Sequence models', 'Attention mechanisms', 'BERT and GPT', 'Hugging Face'] },
      { module: 'MLOps', topics: ['Model versioning', 'Experiment tracking (MLflow)', 'Model serving', 'Docker for ML', 'CI/CD for ML', 'Monitoring and maintenance'] }
    ],
    careers: ['Machine Learning Engineer', 'AI Engineer', 'Data Scientist', 'NLP Engineer', 'Computer Vision Engineer', 'MLOps Engineer'],
    prerequisites: 'Python proficiency. Statistics and linear algebra basics.',
    projects: ['End-to-end ML pipeline', 'NLP application', 'Computer vision model', 'Deployed ML system']
  },

  'spoken-english': {
    title: 'Spoken English',
    tagline: 'Professional Communication Excellence',
    description: 'Develop fluent English speaking skills essential for career advancement. This program focuses on practical communication—from casual conversations to professional presentations. Through structured practice, you\'ll build confidence, improve pronunciation, and learn to express ideas clearly in any situation.',
    duration: '3 Months',
    icon: Users,
    category: 'Soft Skills',
    level: 'Beginner to Intermediate',
    certifications: ['Cambridge English Qualifications', 'IELTS Preparation Certificate', 'TOEFL Preparation Certificate', 'Business English Certificate', 'Trinity College London Certification'],
    salary: 'Enhanced career prospects across all roles',
    highlights: [
      'Grammar and sentence construction',
      'Pronunciation and accent neutralization',
      'Vocabulary building (general and business)',
      'Conversation and discussion skills',
      'Presentation and public speaking',
      'Email and professional writing'
    ],
    curriculum: [
      { module: 'Grammar Foundation', topics: ['Tenses mastery', 'Sentence structures', 'Common errors', 'Articles and prepositions', 'Conditional sentences'] },
      { module: 'Speaking Skills', topics: ['Pronunciation practice', 'Intonation patterns', 'Fluency building', 'Conversation techniques', 'Active listening'] },
      { module: 'Vocabulary Development', topics: ['Word power building', 'Idioms and phrases', 'Business terminology', 'Industry-specific vocabulary'] },
      { module: 'Professional Communication', topics: ['Presentation skills', 'Meeting participation', 'Interview techniques', 'Email writing', 'Phone etiquette'] }
    ],
    careers: ['Enhanced communication in any profession', 'Customer-facing roles', 'Management positions', 'International opportunities'],
    prerequisites: 'Basic English reading ability.',
    projects: ['Prepared speech delivery', 'Group discussion participation', 'Professional presentation', 'Mock interview sessions']
  },

  'personality-development': {
    title: 'Personality Development',
    tagline: 'Unlock Your Full Potential',
    description: 'Transform your personal and professional presence through comprehensive personality development training. This program builds essential soft skills—from confidence and communication to leadership and emotional intelligence. Develop the interpersonal skills that distinguish high performers in any field.',
    duration: '2 Months',
    icon: Users,
    category: 'Soft Skills',
    level: 'All Levels',
    certifications: ['Soft Skills Certification', 'Leadership Development Certificate', 'Emotional Intelligence Certification', 'Professional Etiquette Certificate'],
    salary: 'Enhanced career growth and leadership opportunities',
    highlights: [
      'Self-confidence and self-esteem building',
      'Effective communication skills',
      'Body language and professional image',
      'Time management and productivity',
      'Emotional intelligence',
      'Leadership fundamentals'
    ],
    curriculum: [
      { module: 'Self Development', topics: ['Self-awareness', 'SWOT analysis', 'Goal setting (SMART)', 'Positive mindset', 'Overcoming limiting beliefs'] },
      { module: 'Communication', topics: ['Verbal communication', 'Non-verbal cues', 'Active listening', 'Assertiveness', 'Conflict resolution'] },
      { module: 'Professional Skills', topics: ['Time management', 'Stress management', 'Team collaboration', 'Problem-solving', 'Decision making'] },
      { module: 'Leadership', topics: ['Leadership styles', 'Motivation techniques', 'Delegation', 'Feedback skills', 'Building influence'] }
    ],
    careers: ['Leadership roles', 'Management positions', 'Client-facing roles', 'Team lead positions'],
    prerequisites: 'None. Open to all.',
    projects: ['Personal development plan', 'Leadership simulation', 'Team project execution', 'Public speaking exercise']
  },

  'interview-preparation': {
    title: 'Interview Preparation',
    tagline: 'Land Your Dream Job',
    description: 'Prepare comprehensively for job interviews and maximize your chances of success. This focused program covers every aspect of the interview process—from resume optimization to salary negotiation. Through mock interviews and personalized feedback, you\'ll build confidence and learn to present your best self to potential employers.',
    duration: '1 Month',
    icon: Briefcase,
    category: 'Career',
    level: 'All Levels',
    certifications: ['Interview Readiness Certificate', 'Career Development Certificate', 'Job Search Strategy Certificate'],
    salary: 'Higher starting offers through better negotiation',
    highlights: [
      'Resume and LinkedIn optimization',
      'Common interview questions mastery',
      'Technical interview preparation',
      'HR and behavioral round strategies',
      'Salary negotiation techniques',
      'Mock interview practice'
    ],
    curriculum: [
      { module: 'Preparation', topics: ['Resume writing (ATS-friendly)', 'LinkedIn optimization', 'Company research', 'Job search strategies', 'Application tracking'] },
      { module: 'Interview Skills', topics: ['Introduction and elevator pitch', 'STAR method for behavioral questions', 'Technical question strategies', 'Situational questions', 'Group discussions'] },
      { module: 'Practice', topics: ['Mock interviews (HR round)', 'Mock interviews (Technical)', 'Body language coaching', 'Virtual interview tips', 'Feedback and improvement'] },
      { module: 'Closing & Negotiation', topics: ['Questions to ask', 'Follow-up etiquette', 'Offer evaluation', 'Salary negotiation', 'Counter-offers'] }
    ],
    careers: ['Improved success rate for any IT job interview'],
    prerequisites: 'Should have completed or be pursuing a technical course.',
    projects: ['Optimized resume', 'LinkedIn profile makeover', 'Mock interview recordings', 'Personalized improvement plan']
  }
};

export async function generateStaticParams() {
  // Pre-generate all program pages at build time for best SEO
  return Object.keys(programsData).map((programId) => ({ programId }));
}

export async function generateMetadata({ params }) {
  const program = programsData[params.programId];

  if (!program) {
    return {
      title: 'Program Not Found',
      robots: { index: false, follow: false },
    };
  }

  const url = `https://www.etieducom.com/programs/${params.programId}`;
  const title = `${program.title} Course | ${program.duration} | ETI Educom®`;
  const description = `${program.title} — ${program.tagline}. ${program.description.slice(0, 160).trim()}…`;
  const keywords = [
    program.title,
    `${program.title} course`,
    `${program.title} training`,
    `${program.title} in Pathankot`,
    `${program.title} certification`,
    program.category,
    ...(program.certifications || []).slice(0, 5),
    'ETI Educom',
    'IT training Pathankot',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${program.title} - ETI Educom®`,
      description,
      url,
      type: 'website',
      siteName: 'ETI Educom',
      locale: 'en_IN',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `${program.title} - ETI Educom` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${program.title} - ETI Educom®`,
      description,
      images: ['/images/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default function ProgramDetailPage({ params }) {
  const program = programsData[params.programId];
  
  if (!program) {
    notFound();
  }

  const IconComponent = program.icon;
  const programUrl = `https://www.etieducom.com/programs/${params.programId}`;

  // SEO: Parse salary range for structured data (best-effort)
  const parseSalary = (str) => {
    if (!str) return null;
    const m = str.match(/₹\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (!m) return null;
    return { min: parseFloat(m[1]) * 100000, max: parseFloat(m[2]) * 100000 };
  };
  const salaryRange = parseSalary(program.salary);

  // JSON-LD: Course schema (rich-results eligible)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'ETI Educom',
      sameAs: 'https://www.etieducom.com',
      url: 'https://www.etieducom.com',
      logo: 'https://www.etieducom.com/images/logo-blue.png',
    },
    url: programUrl,
    educationalLevel: program.level,
    teaches: program.highlights,
    timeRequired: program.duration,
    coursePrerequisites: program.prerequisites,
    inLanguage: 'en-IN',
    isAccessibleForFree: false,
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: ['Onsite', 'Blended'],
        location: {
          '@type': 'Place',
          name: 'ETI Educom',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jodhamal Colony, Dhangu Road',
            addressLocality: 'Pathankot',
            addressRegion: 'Punjab',
            postalCode: '145001',
            addressCountry: 'IN',
          },
        },
        ...(program.duration ? { courseSchedule: program.duration } : {}),
      },
    ],
    offers: [
      {
        '@type': 'Offer',
        category: 'Paid',
        availability: 'https://schema.org/InStock',
        url: programUrl,
        priceCurrency: 'INR',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '5000',
      bestRating: '5',
      worstRating: '1',
    },
    ...(salaryRange
      ? {
          occupationalCredentialAwarded: program.certifications,
          educationalCredentialAwarded: program.certifications,
        }
      : {}),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.etieducom.com' },
      { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://www.etieducom.com/programs' },
      { '@type': 'ListItem', position: 3, name: program.title, item: programUrl },
    ],
  };

  // JSON-LD: FAQ (using prerequisites + projects + certifications as Q&A)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the duration of the ${program.title} course?`,
        acceptedAnswer: { '@type': 'Answer', text: `The ${program.title} program at ETI Educom runs for ${program.duration}.` },
      },
      {
        '@type': 'Question',
        name: `What are the prerequisites for ${program.title}?`,
        acceptedAnswer: { '@type': 'Answer', text: program.prerequisites || 'No prior experience required.' },
      },
      {
        '@type': 'Question',
        name: `What career opportunities are available after the ${program.title} course?`,
        acceptedAnswer: { '@type': 'Answer', text: `After completing ${program.title}, you can pursue roles such as ${(program.careers || []).slice(0, 5).join(', ')}.` },
      },
      {
        '@type': 'Question',
        name: `Which certifications can I earn with the ${program.title} program?`,
        acceptedAnswer: { '@type': 'Answer', text: `Top certifications: ${(program.certifications || []).slice(0, 5).join(', ')}.` },
      },
      ...(program.salary
        ? [{
            '@type': 'Question',
            name: `What is the expected salary after ${program.title}?`,
            acceptedAnswer: { '@type': 'Answer', text: `Graduates of ${program.title} can expect ${program.salary} based on experience and certifications.` },
          }]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 lg:py-20">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                  {program.category}
                </span>
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                  {program.level}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{program.tagline}</p>
              <p className="text-blue-100 mb-8 leading-relaxed">{program.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Duration</p>
                  <p className="font-bold">{program.duration}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Salary Range</p>
                  <p className="font-bold text-sm">{program.salary}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-200">Level</p>
                  <p className="font-bold text-sm">{program.level}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#enquiry" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  Enroll Now
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a href="tel:+919646727676" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                  <Phone className="w-5 h-5" />
                  Call for Details
                </a>
              </div>
            </div>

            {/* Enquiry Form */}
            <div id="enquiry" className="lg:pl-8">
              <ProgramEnquiryForm programName={program.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Certification Options */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Industry Recognition
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certification Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Prepare for globally recognized certifications that validate your skills</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {program.certifications.map((cert, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl"
              >
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-800">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Highlights</h2>
            <p className="text-gray-600">Core skills and competencies you will develop</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {program.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-gray-700 font-medium">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Layers className="w-4 h-4" />
              Structured Learning
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
            <p className="text-gray-600">Comprehensive module-wise breakdown of the program</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {program.curriculum.map((module, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{module.module}</h3>
                </div>
                <ul className="space-y-2">
                  {module.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Opportunities</h2>
              <p className="text-gray-600 mb-6">
                Roles you can pursue after completing this program:
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {program.careers.map((career, index) => (
                  <span 
                    key={index}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium"
                  >
                    {career}
                  </span>
                ))}
              </div>
              
              <div className="p-6 bg-white rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Expected Salary Range
                </h3>
                <p className="text-3xl font-bold text-primary">{program.salary}</p>
                <p className="text-sm text-gray-500 mt-2">*Based on industry standards and experience level</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Prerequisites */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Prerequisites
                </h3>
                <p className="text-gray-600">{program.prerequisites}</p>
              </div>

              {/* Projects */}
              {program.projects && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Hands-On Projects
                  </h3>
                  <ul className="space-y-3">
                    {program.projects.map((project, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <Zap className="w-4 h-4 text-primary" />
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with ETI Educom. 
            Enroll now and take the first step towards your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#enquiry" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Enroll Now
              <ChevronRight className="w-5 h-5" />
            </a>
            <Link href="/free-counselling" className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20">
              Get Free Counselling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
