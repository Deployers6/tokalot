import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tokalot.vercel.app";

export async function GET(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");

  const res = await fetch(`${BACKEND_URL}/api/admin/membership`, {
    headers: { "x-user-id": clerkId ?? "" },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
