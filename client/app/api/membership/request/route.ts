import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tokalot.vercel.app";

export async function POST(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");
  const fullName = req.headers.get("x-user-name");

  const res = await fetch(`${BACKEND_URL}/api/admin/membership/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": clerkId ?? "",
      "x-user-email": email ?? "",
      "x-user-name": fullName ?? "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
