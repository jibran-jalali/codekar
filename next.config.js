/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.orchids.cloud",
        "*.proxy.daytona.works",
        "*.app.orchid.software",
        "*.orchid.software",
        "localhost:3000"
      ]
    }
  },
  allowedDevOrigins: [
    "*.orchids.cloud",
    "*.proxy.daytona.works"
  ]
};

module.exports = nextConfig;
// Orchids restart: 1767027325813
