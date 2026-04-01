import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
   
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json({ error: "Огноо сонгоно уу" }, { status: 400 });
    }


    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);

   
    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: {
          gte: startOfDay, 
          lte: endOfDay,   
        },
      },
      select: {
        id: true,
        title: true,
        StartTime: true, 
        endTime: true,  
        level: true,
      },
      orderBy: {
        StartTime: "asc", 
      },
    });

    return NextResponse.json(sessions, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Sessions Error:", error);
    return NextResponse.json({ error: "Дата авахад алдаа гарлаа" }, { status: 500 });
  }
}