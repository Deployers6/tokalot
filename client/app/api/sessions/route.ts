import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const res = await fetch(`${BACKEND_URL}/api/user/user-section?date=${date}`);
  if (!res.ok) return NextResponse.json([], { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}
