import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server"; // Clerk Client нэмэх
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, userId } = body;

    const result = await prisma.$transaction(
      async (tx) => {
        // 1. CLERK-ЭЭС МЭДЭЭЛЭЛ ТАТАХ (Email болон Name авахын тулд)
        const client = await clerkClient();
        let clerkUser;
        try {
          clerkUser = await client.users.getUser(userId);
        } catch (e) {
          throw new Error("CLERK_USER_NOT_FOUND");
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const fullName =
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        // 2. USER SYNC (Upsert)
        // Таны моделд email, fullName заавал байх ёстой тул энд нэмлээ
        const user = await tx.user.upsert({
          where: {
            clerkId: userId,
          },
          update: {
            email: email,
            fullName: fullName,
          },
          create: {
            clerkId: userId,
            email: email,
            fullName: fullName || "Unknown User",
          },
        });

        // 3. SECTION ШАЛГАХ
        const section = await tx.section.findUnique({
          where: { id: sectionId },
          select: {
            id: true,
            capacity: true,
            _count: { select: { bookings: true } },
          },
        });

        if (!section) throw new Error("SECTION_NOT_FOUND");
        if (section._count.bookings >= section.capacity)
          throw new Error("SECTION_FULL");

        // 4. ДАВХАР ЗАХИАЛГА ШАЛГАХ
        const existingBooking = await tx.booking.findFirst({
          where: {
            sectionId,
            userId: user.id, // Баазын дотоод CUID
          },
        });

        if (existingBooking) throw new Error("ALREADY_BOOKED");

        // 5. ЗАХИАЛГА ҮҮСГЭХ
        return await tx.booking.create({
          data: {
            sectionId,
            userId: user.id, // User-ийн id (CUID)-аар холбоно
            status: true,
            isTrial: false,
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    return NextResponse.json(
      { message: "Амжилттай захиалагдлаа", booking: result },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("BOOKING_ERROR:", error);

    const errorMessages: Record<string, string> = {
      CLERK_USER_NOT_FOUND: "Clerk систем дээр хэрэглэгч олдсонгүй",
      SECTION_NOT_FOUND: "Хичээл олдсонгүй",
      SECTION_FULL: "Суудал дүүрсэн байна",
      ALREADY_BOOKED: "Та аль хэдийн бүртгүүлсэн байна",
    };

    const status = errorMessages[error.message] ? 400 : 500;
    const message =
      errorMessages[error.message] || "Серверийн алдаа: " + error.message;

    return NextResponse.json({ message }, { status });
  }
}
