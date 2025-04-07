import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline',
    image: '/icons/fallback.png', // You must create this file
    audio: '/fallbacks/fallback.mp3', // Optional: only if you use audio
    video: '/fallbacks/fallback.mp4', // Optional: only if you use video
    font: '/fallbacks/fallback.woff2', // Optional: only if you use web fonts
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "utfs.io",
      },
      {
        protocol: "https" as const,
        hostname: "img.clerk.com",
      },
      {
        protocol: "https" as const,
        hostname: "unsplash.com",
      },
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https" as const,
        hostname: "randomuser.me",
      },
    ],
  },
};

export default pwaConfig(nextConfig);