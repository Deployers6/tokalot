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

    if (!booking.status) {
      return NextResponse.json(
        { error: "Энэ захиалга аль хэдийн цуцлагдсан байна." },
        { status: 409 },
      );
    }

    const now = new Date();
    const startTime = new Date(booking.section.StartTime);

    if (startTime <= now) {
      return NextResponse.json(
        { error: "Хичээл эхэлсэн тул цуцлах боломжгүй." },
        { status: 400 },
      );
    }

    const hoursLeft = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursLeft < 48) {
      return NextResponse.json(
        { error: "Хичээл эхлэхэд 48 цагаас бага хугацаа үлдсэн тул цуцлах боломжгүй." },
        { status: 400 },
      );
    }

    const cancelResult = await prisma.$transaction(async (tx: any) => {
      const updatedBooking = await tx.booking.updateMany({
        where: {
          id: bookingId,
          status: true,
        },
        data: { status: false },
      });

      if (updatedBooking.count === 0) {
        return false;
      }

      await tx.membership.update({
        where: { clerkId: clerkId },
        data: { usedSessions: { decrement: 1 } },
      });

      return true;
    });

    if (!cancelResult) {
      return NextResponse.json(
        { error: "Энэ захиалга аль хэдийн цуцлагдсан байна." },
        { status: 409 },
      );
    }

    return NextResponse.json({
      message: "Захиалга цуцлагдлаа. 1 credit буцаан нэмэгдлээ.",
    });
  } catch (error: any) {
    console.error("CANCEL_ERROR:", error);
    return NextResponse.json(
      { error: "Цуцлах үйлдэл амжилтгүй боллоо" },
      { status: 500 },
    );
  }
}
