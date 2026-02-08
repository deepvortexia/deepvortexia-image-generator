/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbxt.replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.com',
        pathname: '/**',
      },
    ],
    domains: [
      'replicate.delivery',
      'pbxt.replicate.delivery',
      'replicate.com',
    ],
  },
  // Disable strict mode to prevent double-rendering which can cause issues with Replicate API calls
  reactStrictMode: false,
};

export default nextConfig;
