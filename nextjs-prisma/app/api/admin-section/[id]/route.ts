import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// GET    /admin/sessions/:sessionId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 

    const section = await prisma.section.findUnique({
      where: { id: id },
      include: {
        teacher: true,
        bookings: {
          where: {
            status: true,
          },
        },
      },
      
    });
    

    if (!section) {
      return NextResponse.json({ error: "Not found session" }, { status: 404 });
    }
return NextResponse.json({section, message: "Successful"}, {status: 200});
    
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
