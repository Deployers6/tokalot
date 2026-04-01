"use client";

import { useState } from "react";
import { Camera, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { addTeacher } from "@/app/testMock/mockTeachers";
import { useRouter } from "next/navigation";

export default function AddNewTeacher() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    level: "",
    bio: "",
    specialties: ["IELTS Prep", "Business English"],
  });

  const levels = ["Beginner", "Intermediate", "Advanced"];

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
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center p-4">
      <div className="self-start mb-4">
        <Link href="/admin/teachers">
          <button className="text-[18px] text-sky-600 flex items-center justify-center">
            <ArrowLeft className="w-[16px] h-[16px] mr-2" />
            Back
          </button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Add New Teacher</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-5">
        <div className="flex flex-col items-center">
          <div className="relative">
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
            className="w-full p-3 rounded-xl bg-[#EFEFEF] outline-none"
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
            className="w-full p-3 rounded-xl bg-[#EFEFEF] outline-none"
          >
            <option value="">Select</option>
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
            className="w-full p-3 rounded-xl bg-[#EFEFEF] outline-none h-24"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-black text-white font-bold"
        >
          Save Teacher
        </button>
      </div>
    </div>
  );
}
