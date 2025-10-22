import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...((process.env.NEXT_CONFIG_OUTPUT === "standalone") && { 
    output: "standalone" 
  }),
};

export default nextConfig;
