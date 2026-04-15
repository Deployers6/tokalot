"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Camera, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/app/admin/components/Footer";
import Image from "next/image";

interface TeacherForm {
  name: string;
  level: string;
  bio: string;
  image: string;
}

export default function AddNewTeacher() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<TeacherForm>({
    name: "",
    level: "",
    bio: "",
    image: "/default-profile.png",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.level) {
      alert("Name and Experience Level are required!");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: form.name,
            bio: form.bio,
            experience: form.level,
            imageUrl: form.image,
          }),
        },
      );

      if (res.ok) {
        router.push("/admin/teachers");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
      >
        <div className="w-full h-[60px] bg-black text-white flex items-center px-5 shrink-0 z-30">
          <Link
            href="/admin/teachers"
            className="flex items-center gap-3 active:opacity-70 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#20BEF9]" />
            <h1 className="text-lg font-black tracking-tight text-[#EFEFEF]">
              Add New Teacher
            </h1>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-[40px] bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-[#20BEF9] text-white rounded-2xl w-11 h-11 flex items-center justify-center shadow-lg active:scale-90 transition border-4 border-white"
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8">
              Upload Photo
            </p>

            <div className="w-full space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full h-[60px] px-6 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Experience Level
                </label>
                <input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. 5 Years, Senior Expert"
                  className="w-full h-[60px] px-6 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Describe teaching style and background..."
                  className="w-full h-[140px] p-6 rounded-[28px] bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-[65px] rounded-[24px] bg-black text-white font-black uppercase tracking-[3px] text-sm shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all mt-4"
              >
                {loading ? "Saving..." : "Save Teacher"}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
