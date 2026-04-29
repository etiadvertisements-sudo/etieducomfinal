import WarriorsAssessmentClient from '@/components/WarriorsAssessmentClient';

export const metadata = {
  title: 'Cyber Warrior Assessment | Test Your Cybersecurity Knowledge | ETI Educom®',
  description: 'Take the free Cyber Warriors assessment quiz and earn your certificate! Test your cybersecurity awareness with 10 questions. Score 7+ to become a certified Cyber Warrior.',
  keywords: 'cyber warrior assessment, cybersecurity quiz, free certificate, cyber awareness test, digital safety quiz',
  openGraph: {
    title: 'Cyber Warrior Assessment - ETI Educom®',
    description: 'Test your cybersecurity knowledge and earn your Cyber Warrior certificate!',
    url: 'https://etieducom.com/warriors',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://etieducom.com/warriors' },
};

export default function WarriorsPage() {
  return <WarriorsAssessmentClient />;
}
