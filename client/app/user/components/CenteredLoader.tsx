import { Loader2 } from "lucide-react";

export function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-400">
      <Loader2 className="h-7 w-7 animate-spin text-sky-500" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
