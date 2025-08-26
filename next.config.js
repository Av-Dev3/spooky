/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  trailingSlash: true,
  // Serve static files from public directory
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ];
  }
};
module.exports = nextConfig;
