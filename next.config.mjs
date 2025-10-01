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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.vitrus.rw',
          },
        ],
        destination: 'https://vitrus.rw/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'vitrus.rw',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
        destination: 'https://vitrus.rw/:path*',
        permanent: true,
      },
    ];
  },
  // Add canonical URL support
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'vitrus.rw',
            },
          ],
          headers: {
            'Link': '<https://vitrus.rw/:path*>; rel="canonical"',
          },
        },
      ],
    };
  },
  // Add canonical URL support
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'vitrus.rw',
            },
          ],
          headers: {
            'Link': '<https://vitrus.rw/:path*>; rel="canonical"',
          },
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Allow iframe embedding for tour and embed pages
        source: '/tour/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' https://my.matterport.com https://*.matterport.com; frame-ancestors 'self' http: https: file: data:",
          },
        ],
      },
      {
        // Allow iframe embedding for embed pages
        source: '/embed/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' https://my.matterport.com https://*.matterport.com; frame-ancestors 'self' http: https: file: data:",
          },
        ],
      },
      {
        // Maintain security for all other pages
        source: '/((?!tour|embed).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Removed standalone output for better Vercel compatibility
}

export default nextConfig
