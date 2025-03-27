import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true, // Mantenha se necessário
  },
};

export default nextConfig;
