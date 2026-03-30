import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const { id } = await params; 

    const session = await prisma.section.findUnique({
      where: {
        id: id, 
      },
      select: {
        id: true,
        title: true,
        level: true,
        StartTime: true,
        endTime: true,
        capacity: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session detail" },
      { status: 500 },
    );
  }
}