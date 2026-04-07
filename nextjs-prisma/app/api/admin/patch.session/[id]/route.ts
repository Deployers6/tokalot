// /api/admin/sessions/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // teacherId-г body-оос авч байна
    const { title, startTime, level, endTime, capacity, status, teacherId } = body;

    const updatedSection = await prisma.section.update({
  where: { id: id },
  data: {
    ...(title && { title }),
    ...(level && { level }),
    ...(teacherId && { teacherId }),
    // Database-ийн баганын нэр 'StartTime' (Том S) байна
    ...(startTime && { StartTime: new Date(startTime) }), 
    // Database-ийн баганын нэр 'endTime' (Жижиг e) байна
    ...(endTime && { endTime: new Date(endTime) }),
    ...(capacity && { capacity: parseInt(capacity) }),
    ...(status !== undefined && { status }),
  },
  include: {
    teacher: true, // Ингэж байж fullName харагдана
  }
});

    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update session:", error);
    return NextResponse.json(
      { error: "Failed to update session", details: error.message },
      { status: 500 },
    );
  }
}
