"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Footer from "../../components/Footer";

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
  const [form, setForm] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("/api/teachers");
        const teachers: Teacher[] = await res.json();
        const t = teachers.find(
          (teacher) => String(teacher.id) === String(params.id),
        );
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
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      const res = await fetch(`/api/teachers?id=${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          bio: form.bio,
          experience: form.experience,
          imageUrl: form.imageUrl,
        }),
      });
      if (!res.ok) throw new Error("Алдаа гарлаа");
      router.push("/admin/teachers");
    } catch (err) {
      alert("Хадгалахад алдаа гарлаа");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!form || !confirm("Энэ профайлыг устгах уу?")) return;
    try {
      const res = await fetch(`/api/teachers?id=${form.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Алдаа гарлаа");
      router.push("/admin/teachers");
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
      console.error(err);
    }
  };

  if (loading || !form) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-black text-white p-4 flex items-center gap-2">
        <Link href="/admin/teachers" className="flex items-center gap-2">
          <ArrowLeft />
          <span>Edit Teacher</span>
        </Link>
      </div>

      <div className="p-6 space-y-4 max-w-md w-full mx-auto">
        <div>
          <label className="text-xs font-semibold text-gray-500">
            Full Name
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">
            Experience Level
          </label>
          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white h-24 resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="w-full bg-black text-white p-3 rounded"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="w-full border border-red-500 text-red-500 p-3 rounded flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
