/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Serve static files from public directory
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Ensure static files are served correctly
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  // Disable automatic static optimization for HTML files
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
