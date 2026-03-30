import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.section.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "Deletion Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("error");
    return NextResponse.json({ error: "Unsuccessful" }, { status: 500 });
  }
}
