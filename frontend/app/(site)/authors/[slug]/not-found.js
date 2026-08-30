import Link from 'next/link';

export const metadata = {
  title: 'Author Not Found | ETI Educom',
  robots: { index: false, follow: false },
};

export default function AuthorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Author Not Found</h1>
      <p className="text-gray-500 max-w-md">This author profile doesn’t exist.</p>
      <Link href="/blogs" className="text-primary font-semibold hover:underline">Browse all articles</Link>
    </div>
  );
}
