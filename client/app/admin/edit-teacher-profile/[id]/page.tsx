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

  // ✅ FETCH TEACHER
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const teachers: Teacher[] = Array.isArray(data) ? data : [];

        const teacher = teachers.find((t) => t.id === params.id);

        if (!teacher) {
          router.push("/admin/teachers");
          return;
        }

        setForm(teacher);
      } catch (err) {
        console.error(err);
        router.push("/admin/teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [params.id, router, getToken]);

  // ✅ INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  // ✅ IMAGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) =>
        prev ? { ...prev, imageUrl: reader.result as string } : prev,
      );
    };
    reader.readAsDataURL(file);
  };

  // ✅ 🔥 UPDATE (PATCH)
  const handleSave = async () => {
    if (!form) return;

    setSaving(true);

    try {
      const token = await getToken();

      const res = await fetch(
        `${BACKEND_URL}/api/admin/teachers?id=${form.id}`,
        {
          method: "PATCH", // 🔥 хамгийн зөв
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
        },
      );

      console.log("PATCH STATUS:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        alert("Update хийхэд алдаа гарлаа");
        return;
      }

      router.push("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  // ✅ DELETE
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
        alert("Устгах боломжгүй");
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
      {/* HEADER */}
      <div className="bg-black text-white p-4 flex items-center gap-2">
        <Link href="/admin/teachers" className="flex items-center gap-2">
          <ArrowLeft />
          <span className="font-bold text-[20px]">Edit Teacher</span>
        </Link>
      </div>

      <div className="p-6 space-y-6 max-w-md w-full mx-auto">
        {/* IMAGE */}
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
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <Camera />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* NAME */}
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#EFEFEF]"
        />

        {/* LEVEL */}
        <div>
          <button
            onClick={() => setOpen(!open)}
            className="w-full p-3 bg-[#EFEFEF] rounded-xl"
          >
            {form.experience || "Select level"}
          </button>

          {open && (
            <div className="bg-white border rounded-xl mt-1">
              {levels.map((l) => (
                <div
                  key={l}
                  onClick={() => {
                    setForm((prev) =>
                      prev ? { ...prev, experience: l } : prev,
                    );
                    setOpen(false);
                  }}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BIO */}
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#EFEFEF]"
        />

        {/* BUTTONS */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-black text-white rounded-full"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleDelete}
          className="w-full py-3 border border-red-500 text-red-500 rounded-full"
        >
          Delete
        </button>
      </div>

      <Footer />
    </div>
  );
}
