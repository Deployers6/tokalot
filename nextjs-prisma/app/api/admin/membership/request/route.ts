import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
 
  const clerkId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");
  const fullName = req.headers.get("x-user-name") || "Шинэ сурагч";

  
  if (!clerkId || !email) {
    return NextResponse.json(
      { error: "clerkId эсвэл email дутуу байна (Headers-ээ шалгана уу)" }, 
      { status: 400 }
    );
  }

  try {
    
    const user = await prisma.user.upsert({
      where: { clerkId: clerkId },
      update: {
        email: email,
        fullName: fullName,
      },
      create: {
        clerkId: clerkId,
        email: email,
        fullName: fullName,
      },
    });

    
    const existingMembership = await prisma.membership.findUnique({
      where: { clerkId: clerkId },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "Та аль хэдийн хүсэлт илгээсэн байна." },
        { status: 400 }
      );
    }

    
    const newMembership = await prisma.membership.create({
      data: {
        clerkId: clerkId,
        status: "PENDING",
        totalSessions: 0,
        usedSessions: 0,
        
      },
    });


    try {
      await resend.emails.send({
        from: "Tokalot <onboarding@resend.dev>",
        to: "telmuunotgonbileg@gmail.com",
        subject: `🔔 Шинэ хүсэлт: ${fullName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Гишүүнчлэлийн шинэ хүсэлт</h2>
            <p><strong>Сурагчийн нэр:</strong> ${fullName}</p>
            <p><strong>Имэйл хаяг:</strong> ${email}</p>
            <p><strong>Clerk ID:</strong> ${clerkId}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666;">Админ панел руугаа орж хүсэлтийг шийдвэрлэнэ үү.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend Error:", emailError);
      
    }

    return NextResponse.json(newMembership);

  } catch (error: any) {
    console.error("[MEMBERSHIP_REQUEST_ERROR]", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа", details: error.message },
      { status: 500 }
    );
  }
}