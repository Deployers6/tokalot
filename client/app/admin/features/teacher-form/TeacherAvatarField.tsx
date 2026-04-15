import Image from "next/image";
import { Camera, User } from "lucide-react";
import { RefObject } from "react";

interface TeacherAvatarFieldProps {
  imageUrl: string;
  preview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (file: File) => void;
  label: string;
}

export function TeacherAvatarField({
  imageUrl,
  preview,
  fileInputRef,
  onFileChange,
  label,
}: TeacherAvatarFieldProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[40px] border-4 border-white bg-slate-100 shadow-md">
          {preview || imageUrl ? (
            <Image src={preview || imageUrl} alt="Teacher preview" fill className="object-cover" />
          ) : (
            <User className="h-12 w-12 text-slate-300" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[#20BEF9] text-white shadow-lg"
        >
          <Camera className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileChange(file);
          }}
        />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">{label}</p>
    </div>
  );
}
