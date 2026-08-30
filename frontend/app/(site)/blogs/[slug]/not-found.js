import Link from 'next/link';

export const metadata = {
  title: 'Blog Not Found | ETI Educom',
  robots: { index: false, follow: false },
};

export default function BlogNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
      data-testid="blog-not-found"
    >
      <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
      <p className="text-gray-500 max-w-md">
        The article you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/blogs"
        className="text-primary font-semibold hover:underline"
        data-testid="back-to-blogs-link"
      >
        Back to All Articles
      </Link>
    </div>
  );
}
