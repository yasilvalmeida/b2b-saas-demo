/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@b2b-saas/dtos'],
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.200:4001',
  },
  // Allow external access
  experimental: {
    serverComponentsExternalPackages: ['@b2b-saas/dtos'],
  },
};

module.exports = nextConfig;
