/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholder.com', 'vercel.blob.store'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

