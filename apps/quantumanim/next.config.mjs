/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['quantumanim.abdalkader.dev'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: 'https://quantumanim.abdalkader.dev',
  },
}

export default nextConfig