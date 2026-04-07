import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId шаардлагатай" },
        { status: 400 },
      );
    }

    await prisma.membership.delete({
      where: { clerkId: clerkId },
    });

    return NextResponse.json({ message: "Гишүүнчлэл амжилттай устгагдлаа" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Устгахад алдаа гарлаа" },
      { status: 500 },
    );
  }
}
