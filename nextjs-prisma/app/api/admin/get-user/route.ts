// import { clerkClient, auth } from "@clerk/nextjs/server"; 
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export async function GET(req: NextRequest) {
//   try {
//     const client = await clerkClient();
//     const { userId: currentUserId } = await auth();
//     const adminHeaderId = req.headers.get("x-admin-id");
//     const requesterId = currentUserId || adminHeaderId;

//     if (!requesterId) {
//       return NextResponse.json(
//         { error: "Нэвтрээгүй байна" },
//         { status: 401 },
//       );
//     }

//     const requester = await client.users.getUser(requesterId);
//     const requesterRole = (requester.publicMetadata as { role?: string })?.role;

//     if (requesterRole !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Танд АДМИН эрх байхгүй" },
//         { status: 403 },
//       );
//     }

//     // Clerk-ээс хэрэглэгчдийг авах
//     const response = await client.users.getUserList({
//       limit: 100,
//     });

//     const clerkIds = response.data.map((user) => user.id);

//     // Баазаас (Prisma) мэдээллээ авах
//     const dbUsers = await prisma.user.findMany({
//       where: { clerkId: { in: clerkIds } },
//       select: {
//         clerkId: true,
//         fullName: true, // Баазад хадгалагдсан нэр
//         membership: { select: { status: true } },
//       },
//     });

//     const dbUserMap = new Map(
//       dbUsers.map((u) => [u.clerkId, u]),
//     );

//     const studentsOnly = response.data
//       .filter((user) => {
//         const role = (user.publicMetadata as { role?: string })?.role;
//         return role !== "ADMIN"; 
//       })
//       .map((user) => {
//         const email =
//           user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
//             ?.emailAddress || user.emailAddresses[0]?.emailAddress;

//         const dbUser = dbUserMap.get(user.id);
//         const status = dbUser?.membership?.status || "NO_MEMBERSHIP";

//         return {
//           clerkId: user.id,
       
//           username: user.username || dbUser?.fullName || "NO NAME",
//           email: email,
//           membershipStatus: status,
//           isMember: status === "ACTIVE",
//         };
//       });

//     return NextResponse.json(studentsOnly);
//   } catch (error: any) {
//     console.error("GET_USERS_ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { clerkClient, auth } from "@clerk/nextjs/server"; 
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const client = await clerkClient();


    const { userId: currentUserId } = await auth();
    const adminHeaderId = req.headers.get("x-admin-id");
    const requesterId = currentUserId || adminHeaderId;

    if (!requesterId) {
      return NextResponse.json(
        { error: "Нэвтрээгүй байна эсвэл Админы ID дутуу" },
        { status: 401 },
      );
    }

    const requester = await client.users.getUser(requesterId);
    const requesterRole = (requester.publicMetadata as { role?: string })?.role;

    if (requesterRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ мэдээллийг харах АДМИН эрх байхгүй" },
        { status: 403 },
      );
    }

    const response = await client.users.getUserList({
      limit: 100,
    });

    const clerkIds = response.data.map((user) => user.id);

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

    const studentsOnly = response.data
      .filter((user) => {
        const role = (user.publicMetadata as { role?: string })?.role;
        return role !== "ADMIN"; 
      })
      .map((user) => {
        const email =
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || user.emailAddresses[0]?.emailAddress;

        const status = dbUserMap.get(user.id) || "NO_MEMBERSHIP";

        return {
          clerkId: user.id,
          fullName: user.username || "NO NAME",
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

