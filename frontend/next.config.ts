import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/persistence", "@repo/diagram-engine", "@repo/parser-client", "@repo/validation"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
