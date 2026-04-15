import { Mail, User } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
}

export function ProfileForm({
  fullName,
  email,
  onFullNameChange,
}: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field icon={<User className="h-4 w-4 text-slate-400" />} label="Full Name">
        <input value={fullName} onChange={(e) => onFullNameChange(e.target.value)} className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none" placeholder="Full name" />
      </Field>
      <Field icon={<Mail className="h-4 w-4 text-slate-400" />} label="Email Address">
        <input value={email} disabled className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none" />
      </Field>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-black">{label}</span><div className="flex items-center gap-3 rounded-[12px] bg-[#efefef] px-4 py-4">{icon}{children}</div></label>;
}
