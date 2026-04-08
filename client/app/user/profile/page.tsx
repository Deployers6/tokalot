"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CalendarDays,
  BookMarked,
  User,
  Mail,
  Camera,
  UserCircle,
  Ticket,
} from "lucide-react";
import { fetchMembership, updateUserProfile } from "@/lib/api";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<
    "schedule" | "sessions" | "profile"
  >("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [membership, setMembership] = useState<{
    status: string;
    startDate: string | null;
    endDate: string | null;
    totalSessions: number;
    usedSessions: number;
    remainingSessions: number;
  } | null | undefined>(undefined);

  // Хуудас нээх бүрт Clerk-г refresh хийж шинэ нэр авна
  useEffect(() => {
    if (!user) return;
    user.reload().then(() => {
      setFullName(user.fullName ?? "");
      setEmail(user.primaryEmailAddress?.emailAddress ?? "");
      if (user.imageUrl) setPhoto(user.imageUrl);
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchMembership(user.id)
      .then((data) => {
        if (!data) { setMembership(null); return; }
        setMembership({
          ...data,
          remainingSessions: (data.totalSessions ?? 0) - (data.usedSessions ?? 0),
        });
      })
      .catch(() => setMembership(null));
  }, [user?.id]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoUploading(true);
    try {
      await user.setProfileImage({ file });
      showSuccess("Зураг амжилттай хадгалагдлаа");
    } catch {
      alert("Зураг хадгалахад алдаа гарлаа");
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const parts = fullName.trim().split(" ");
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");
      await updateUserProfile(firstName, lastName);
      await user.reload();
      setFullName(`${firstName} ${lastName}`.trim());
      showSuccess("Мэдээлэл амжилттай хадгалагдлаа");
    } catch (err: any) {
      alert("Алдаа: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-5">
          <h1 onClick={() => router.push("/")} className="text-2xl font-extrabold text-white cursor-pointer">Tokalot</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 pt-8 flex flex-col items-center">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {/* Profile Photo */}
            <div className="relative">
              <div className="w-[96px] h-[96px] rounded-full overflow-hidden border-[3px] border-sky-400 bg-slate-100 flex items-center justify-center">
                {photo ? (
                  <img
                    src={photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shadow-md border-2 border-white"
              >
                <Camera size={13} className="text-white" />
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              className="mt-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {photoUploading ? "Хадгалж байна..." : "Change Photo"}
            </button>

            {/* Form */}
            <div className="w-full mt-6 flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-black">
                  Full Name
                </label>
                <div
                  className="flex items-center gap-3 rounded-[12px] px-4 py-4"
                  style={{ backgroundColor: "#EFEFEF" }}
                >
                  <User size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Full name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-black">
                  Email Address
                </label>
                <div
                  className="flex items-center gap-3 rounded-[12px] px-4 py-4"
                  style={{ backgroundColor: "#EFEFEF" }}
                >
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Email address"
                  />
                </div>
              </div>

              {/* Membership Status */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black">
                  Membership Status
                </label>

                {membership === undefined ? (
                  <div className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    <span className="text-sm text-slate-400">Ачаалж байна...</span>
                  </div>
                ) : membership === null ? (
                  <div className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-400 text-center">
                    Membership байхгүй байна
                  </div>
                ) : (
                  <>
                    {/* Membership Period */}
                    <div className="flex items-center gap-3 rounded-[12px] border border-slate-200 bg-white px-4 py-4">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                        <CalendarDays size={18} className="text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Membership Period
                        </p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          {formatDate(membership.startDate)} – {formatDate(membership.endDate)}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full",
                        membership.status === "ACTIVE" ? "bg-green-100 text-green-600" :
                        membership.status === "EXPIRED" ? "bg-red-100 text-red-500" :
                        "bg-yellow-100 text-yellow-600"
                      )}>
                        {membership.status}
                      </span>
                    </div>

                    {/* Session Credits */}
                    <div className="flex flex-col gap-3 rounded-[12px] border border-slate-200 bg-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                          <Ticket size={18} className="text-sky-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Session Credits
                          </p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">
                            {membership.remainingSessions} / {membership.totalSessions} left
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-500"
                            style={{
                              width: membership.totalSessions > 0
                                ? `${(membership.remainingSessions / membership.totalSessions) * 100}%`
                                : "0%"
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>USED: {membership.usedSessions}</span>
                          <span>TOTAL: {membership.totalSessions}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {successMsg && (
                <div className="rounded-[12px] bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-600 text-center">
                  {successMsg}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-2 w-full rounded-[12px] bg-black py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {saving ? "Хадгалж байна..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
          <button
            onClick={() => {
              setActiveTab("schedule");
              router.push("/user/dashboard");
            }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "schedule" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold">SCHEDULE</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "profile" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <UserCircle size={20} />
            <span className="text-[10px] font-bold">PROFILE</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("sessions");
              router.push("/user/my-sessions");
            }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "sessions" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold">SESSIONS</span>
          </button>

        </div>
      </div>
    </div>
  );
}
