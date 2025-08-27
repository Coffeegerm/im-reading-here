/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@im-reading-here/shared'],
  images: {
    domains: ['covers.openlibrary.org', 'books.google.com'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
