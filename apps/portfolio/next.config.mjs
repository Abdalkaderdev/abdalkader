/** @type {import('next').NextConfig} */
let withBundleAnalyzer = (config) => config;

// Only use bundle analyzer in development or when explicitly requested
if (process.env.NODE_ENV !== 'production' || process.env.ANALYZE === 'true') {
  try {
    const bundleAnalyzer = require('next-bundle-analyzer');
    withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
  } catch (error) {
    console.warn('next-bundle-analyzer not available, skipping bundle analysis');
  }
}

const securityHeaders = [
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; frame-src 'self' https:; connect-src 'self' https:; font-src 'self' data: https:;";

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    transpilePackages: ['@abdalkader/ui'],
    
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
        // Optimize chunks
        if (!dev) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
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
    
    async headers() {
        return [
            { source: '/(.*)', headers: [...securityHeaders, { key: 'Content-Security-Policy', value: csp }] },
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
};

export default withBundleAnalyzer(nextConfig);