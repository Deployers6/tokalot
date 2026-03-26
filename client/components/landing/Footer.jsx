export const Footer = () => {
  return (
    <div className="w-full bg-[#00161D] flex justify-center">
      <div
        className="w-full max-w-[1200px] flex items-center justify-between px-16 py-12
                      max-md:flex-col max-md:items-start max-md:gap-6 max-md:px-6 max-md:py-8"
      >
        <p className="font-bold text-2xl text-sky-400 max-md:text-[18px]">
          Tokalot English Club
        </p>

        <div className="text-[12px] text-[#64748B] flex gap-[32px] max-md:gap-3">
          <p className="hover:text-sky-400 cursor-pointer transition">
            Privacy Policy
          </p>
          <p className="hover:text-sky-400 cursor-pointer transition">
            Terms of Service
          </p>
          <p className="hover:text-sky-400 cursor-pointer transition">
            Community Guidelines
          </p>
          <p className="hover:text-sky-400 cursor-pointer transition">
            Contact Support
          </p>
        </div>
      </div>
    </div>
  );
};
