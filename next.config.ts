import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Placeholder image.
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },

      // Book cover images.
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
      },

      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
