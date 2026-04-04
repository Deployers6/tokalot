import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const client = await clerkClient();

    // 1. Clerk-ээс бүх хэрэглэгчдийг татах
    const response = await client.users.getUserList({
      limit: 100, // Хэрэглэгчийн тооноос хамаарч тохируулна
    });

    // 2. Зөвхөн "USER" эсвэл Админ биш хүмүүсийг шүүж авах
    const studentsOnly = response.data
      .filter((user) => {
        // Metadata доторх role-ийг шалгах
        const role = (user.publicMetadata as { role?: string })?.role;
        
        // Хэрэв role нь "ADMIN" биш бол жагсаалтад оруулна
        // (Role байхгүй хэрэглэгчдийг мөн сурагч гэж үзнэ)
        return role !== "ADMIN";
      })
      .map((user) => {
        const email = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId
        )?.emailAddress || user.emailAddresses[0]?.emailAddress;

        return {
          clerkId: user.id,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Нэргүй",
          email: email,
          role: (user.publicMetadata as { role?: string })?.role || "USER"
        };
      });

    return NextResponse.json(studentsOnly);

  } catch (error: any) {
    console.error("GET_USERS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// import { clerkClient } from "@clerk/nextjs/server";

// import { NextRequest, NextResponse } from "next/server";
 
// export const dynamic = "force-dynamic";
 
// export async function OPTIONS() {

//   return new NextResponse(null, {

//     status: 204,

//     headers: {

//       "Access-Control-Allow-Origin": "*",

//       "Access-Control-Allow-Methods": "GET, OPTIONS",

//       "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-id",

//     },

//   });

// }
 
// export async function GET(req: NextRequest) {

//   try {

//     const adminClerkId = req.headers.get("x-admin-id");
 
//     if (!adminClerkId) {

//       return NextResponse.json({ error: "Админы ID дутуу байна" }, { status: 400 });

//     }
 
//     const client = await clerkClient();
 
//     const response = await client.users.getUserList({

//       limit: 100,

//     });
 
//     const studentsOnly = response.data

//       .filter((user) => user.id !== adminClerkId)

//       .map((user) => {

//         const email = user.emailAddresses.find(

//           (e) => e.id === user.primaryEmailAddressId

//         )?.emailAddress || user.emailAddresses[0]?.emailAddress;
 
//         return {

//           clerkId: user.id,

//           fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No Name",

//           email: email,

//         };

//       });
 
//     return NextResponse.json(studentsOnly);
 
//   } catch (error: any) {

//     return NextResponse.json({ error: error.message }, { status: 500 });

//   }

// }
 