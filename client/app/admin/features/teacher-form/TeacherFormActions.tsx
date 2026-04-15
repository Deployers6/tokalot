import { Loader2, Trash2 } from "lucide-react";

interface TeacherFormActionsProps {
  saving: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function TeacherFormActions({
  saving,
  onSave,
  onDelete,
}: TeacherFormActionsProps) {
  return (
    <div className="space-y-3 pt-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex h-[65px] w-full items-center justify-center gap-2 rounded-[24px] bg-black text-sm font-black uppercase tracking-[0.2em] text-white disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {saving ? "Saving..." : "Save Teacher"}
      </button>
      {onDelete ? (
        <button
          onClick={onDelete}
          className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[24px] border-2 border-red-500/20 text-xs font-black uppercase tracking-[0.2em] text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          Delete Profile
        </button>
      ) : null}
    </div>
  );
}
