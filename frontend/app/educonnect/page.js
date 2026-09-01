import EduConnectLanding from '@/components/EduConnectLanding';

export const metadata = {
  title: 'ETI EduConnect | Distance Learning Programs from Top Universities',
  description: 'Your gateway to distance learning programs from top universities. Get UG, PG, Diploma, and Certification courses through ETI EduConnect.',
  keywords: 'distance learning, online degree, UG courses, PG courses, MBA distance, BBA distance, top universities',
  openGraph: {
    title: 'ETI EduConnect - Distance Learning Programs',
    description: 'Your gateway to distance learning programs from top universities across India.',
    url: 'https://www.etieducom.com/educonnect',
  },
};

export default function EduConnectPage() {
  return <EduConnectLanding />;
}
