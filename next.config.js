/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [70, 75, 90, 95],
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

module.exports = nextConfig;
