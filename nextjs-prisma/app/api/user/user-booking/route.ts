import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClerkClient } from "@clerk/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, clerkId } = body;

    if (!clerkId || !sectionId) {
      return NextResponse.json(
        { message: "Мэдээлэл дутуу байна" },
        { status: 400 },
      );
    }

    const member = await prisma.membership.findUnique({
      where: { clerkId },
    });

    if (!member || member.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Та идэвхтэй гишүүн биш байна" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
      
        const section = await tx.section.findUnique({
          where: { id: sectionId },
          include: {
            _count: { select: { bookings: true } },
          },
        });

        if (!section) throw new Error("SECTION_NOT_FOUND");

        
        if (section._count.bookings >= section.capacity) {
          throw new Error("SECTION_FULL");
        }

        
        const existingBooking = await tx.booking.findUnique({
          where: {
            clerkId_sectionId: { clerkId, sectionId },
          },
        });
        if (existingBooking) throw new Error("ALREADY_BOOKED");

        
        const currentMember = await tx.membership.findUnique({
          where: { clerkId },
        });
        if (
          !currentMember ||
          currentMember.usedSessions >= currentMember.totalSessions
        ) {
          throw new Error("INSUFFICIENT_SESSIONS");
        }

        
        const newBooking = await tx.booking.create({
          data: {
            clerkId,
            sectionId,
            status: true,
            isTrial: false,
          },
        });

        await tx.membership.update({
          where: { clerkId },
          data: {
            usedSessions: { increment: 1 },
          },
        });

        return newBooking;
      },
      {
     
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return NextResponse.json(
      { message: "Амжилттай бүртгүүллээ" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("BOOKING_ERROR:", error);

    const errorMessages: Record<string, string> = {
      SECTION_NOT_FOUND: "Хичээл олдсонгүй",
      SECTION_FULL: "Уучлаарай, энэ хичээлийн суудал дүүрсэн байна",
      ALREADY_BOOKED: "Та энэ хичээлд бүртгүүлсэн байна",
      INSUFFICIENT_SESSIONS: "Таны хичээлийн эрх дууссан байна",
    };

    return NextResponse.json(
      {
        message: errorMessages[error.message] || "Захиалга хийхэд алдаа гарлаа",
      },
      { status: errorMessages[error.message] ? 400 : 500 },
    );
  }
}
