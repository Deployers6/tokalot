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
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setTeachers([]);
        return;
      }

      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "You can only delete teachers you have added");
        return;
      }
      await fetchData();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Failed to delete teacher");
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
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
      >
        <Header />

        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  FACULTY DIRECTORY
                </p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Teachers
                </h2>
              </div>
              <Link href="/admin/add-new-teacher">
                <button className="w-[58px] h-[58px] bg-black text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition">
                  <UserPlus size={24} />
                </button>
              </Link>
            </div>

            <div className="grid gap-4 mt-6">
              <div className="bg-[#EFEFEF] p-6 rounded-[28px] border border-gray-100">
                <p className="text-4xl font-black text-gray-900">
                  {teachers.length}
                </p>
                <p className="text-[10px] font-black tracking-[3px] text-gray-500 uppercase mt-1">
                  TOTAL TEACHERS
                </p>
              </div>
            </div>

            <div className="mt-6 relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or bio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition text-sm font-bold"
              />
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#20BEF9] border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-300 font-black uppercase text-xs tracking-[4px]">
                    Loading...
                  </p>
                </div>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-[28px] p-5 flex items-center justify-between shadow-sm border border-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0">
                        <Image
                          src={teacher.imageUrl || "/default-profile.png"}
                          alt={teacher.fullName}
                          fill
                          className="rounded-2xl object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-gray-800 text-lg leading-tight">
                          {teacher.fullName}
                        </h3>
                        <p className="text-[#20BEF9] text-xs font-black uppercase tracking-wider mt-1">
                          {teacher.experience}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1 truncate">
                          {teacher.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <Link href={`/admin/edit-teacher-profile/${teacher.id}`}>
                        <button className="bg-[#DAF2F9] p-3 rounded-2xl text-[#006688] active:scale-90 transition">
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="bg-red-50 p-3 rounded-2xl text-red-400 active:scale-90 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-300 font-black uppercase text-xs tracking-[4px]">
                    No teachers found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
