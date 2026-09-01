// Compact program list used for programmatic SEO landing pages.
// Mirrors the slugs in /app/(site)/programs/[programId]/page.js → programsData.
// Keep this list in sync with that file.

export const PROGRAMS = [
  // Career Tracks
  { slug: 'it-foundation', title: 'IT Foundation', short: 'IT Foundation', duration: '6 Months', category: 'Career Track', priceFrom: 12000 },
  { slug: 'digital-design', title: 'Design & Marketing', short: 'Digital Design & Marketing', duration: '9-12 Months', category: 'Career Track', priceFrom: 25000 },
  { slug: 'it-networking', title: 'IT & Cybersecurity', short: 'IT Support & Networking', duration: '9-12 Months', category: 'Career Track', priceFrom: 28000 },
  { slug: 'software-development', title: 'Software Development', short: 'Full Stack Development', duration: '9-12 Months', category: 'Career Track', priceFrom: 35000 },

  // Tech Programs
  { slug: 'python', title: 'Python Programming', short: 'Python', duration: '3 Months', category: 'Programming', priceFrom: 8000 },
  { slug: 'web-designing', title: 'Web Designing', short: 'Web Design', duration: '3 Months', category: 'Web Development', priceFrom: 7000 },
  { slug: 'web-development', title: 'Full Stack Web Development', short: 'Web Development', duration: '6 Months', category: 'Web Development', priceFrom: 18000 },
  { slug: 'data-analytics', title: 'Data Analytics', short: 'Data Analytics', duration: '4 Months', category: 'Analytics', priceFrom: 15000 },
  { slug: 'ai-beginners', title: 'AI for Beginners', short: 'AI for Beginners', duration: '2 Months', category: 'AI & ML', priceFrom: 6000 },
  { slug: 'ai-engineering', title: 'AI & Machine Learning Engineering', short: 'AI Engineering', duration: '6 Months', category: 'AI & ML', priceFrom: 30000 },

  // Design & Marketing
  { slug: 'digital-marketing', title: 'Digital Marketing', short: 'Digital Marketing', duration: '4 Months', category: 'Marketing', priceFrom: 14000 },
  { slug: 'graphic-designing', title: 'Graphic Designing', short: 'Graphic Design', duration: '3 Months', category: 'Design', priceFrom: 9000 },
  { slug: 'ui-ux-designing', title: 'UI/UX Design', short: 'UI/UX Design', duration: '4 Months', category: 'Design', priceFrom: 16000 },

  // Cybersecurity
  { slug: 'soc-analyst', title: 'SOC Analyst', short: 'SOC Analyst', duration: '6 Months', category: 'Cybersecurity', priceFrom: 22000 },
  { slug: 'ethical-hacking', title: 'Ethical Hacking', short: 'Ethical Hacking', duration: '6 Months', category: 'Cybersecurity', priceFrom: 24000 },

  // Office & Accounting
  { slug: 'ms-office', title: 'MS Office with AI Tools', short: 'MS Office', duration: '2 Months', category: 'Productivity', priceFrom: 5000 },
  { slug: 'e-accounting', title: 'E-Accounting (Tally Prime)', short: 'Tally / E-Accounting', duration: '3 Months', category: 'Accounting', priceFrom: 9000 },

  // Soft Skills
  { slug: 'spoken-english', title: 'Spoken English', short: 'Spoken English', duration: '3 Months', category: 'Soft Skills', priceFrom: 6000 },
  { slug: 'personality-development', title: 'Personality Development', short: 'Personality Development', duration: '2 Months', category: 'Soft Skills', priceFrom: 5000 },
  { slug: 'interview-preparation', title: 'Interview Preparation', short: 'Interview Prep', duration: '1 Month', category: 'Career', priceFrom: 4000 },
];

export const PROGRAM_BY_SLUG = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p]));

export const PROGRAM_SLUGS = PROGRAMS.map((p) => p.slug);
