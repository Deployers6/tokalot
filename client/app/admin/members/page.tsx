"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Search, Calendar, Pencil } from "lucide-react";
import { UserPlus } from "lucide-react";

const mockStudents = [
  {
    id: 1,
    name: "Alex Rivers",
    enrolledDate: "Oct 12, 2023",
    image: null,
  },
  {
    id: 2,
    name: "Jordan Lee",
    enrolledDate: "Nov 05, 2023",
    image: null,
  },
];

const User = () => {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Student Directory
          </h1>
          <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
            {filtered.length} TOTAL
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🧑</span>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-gray-900">{student.name}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                    <Calendar className="h-3 w-3" />
                    <span>Enrolled: {student.enrolledDate}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl shrink-0">
                <Pencil className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-24 right-5">
        <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default User;
