import type { MembershipStatus } from "./types";

export const STATUS_CONFIG: Record<
  MembershipStatus,
  { label: string; icon: string; color: string }
> = {
  ACTIVE: { label: "Active", icon: "✅", color: "text-green-600" },
  PENDING: { label: "Pending", icon: "🟡", color: "text-yellow-500" },
  EXPIRED: { label: "Expired", icon: "❌", color: "text-red-500" },
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
