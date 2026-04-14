// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "plus.unsplash.com",
//       },
//       {
//         protocol: "https",
//         hostname: "*.unsplash.com",
//       },
//     ],
//   },
//   async headers() {
//     const allowedOrigin =
//       process.env.NODE_ENV === "production"
//         ? "https://tokalot-1d4s.vercel.app"
//         : "http://localhost:3000";

//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           {
//             key: "Access-Control-Allow-Origin",
//             value: allowedOrigin,
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value:
//               "Content-Type, Authorization, x-admin-id, x-user-id, x-user-email, x-user-name",
//           },
//           {
//             key: "Access-Control-Allow-Credentials",
//             value: "true",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
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
