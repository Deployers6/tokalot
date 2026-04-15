import { BookMarked, CalendarDays, UserCircle } from "lucide-react";

export const userNavItems = [
  { href: "/user/dashboard", label: "Schedule", value: "schedule", icon: CalendarDays },
  { href: "/user/profile", label: "Profile", value: "profile", icon: UserCircle },
  { href: "/user/my-sessions", label: "Sessions", value: "sessions", icon: BookMarked },
] as const;

export type UserNavValue = (typeof userNavItems)[number]["value"];
