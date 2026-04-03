import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
//admin session update
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { title, startTime, level, endTime, capacity, status } = body;

    const updatedSection = await prisma.section.update({
      where: { id: id },
      data: {
        ...(title && { title }),
        ...(level && { level }),
        ...(startTime && { StartTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error) {
    console.error("Unsuccessful to create session:", error);
    return NextResponse.json(
      { error: "Unsuccessful to create session" },
      { status: 500 },
    );
  }
}
