import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, sectionId } = body;

   
    if (!clerkId || !sectionId) {
      return NextResponse.json(
        { error: "clerkId болон sectionId заавал шаардлагатай" },
        { status: 400 }
      );
    }

    
    const membership = await prisma.membership.findUnique({
      where: { clerkId }
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Танд бүртгэлтэй гишүүнчлэл алга" },
        { status: 403 }
      );
    }

    if (membership.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Таны гишүүнчлэл идэвхгүй байна" },
        { status: 403 }
      );
    }

   
    if (membership.usedSessions >= membership.totalSessions) {
      return NextResponse.json(
        { error: "Таны хичээлийн эрх (сесс) дууссан байна" },
        { status: 403 }
      );
    }

   
    const result = await prisma.$transaction(async (tx) => {
      
     
      const section = await tx.section.findUnique({
        where: { id: sectionId },
        include: { _count: { select: { bookings: true } } }
      });

      if (!section) throw new Error("SECTION_NOT_FOUND");
      
      
      if (section._count.bookings >= section.capacity) {
        throw new Error("SECTION_FULL");
      }

      
      const existing = await tx.booking.findFirst({
        where: { clerkId, sectionId }
      });
      if (existing) throw new Error("ALREADY_BOOKED");

      
      const newBooking = await tx.booking.create({
        data: {
          clerkId: clerkId,
          sectionId: sectionId,
          status: true,
        }
      });

      
      await tx.membership.update({
        where: { clerkId: clerkId },
        data: {
          usedSessions: { increment: 1 },
        }
      });

      return newBooking;
    });

    return NextResponse.json(
      { message: "Амжилттай бүртгүүллээ", data: result },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("BOOKING_ERROR_LOG:", error);

    
    const errorMap: Record<string, string> = {
      SECTION_NOT_FOUND: "Уучлаарай, хичээл олдсонгүй.",
      SECTION_FULL: "Уучлаарай, энэ хичээлийн суудал дүүрсэн байна.",
      ALREADY_BOOKED: "Та энэ хичээлд бүртгүүлсэн байна.",
    };

    return NextResponse.json(
      { error: errorMap[error.message] || "Захиалга хийхэд алдаа гарлаа", details: error.message },
      { status: errorMap[error.message] ? 400 : 500 }
    );
  }
}