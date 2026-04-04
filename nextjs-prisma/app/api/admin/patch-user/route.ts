import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetClerkId, firstName, lastName } = body;

    // 1. Шаардлагатай ID ирсэн эсэхийг шалгах
    if (!targetClerkId) {
      return NextResponse.json(
        { error: "Засах хэрэглэгчийн ID (targetClerkId) дутуу байна" },
        { status: 400 }
      );
    }

    // 2. Clerk SDK-г ашиглан ШУУД Clerk дээрх датаг засах
    const client = await clerkClient();
    
    const updatedUser = await client.users.updateUser(targetClerkId, {
      firstName: firstName, // Шинэ нэр
      lastName: lastName,   // Шинэ овог
    });

    return NextResponse.json({
      message: "Clerk дээрх мэдээлэл амжилттай шинэчлэгдлээ",
      updatedData: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("CLERK_PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Clerk дээр засахад алдаа гарлаа", details: error.message },
      { status: 500 }
    );
  }
}
// import { createClerkClient } from '@clerk/backend';
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// export async function PATCH(req: NextRequest) {
//   try {
//     const adminClerkId = req.headers.get("x-admin-id");
//     if (!adminClerkId) {
//       return NextResponse.json({ error: "Admin ID дутуу" }, { status: 400 });
//     }

//     // Admin эрх шалгах
//     const adminUser = await clerk.users.getUser(adminClerkId);
//     const role = (adminUser.publicMetadata as { role?: string })?.role;
//     if (role !== "ADMIN") {
//       return NextResponse.json({ error: "ADMIN эрх алга" }, { status: 403 });
//     }

//     const body = await req.json();
//     const { id, fullName, isMember } = body;

//     if (!id) {
//       return NextResponse.json({ error: "User ID дутуу" }, { status: 400 });
//     }

//     // Prisma update
//     const updated = await prisma.user.update({
//       where: { id },
//       data: {
//         fullName,
//   membershipType,
//       },
//     });

//     // Хэрэв Clerk дээр нэр шинэчлэх шаардлагатай бол
//     if (fullName && updated.clerkId) {
//       const parts = fullName.trim().split(" ");
//       const firstName = parts[0];
//       const lastName = parts.slice(1).join(" ") || "";
//       await clerk.users.updateUser(updated.clerkId, { firstName, lastName });
//     }

//     return NextResponse.json({ message: "Амжилттай шинэчлэгдлээ", user: updated });
//   } catch (error: any) {
//     console.error("PATCH_USER_ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }