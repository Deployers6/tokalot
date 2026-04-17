// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// // 1. Админ замуудыг тодорхойлох (Жишээ нь: /admin/dashboard, /admin/users гэх мэт)
// const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// export default clerkMiddleware(async (auth, req) => {
//   // 2. Хэрэв хэрэглэгч админ зам руу орох гэж байвал
//   if (isAdminRoute(req)) {
//     const { sessionClaims } = await auth();

//     // 3. Role-ийг шалгах (publicMetadata.role)
//     const role = sessionClaims?.metadata.role;

//     if (role !== 'ADMIN') {
//       // Админ биш бол нүүр хуудас эсвэл 404 рүү шилжүүлнэ
//       const url = new URL('/', req.url);
//       return NextResponse.redirect(url);
//     }
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://tokalot-1d4s.vercel.app",
];

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get("origin") ?? "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  // OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": isAllowed ? origin : "",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, x-admin-id, x-user-id, x-user-email, x-user-name",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata.role;

    if (role !== "ADMIN") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();

  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-admin-id, x-user-id, x-user-email, x-user-name",
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
