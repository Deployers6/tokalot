import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; bookingId: string } },
) {
  try {
    const { userId, bookingId } = params;

    // Тухайн хэрэглэгчийн (userId) яг тэр захиалгыг (bookingId) хайх
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        user: {
          clerkId: userId, // Эсвэл таны баазын дотоод ID: userId
        },
      },
      include: {
        section: true, // Захиалсан хэсгийн мэдээлэл
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Тухайн хэрэглэгчид хамааралтай захиалга олдсонгүй" },
        { status: 404 },
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Сервер талд алдаа гарлаа" },
      { status: 500 },
    );
  }
}
