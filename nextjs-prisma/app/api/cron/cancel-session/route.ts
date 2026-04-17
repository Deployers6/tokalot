import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
 
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
  
    const nowMN = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" })
    );

    
    const activeSessions = await prisma.section.findMany({
      where: { status: true },
      include: {
        bookings: true,
        _count: { select: { bookings: true } },
      },
    });

    const updates = [];

    for (const session of activeSessions) {
     
      const sessionStart = new Date(session.StartTime);

      
      const diffInMs = sessionStart.getTime() - nowMN.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours <= 48) {
    
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        if (session._count.bookings < 3) {
          for (const booking of session.bookings) {
            updates.push(
              prisma.membership.update({
                where: { clerkId: booking.clerkId },
                data: { usedSessions: { decrement: 1 } }
              })
            );
          }
        }
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({
      success: true,
      data: {
        currentTimeMN: nowMN.toLocaleString(), 
        sessionsFound: activeSessions.length,
        actuallyUpdated: updates.length
      }
    });

  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}