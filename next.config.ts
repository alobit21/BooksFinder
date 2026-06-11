import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/b/id/**',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/a/id/**',
      },
      {
        protocol: 'https',
        hostname: 'ia601601.us.archive.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'archive.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Faster dev builds - skip type checking in dev
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Optimize development
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
