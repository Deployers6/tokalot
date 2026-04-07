import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
//admin session update
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, teacherId, StartTime, endTime, capacity } = body;

    const updated = await prisma.section.update({
      where: { id: params.id },
      data: {
        title,
        teacherId, // Багшийн ID-г энд шинэчилнэ
        StartTime: new Date(StartTime),
        endTime: new Date(endTime),
        capacity: Number(capacity),
      },
      include: {
        teacher: true, // Шинэ багшийн нэрийг цуг буцаах нь чухал!
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Алдаа" }, { status: 500 });
  }
}
