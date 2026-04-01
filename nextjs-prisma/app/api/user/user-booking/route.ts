import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, clerkId } = body; // Clerk-ээс ирсэн user ID

    if (!clerkId || !sectionId) {
      return NextResponse.json({ error: "clerkId эсвэл sectionId дутуу байна" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. ClerkId-аар манай бааз дахь User-ийг олох (эсвэл үүсгэх)
      const user = await tx.user.findUnique({
        where: { clerkId: clerkId },
      });

      if (!user) throw new Error("USER_NOT_FOUND");

      // 2. Section (Хичээл) байгаа эсэх болон багтаамжийг шалгах
      const section = await tx.section.findUnique({
        where: { id: sectionId },
        select: {
          id: true,
          capacity: true,
          _count: { select: { bookings: true } },
        },
      });

      if (!section) throw new Error("SECTION_NOT_FOUND");
      if (section._count.bookings >= section.capacity) throw new Error("SECTION_FULL");

      // 3. Өмнө нь бүртгүүлсэн эсэхийг шалгах
      const existingBooking = await tx.booking.findFirst({
        where: {
          sectionId: sectionId,
          userId: user.id, // Манай баазын CUID
        },
      });

      if (existingBooking) throw new Error("ALREADY_BOOKED");

      // 4. Захиалга үүсгэх
      const newBooking = await tx.booking.create({
        data: {
          sectionId: sectionId,
          userId: user.id,
          status: true,
          isTrial: false,
        },
      });

      return newBooking;
    });

    return NextResponse.json({ message: "Амжилттай бүртгүүллээ", booking: result }, { status: 201 });

  } catch (error: any) {
    console.error("BOOKING_ERROR:", error);

    const errorMessages: Record<string, string> = {
      USER_NOT_FOUND: "Хэрэглэгч системд бүртгэлгүй байна",
      SECTION_NOT_FOUND: "Хичээл олдсонгүй",
      SECTION_FULL: "Уучлаарай, хичээлийн суудал дүүрсэн байна",
      ALREADY_BOOKED: "Та энэ хичээлд аль хэдийн бүртгүүлсэн байна",
    };

    const status = errorMessages[error.message] ? 400 : 500;
    return NextResponse.json(
      { message: errorMessages[error.message] || "Серверийн алдаа гарлаа" },
      { status }
    );
  }
}