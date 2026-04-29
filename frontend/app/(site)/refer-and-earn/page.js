import Link from 'next/link';
import { Gift, ArrowRight } from 'lucide-react';
import ReferAndEarnClient from '@/components/ReferAndEarnClient';

export const metadata = {
  title: 'Refer & Earn | Earn Cash Rewards for Referrals',
  description: 'Refer friends and family to ETI Educom® and earn up to Rs. 2,000 per referral. Help others build careers while you earn rewards.',
  keywords: 'refer and earn, referral program, ETI Educom rewards, cash rewards referral',
  openGraph: {
    title: 'Refer & Earn - ETI Educom®',
    description: 'Refer friends and earn cash rewards up to Rs. 2,000 per referral.',
    url: 'https://etieducom.com/refer-and-earn',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://etieducom.com/refer-and-earn' },
};

export default function ReferAndEarnPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gift className="w-4 h-4" />
            Referral Program
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Refer Friends. <span className="text-yellow-400">Earn Rewards.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Know someone who wants to upgrade their skills? Refer them to ETI Educom 
            and earn cash rewards for every successful enrollment!
          </p>
          
          <a href="#refer-form" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Refer Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Client Component with How It Works, Rewards & Form */}
      <ReferAndEarnClient />

      {/* Terms */}
      <section className="py-12 bg-gray-100">
        <div className="container-main">
          <div className="text-center text-sm text-gray-500">
            <p>* Terms & Conditions apply. Reward will be credited 30 days after the referred student joins.</p>
            <p className="mt-1">Contact our team for more details about the referral program.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
