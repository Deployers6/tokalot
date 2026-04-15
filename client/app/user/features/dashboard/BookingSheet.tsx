export function BookingSheet({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full flex-col gap-4 rounded-t-3xl bg-white px-6 pb-10 pt-8 shadow-2xl">
        <button onClick={onConfirm} className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white">Confirm Booking</button>
        <button onClick={onClose} className="w-full py-3 text-sm font-semibold text-slate-500">Cancel</button>
      </div>
    </div>
  );
}
