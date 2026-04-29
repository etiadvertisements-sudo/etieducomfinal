import { redirect } from 'next/navigation';

export const metadata = {
  title: 'ETI EduConnect | Distance Learning Programs',
  description: 'Your gateway to distance learning programs from top universities.',
};

export default function EduConnectPage() {
  redirect('/educonnect');
}
