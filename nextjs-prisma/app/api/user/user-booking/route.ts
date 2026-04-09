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

    // Transaction-ы гадна байгаа findFirst нь зөвхөн анхны шүүлтүүр болно
    const member = await prisma.membership.findUnique({
      where: { clerkId },
    });

    if (!member || member.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Та идэвхтэй гишүүн биш байна" },
        { status: 400 },
      );
    }

    // Зэрэг ирэх хүсэлтийг шийдвэрлэх Transaction
    const result = await prisma.$transaction(
      async (tx: any) => {
        const section = await tx.section.findUnique({
          where: { id: sectionId },
        });

        if (!section) throw new Error("SECTION_NOT_FOUND");

        if (!section.status) {
          throw new Error("SECTION_CLOSED");
        }

        if (new Date(section.StartTime) <= new Date()) {
          throw new Error("SECTION_STARTED");
        }

        const activeBookingCount = await tx.booking.count({
          where: {
            sectionId,
            status: true,
          },
        });

        if (activeBookingCount >= section.capacity) {
          throw new Error("SECTION_FULL");
        }

        // 3. ДАВХАР ЗАХИАЛГА ШАЛГАХ
        const existingBooking = await tx.booking.findUnique({
          where: {
            clerkId_sectionId: { clerkId, sectionId },
          },
        });
        if (existingBooking) throw new Error("ALREADY_BOOKED");

        // 4. СЕСС ҮЛДЭГДЭЛ ШАЛГАХ (Дотор нь дахин шалгах нь аюулгүй)
        const currentMember = await tx.membership.findUnique({
          where: { clerkId },
        });
        if (
          !currentMember ||
          currentMember.usedSessions >= currentMember.totalSessions
        ) {
          throw new Error("INSUFFICIENT_SESSIONS");
        }

        // 5. ҮЙЛДЛҮҮДИЙГ ГҮЙЦЭТГЭХ
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
        // Тусгаарлах түвшинг дээшлүүлснээр зэрэг хүсэлтийг дараалалд оруулна
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
      SECTION_CLOSED: "Энэ хичээл хаагдсан тул бүртгүүлэх боломжгүй",
      SECTION_STARTED: "Энэ хичээл аль хэдийн эхэлсэн байна",
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
