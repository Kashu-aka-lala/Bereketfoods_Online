import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bereketfoods.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.bereketfoods.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bereketnaturals.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.bereketnaturals.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
