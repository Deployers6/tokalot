interface MemberCountCardProps {
  count: number;
}

export function MemberCountCard({ count }: MemberCountCardProps) {
  return (
    <div className="rounded-2xl border border-[#20BEF9]/20 bg-[#e0f8ff] px-4 py-3 text-center">
      <p className="text-2xl font-black text-[#20BEF9]">{count}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#20BEF9]">
        Total
      </p>
    </div>
  );
}
