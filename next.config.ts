import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*", // matches any /api/* route
            destination: "http://127.0.0.1:5000/api/:path*",
          },
        ]
      : [];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w500/**",
      },
    ],
  },
};

export default nextConfig;
