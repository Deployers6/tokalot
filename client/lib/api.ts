const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";

// Sessions авах (огноогоор)
export async function fetchSessions(date: string) {
  const res = await fetch(`/api/sessions?date=${date}`);
  if (!res.ok) throw new Error("Sessions авахад алдаа гарлаа");
  return res.json();
}

// Session захиалах
export async function bookSession(sectionId: string, _clerkId?: string) {
  const res = await fetch(`/api/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sectionId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Захиалга хийхэд алдаа гарлаа");
  return data;
}

// Захиалга цуцлах
export async function cancelBooking(bookingId: string, _clerkId?: string) {
  const res = await fetch(`/api/booking`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Цуцлахад алдаа гарлаа");
  return data;
}

// Миний захиалгууд
export async function fetchMyBookings(clerkId: string, status: "upcoming" | "completed") {
  const res = await fetch(`/api/user/my-bookings?status=${status}`);
  if (!res.ok) throw new Error("Захиалгууд авахад алдаа гарлаа");
  return res.json();
}

// User profile шинэчлэх (client-ийн өөрийн API route)
export async function updateUserProfile(firstName: string, lastName: string) {
  const res = await fetch(`/api/user/update-profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Хадгалахад алдаа гарлаа");
  return data;
}

// Membership мэдээлэл авах
export async function fetchMembership(_clerkId?: string) {
  const res = await fetch(`/api/membership/status`);
  if (!res.ok) throw new Error("Membership авахад алдаа гарлаа");
  return res.json();
}

// Membership хүсэлт илгээх
export async function sendMembershipRequest(clerkId: string, email: string, fullName: string) {
  const res = await fetch(`/api/membership/request`, {
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
