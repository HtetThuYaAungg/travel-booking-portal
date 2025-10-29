import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(process.env.NEXT_CONFIG_OUTPUT === "standalone" && {
    output: "standalone",
  }),
};

export default nextConfig;
