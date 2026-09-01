import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-gray-500 mb-6">This page does not exist</p>
        <Link href="/" className="text-primary hover:underline">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
