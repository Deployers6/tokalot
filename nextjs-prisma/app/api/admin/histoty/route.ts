import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function DELETE(req: NextRequest) {
  try {
    // 💡 Эхлээд текст хэлбэрээр уншиж шалгах (JSON хоосон эсэхийг мэдэхийн тулд)
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: "Body хоосон байна" }, { status: 400 });
    }

    const body = JSON.parse(text);
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID шаардлагатай" }, { status: 400 });
    }

    await prisma.membershipHistory.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Амжилттай устлаа" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "JSON формат буруу эсвэл дата олдсонгүй" }, { status: 500 });
  }
}