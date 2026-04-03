// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// // 1. Хамгаалалттай замуудаа тодорхойлох
// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);
// const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// export default clerkMiddleware(async (auth, req) => {
//   // Нэвтрээгүй хэрэглэгч нийтийн бус зам руу орвол нэвтрэх хуудас руу шилжүүлнэ
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }

//   // 2. Админ замыг шалгах логик
//   if (isAdminRoute(req)) {
//     const { sessionClaims } = await auth();

//     // Session Claims-ээс Role-ийг унших
//     const role = (sessionClaims?.metadata as { role?: string })?.role;

//     // Хэрэв Role нь ADMIN биш бол нүүр хуудас руу буцаах
//     if (role !== 'ADMIN') {
//       const url = new URL('/', req.url);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Next.js-ийн дотоод файл болон статик файлуудаас бусад бүх зам дээр ажиллана
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // API болон trpc замууд дээр үргэлж ажиллана
//     '/(api|trpc)(.*)',
//   ],
// };