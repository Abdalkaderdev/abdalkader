/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@abdalkader/ui'],
  typescript: {
    // Enable TypeScript error checking during build
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig