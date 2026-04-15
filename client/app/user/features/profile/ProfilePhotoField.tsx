import Image from "next/image";
import { Camera, User } from "lucide-react";

interface ProfilePhotoFieldProps {
  photo: string | null;
  loading: boolean;
  onChoose: () => void;
}

export function ProfilePhotoField({
  photo,
  loading,
  onChoose,
}: ProfilePhotoFieldProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-sky-400 bg-slate-100">
          {photo ? <Image src={photo} alt="profile" width={96} height={96} unoptimized className="h-full w-full object-cover" /> : <User className="h-10 w-10 text-slate-400" />}
        </div>
        <button onClick={onChoose} className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-md">
          <Camera className="h-3 w-3" />
        </button>
      </div>
      <button onClick={onChoose} disabled={loading} className="mt-2 text-sm font-semibold text-black disabled:opacity-50">
        {loading ? "Saving..." : "Change Photo"}
      </button>
    </div>
  );
}
