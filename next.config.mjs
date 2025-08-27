/** @type {import('next').NextConfig} */
import bundleAnalyzer from 'next-bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

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
    async headers() {
        return [
            { source: '/(.*)', headers: [...securityHeaders, { key: 'Content-Security-Policy', value: csp }] },
        ];
    },
};

export default withBundleAnalyzer(nextConfig);