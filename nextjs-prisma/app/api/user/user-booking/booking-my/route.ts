import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");
 
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (!clerkId) {
    return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  }

  try {
    const now = new Date();

    const where =
      status === "completed"
        ? {
            clerkId,
            OR: [
              { status: true, section: { endTime: { lt: now } } },
              { status: false },
            ],
          }
        : {
            clerkId,
            status: true,
            section: { endTime: { gt: now } },
          };

    const myBookings = await prisma.booking.findMany({
      where,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        section: {
          select: {
            id: true,
            title: true,
            level: true,
            StartTime: true,
            endTime: true,
          },
        },
      },
      orderBy: { section: { StartTime: "desc" } },
    });

    return NextResponse.json(myBookings);
  } catch (error) {
    console.error("GET_BOOKINGS_ERROR:", error);
    return NextResponse.json({ error: "Мэдээлэл авахад алдаа гарлаа" }, { status: 500 });
  }
}