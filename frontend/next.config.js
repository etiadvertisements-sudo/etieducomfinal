/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Real image optimization (AVIF/WebP, responsive sizes)
  // Was previously `unoptimized: true` — disabled all optimization, hurt LCP.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'etieducom.com' },
      { protocol: 'https', hostname: 'www.etieducom.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Forwards /api/* (incl. uploads & sitemaps that hit backend) to FastAPI
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
    ];
  },

  // Security headers — applied to every HTML response (sitemaps/api unaffected)
  async headers() {
    // Permissive CSP that supports GTM, GA4, Meta Pixel, Cloudinary, Unsplash,
    // YouTube embeds and your existing inline JSON-LD. Tighten further once
    // you've removed any third-party scripts you no longer need.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://www.etieducom.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.gstatic.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://static.cloudflareinsights.com",
      "connect-src 'self' https://www.etieducom.com https://etieducom.com https://api.msg91.com https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://www.google.com https://stats.g.doubleclick.net https://cloudflareinsights.com https://api.indexnow.org https://indexing.googleapis.com https://bms.etieducom.com https://www.facebook.com",
      "frame-src 'self' https://www.googletagmanager.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://*.facebook.com",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // X-Frame-Options DENY would block GTM iframe; rely on frame-ancestors above instead.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
