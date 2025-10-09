/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@abdalkader/ui'],
  experimental: {
    esmExternals: false,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle optimization
  webpack: (config, { isServer, dev }) => {
    // Monaco Editor support
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    // Optimize chunks
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // TensorFlow.js chunk
          tensorflow: {
            name: 'tensorflow',
            test: /[\\/]node_modules[\\/]@tensorflow/,
            chunks: 'all',
            priority: 20,
          },
          // Monaco Editor chunk
          monaco: {
            name: 'monaco',
            test: /[\\/]node_modules[\\/]monaco-editor/,
            chunks: 'all',
            priority: 20,
          },
          // UI components chunk
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/]@abdalkader[\\/]ui/,
            chunks: 'all',
            priority: 20,
          },
          // Common libraries
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DESIGN_TOKENS_URL: process.env.DESIGN_TOKENS_URL,
  },
};

module.exports = nextConfig;