import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClerkClient } from "@clerk/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const { sectionId, clerkId } = body;

    if (!clerkId || !sectionId) {
      return NextResponse.json(
        { message: "Мэдээлэл дутуу байна" },
        { status: 400 },
      );
    }

    const user = await clerkClient.users.getUser(clerkId);

    const member = await prisma.membership.findFirst({
      where: {
        clerkId,
      },
    });

    if (member?.status === "ACTIVE") {
      const result = await prisma.$transaction(
        async (tx) => {
          const section = await tx.section.findUnique({
            where: { id: sectionId },
            include: { _count: { select: { bookings: true } } },
          });

          if (!section) throw new Error("SECTION_NOT_FOUND");
          if (section._count.bookings >= section.capacity)
            throw new Error("SECTION_FULL");

          const existingBooking = await tx.booking.findUnique({
            where: {
              clerkId_sectionId: { clerkId, sectionId },
            },
          });
          if (existingBooking) throw new Error("ALREADY_BOOKED");

          const newBooking = await tx.booking.create({
            data: {
              clerkId: clerkId,
              sectionId: sectionId,
              status: true,
              isTrial: false,
            },
          });

          await tx.membership.update({
            where: { clerkId: clerkId },
            data: {
              usedSessions: { increment: 1 },
              history: {
                create: {
                  action: "CLASS_BOOKING",
                  change: -1,
                },
              },
            },
          });

          return newBooking;
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );
    } else {
      return NextResponse.json(
        {
          message: "Ta gihsiuohaf h",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Амжилттай бүртгүүллээ",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("BOOKING_ERROR:", error);

    const errorMessages: Record<string, string> = {
      USER_NOT_FOUND: "Хэрэглэгч олдсонгүй",
      NO_MEMBERSHIP: "Танд идэвхтэй гишүүнчлэл алга",
      INSUFFICIENT_SESSIONS: "Таны хичээлийн эрх (сесс) дууссан байна",
      SECTION_NOT_FOUND: "Хичээл олдсонгүй",
      SECTION_FULL: "Уучлаарай, энэ хичээлийн суудал дүүрсэн байна",
      ALREADY_BOOKED: "Та энэ хичээлд бүртгүүлсэн байна",
    };

    if (error.code === "P2028") {
      return NextResponse.json(
        { message: "Бааз ачаалалтай байна, түр хүлээгээд дахин оролдоно уу" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message: errorMessages[error.message] || "Захиалга хийхэд алдаа гарлаа",
      },
      { status: errorMessages[error.message] ? 400 : 500 },
    );
  }
}
