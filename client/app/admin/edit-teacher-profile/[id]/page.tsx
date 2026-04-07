"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2, ChevronDown, Camera, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Footer from "../../components/Footer";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";
const levels = ["Basic", "Intermediate", "Advanced"];

interface Teacher {
  id: string;
  fullName: string;
  bio: string;
  experience: string;
  imageUrl: string;
}

export default function EditTeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [form, setForm] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch single teacher
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch error:", res.status, text);
          router.push("/admin/teachers");
          return;
        }

        const teachers: Teacher[] = await res.json();
        const t = teachers.find((teacher) => teacher.id === params.id);

        if (!t) {
          router.push("/admin/teachers");
          return;
        }

        setForm(t);
      } catch (err) {
        console.error(err);
        router.push("/admin/teachers");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [params.id, router, getToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => prev && { ...prev, imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const token = await getToken();
      const url = `${BACKEND_URL}/api/admin/teachers?id=${form.id}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          bio: form.bio,
          experience: form.experience,
          imageUrl: form.imageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Хадгалахад алдаа гарлаа");
        return;
      }

      router.push("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form || !confirm("Энэ профайлыг устгах уу?")) return;
    try {
      const token = await getToken();
      const res = await fetch(
        `${BACKEND_URL}/api/admin/teachers?id=${form.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
        return;
      }

      router.push("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Устгахад алдаа гарлаа");
    }
  };

  if (loading || !form) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-black text-white p-4 flex items-center gap-2">
        <Link href="/admin/teachers" className="flex items-center gap-2">
          <ArrowLeft />
          <span className="font-bold text-[20px] text-[#EFEFEF]">
            Edit Teacher
          </span>
        </Link>
      </div>

      <div className="p-6 space-y-6 max-w-md w-full mx-auto">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative pt-8">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {preview || form.imageUrl ? (
                <Image
                  src={preview || form.imageUrl}
                  alt="Profile"
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

        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
          />
        </div>

        {/* Experience Level Dropdown */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Experience Level
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className={`w-full h-[56px] px-4 bg-[#EFEFEF] border-none flex items-center justify-between cursor-pointer text-sm transition-all ${
                open ? "rounded-t-xl" : "rounded-xl"
              }`}
            >
              <span
                className={form.experience ? "text-gray-800" : "text-gray-400"}
              >
                {form.experience || "Select level"}
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
                      setForm((prev) => prev && { ...prev, experience: l });
                      setOpen(false);
                    }}
                    className={`px-4 py-3.5 text-sm cursor-pointer hover:bg-gray-50 ${
                      form.experience === l
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

        {/* Bio */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Professional Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Briefly describe academic background and teaching style..."
            className="w-full h-[128px] p-3 rounded-xl bg-[#EFEFEF] outline-none resize-none"
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-full bg-black text-white font-bold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-full border border-red-500 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50"
        >
          <Trash2 size={16} /> Delete Teacher
        </button>
      </div>

      <Footer />
    </div>
  );
}
