import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Next.js 15-д params нь Promise байдаг
) {
 
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;
  
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  }

  try {
    // 3. Захиалгыг хайх (Хичээлийн эхлэх цагтай нь цуг)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { section: true },
    });

    // Хэрэв ID-аар олдохгүй бол энд баригдана
    if (!booking) {
      return NextResponse.json(
        { error: `ID: ${bookingId} захиалга олдсонгүй` }, 
        { status: 404 }
      );
    }

    // 4. Өөрийнх нь захиалга мөн эсэхийг шалгах (Security)
    if (booking.clerkId !== clerkId) {
      return NextResponse.json({ error: "Бусдын захиалгыг цуцлах эрхгүй" }, { status: 403 });
    }

    // 5. 48 ЦАГИЙН ЛОГИК ШАЛГАЛТ
    const now = new Date();
    const startTime = new Date(booking.section.StartTime);
    
    // Цагийн зөрүүг тооцоолох (Milliseconds -> Hours)
    const diffInHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 48) {
      return NextResponse.json(
        { error: "Хичээл эхлэхээс 48 цагийн өмнө цуцлах ёстой. Одоо цуцлах боломжгүй." },
        { status: 400 }
      );
    }


    await prisma.$transaction(async (tx) => {
     
      await tx.booking.delete({
        where: { id: bookingId },
      });

   
      await tx.membership.update({
        where: { clerkId: clerkId },
        data: {
          usedSessions: { decrement: 1 },
          history: {
            create: {
              action: "CANCEL_REFUND",
              change: 1, 
            },
          },
        },
      });
    });

    return NextResponse.json({ 
      message: "Захиалга амжилттай цуцлагдлаа. Хичээлийн эрх буцаан олгогдсон." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("CANCEL_ERROR:", error);
    return NextResponse.json({ error: "Цуцлах үйлдэл амжилтгүй боллоо" }, { status: 500 });
  }
}
