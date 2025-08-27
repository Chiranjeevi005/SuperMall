import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  // Enable compression
  compress: true,
  // Optimize React rendering
  reactStrictMode: true,
  // Enable experimental optimizations
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Enable webpack 5 optimizations
    webpackBuildWorker: true,
  },
  // Configure headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|gif|ico|ttf|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Reduce bundle size by excluding unnecessary modules
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;