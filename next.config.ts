import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
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
    domains: [
      "lh3.googleusercontent.com", 
      "i.sstatic.net",
      "better-auth-nextjs-user-authentication.vercel.app"
    ],
  },
};

export default nextConfig;
