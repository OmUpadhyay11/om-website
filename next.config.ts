import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export so the site can be zipped and opened locally in Chrome.
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
