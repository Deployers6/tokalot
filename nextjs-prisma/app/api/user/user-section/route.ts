import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
const sessions = await prisma.section.findMany({
  where: {
    status: true, 
  },
  select: {
    id: true,
    title: true,
    StartTime: true,
    endTime: true,
    level: true,     
  },
  orderBy: { 
    StartTime: "asc"
  },
});

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}