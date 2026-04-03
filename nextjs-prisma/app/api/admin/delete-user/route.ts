import { createClerkClient } from '@clerk/backend';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Clerk Backend Client-ийг үүсгэх
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetClerkId, adminClerkId } = body;

    // 1. Мэдээлэл ирсэн эсэхийг шалгах
    if (!targetClerkId || !adminClerkId) {
      return NextResponse.json(
        { error: "Устгах ID эсвэл Админы ID дутуу байна" },
        { status: 400 },
      );
    }

    // 2. Clerk-ээс Админ хэрэглэгчийг хайх (Чиний бичсэн findUser логикоор)
    let adminUser;
    try {
      adminUser = await clerk.users.getUser(adminClerkId);
    } catch (error) {
      return NextResponse.json(
        { error: "Админ хэрэглэгч Clerk дээр олдсонгүй" },
        { status: 404 },
      );
    }

    // 3. Clerk-ийн Metadata доторх Роль-ийг шалгах
    const role = (adminUser.publicMetadata as { role?: string })?.role;

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ үйлдлийг хийх АДМИН эрх Clerk дээр алга" },
        { status: 403 },
      );
    }

    // 4. Эхлээд Prisma-аас устгах (Захиалга байгаа эсэхийг шалгах үүднээс)
    try {
      await prisma.user.delete({
        where: { clerkId: targetClerkId },
      });
    } catch (prismaError: any) {
      console.error("PRISMA_DELETE_ERROR:", prismaError);
      // Хэрэв баазад байхгүй бол шууд Clerk-ээс устгах руу үргэлжлүүлж болно
    }

    // 5. Clerk-ээс хэрэглэгчийг устгах
    try {
      await clerk.users.deleteUser(targetClerkId);
    } catch (clerkError: any) {
      console.error("CLERK_DELETE_ERROR:", clerkError);
      return NextResponse.json(
        { error: "Clerk-ээс хэрэглэгчийг устгаж чадсангүй" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Хэрэглэгчийг Clerk болон Prisma-аас амжилттай устгалаа" },
      { status: 200 },
    );

  } catch (error: any) {
    console.error("ADMIN_DELETE_USER_ERROR:", error);
    return NextResponse.json(
      { error: "Системийн алдаа гарлаа", details: error.message },
      { status: 500 },
    );
  }
}