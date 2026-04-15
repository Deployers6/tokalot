import { Loader2, Trash2 } from "lucide-react";

interface DeleteSessionDialogProps {
  deleting: boolean;
  error: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteSessionDialog({
  deleting,
  error,
  title,
  onCancel,
  onConfirm,
}: DeleteSessionDialogProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-center">
        <Trash2 className="mx-auto mb-2 h-8 w-8 text-red-400" />
        <p className="font-black text-slate-800">Delete this session?</p>
        <p className="mt-1 text-xs font-medium text-slate-500">&quot;{title}&quot; will be permanently removed.</p>
      </div>
      {error ? <p className="text-center text-xs font-bold text-red-500">{error}</p> : null}
      <button onClick={onConfirm} disabled={deleting} className="flex w-full justify-center rounded-xl bg-red-500 py-4 font-black text-white">
        {deleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Yes, Delete"}
      </button>
      <button onClick={onCancel} className="w-full rounded-xl bg-slate-100 py-4 font-black text-slate-600">Cancel</button>
    </div>
  );
}
