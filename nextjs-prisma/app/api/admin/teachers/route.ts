import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role || req.headers.get("x-role");

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Зөвшөөрөлгүй хандалт" },
        { status: 403 },
      );
    }

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

export async function PATCH(req: Request) {
  try {
    
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role || req.headers.get("x-role");

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Зөвшөөрөлгүй хандалт. Админ эрх шаардлагатай." },
        { status: 403 }
      );
    }

   
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Багшийн ID олдсонгүй" }, { status: 400 });
    }

   
    const body = await req.json();

    const { fullName, bio, experience, imageUrl } = body;

   
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        
        fullName: fullName ?? undefined,
        bio: bio ?? undefined,
        experience: experience ?? undefined,
        imageUrl: imageUrl ?? undefined,
      },
    });

    return NextResponse.json({
      message: "Багшийн мэдээлэл амжилттай шинэчлэгдлээ",
      updatedTeacher,
    });

  } catch (error: any) {
    console.error("PATCH_TEACHER_ERROR:", error);

    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Ийм ID-тай багш олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Серверийн алдаа", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { sessionClaims } = await auth();
    const clerkRole = sessionClaims?.metadata?.role;
    const headerRole = req.headers.get("x-role");

    if (clerkRole !== "ADMIN" && headerRole !== "ADMIN") {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    if (!teacherId) {
      return NextResponse.json({ error: "ID олдсонгүй" }, { status: 400 });
    }

    await prisma.section.deleteMany({
      where: { teacherId: teacherId },
    });

    
    const deletedTeacher = await prisma.teacher.delete({
      where: { id: teacherId },
    });

    return NextResponse.json({
      message: "Амжилттай устгагдлаа",
      deletedTeacher,
    });

  } catch (error: any) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json({ 
      error: "Устгахад алдаа гарлаа", 
      details: error.message 
    }, { status: 500 });
  }
}