/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@abdalkader/ui'],
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
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

    return config;
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DESIGN_TOKENS_URL: process.env.DESIGN_TOKENS_URL,
  },
};

module.exports = nextConfig;