import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // 1. URL-аас userId-г салгаж авах (Жишээ нь: /api/bookings/me?userId=user_123)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID шаардлагатай", { status: 400 });
    }

    // 2. Тухайн Clerk ID-тай холбоотой БҮХ захиалгыг баазаас татах
    const userBookings = await prisma.booking.findMany({
      where: {
        clerkId: userId, // Хэрэглэгчийн Clerk ID-аар шүүнэ
      },
      include: {
        section: true, // Захиалсан хэсгийн мэдээллийг хамт авна
      },
      orderBy: {
        createdAt: "desc", // Хамгийн сүүлийнх нь эхэндээ
      },
    });

    // 3. Үр дүнг JSON-оор буцаах
    return NextResponse.json(userBookings);
  } catch (error) {
    console.error("[BOOKINGS_GET_ERROR]", error);
    return new NextResponse("Сервер талд алдаа гарлаа", { status: 500 });
  }
}
