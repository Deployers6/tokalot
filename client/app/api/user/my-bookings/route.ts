import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tokalot.vercel.app";

interface BookingSection {
  StartTime: string;
  endTime: string;
}

interface UserBooking {
  status: boolean;
  section: BookingSection;
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const res = await fetch(`${BACKEND_URL}/api/user/user-booking-me?userId=${userId}`);
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });

  const all: UserBooking[] = await res.json();
  const now = new Date();
  let filtered: UserBooking[];

  if (status === "upcoming") {
    filtered = all.filter(
      (b) => b.status === true && new Date(b.section.StartTime) > now
    );
  } else {
    // history: дууссан active + бүх cancelled
    filtered = all.filter(
      (b) =>
        (b.status === true && new Date(b.section.endTime) < now) ||
        b.status === false
    );
    filtered.sort(
      (a, b) =>
        new Date(b.section.StartTime).getTime() -
        new Date(a.section.StartTime).getTime()
    );
  }

  return NextResponse.json(filtered);
}
