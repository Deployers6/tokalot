import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sectionId } = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/user/user-booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sectionId, clerkId: userId }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/user/user-booking/${bookingId}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
