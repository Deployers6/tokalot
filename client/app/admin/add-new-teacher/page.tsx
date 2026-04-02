"use client";

import { useState } from "react";
import { Camera, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { addTeacher, Teacher } from "../testMock/mockTeachers";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddNewTeacher() {
  const router = useRouter();

  const [form, setForm] = useState<Omit<Teacher, "id">>({
    name: "",
    level: "",
    bio: "",
    specialties: ["IELTS Prep", "Business English"],
    tags: [],
    image: "/default-profile.png",
  });

  const levels = ["Advanced", "Intermediate", "Basic"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await addTeacher(form);
    router.push("/admin/teachers");
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
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
              <User className="w-[44px] h-[44px] text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center">
              <Camera />
            </button>
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
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full h-[56px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
          >
            <option value="">None</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
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
