import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicit project root prevents Next.js from picking up a parent lockfile
    root: __dirname,
  },
};

export default nextConfig;
