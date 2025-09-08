/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Removed standalone output for better Vercel compatibility
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

export default nextConfig
