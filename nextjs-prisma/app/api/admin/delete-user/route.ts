import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // 2. Баазаас adminClerkId-тай хэрэглэгч АДМИН мөн эсэхийг шалгах
    const adminUser = await prisma.user.findUnique({
      where: { clerkId: adminClerkId },
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ үйлдлийг хийх АДМИН эрх байхгүй" },
        { status: 403 },
      );
    }

    // 3. Clerk-ээс устгах
    const client = await clerkClient();
    try {
      await client.users.deleteUser(targetClerkId);
    } catch (clerkError: any) {
      console.error("CLERK_DELETE_ERROR:", clerkError);
      // Clerk дээр олдохгүй байсан ч баазаас үргэлжлүүлэн устгах эсэхээ шийдэж болно
    }

    // 4. Өөрийн баазаас (Prisma) устгах
    await prisma.user.delete({
      where: { clerkId: targetClerkId },
    });

    return NextResponse.json(
      { message: "Хэрэглэгчийг амжилттай устгалаа" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("ADMIN_DELETE_USER_ERROR:", error);
    return NextResponse.json(
      { error: "Устгах явцад алдаа гарлаа" },
      { status: 500 },
    );
  }
}