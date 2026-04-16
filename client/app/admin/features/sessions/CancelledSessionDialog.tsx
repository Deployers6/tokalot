"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { formatSessionTime } from "@/app/admin/lib/session-time";
import { ADMIN_SESSION_URL } from "../common/api";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import type { Section } from "./types";

interface CancelledSessionDialogProps {
  section: Section;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelledSessionDialog({
  section,
  onClose,
  onSuccess,
}: CancelledSessionDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (confirmDelete) {
    return (
      <DeleteSessionDialog
        deleting={deleting}
        error={error}
        title={section.title}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            const response = await fetch(`${ADMIN_SESSION_URL}/api/admin/delete.session/${section.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            onSuccess();
          } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
            setDeleting(false);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button type="button" onClick={onClose} className="text-[#20BEF9]"><ArrowLeft className="h-5 w-5" /></button><h2 className="text-lg font-black">Cancelled Session</h2></div>
      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <p className="text-sm font-black text-slate-700">{section.title}</p>
        <p className="mt-1 text-[11px] font-medium text-slate-400">{formatSessionTime(section.StartTime)} - {formatSessionTime(section.endTime)}</p>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-red-400">This session has been cancelled</p>
      </div>
      <button type="button" onClick={() => setConfirmDelete(true)} className="w-full rounded-xl bg-red-500 py-4 font-black uppercase tracking-[0.2em] text-white">Delete Session</button>
    </div>
  );
}
