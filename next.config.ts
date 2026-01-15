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
    domains: ["lh3.googleusercontent.com", "better-auth-nextjs-kloixa3r5-christos-apatsidis-projects.vercel.app"],
  },
};

export default nextConfig;
