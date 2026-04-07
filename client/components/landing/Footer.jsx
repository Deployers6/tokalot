export const Footer = () => {
  return (
    <footer className="w-full bg-[#00161D] flex justify-center border-t border-white/5 font-sans relative overflow-hidden">
      {/* Гоёл чимэглэлийн гэрлийн тусгал - Footer-ийн арын дэвсгэрт */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-900/10 blur-[100px] rounded-full" />

      <div
        className="w-full max-w-[1200px] flex items-center justify-between px-16 py-12 relative z-10
                   max-md:flex-col max-md:items-center max-md:text-center max-md:gap-10 max-md:px-6 max-md:py-10"
      >
        {/* Logo & Title Section */}
        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-4 group cursor-default">
          {/* Logo Container - Шинэ дэвсгэр гэрэлтэй (Glow) */}
          <div className="relative">
            {/* Арын гэрэлтсэн тусгал (Glow effect) */}
            <div className="absolute inset-0 bg-sky-400/15 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Үндсэн хайрцаг */}
            <div
              className="w-24 h-24 bg-[#011F28] rounded-2xl flex items-center justify-center border border-white/5 
                           group-hover:border-sky-400/30 transition-all duration-500 overflow-hidden relative z-10 
                           shadow-xl shadow-black/20 group-hover:shadow-sky-900/30"
            >
              <img
                src="tokalotlogo.png"
                alt="Tokalot Logo"
                className="w-16 h-16 object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <p className="font-bold text-2xl text-sky-400 max-md:text-[22px] tracking-tight">
              Tokalot English Club
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium mt-1">
              Est. 2024
            </p>
          </div>
        </div>

        {/* Links & Social Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-12">
          {/* Contact Details */}
          <div
            className="text-[12px] flex gap-[40px] 
               max-md:grid max-md:grid-cols-2 max-md:gap-x-12 max-md:gap-y-4 max-md:text-center"
          >
            <div className="space-y-1.5">
              <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                Phone
              </p>
              <p className="text-[#BCC8D1] hover:text-sky-400 cursor-pointer transition-colors duration-200">
                96160212
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                Email
              </p>
              <p className="text-[#BCC8D1] hover:text-sky-400 cursor-pointer transition-colors duration-200">
                Tokalotcafe@gmail.com
              </p>
            </div>
          </div>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/tokalotcafe/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 
             hover:bg-white/10 hover:border-sky-400/50 transition-all cursor-pointer group/insta shadow-lg shadow-black/10"
          >
            <img
              src="test1.png"
              alt="Instagram"
              className="w-6 h-6 object-contain group-hover/insta:scale-110 transition-transform"
            />
            <p className="text-[13px] text-slate-300 font-medium whitespace-nowrap">
              @tokalotcafe
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
};
