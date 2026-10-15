'use client';

import { useState, useEffect } from 'react';
import { Award, Briefcase } from 'lucide-react';
import { cloudImg } from '@/lib/utils';
import Marquee from '@/components/Marquee';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const P = '/images/partners';

const defaultCertificationPartners = [
  { id: '1', name: 'Adobe', logo_url: `${P}/adobe.svg` },
  { id: '2', name: 'Autodesk', logo_url: `${P}/autodesk.png` },
  { id: '3', name: 'Microsoft', logo_url: `${P}/microsoft.svg` },
  { id: '4', name: 'Meta', logo_url: `${P}/meta.svg` },
  { id: '5', name: 'Tally', logo_url: `${P}/tally.png` },
  { id: '6', name: 'QuickBooks', logo_url: `${P}/quickbooks.png` },
  { id: '7', name: 'Cisco', logo_url: `${P}/cisco.svg` },
  { id: '8', name: 'IBM', logo_url: `${P}/ibm.svg` },
  { id: '9', name: 'EC-Council', logo_url: `${P}/eccouncil.png` },
];

const typeOf = (p) => p.partner_type || p.type;

function LogoTile({ partner }) {
  const src = partner.logo || partner.logo_url;
  return (
    <div
      className="h-20 w-44 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center px-5 transition-transform duration-300 hover:-translate-y-1"
      data-testid="partner-logo"
      title={partner.name}
    >
      {src ? (
        <img src={cloudImg(src, 'logo')} alt={partner.name} loading="lazy" className="max-h-10 max-w-full object-contain" />
      ) : (
        <span className="text-gray-700 font-semibold">{partner.name}</span>
      )}
    </div>
  );
}

function Row({ icon: Icon, title, items, testid }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <Marquee items={items} testid={testid} duration={35} renderItem={(p) => <LogoTile partner={p} />} />
    </div>
  );
}

export default function PartnersSection() {
  const [certificationPartners, setCertificationPartners] = useState(defaultCertificationPartners);
  const [placementPartners, setPlacementPartners] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/partners`);
        if (!response.ok) return;
        const data = await response.json();
        const cert = data.filter((p) => typeOf(p) === 'certification');
        if (cert.length > 0) setCertificationPartners(cert);
        setPlacementPartners(data.filter((p) => typeOf(p) === 'placement'));
      } catch {}
    })();
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden" data-testid="partners-section">
      <div className="container-main space-y-14">
        <Row icon={Award} title="Our Certification Partners" items={certificationPartners} testid="certification-partners-marquee" />
        {placementPartners.length > 0 && (
          <Row icon={Briefcase} title="Our Placement Partners" items={placementPartners} testid="placement-partners-marquee" />
        )}
      </div>
    </section>
  );
}
