import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 1. Админ замуудыг тодорхойлох (Жишээ нь: /admin/dashboard, /admin/users гэх мэт)
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 2. Хэрэв хэрэглэгч админ зам руу орох гэж байвал
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();

    // 3. Role-ийг шалгах (publicMetadata.role)
    const role = sessionClaims?.metadata.role;

    if (role !== 'ADMIN') {
      // Админ биш бол нүүр хуудас эсвэл 404 рүү шилжүүлнэ
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
