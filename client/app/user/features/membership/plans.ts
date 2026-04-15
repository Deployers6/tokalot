export const membershipPlans = [
  {
    id: "8",
    label: "8 Sessions",
    badge: "Popular",
    badgeColor: "bg-sky-100 text-sky-600",
    options: [
      { months: "1mo", subtitle: "Valid for 30 days", price: "259,000 MNT", note: "STANDARD RATE" },
      { months: "2mo", subtitle: "Save 5% total", price: "492,100 MNT", note: "" },
      { months: "3mo", subtitle: "Best Value", price: "699,300 MNT", note: "" },
    ],
  },
  {
    id: "12",
    label: "12 Sessions",
    badge: "High Frequency",
    badgeColor: "bg-slate-100 text-slate-600",
    options: [
      { months: "1mo", subtitle: "Intensive", price: "319,000 MNT", note: "" },
      { months: "2mo", subtitle: "Save 5%", price: "606,100 MNT", note: "" },
      { months: "3mo", subtitle: "Maximum Focus", price: "861,300 MNT", note: "" },
    ],
  },
] as const;

export type MembershipPlan = (typeof membershipPlans)[number];
