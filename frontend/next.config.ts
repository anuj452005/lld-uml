import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/persistence", "@repo/diagram-engine", "@repo/parser-client", "@repo/validation"],
  experimental: {
    externalDir: true,
  },
  // Tell Turbopack the monorepo root so it doesn't get confused by
  // multiple package-lock.json files (one at root, one in frontend/).
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
