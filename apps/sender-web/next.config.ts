import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@picbox/utils", "@picbox/types"],
};

export default nextConfig;