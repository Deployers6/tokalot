"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Search, Loader2 } from "lucide-react";
import UserCard from "../members/components/UserCard";

const BACKEND_URL = "https://tokalot.vercel.app";

interface UserType {
  clerkId: string;
  fullName: string;
  email?: string;
  image?: string;
  isMember: boolean;
  membershipStatus?: string;
  membershipEnd?: string;
  remainingSessions?: number;
  isExpired?: boolean;
  createdAt?: string;
}

const User = () => {
  const { userId } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": userId ?? "",
        },
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      setUsers(
        list.map((u: any) => ({
          ...u,
          isMember: u.membershipStatus === "ACTIVE",
        })),
      );
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleDelete = async (clerkId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId }),
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px]  md:border-white"
      >
        <Header />

        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  MANAGEMENT
                </p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Students
                </h1>
              </div>
              <div className="bg-[#E0F8FF] border border-[#20BEF9]/30 rounded-2xl px-4 py-2 flex flex-col items-center">
                <span className="text-xl font-black text-[#20BEF9]">
                  {filtered.length}
                </span>
                <span className="text-[8px] font-black text-[#20BEF9] uppercase tracking-wider">
                  TOTAL
                </span>
              </div>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#EFEFEF] rounded-2xl h-[60px] pl-14 pr-6 text-sm font-bold outline-none border border-transparent focus:border-[#20BEF9] transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-xs font-bold text-red-600 flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {loading && (
                <div className="py-20 flex justify-center items-center">
                  <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-gray-300 font-black uppercase text-xs tracking-[4px]">
                    No users found
                  </p>
                </div>
              )}

              {filtered.map((user) => (
                <UserCard
                  key={user.clerkId}
                  user={user}
                  onDelete={() => handleDelete(user.clerkId)}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default User;
