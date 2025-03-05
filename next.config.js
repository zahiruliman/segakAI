/** @type {import('next').NextConfig} */

const nextConfig = {
  // Optimize image handling
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Router cache configuration
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  
  // PWA headers and caching
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 