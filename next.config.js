/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      '3ayuy426nen0azg1.public.blob.vercel-storage.com',
      'public.blob.vercel-storage.com',
      'vercel.blob.core.windows.net'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
