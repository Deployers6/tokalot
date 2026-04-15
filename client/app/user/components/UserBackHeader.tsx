"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserBackHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100">
        <ArrowLeft className="h-4 w-4 text-slate-700" />
      </button>
      <h1 className="text-base font-bold text-black">{title}</h1>
    </header>
  );
}
