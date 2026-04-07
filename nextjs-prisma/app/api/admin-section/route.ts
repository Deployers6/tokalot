// /api/admin/sessions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, level, teacherId, StartTime, endTime, capacity } = body;

        // "2026-04-13T18:10:00Z"-ээс "Z"-г устгаад Монгол цагийн бүсийг (+08:00) залгах
        // Ингэснээр Prisma үүнийг Монгол цаг гэж таньж, бааз руу UTC-ээр зөв хөрвүүлнэ.
        const formatWithTimezone = (dateStr: string) => {
            if (!dateStr) return null;
            // "Z" эсвэл бусад цагийн бүсийг цэвэрлэж, +08:00 нэмэх
            const cleanDate = dateStr.split('.')[0].replace('Z', '');
            return new Date(`${cleanDate}+08:00`);
        };

        const startDate = formatWithTimezone(StartTime);
        const endDate = formatWithTimezone(endTime);

        if (!startDate || isNaN(startDate.getTime())) {
            return NextResponse.json({ error: "Invalid StartTime format" }, { status: 400 });
        }

        const newSection = await prisma.section.create({
            data: {
                title,
                level,
                teacherId,
                StartTime: startDate,
                endTime: endDate || new Date(), // endTime байхгүй бол одоогийн цагийг авах (эсвэл алдаа гаргах)
                capacity: parseInt(capacity),
                status: true
            },
        });

        return NextResponse.json(newSection, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create session:", error);
        return NextResponse.json({ error: "Failed to create session", details: error.message }, { status: 500 });
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