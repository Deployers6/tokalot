import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface AdminTopBarProps {
  eyebrow?: string;
  title?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function AdminTopBar({
  eyebrow,
  title,
  actions,
  backHref,
  backLabel = "Back",
}: AdminTopBarProps) {
  return (
    <header className="hidden items-center justify-between border-b border-slate-100 px-8 py-6 lg:flex">
      <div className="space-y-1">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#20BEF9]"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : null}
        {eyebrow ? (
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
            {eyebrow}
          </p>
        ) : null}
        {title ? <h1 className="text-3xl font-black text-slate-950">{title}</h1> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}
