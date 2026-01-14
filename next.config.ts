import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/profile",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
