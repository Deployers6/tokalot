import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { clerkId: string } } 
) {
  
  const clerkId = req.headers.get("x-user-id") || params.clerkId;

  if (!clerkId || clerkId === "null") {
    return NextResponse.json({ error: "clerkId олдсонгүй" }, { status: 400 });
  }

  try {
    const membership = await prisma.membership.upsert({
      where: { clerkId: clerkId },
      update: {}, 
      create: {
        clerkId: clerkId,
        startDate: new Date(),
        endDate: new Date(),
        totalSessions: 0,
        usedSessions: 0,
        status: "pending",
      },
      include: {
        history: true,
      },
    });

    return NextResponse.json(membership); 
    
  } catch (error: any) {
    console.error("GET Membership Error:", error);
    return NextResponse.json(
      { 
        error: "Дата авахад алдаа гарлаа", 
        details: error.message
      },
      { status: 500 },
    );
  }
}





export async function PATCH(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json({ error: "Header-т x-user-id алга" }, { status: 400 });
  }

  try {
    const body = await req.json();
    
    const updatedMembership = await prisma.membership.update({
      where: { clerkId: clerkId },
      data: {

        ...(body.totalSessions !== undefined && { totalSessions: Number(body.totalSessions) }),
        ...(body.usedSessions !== undefined && { usedSessions: Number(body.usedSessions) }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.status && { status: body.status }),

       
        history: {
          create: {
            action: "ADMIN_UPDATE",
            change: body.totalSessions !== undefined ? Number(body.totalSessions) : 0,
          },
        },
      },
    });

    return NextResponse.json(updatedMembership);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { 
        error: "Шинэчлэхэд алдаа гарлаа", 
        message: error.message, 
        prismaCode: error.code 
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json({ error: "Header-т x-user-id алга" }, { status: 400 });
  }

  try {
    const membership = await prisma.membership.findUnique({
      where: { clerkId: clerkId }
    });

    if (membership) {
      await prisma.membershipHistory.deleteMany({
        where: { membershipId: membership.id }
      });

 
      await prisma.membership.delete({
        where: { clerkId: clerkId }
      });
    }

    return NextResponse.json({ message: "Амжилттай устгагдлаа" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { 
        error: "Устгахад алдаа гарлаа", 
        message: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}