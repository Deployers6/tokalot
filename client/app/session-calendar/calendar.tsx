import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const days = [
  { label: "MON", date: 16 },
  { label: "TUE", date: 17 },
  { label: "WED", date: 18, active: true },
  { label: "THU", date: 19 },
  { label: "FRI", date: 20 },
];

function DayCard({
  label,
  date,
  active,
}: {
  label: string;
  date: number;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex h-24 w-20 shrink-0 flex-col items-center justify-center rounded-3xl border transition-all",
        active
          ? "border-sky-500 bg-sky-500 text-white shadow-lg"
          : "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-[0.24em]",
          active ? "text-white/90" : "text-slate-500",
        )}
      >
        {label}
      </span>
      <span className="mt-2 text-4xl font-bold leading-none">{date}</span>
    </button>
  );
}

export default function MobileBookingDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-200 p-6">
      <Card className="w-[400px] overflow-hidden rounded-none border-0 bg-white shadow-2xl">
        <div className="bg-black px-6 py-5">
          <h1 className="text-4xl font-extrabold text-white">Tokalot</h1>
        </div>

        <CardContent className="space-y-6 px-6 py-10">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] text-slate-500">
              BOOK YOUR SESSION
            </p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-black">
              March 26
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {days.map((day) => (
              <DayCard key={`${day.label}-${day.date}`} {...day} />
            ))}
          </div>

          <div className="pt-2">
            <Button className="h-12 rounded-2xl bg-black px-6 text-base font-semibold text-white hover:bg-black/90">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
