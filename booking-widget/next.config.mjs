/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for embedding
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config, { isServer }) => {
    // Add a custom entry point for the web component
    if (!isServer) {
      config.entry = {
        ...config.entry,
        'booking-widget': './components/booking-widget/index.tsx',
      };
    }
    
    return config;
  },
};

export default nextConfig;
