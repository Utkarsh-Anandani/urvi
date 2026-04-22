import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-99291093b65d41efa5b60d58d61a9b8a.r2.dev",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./src/generated/client/**/*"],
    "/*": ["./src/generated/client/**/*"],
  },
};

export default nextConfig;
