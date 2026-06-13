import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
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
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
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
    // @ts-ignore
    allowedDevOrigins: [
      "*.orchids.cloud",
      "*.proxy.daytona.works"
    ]

} as NextConfig;

export default nextConfig;
