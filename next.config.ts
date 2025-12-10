import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* config options here */
   serverExternalPackages: ["pdfkit"],
  eslint: {
    ignoreDuringBuilds: true,
  },
   typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // ou '50mb'
    },
  },
};

export default nextConfig;
