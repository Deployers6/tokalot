import React from "react";

export const MainOne = () => {
  return (
    <section className="relative w-full min-h-[1024px] flex items-center justify-center px-6 md:px-12 py-20 max-md:min-h-screen overflow-hidden">
      {/* Mobile Background Image (Зөвхөн Mobile-д харагдана) */}
      <div className="absolute inset-0 md:hidden">
        <img
          src="profile.jpeg"
          alt="Background"
          className="w-full h-full object-cover grayscale-[30%]"
        />
        {/* Бичвэрийг уншигдахуйц болгохын тулд дээрээс нь харанхуйлах давхарга */}
        <div className="absolute inset-0 bg-[#00161D]/80"></div>
      </div>

      {/* Desktop Background (Зөвхөн Desktop-д зориулсан өнгө) */}
      <div className="absolute inset-0 -z-10 bg-[#00161D] hidden md:block"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-16 max-w-7xl w-full">
        {/* Text Content */}
        <div className="w-full md:max-w-2xl space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <p className="text-sm text-[#89D6FF] font-semibold tracking-[0.2em] uppercase">
              THE MIDNIGHT EDITORIAL EXPERIENCE
            </p>

            <h1 className="text-4xl md:text-7xl text-[#CEE7F0] font-extrabold leading-[1.1] tracking-tight">
              Master English <br className="hidden md:block" />
              In the Shadows.
            </h1>

            <p className="text-base md:text-lg text-[#BCC8D1] leading-relaxed max-w-xl mx-auto md:mx-0">
              Tokalot is an exclusive community for advanced speakers. No
              textbooks, no exams. Just profound conversations under the
              midnight sky.
            </p>
          </div>
        </div>

        {/* Desktop Image (Гар утас дээр нуугдана) */}
        <div className="hidden md:block w-full md:max-w-xl h-[600px] relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

          <div className="relative w-full h-full bg-[#162D34] rounded-2xl overflow-hidden border border-white/5">
            <img
              src="profile.jpeg"
              alt="Profile"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
