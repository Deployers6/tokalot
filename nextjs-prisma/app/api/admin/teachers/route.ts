import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // const { sessionClaims } = await auth();


    // if (sessionClaims?.metadata?.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 403 });
    // }

    const body = await req.json();
    const { fullName, bio, experience, imageUrl } = body;

    const newTeacher = await prisma.teacher.create({
      data: {
        fullName,
        bio,
        experience,
        imageUrl,
        isActive: true,
      },
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error("Failed to add teacher", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: "Loading error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
  
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID олдсонгүй" }, { status: 400 });
    }

    const deletedTeacher = await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: "Амжилттай устгагдлаа", 
      deletedTeacher 
    });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}