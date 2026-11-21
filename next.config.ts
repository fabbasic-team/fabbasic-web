import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vdkyaxjtmhinmadsfzyp.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
