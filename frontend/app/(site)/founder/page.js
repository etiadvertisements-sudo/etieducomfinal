import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Users } from 'lucide-react';

export const metadata = {
  title: "Founder's Desk | Leadership Message",
  description: 'A message from the founder of ETI Educom® on building structured computer career education in India.',
  keywords: 'ETI Educom founder, leadership, computer career school, IT education vision',
  openGraph: {
    title: "Founder's Desk - ETI Educom®",
    description: 'The vision behind ETI Educom® - Building Computer Careers.',
    url: 'https://www.etieducom.com/founder',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.etieducom.com/founder' },
};

const coreBeliefs = [
  'Structured education creates sustainable careers',
  'Discipline in academics leads to excellence in careers',
  'Global certifications open global opportunities',
  'Transparent practices build lasting trust'
];

export default function FounderPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Leadership
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              From the Founder&apos;s <span className="text-primary">Desk</span>
            </h1>
            <p className="text-xl text-gray-600">
              A message from the leadership of ETI Educom®
            </p>
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image - Sticky on desktop */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/founder.jpg"
                    alt="Krishna Mahajan - Founder ETI Educom"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover max-h-[500px] object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary text-white p-5 rounded-xl shadow-lg hidden md:block">
                  <p className="text-xl font-bold">Since 2017</p>
                  <p className="text-blue-100 text-sm">Building Computer Careers</p>
                </div>
              </div>
              <div className="text-center lg:text-left pt-2">
                <h3 className="text-2xl font-bold text-gray-900">Krishna Mahajan</h3>
                <p className="text-lg text-primary font-medium">Founder & Managing Director</p>
                <p className="text-gray-600">ETI Educom®</p>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <div className="text-6xl text-primary/20 font-serif leading-none mb-4">&ldquo;</div>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium">
                  In an era where technology shapes every aspect of our lives, structured 
                  computer education has become not just relevant, but essential.
                </p>
                
                <p>
                  When I founded ETI Educom® in 2017, the vision was clear — to build an 
                  institution, not just another training center. The Indian education landscape 
                  is filled with coaching institutes that promise quick results but lack the 
                  foundational structure needed for lasting career success.
                </p>
                
                <p>
                  At ETI Educom®, we took a different path. We created defined Career Tracks 
                  instead of disconnected courses. We established centralized academic governance 
                  instead of franchise-dependent quality. We partnered with global certification 
                  bodies instead of offering generic certificates.
                </p>
                
                <p>
                  Our journey has been guided by a simple principle: <strong className="text-gray-900">build careers, 
                  not sell courses</strong>. Every curriculum we design, every partnership we form, 
                  and every student we train reflects this commitment.
                </p>
                
                <p>
                  Today, with over 5000 successful learners, we continue to expand our reach 
                  while maintaining the discipline and structure that defines us. Our goal 
                  remains the same — to be India&apos;s most trusted Computer Career School.
                </p>
                
                <p className="text-lg font-semibold text-gray-900 pt-4">
                  Together, we are building India&apos;s Computer Career Ecosystem.
                </p>
              </div>

              {/* Core Beliefs */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-4">Our Core Beliefs</h4>
                <ul className="space-y-3">
                  {coreBeliefs.map((belief, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{belief}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Be part of India&apos;s growing Computer Career ecosystem.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/programs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Explore Programs
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/franchise" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
