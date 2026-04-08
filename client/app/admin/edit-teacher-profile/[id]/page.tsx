// "use client";

// import { useState, useEffect, useRef } from "react";
// import { ArrowLeft, Trash2, ChevronDown, Camera, User } from "lucide-react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useAuth } from "@clerk/nextjs";
// import Image from "next/image";
// import Footer from "../../components/Footer";

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";
// const levels = ["Basic", "Intermediate", "Advanced"];

// interface Teacher {
//   id: string;
//   fullName: string;
//   bio: string;
//   experience: string;
//   imageUrl: string;
// }

// export default function EditTeacherProfilePage() {
//   const params = useParams();
//   const router = useRouter();
//   const { getToken } = useAuth();
//   const [form, setForm] = useState<Teacher | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch single teacher
//   useEffect(() => {
//     const fetchTeacher = async () => {
//       try {
//         const token = await getToken();
//         const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           console.error("Fetch error:", res.status, text);
//           router.push("/admin/teachers");
//           return;
//         }

//         const teachers: Teacher[] = await res.json();
//         const t = teachers.find((teacher) => teacher.id === params.id);

//         if (!t) {
//           router.push("/admin/teachers");
//           return;
//         }

//         setForm(t);
//       } catch (err) {
//         console.error(err);
//         router.push("/admin/teachers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeacher();
//   }, [params.id, router, getToken]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => prev && { ...prev, [name]: value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result as string;
//       setForm((prev) => prev && { ...prev, imageUrl: base64 });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     if (!form) return;
//     setSaving(true);
//     try {
//       const token = await getToken();
//       const url = `${BACKEND_URL}/api/admin/teachers?id=${form.id}`;

//       const res = await fetch(url, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fullName: form.fullName,
//           bio: form.bio,
//           experience: form.experience,
//           imageUrl: form.imageUrl,
//         }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Хадгалахад алдаа гарлаа");
//         return;
//       }

//       router.push("/admin/teachers");
//     } catch (err) {
//       console.error(err);
//       alert("Хадгалахад алдаа гарлаа");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!form || !confirm("Энэ профайлыг устгах уу?")) return;
//     try {
//       const token = await getToken();
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/teachers?id=${form.id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
//         return;
//       }

//       router.push("/admin/teachers");
//     } catch (err) {
//       console.error(err);
//       alert("Устгахад алдаа гарлаа");
//     }
//   };

//   if (loading || !form) return <p className="p-6 text-center">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <div className="bg-black text-white p-4 flex items-center gap-2">
//         <Link href="/admin/teachers" className="flex items-center gap-2">
//           <ArrowLeft />
//           <span className="font-bold text-[20px] text-[#EFEFEF]">
//             Edit Teacher
//           </span>
//         </Link>
//       </div>

//       <div className="p-6 space-y-6 max-w-md w-full mx-auto">
//         {/* Profile Photo */}
//         <div className="flex flex-col items-center">
//           <div className="relative pt-8">
//             <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//               {preview || form.imageUrl ? (
//                 <Image
//                   src={preview || form.imageUrl}
//                   alt="Profile"
//                   width={112}
//                   height={112}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <User className="w-[44px] h-[44px] text-gray-400" />
//               )}
//             </div>
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="absolute bottom-0 right-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               <Camera />
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageChange}
//             />
//           </div>
//           <p className="mt-2 text-gray-600 text-sm">Upload Profile Photo</p>
//         </div>

//         {/* Full Name */}
//         <div>
//           <label className="block mb-2 text-sm font-medium">Full Name</label>
//           <input
//             name="fullName"
//             value={form.fullName}
//             onChange={handleChange}
//             className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium">
//             Experience Level
//           </label>
//           <input
//             type="text"
//             name="experience"
//             value={form.experience}
//             onChange={handleChange}
//             placeholder="Enter your experience level"
//             className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
//           />
//         </div>

//         {/* Bio */}
//         <div>
//           <label className="block mb-2 text-sm font-medium">
//             Professional Bio
//           </label>
//           <textarea
//             name="bio"
//             value={form.bio}
//             onChange={handleChange}
//             placeholder="Briefly describe academic background and teaching style..."
//             className="w-full h-[128px] p-3 rounded-xl bg-[#EFEFEF] outline-none resize-none"
//           />
//         </div>

//         {/* Buttons */}
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full py-3 rounded-full bg-black text-white font-bold disabled:opacity-50"
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>

//         <button
//           onClick={handleDelete}
//           className="w-full py-3 rounded-full border border-red-500 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50"
//         >
//           <Trash2 size={16} /> Delete Teacher
//         </button>
//       </div>

//       <Footer />
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2, Camera, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Footer from "../../components/Footer";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";

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
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/admin/teachers");
          return;
        }

        const teachers: Teacher[] = await res.json();
        const t = teachers.find((teacher) => teacher.id === params.id);

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
  }, [params.id, router, getToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => prev && { ...prev, imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const token = await getToken();
      const url = `${BACKEND_URL}/api/admin/teachers?id=${form.id}`;

      const res = await fetch(url, {
        method: "PATCH",
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
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Хадгалахад алдаа гарлаа");
        return;
      }

      router.push("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

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
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
        return;
      }

      router.push("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Устгахад алдаа гарлаа");
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen w-full bg-[#F1F5F9] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
      </div>
    );
  }

  return (
    // Desktop Wrapper
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      {/* Phone Frame Container */}
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px]  md:border-white"
      >
        {/* Custom Header - Хар өнгөтэй, ирмэгтээ тулсан */}
        <div className="w-full h-[60px] bg-black text-white flex items-center px-5 shrink-0 z-30">
          <Link
            href="/admin/teachers"
            className="flex items-center gap-3 active:opacity-70 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#20BEF9]" />
            <h1 className="text-lg font-black tracking-tight text-[#EFEFEF]">
              Edit Teacher
            </h1>
          </Link>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-8 flex flex-col items-center">
            {/* Profile Photo Upload */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-[40px] bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative">
                {preview || form.imageUrl ? (
                  <Image
                    src={preview || form.imageUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-[#20BEF9] text-white rounded-2xl w-11 h-11 flex items-center justify-center shadow-lg active:scale-90 transition border-4 border-white"
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8">
              Update Photo
            </p>

            {/* Form Fields */}
            <div className="w-full space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full h-[60px] px-6 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Experience Level
                </label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Enter experience level"
                  className="w-full h-[60px] px-6 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Describe background and style..."
                  className="w-full h-[140px] p-6 rounded-[28px] bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800 resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-[65px] rounded-[24px] bg-black text-white font-black uppercase tracking-[3px] text-sm shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={18} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full h-[60px] rounded-[24px] border-2 border-red-500/20 text-red-500 font-black uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 hover:bg-red-50 active:scale-[0.98] transition-all"
                >
                  <Trash2 size={16} /> Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
