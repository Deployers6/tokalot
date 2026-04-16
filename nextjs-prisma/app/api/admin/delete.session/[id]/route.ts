import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

  
    const sessionToDelete = await prisma.section.findUnique({
      where: { id: id },
      include: {
        bookings: {
          include: {
            user: true,
          },
        },
        teacher: true,
      },
    });

    if (!sessionToDelete) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const now = new Date();
    const sessionStartTime = new Date(sessionToDelete.StartTime);
    const hasSessionStarted = now >= sessionStartTime;

    const updates = [];

  
    if (!hasSessionStarted && sessionToDelete.bookings.length > 0) {
      for (const booking of sessionToDelete.bookings) {
        updates.push(
          prisma.membership.update({
            where: { clerkId: booking.clerkId },
            data: { usedSessions: { decrement: 1 } },
          })
        );
      }
    }

    updates.push(
      prisma.section.delete({
        where: { id: id },
      })
    );

   
    await prisma.$transaction(updates);

    if (!hasSessionStarted && sessionToDelete.bookings.length > 0) {
    
      const emailPromises = sessionToDelete.bookings.map((booking) => {

        if (!booking.user?.email) return Promise.resolve(null);

        return resend.emails.send({
          from: "Tokalot <onboarding@resend.dev>", 
          to: booking.user.email,
          subject: `📚 Your class "${sessionToDelete.title}" has been cancelled`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">Class Cancelled</h1>
              </div>
              <div style="padding: 30px; line-height: 1.6; color: #333;">
                <p>Hi <b>${booking.user.fullName}</b>,</p>
                <p>We're sorry to inform you that your class <b>"${sessionToDelete.title}"</b> scheduled for <b>${sessionStartTime.toLocaleString()}</b> has been cancelled.</p>
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; color: #2e7d32; font-weight: bold; margin: 20px 0;">
                  ✅ Your class credit has been fully refunded to your account.
                </div>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://tokalot.mn" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book Another Class</a>
                </div>
              </div>
            </div>
          `,
        }).catch(err => {
          console.error(`❌ Email error for ${booking.user.email}:`, err);
          return null;
        });
      });

      await Promise.all(emailPromises);
    }

    return NextResponse.json({ 
      message: "Session deleted and credits refunded",
      emailsAttempted: sessionToDelete.bookings.length 
    });

  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
