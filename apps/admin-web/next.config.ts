import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@picbox/ui", "@picbox/utils", "@picbox/types"],
};

export default nextConfig;
