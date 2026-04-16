import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
   
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID шаардлагатай", { status: 400 });
    }

    
    const userBookings = await prisma.booking.findMany({
      where: {
        clerkId: userId, 
      },
      include: {
        section: true, 
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error("[BOOKINGS_GET_ERROR]", error);
    return new NextResponse("Сервер талд алдаа гарлаа", { status: 500 });
  }
}
