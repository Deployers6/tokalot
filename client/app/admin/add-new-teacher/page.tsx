// "use client";

// import { useState, useRef } from "react";
// import { useAuth } from "@clerk/nextjs";
// import { Camera, User, ArrowLeft, ChevronDown } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Footer from "../components/Footer";
// import Image from "next/image";

// const levels = ["Basic", "Intermediate", "Advanced"];

// interface TeacherForm {
//   name: string;
//   level: string;
//   bio: string;
//   image: string;
// }

// export default function AddNewTeacher() {
//   const router = useRouter();
//   const { getToken } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [form, setForm] = useState<TeacherForm>({
//     name: "",
//     level: "",
//     bio: "",
//     image: "/default-profile.png",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result as string;
//       setForm((prev) => ({ ...prev, image: base64 }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.level) {
//       alert("Name болон Level шаардлагатай!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await getToken();

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             fullName: form.name,
//             bio: form.bio,
//             experience: form.level,
//             imageUrl: form.image,
//           }),
//         },
//       );

//       if (res.ok) {
//         router.push("/admin/teachers");
//       } else {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Хадгалахад алдаа гарлаа");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Хадгалахад алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-start">
//       <div className="w-screen h-15 bg-black text-white font-extrabold text-2xl p-4">
//         <Link href="/admin/teachers" className="flex items-center">
//           <ArrowLeft className="w-[20px] h-[20px] mr-2" />
//           <h1 className="text-[20px] font-bold text-[#EFEFEF]">
//             Add New Teacher
//           </h1>
//         </Link>
//       </div>

//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-8">
//         <div className="flex flex-col items-center">
//           <div className="relative pt-8">
//             <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//               {preview ? (
//                 <Image
//                   src={preview}
//                   alt="Profile preview"
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

//         <div>
//           <label className="block mb-2 text-sm font-medium">Full Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Enter full name"
//             className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium">
//             Experience Level
//           </label>
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setOpen((prev) => !prev)}
//               className={`w-full h-[56px] px-4 bg-[#EFEFEF] border-none flex items-center justify-between cursor-pointer text-sm transition-all ${
//                 open ? "rounded-t-xl" : "rounded-xl"
//               }`}
//             >
//               <span className={form.level ? "text-gray-800" : "text-gray-400"}>
//                 {form.level || "Select level"}
//               </span>
//               <ChevronDown
//                 className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             {open && (
//               <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-xl overflow-hidden z-10">
//                 {levels.map((l, i) => (
//                   <div
//                     key={l}
//                     onClick={() => {
//                       setForm((prev) => ({ ...prev, level: l }));
//                       setOpen(false);
//                     }}
//                     className={`px-4 py-3.5 text-sm cursor-pointer hover:bg-gray-50 ${
//                       form.level === l
//                         ? "bg-[#EFEFEF] font-medium"
//                         : "text-gray-700"
//                     } ${i !== levels.length - 1 ? "border-b border-gray-100" : ""}`}
//                   >
//                     {l}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium">
//             Professional Bio
//           </label>
//           <textarea
//             name="bio"
//             value={form.bio}
//             onChange={handleChange}
//             placeholder="Briefly describe academic background and teaching style..."
//             className="w-full h-[128px] p-3 rounded-xl bg-[#EFEFEF]"
//           />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full py-3 rounded-full bg-black text-white font-bold disabled:opacity-50"
//         >
//           {loading ? "Saving..." : "Save Teacher"}
//         </button>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// "use client";

// import { useState, useRef } from "react";
// import { useAuth } from "@clerk/nextjs";
// import { Camera, User, ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Footer from "../components/Footer";
// import Image from "next/image";

// interface TeacherForm {
//   name: string;
//   level: string;
//   bio: string;
//   image: string;
// }

// export default function AddNewTeacher() {
//   const router = useRouter();
//   const { getToken } = useAuth();
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [form, setForm] = useState<TeacherForm>({
//     name: "",
//     level: "",
//     bio: "",
//     image: "/default-profile.png",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result as string;
//       setForm((prev) => ({ ...prev, image: base64 }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.level) {
//       alert("Name болон Experience Level шаардлагатай!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await getToken();

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             fullName: form.name,
//             bio: form.bio,
//             experience: form.level,
//             imageUrl: form.image,
//           }),
//         },
//       );

//       if (res.ok) {
//         router.push("/admin/teachers");
//       } else {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Хадгалахад алдаа гарлаа");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Хадгалахад алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-start">
//       <div className="w-screen h-15 bg-black text-white font-extrabold text-2xl p-4">
//         <Link href="/admin/teachers" className="flex items-center">
//           <ArrowLeft className="w-[20px] h-[20px] mr-2" />
//           <h1 className="text-[20px] font-bold text-[#EFEFEF]">
//             Add New Teacher
//           </h1>
//         </Link>
//       </div>

//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-8 mx-auto mt-10">
//         <div className="flex flex-col items-center">
//           <div className="relative pt-8">
//             <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
//               {preview ? (
//                 <Image
//                   src={preview}
//                   alt="Profile preview"
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
//               <Camera size={20} />
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

//         <div>
//           <label className="block mb-2 text-sm font-medium">Full Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Enter full name"
//             className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium">
//             Experience Level
//           </label>
//           <input
//             name="level"
//             value={form.level}
//             onChange={handleChange}
//             placeholder="Enter experience (e.g. 5 years, Expert)"
//             className="w-full h-[55px] p-3 rounded-xl bg-[#EFEFEF] outline-none"
//           />
//         </div>

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

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full py-4 rounded-full bg-black text-white font-bold disabled:opacity-50 active:scale-95 transition-transform"
//         >
//           {loading ? "Saving..." : "Save Teacher"}
//         </button>
//       </div>
//       <div className="mt-auto w-full">
//         <Footer />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Camera, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/app/admin/components/Footer";
import Image from "next/image";

interface TeacherForm {
  name: string;
  level: string;
  bio: string;
  image: string;
}

export default function AddNewTeacher() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<TeacherForm>({
    name: "",
    level: "",
    bio: "",
    image: "/default-profile.png",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.level) {
      alert("Name болон Experience Level шаардлагатай!");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: form.name,
            bio: form.bio,
            experience: form.level,
            imageUrl: form.image,
          }),
        },
      );

      if (res.ok) {
        router.push("/admin/teachers");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Хадгалахад алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      alert("Хадгалахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Desktop Wrapper
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      {/* Phone Frame Container */}
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
      >
        {/* Custom Header - Back button-той хар header */}
        <div className="w-full h-[60px] bg-black text-white flex items-center px-5 shrink-0 z-30">
          <Link
            href="/admin/teachers"
            className="flex items-center gap-3 active:opacity-70 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#20BEF9]" />
            <h1 className="text-lg font-black tracking-tight text-[#EFEFEF]">
              Add New Teacher
            </h1>
          </Link>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-8 flex flex-col items-center">
            {/* Profile Image Upload Section */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-[40px] bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile preview"
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
              Upload Photo
            </p>

            {/* Form Fields */}
            <div className="w-full space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full h-[60px] px-6 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                  Experience Level
                </label>
                <input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. 5 Years, Senior Expert"
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
                  placeholder="Describe teaching style and background..."
                  className="w-full h-[140px] p-6 rounded-[28px] bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition font-bold text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-[65px] rounded-[24px] bg-black text-white font-black uppercase tracking-[3px] text-sm shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all mt-4"
              >
                {loading ? "Saving..." : "Save Teacher"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
