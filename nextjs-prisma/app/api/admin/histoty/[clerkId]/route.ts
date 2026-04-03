import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;

    const history = await prisma.membershipHistory.findMany({
      where: { 
        clerkId: clerkId,
        // Хэрэв чи PATCH дээрээ action явуулаагүй бол бааз дээр "ADMIN_UPDATE" байгаа.
        // Тиймээс status нь EXPIRED байх үеийн бүх түүхийг харахыг хүсвэл:
        action: { in: ["EXPIRED"] } 
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

