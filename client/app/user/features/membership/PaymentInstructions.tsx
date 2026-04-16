import { AtSign, Info, Phone } from "lucide-react";

export function PaymentInstructions() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2"><Info className="h-4 w-4 shrink-0 text-sky-500" /><p className="text-sm font-bold text-sky-700">Payment Instructions</p></div>
      <p className="mb-3 text-xs leading-relaxed text-slate-600">To finalize your membership activation, please complete the payment via bank transfer.</p>
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Phone className="h-3 w-3 text-slate-400" />Contact admin for bank details:</p>
        <a href="https://www.instagram.com/tokalotcafe" className="flex items-center gap-2 text-xs font-semibold text-sky-500"><AtSign className="h-3 w-3" />tokalotcafe</a>
        <a href="tel:+97691930011" className="flex items-center gap-2 text-xs font-semibold text-sky-500"><Phone className="h-3 w-3" />+976 91930011</a>
      </div>
    </div>
  );
}
