"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Footer from "../components/Footer";
import {
  getTeachers,
  updateTeacher,
  deleteTeacher,
  Teacher,
} from "../testMock/mockTeachers";

export default function EditTeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  if (!params.id) {
    router.push("/admin/teachers");
    return null;
  }
  const id = Number(params.id);
  const [form, setForm] = useState<Omit<Teacher, "id">>({
    name: "",
    level: "",
    bio: "",
    specialties: [],
    tags: [],
    image: "",
  });

  useEffect(() => {
    getTeachers().then((data) => {
      const teacher = data.find((t) => t.id === id);
      if (teacher) setForm({ ...teacher });
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateTeacher(id, form);
    router.push("/admin/teachers");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this profile?")) {
      await deleteTeacher(id);
      router.push("/admin/teachers");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="w-screen h-15 bg-black text-white font-extrabold text-2xl p-4">
        <Link href="/admin/teachers" className="flex items-center">
          <ArrowLeft className="w-[20px] h-[20px] mr-2" />
          <h1 className="text-[20px] font-bold text-[#EFEFEF]">
            Edit Teacher Profile
          </h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={form.image}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-400"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1">
            FULL NAME
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100 outline-none"
          />
        </div>

        {/* Level */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1">
            EXPERIENCE LEVEL
          </label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100 outline-none"
          >
            <option value="">Select Level</option>
            {[
              "Associate Professor (2-5 Years)",
              "Professor (5+ Years)",
              "Assistant Professor (0-2 Years)",
            ].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1">
            BIO
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100 outline-none resize-none h-24"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-300 text-white py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 text-red-600 py-3 rounded-lg font-semibold border border-red-200"
        >
          <Trash2 className="w-4 h-4" /> Delete Profile
        </button>
      </div>
      <Footer />
    </div>
  );
}
