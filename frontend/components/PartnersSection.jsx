'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { cloudImg } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const defaultCertificationPartners = [
  { id: '1', name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/200px-Adobe_Corporate_Logo.png', type: 'certification' },
  { id: '2', name: 'Autodesk', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Autodesk_Logo.svg/200px-Autodesk_Logo.svg.png', type: 'certification' },
  { id: '3', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png', type: 'certification' },
  { id: '4', name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png', type: 'certification' },
  { id: '5', name: 'Tally', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Tally_-_Logo.svg/200px-Tally_-_Logo.svg.png', type: 'certification' },
  { id: '6', name: 'QuickBooks', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/QuickBooks_logo.png/200px-QuickBooks_logo.png', type: 'certification' },
  { id: '7', name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/200px-Cisco_logo_blue_2016.svg.png', type: 'certification' },
  { id: '8', name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png', type: 'certification' },
  { id: '9', name: 'EC-Council', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/EC-Council_Logo.svg/200px-EC-Council_Logo.svg.png', type: 'certification' },
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
