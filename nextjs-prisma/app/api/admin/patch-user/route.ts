import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetClerkId, firstName, lastName } = body;

    
    if (!targetClerkId) {
      return NextResponse.json(
        { error: "Засах хэрэглэгчийн ID (targetClerkId) дутуу байна" },
        { status: 400 }
      );
    }

    
    const client = await clerkClient();
    
    const updatedUser = await client.users.updateUser(targetClerkId, {
      firstName: firstName, 
      lastName: lastName,   
    });

    return NextResponse.json({
      message: "Clerk дээрх мэдээлэл амжилттай шинэчлэгдлээ",
      updatedData: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("CLERK_PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Clerk дээр засахад алдаа гарлаа", details: error.message },
      { status: 500 }
    );
  }
}
