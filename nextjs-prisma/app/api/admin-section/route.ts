import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// POST   /admin/sessions
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {title, level, teacherId,  startTime, endTime, capacity} = body;
        
       const newSection = await prisma.section.create({
    data: {
        title,
        level,
        teacherId,
        StartTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: parseInt(capacity),
        status: true
    },
});
        return NextResponse.json(newSection, {status: 201})
    }catch(error){
        console.error("Failed to create session", error);
        return NextResponse.json({error: "Failed"}, {status: 500})
    }
}
// GET    /admin/sessions
export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      include: {
        teacher: true,
      },
      orderBy: { StartTime: "asc" },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: "Уншихад алдаа гарлаа" }, { status: 500 });
  }
}