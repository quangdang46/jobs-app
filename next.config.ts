import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
