import { clerkClient, auth } from "@clerk/nextjs/server"; // auth() нэмэгдсэн
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const client = await clerkClient();

    // 1. Хүсэлт гаргагчийн эрхийг шалгах (Middleware эсвэл Header-ээс)
    // Бодит апп дээр auth() ашиглана, Postman дээр Header-ээс авч болно
    const { userId: currentUserId } = await auth();
    const adminHeaderId = req.headers.get("x-admin-id");
    const requesterId = currentUserId || adminHeaderId;

    if (!requesterId) {
      return NextResponse.json(
        { error: "Нэвтрээгүй байна эсвэл Админы ID дутуу" },
        { status: 401 },
      );
    }

    // Хүсэлт гаргагч нь Админ мөн эсэхийг Clerk-ээс шалгах
    const requester = await client.users.getUser(requesterId);
    const requesterRole = (requester.publicMetadata as { role?: string })?.role;

    if (requesterRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ мэдээллийг харах АДМИН эрх байхгүй" },
        { status: 403 },
      );
    }

    // 2. Clerk-ээс бүх хэрэглэгчдийг татах
    const response = await client.users.getUserList({
      limit: 100,
    });

    const clerkIds = response.data.map((user) => user.id);

    // 3. Prisma-аас User болон Membership-ийг цуг татах
    const dbUsers = await prisma.user.findMany({
      where: { clerkId: { in: clerkIds } },
      select: {
        clerkId: true,
        membership: { select: { status: true } },
      },
    });

    const dbUserMap = new Map(
      dbUsers.map((u) => [u.clerkId, u.membership?.status || "NO_MEMBERSHIP"]),
    );

    // 4. Жагсаалтыг шүүж нэгтгэх
    const studentsOnly = response.data
      .filter((user) => {
        const role = (user.publicMetadata as { role?: string })?.role;
        return role !== "ADMIN"; // Бусад админуудыг жагсаалтад харуулахгүй
      })
      .map((user) => {
        const email =
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || user.emailAddresses[0]?.emailAddress;

        const status = dbUserMap.get(user.id) || "NO_MEMBERSHIP";

        return {
          clerkId: user.id,
          fullName:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Нэргүй",
          email: email,
          membershipStatus: status,
          isMember: status === "ACTIVE",
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
