import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetClerkId, adminClerkId } = body;

   
    if (!targetClerkId || !adminClerkId) {
      return NextResponse.json(
        { error: "Устгах ID эсвэл Админы ID дутуу байна" },
        { status: 400 },
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: { clerkId: adminClerkId },
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ үйлдлийг хийх АДМИН эрх байхгүй" },
        { status: 403 },
      );
    }

   
    const client = await clerkClient();
    try {
      await client.users.deleteUser(targetClerkId);
    } catch (clerkError: any) {
      console.error("CLERK_DELETE_ERROR:", clerkError);
      
    }

 
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