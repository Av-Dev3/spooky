/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Ensure API routes are properly handled
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
