import type { SessionEditorValues, TeacherOption } from "./types";

interface SessionFormFieldsProps {
  form: SessionEditorValues;
  teachers: TeacherOption[];
  onChange: (name: keyof SessionEditorValues, value: string) => void;
}

const boxClass =
  "flex flex-col rounded-xl border border-[#a8e6fa] bg-[#d6f4ff] px-4 py-3";

export function SessionFormFields({
  form,
  teachers,
  onChange,
}: SessionFormFieldsProps) {
  return (
    <div className="space-y-3">
      <Field label="Session Name">
        <input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
      </Field>
      <Field label="Session Date">
        <input
          type="date"
          value={form.sessionDate}
          onChange={(e) => onChange("sessionDate", e.target.value)}
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Start">
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
            className="w-full bg-transparent text-sm font-bold outline-none"
          />
        </Field>
        <Field label="End">
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
            className="w-full bg-transparent text-sm font-bold outline-none"
          />
        </Field>
      </div>
      <Field label="Seats">
        <input
          type="number"
          min="1"
          value={form.capacity}
          onChange={(e) => onChange("capacity", e.target.value)}
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
      </Field>
      <label className={boxClass}>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Teacher
        </span>
        <select
          value={form.teacherId}
          onChange={(e) => onChange("teacherId", e.target.value)}
          className="bg-transparent text-sm font-bold outline-none"
        >
          <option value="">
            {teachers.length ? "Select a teacher" : "No teachers found"}
          </option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={boxClass}>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
