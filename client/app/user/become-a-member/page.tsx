"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, AtSign, Phone } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { sendMembershipRequest } from "@/lib/api";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const plans = [
  {
    id: "8",
    sessions: 8,
    label: "8 Sessions",
    badge: "Popular",
    badgeColor: "bg-sky-100 text-sky-600",
    options: [
      { months: "1mo", subtitle: "Valid for 30 days", price: "259,000 MNT", note: "STANDARD RATE", noteColor: "text-slate-400" },
      { months: "2mo", subtitle: "Save 5% total", price: "492,100 MNT", note: "", noteColor: "" },
      { months: "3mo", subtitle: "Best Value", price: "699,300 MNT", note: "", noteColor: "" },
    ],
  },
  {
    id: "12",
    sessions: 12,
    label: "12 Sessions",
    badge: "High Frequency",
    badgeColor: "bg-slate-100 text-slate-600",
    options: [
      { months: "1mo", subtitle: "Intensive", price: "319,000 MNT", note: "", noteColor: "" },
      { months: "2mo", subtitle: "Save 5%", price: "606,100 MNT", note: "", noteColor: "" },
      { months: "3mo", subtitle: "Maximum Focus", price: "861,300 MNT", note: "", noteColor: "" },
    ],
  },
];

export default function BecomeAMemberPage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>("8");
  const [selectedMonth, setSelectedMonth] = useState<string>("8-0");
  const [loading, setLoading] = useState(false);

  async function handleSendRequest() {
    if (!user) return;
    setLoading(true);
    try {
      await sendMembershipRequest(
        user.id,
        user.primaryEmailAddress?.emailAddress ?? "",
        user.fullName ?? user.firstName ?? ""
      );
      router.push("/user/become-a-member/pending");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <h1 className="text-base font-bold text-black">Become a Member</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-28">
          <div className="px-5 pt-5 flex flex-col gap-5">

            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl border-2 overflow-hidden transition-all",
                  selectedPlan === plan.id ? "border-sky-500" : "border-slate-100"
                )}
              >
                {/* Plan header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  <h2 className="text-lg font-black text-black">{plan.label}</h2>
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full", plan.badgeColor)}>
                    {plan.badge}
                  </span>
                </div>

                {/* Options */}
                <div className="flex flex-col divide-y divide-slate-100">
                  {plan.options.map((opt, idx) => {
                    const key = `${plan.id}-${idx}`;
                    const isSelected = selectedMonth === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelectedPlan(plan.id); setSelectedMonth(key); }}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 text-left transition-colors",
                          isSelected ? "bg-sky-50" : "bg-white hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-1 h-8 rounded-full",
                            isSelected ? "bg-sky-500" : "bg-slate-200"
                          )} />
                          <div>
                            <p className="text-sm font-bold text-black">{opt.months}</p>
                            <p className="text-xs text-slate-400">{opt.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-base font-black",
                            isSelected ? "text-sky-600" : "text-black"
                          )}>{opt.price}</p>
                          {opt.note && (
                            <p className={cn("text-[10px] font-bold uppercase", opt.noteColor)}>{opt.note}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Payment Instructions */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} className="text-sky-500 shrink-0" />
                <p className="text-sm font-bold text-sky-700">Payment Instructions</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                To finalize your membership activation, please complete the payment via bank transfer.
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" />
                  Contact admin for bank details:
                </p>
                <a
                  href="https://instagram.com/academy_admin"
                  className="flex items-center gap-2 text-xs font-semibold text-sky-500"
                >
                  <AtSign size={13} />
                  Instagram @academy_admin
                </a>
                <a
                  href="tel:+97600000000"
                  className="flex items-center gap-2 text-xs font-semibold text-sky-500"
                >
                  <Phone size={13} />
                  +976 0000 0000
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-2">
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Илгээж байна..." : "Send Membership Request"}
          </button>
          <p className="text-center text-[10px] text-slate-400 leading-relaxed">
            By sending a request, you agree to our terms of service. Our team will verify your payment within 24 hours.
          </p>
        </div>

      </div>
    </div>
  );
}
