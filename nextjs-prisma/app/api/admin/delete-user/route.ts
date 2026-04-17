import { createClerkClient } from '@clerk/backend';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

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

    
    let adminUser;
    try {
      adminUser = await clerk.users.getUser(adminClerkId);
    } catch (error) {
      return NextResponse.json(
        { error: "Админ хэрэглэгч Clerk дээр олдсонгүй" },
        { status: 404 },
      );
    }

    
    const role = (adminUser.publicMetadata as { role?: string })?.role;

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Танд энэ үйлдлийг хийх АДМИН эрх Clerk дээр алга" },
        { status: 403 },
      );
    }

    
    try {
      await prisma.user.delete({
        where: { clerkId: targetClerkId },
      });
    } catch (prismaError: any) {
      console.error("PRISMA_DELETE_ERROR:", prismaError);
      
    }

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