"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Search, Pencil, UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";

interface Teacher {
  id: string;
  fullName: string;
  bio: string;
  experience: string;
  imageUrl: string;
}

export default function TeachersPage() {
  const { getToken } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const token = await getToken();

      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to fetch teachers:", res.status, text);
        setTeachers([]);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.warn("Expected an array but got:", data);
        setTeachers([]);
      } else {
        setTeachers(data);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ багшийг устгах уу?")) return;

    try {
      const token = await getToken();

      const res = await fetch(`${BACKEND_URL}/api/admin/teachers?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
        return;
      }

      await fetchData();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Устгахад алдаа гарлаа");
    }
  };

  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.fullName.toLowerCase().includes(q) ||
          t.experience.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">FACULTY DIRECTORY</p>
            <h2 className="text-3xl font-bold">Teachers</h2>
          </div>
          <Link href="/admin/add-new-teacher">
            <button className="w-[64px] h-[58px] bg-black text-white rounded-xl flex items-center justify-center shadow">
              <UserPlus />
            </button>
          </Link>
        </div>

        <div className="grid gap-4 mt-6">
          <div className="bg-[#EFEFEF] p-6 rounded-2xl shadow">
            <p className="text-3xl font-bold">{teachers.length}</p>
            <p className="text-sm tracking-widest text-gray-600">TEACHERS</p>
          </div>
        </div>

        <div className="mt-6 relative">
          <Search className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or level..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#EFEFEF] outline-none shadow text-sm"
          />
        </div>

        <div className="mt-6 space-y-4">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={teacher.imageUrl || "/default-profile.png"}
                    alt={teacher.fullName}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {teacher.fullName}
                    </h3>
                    <p className="text-cyan-600 text-sm">
                      {teacher.experience}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{teacher.bio}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/edit-teacher-profile/${teacher.id}`}>
                    <button className="bg-[#DAF2F9] p-3 rounded-xl hover:bg-blue-200">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="bg-red-100 p-3 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-10">No teachers found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
