import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// ЭНЭ ХЭСЭГ МАШ ЧУХАЛ: Cache-ийг бүрэн идэвхгүй болгоно
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const client = await clerkClient();

    // Clerk-ээс шинээр дата татах
    const response = await client.users.getUserList({
      limit: 100,
    });

    const users = response.data.map((user) => {
      const email = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress || user.emailAddresses[0]?.emailAddress || "No Email";

      return {
        clerkId: user.id,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No Name",
        email: email,
        _fetchedAt: new Date().toISOString(), // Хэзээ татсаныг харуулах (Check-ийн тулд)
      };
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}