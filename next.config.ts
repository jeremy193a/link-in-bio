import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize bundle size for Cloudflare Pages (25 MiB limit)
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
  },
  // Reduce webpack output
  productionBrowserSourceMaps: false,
  // Modularize imports for large packages
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },
  // Exclude server-only packages from client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        '@anthropic-ai/sdk': false,
      };
    }

    // Reduce cache size
    config.cache = false;

    return config;
  },
};

export default nextConfig;
