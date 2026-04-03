"use client";

import { useState, useRef } from "react";
import { Camera, User, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Image from "next/image";

const levels = ["Basic", "Intermediate", "Advanced"];

interface TeacherForm {
  name: string;
  level: string;
  bio: string;
  image: string;
}

export default function AddNewTeacher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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
    setForm((prev) => ({ ...prev, image: objectUrl }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.level) {
      alert("Name болон Level шаардлагатай!");
      return;
    }

    try {
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          bio: form.bio,
          experience: form.level,
          imageUrl: form.image,
        }),
      });

      if (!res.ok) throw new Error("Алдаа гарлаа");

      router.push("/admin/teachers");
    } catch (err) {
      alert("Хадгалахад алдаа гарлаа");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start">
      <div className="w-screen h-15 bg-black text-white font-extrabold text-2xl p-4">
        <Link href="/admin/teachers" className="flex items-center">
          <ArrowLeft className="w-[20px] h-[20px] mr-2" />
          <h1 className="text-[20px] font-bold text-[#EFEFEF]">
            Add New Teacher
          </h1>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative pt-8">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile preview"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-[44px] h-[44px] text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <Camera />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <p className="mt-2 text-gray-600 text-sm">Upload Profile Photo</p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Experience Level
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className={`w-full h-[56px] px-4 bg-[#EFEFEF] border-none flex items-center justify-between cursor-pointer text-sm transition-all ${open ? "rounded-t-xl" : "rounded-xl"}`}
            >
              <span className={form.level ? "text-gray-800" : "text-gray-400"}>
                {form.level || "Select level"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            {open && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-xl overflow-hidden z-10">
                {levels.map((l, i) => (
                  <div
                    key={l}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, level: l }));
                      setOpen(false);
                    }}
                    className={`px-4 py-3.5 text-sm cursor-pointer hover:bg-gray-50 ${
                      form.level === l
                        ? "bg-[#EFEFEF] font-medium"
                        : "text-gray-700"
                    } ${i !== levels.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Professional Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Briefly describe academic background and teaching style..."
            className="w-full h-[128px] p-3 rounded-xl bg-[#EFEFEF]"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-black text-white font-bold"
        >
          Save Teacher
        </button>
      </div>
      <Footer />
    </div>
  );
}
