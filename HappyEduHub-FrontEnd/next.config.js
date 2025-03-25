/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'drive.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
