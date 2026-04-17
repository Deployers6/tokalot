import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;

    const expiredMemberships = await prisma.membership.findMany({
      where: { 
        clerkId: clerkId,
        status: "EXPIRED"
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });

    return NextResponse.json(expiredMemberships);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

