import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'images.unsplash.com',
         },
         {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
         },
         {
            protocol: 'https',
            hostname: 'logo.clearbit.com',
         },
         {
            protocol: 'https',
            hostname: 'ui-avatars.com',
         },
         {
            protocol: 'https',
            hostname: 'upload.wikimedia.org',
         },
      ],
   },
};

export default nextConfig;
