interface TeacherBioFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TeacherBioField({ value, onChange }: TeacherBioFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        Professional Bio
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe teaching style and background..."
        className="h-[140px] w-full resize-none rounded-[28px] border border-transparent bg-[#efefef] p-6 font-bold leading-relaxed text-slate-800 outline-none focus:border-[#20BEF9]"
      />
    </label>
  );
}
