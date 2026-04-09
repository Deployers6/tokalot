import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addHours } from "@/lib/session-time";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const limit48h = addHours(now, 48);

    const result = await prisma.$transaction(
      async (tx: any) => {
        const sessions = await tx.section.findMany({
          where: {
            status: true,
            StartTime: {
              gt: now,
              lte: limit48h,
            },
          },
          select: {
            id: true,
            StartTime: true,
          },
        });

        const closedSessionIds: string[] = [];
        let refundedBookings = 0;

        for (const session of sessions) {
          const activeBookings = await tx.booking.findMany({
            where: {
              sectionId: session.id,
              status: true,
            },
            select: {
              id: true,
              clerkId: true,
            },
          });

          if (activeBookings.length >= 3) {
            continue;
          }

          const closedSection = await tx.section.updateMany({
            where: {
              id: session.id,
              status: true,
            },
            data: {
              status: false,
            },
          });

          if (closedSection.count === 0) {
            continue;
          }

          if (activeBookings.length > 0) {
            await tx.booking.updateMany({
              where: {
                sectionId: session.id,
                status: true,
              },
              data: {
                status: false,
              },
            });

            for (const booking of activeBookings) {
              await tx.membership.update({
                where: { clerkId: booking.clerkId },
                data: {
                  usedSessions: {
                    decrement: 1,
                  },
                },
              });
            }

            refundedBookings += activeBookings.length;
          }

          closedSessionIds.push(session.id);
        }

        return {
          closedSessionIds,
          refundedBookings,
          foundCandidates: sessions.length,
        };
      },
      {
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return NextResponse.json({
      success: true,
      closedSessionIds: result.closedSessionIds,
      processedSessions: result.closedSessionIds.length,
      refundedBookings: result.refundedBookings,
      foundCandidates: result.foundCandidates,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
