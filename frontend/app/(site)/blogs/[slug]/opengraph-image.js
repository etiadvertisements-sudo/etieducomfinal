import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'ETI Educom Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  'http://localhost:8001';

async function fetchBlog(slug) {
  try {
    const res = await fetch(`${SERVER_API_BASE}/api/blogs/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function OgImage({ params }) {
  const blog = await fetchBlog(params.slug);
  const title = (blog?.meta_title || blog?.title || 'ETI Educom Blog').slice(0, 100);
  const category = (blog?.category || 'Knowledge Hub').slice(0, 40);
  const author = (blog?.author || 'ETI Educom').slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #0b1d3a 0%, #1e3a8a 45%, #2563eb 100%)',
          color: 'white',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* category pill */}
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {category.toUpperCase()}
        </div>

        {/* title */}
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            fontSize: title.length > 60 ? 60 : 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* spacer */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 32,
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 22, opacity: 0.7 }}>
              by {author}
            </div>
            <div style={{ display: 'flex', fontSize: 38, fontWeight: 800, marginTop: 6 }}>
              ETI Educom
            </div>
            <div style={{ display: 'flex', fontSize: 20, opacity: 0.7, marginTop: 2 }}>
              The Computer Career School · Pathankot
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 26px',
              background: 'white',
              color: '#1e3a8a',
              fontWeight: 700,
              fontSize: 24,
              borderRadius: 14,
            }}
          >
            etieducom.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
