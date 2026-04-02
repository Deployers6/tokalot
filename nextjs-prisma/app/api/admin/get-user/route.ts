import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Хүсэлт гаргаж буй Админы ID-г Header-ээс авах
    const adminClerkId = req.headers.get("x-admin-id");

    if (!adminClerkId) {
      return NextResponse.json({ error: "Админы ID дутуу байна" }, { status: 400 });
    }

    const client = await clerkClient();

    // 2. Clerk-ээс бүх хэрэглэгчдийг татах
    const response = await client.users.getUserList({
      limit: 100,
    });

    // 3. Жагсаалтаас АДМИН-ыг хасч (Filter), зөвхөн СУРАГЧ-дыг авах
    const studentsOnly = response.data
      .filter((user) => user.id !== adminClerkId) // Хүсэлт гаргасан Админы ID-г хасна
      .map((user) => {
        const email = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId
        )?.emailAddress || user.emailAddresses[0]?.emailAddress;

        return {
          clerkId: user.id,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No Name",
          email: email,
        };
      });

    return NextResponse.json(studentsOnly);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}