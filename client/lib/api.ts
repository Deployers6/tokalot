const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";

// Sessions авах (огноогоор)
export async function fetchSessions(date: string) {
  const res = await fetch(`${BACKEND_URL}/api/user/user-section?date=${date}`);
  if (!res.ok) throw new Error("Sessions авахад алдаа гарлаа");
  return res.json();
}

// Session захиалах
export async function bookSession(sectionId: string, clerkId: string) {
  const res = await fetch(`${BACKEND_URL}/api/user/user-booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sectionId, clerkId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Захиалга хийхэд алдаа гарлаа");
  return data;
}

// Миний захиалгууд
export async function fetchMyBookings(clerkId: string, status: "upcoming" | "completed") {
  const res = await fetch(
    `${BACKEND_URL}/api/user/user-booking/booking-my?status=${status}`,
    { headers: { "x-user-id": clerkId } }
  );
  if (!res.ok) throw new Error("Захиалгууд авахад алдаа гарлаа");
  return res.json();
}

// Membership хүсэлт илгээх
export async function sendMembershipRequest(clerkId: string, email: string, fullName: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/membership/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": clerkId,
      "x-user-email": email,
      "x-user-name": fullName,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Хүсэлт илгээхэд алдаа гарлаа");
  return data;
}
