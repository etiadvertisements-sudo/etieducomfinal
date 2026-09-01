'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const defaultCertificationPartners = [
  { id: '1', name: 'Adobe', logo: null, type: 'certification' },
  { id: '2', name: 'Autodesk', logo: null, type: 'certification' },
  { id: '3', name: 'Microsoft', logo: null, type: 'certification' },
  { id: '4', name: 'Meta', logo: null, type: 'certification' },
  { id: '5', name: 'Tally', logo: null, type: 'certification' },
  { id: '6', name: 'QuickBooks', logo: null, type: 'certification' },
  { id: '7', name: 'Cisco', logo: null, type: 'certification' },
  { id: '8', name: 'IBM', logo: null, type: 'certification' },
  { id: '9', name: 'EC-Council', logo: null, type: 'certification' },
];

export default function PartnersSection() {
  const [certificationPartners, setCertificationPartners] = useState(defaultCertificationPartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${API_URL}/api/partners`);
        if (response.ok) {
          const data = await response.json();
          const certPartners = data.filter(p => p.type === 'certification' || p.partner_type === 'certification');
          if (certPartners.length > 0) setCertificationPartners(certPartners);
        }
      } catch (error) {
        console.log('Using default partners');
      }
    };
    fetchPartners();
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container-main">
        {/* Certification Partners */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Our Certification Partners</h3>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              {certificationPartners.map((partner) => (
                <div 
                  key={partner.id}
                  className="flex items-center justify-center h-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  {(partner.logo || partner.logo_url) ? (
                    <Image
                      src={cloudImg(partner.logo || partner.logo_url, 'logo')}
                      alt={partner.name}
                      width={120}
                      height={48}
                      unoptimized
                      className="h-10 w-auto object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
