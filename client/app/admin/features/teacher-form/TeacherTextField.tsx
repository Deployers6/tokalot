import type { TeacherFormValues } from "./types";

interface TeacherTextFieldProps {
  label: string;
  name: keyof TeacherFormValues;
  value: string;
  placeholder: string;
  onChange: (name: keyof TeacherFormValues, value: string) => void;
}

export function TeacherTextField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: TeacherTextFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-[60px] w-full rounded-2xl border border-transparent bg-[#efefef] px-6 font-bold text-slate-800 outline-none focus:border-[#20BEF9]"
      />
    </label>
  );
}
