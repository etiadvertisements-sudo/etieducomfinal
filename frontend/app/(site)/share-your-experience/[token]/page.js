import ReviewSubmitForm from '@/components/ReviewSubmitForm';

const SITE_URL = 'https://www.etieducom.com';
const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

export const metadata = {
  title: 'Share Your Experience | ETI Educom',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/share-your-experience` },
};

async function fetchRequest(token) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/review-requests/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ShareYourExperiencePage({ params }) {
  const data = await fetchRequest(params.token);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link is invalid or expired</h1>
        <p className="text-gray-500 max-w-md">This review link cannot be opened. Please contact ETI Educom support if you believe this is a mistake.</p>
      </div>
    );
  }

  if (data.status === 'completed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you! 🌟</h1>
        <p className="text-gray-600 max-w-md">Your review has already been received. We appreciate your time.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ⭐ Your story matters
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hi {data.student_name}, share your experience
          </h1>
          <p className="text-gray-600">
            Your honest review of <strong>{data.course}</strong> at ETI Educom helps thousands of future students make the right choice.
          </p>
        </div>

        <ReviewSubmitForm token={params.token} studentName={data.student_name} course={data.course} />
      </div>
    </div>
  );
}
