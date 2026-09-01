import Link from 'next/link';

export const metadata = {
  title: 'Course Page Not Found | ETI Educom',
  robots: { index: false, follow: false },
};

export default function CourseNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" data-testid="course-not-found">
      <h1 className="text-3xl font-bold text-gray-900">Course Not Found</h1>
      <p className="text-gray-500 max-w-md">
        The course / city combination you’re looking for doesn’t exist. Browse our full programmes catalog instead.
      </p>
      <Link href="/programs" className="text-primary font-semibold hover:underline">
        View All Programmes
      </Link>
    </div>
  );
}
