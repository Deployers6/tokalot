import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   turbopack: {
//     root: __dirname,
//   },
// };

// export default nextConfig;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
