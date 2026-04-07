import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Postman-д зориулж Header-ээс, эсвэл Clerk-ээс ID авна
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId || clerkId === "null") {
    return NextResponse.json({ error: "clerkId олдсонгүй" }, { status: 400 });
  }

  try {
    // Зөвхөн байгаа датаг хайж олно (Шинээр үүсгэхгүй)
    const membership = await prisma.membership.findUnique({
      where: { clerkId: clerkId },
      include: {
        history: {
          orderBy: { createdAt: "desc" }, // Хамгийн сүүлийн түүхийг эхэнд нь
        },
      },
    });

    // Хэрэв байхгүй бол 200 статус бүхий null буцаана (Frontend дээр "Member биш" гэж харуулна)
    return NextResponse.json(membership);
  } catch (error: any) {
    console.error("GET Membership Error:", error);
    return NextResponse.json(
      { error: "Дата авахад алдаа гарлаа" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const rawId = req.headers.get("x-user-id");
  const clerkId = rawId?.trim();

  if (!clerkId || clerkId === "null") {
    return NextResponse.json({ error: "clerkId олдсонгүй" }, { status: 400 });
  }

  try {
    const body = await req.json();
    console.log({ clerkId });

    const current = await prisma.membership.findUnique({
      where: { clerkId: clerkId },
    });

    const updatedMembership = await prisma.membership.upsert({
      where: { clerkId: clerkId },
      update: {
        ...(body.totalSessions !== undefined && {
          totalSessions: Number(body.totalSessions),
        }),
        ...(body.usedSessions !== undefined && {
          usedSessions: Number(body.usedSessions),
        }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.status && { status: body.status }),

        history: {
          create: {
            action: body.action || "ADMIN UPDATE",
      
            change:
              body.totalSessions !== undefined
                ? Number(body.totalSessions) - (current?.totalSessions || 0)
                : 0,
          },
        },
      },
      create: {
       
        clerkId: clerkId,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : new Date(),
        totalSessions: Number(body.totalSessions) || 0,
        usedSessions: Number(body.usedSessions) || 0,
        status: body.status || "PENDING",
        history: {
          create: {
            action: "INITIAL_CREATE_VIA_PATCH",
            change: Number(body.totalSessions) || 0,
          },
        },
      },
      include: {
        history: true,
      },
    });

    return NextResponse.json(updatedMembership);
  } catch (error: any) {
    console.error("PATCH Error Details:", error);
    return NextResponse.json(
      {
        error: "Шинэчлэхэд алдаа гарлаа",
        details: error.message,
        prismaCode: error.code,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json(
      { error: "Header-т x-user-id алга" },
      { status: 400 },
    );
  }

  try {
    const membership = await prisma.membership.findUnique({
      where: { clerkId: clerkId },
    });

    if (membership) {
      await prisma.membershipHistory.deleteMany({
        where: { clerkId: membership.clerkId },
      });

      await prisma.membership.delete({
        where: { clerkId: clerkId },
      });
    }

    return NextResponse.json({ message: "Амжилттай устгагдлаа" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        error: "Устгахад алдаа гарлаа",
        message: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}
