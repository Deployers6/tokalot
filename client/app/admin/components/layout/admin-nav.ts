import { CalendarRange, GraduationCap, Users } from "lucide-react";

export const adminNavItems = [
  { href: "/admin", label: "Sessions", icon: CalendarRange },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
] as const;
