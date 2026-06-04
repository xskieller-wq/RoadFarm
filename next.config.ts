import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@routefarm/supabase", "@routefarm/shared", "@routefarm/database"],
  async redirects() {
    return [
      { source: "/alerts", destination: "/buy/alerts", permanent: false },
      { source: "/account", destination: "/buy", permanent: false },
      { source: "/following", destination: "/buy/following", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
