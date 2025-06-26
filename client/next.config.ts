import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    ppr: 'incremental'
  },
  images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '**',
    },
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
};

export default nextConfig;
