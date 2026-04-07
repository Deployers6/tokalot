import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json(
      { error: "Нэвтрэх шаардлагатай" },
      { status: 401 },
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { section: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: `ID: ${bookingId} захиалга олдсонгүй` },
        { status: 404 },
      );
    }

    if (booking.clerkId !== clerkId) {
      return NextResponse.json(
        { error: "Бусдын захиалгыг цуцлах эрхгүй" },
        { status: 403 },
      );
    }

    const now = new Date();
    const startTime = new Date(booking.section.StartTime);

    const diffInHours =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 48) {
      return NextResponse.json(
        {
          error:
            "Хичээл эхлэхээс 48 цагийн өмнө цуцлах ёстой. Одоо цуцлах боломжгүй.",
        },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({
        where: { id: bookingId },
      });

      await tx.membership.update({
        where: { clerkId: clerkId },
        data: {
          usedSessions: { decrement: 1 },
        },
      });
    });

    return NextResponse.json(
      {
        message:
          "Захиалга амжилттай цуцлагдлаа. Хичээлийн эрх буцаан олгогдсон.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CANCEL_ERROR:", error);
    return NextResponse.json(
      { error: "Цуцлах үйлдэл амжилтгүй боллоо" },
      { status: 500 },
    );
  }
}
