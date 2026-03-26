import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3001",
      },
    ],
    unoptimized: true, // Disable image optimization for localhost
  },
};

export default nextConfig;
