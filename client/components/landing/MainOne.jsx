export const MainOne = () => {
  return (
    <section className="w-full h-[1024px] bg-[#00161D] flex items-center justify-center px-12 py-12 max-md:h-[795px] max-md:items-end">
      <div className="flex flex-row max-md:flex-col items-center gap-16 max-md:gap-10 max-w-7xl w-full ">
        <div className="w-full max-w-2xl space-y-6 max-md:space-y-5 max-md:text-center">
          <p className="text-sm text-[#89D6FF] font-semibold tracking-widest max-md:text-xs max-md:text-start">
            THE MIDNIGHT EDITORIAL EXPERIENCE
          </p>

          <h1 className="text-7xl text-[#CEE7F0] font-extrabold leading-tight max-md:text-3xl max-md:text-start">
            Master English <br className="max-md:hidden" />
            In the Shadows.
          </h1>

          <p className="text-lg text-[#BCC8D1] leading-relaxed max-md:text-sm max-md:text-start">
            Tokalot is an exclusive community for advanced speakers. No
            textbooks, no exams. Just profound conversations under the midnight
            sky.
          </p>

          <div className="flex gap-4 max-md:flex-col max-md:items-center">
            <button className="px-6 py-4 rounded-lg bg-[#89D6FF] text-[#004963] font-bold hover:bg-[#6ecbff] transition max-md:w-full max-md:py-3">
              Join as Student
            </button>

            <button className="px-6 py-4 rounded-lg bg-[#162D34] text-[#89D6FF] font-bold hover:bg-[#1f3f47] transition max-md:w-full max-md:py-3">
              Admin Portal
            </button>
          </div>
        </div>

        <div className="w-full max-w-xl h-[560px] bg-[#21383F99] rounded-2xl overflow-hidden flex items-center justify-center hidden md:flex">
          <img src="test.png" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};
