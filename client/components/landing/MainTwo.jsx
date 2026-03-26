export const MainTwo = () => {
  return (
    <div className="w-full h-[586px] max-md:h-auto bg-[#051F25] flex items-center justify-center max-md:px-6 max-md:py-16 max-md:bg-[#FFFFFF]">
      <div className="max-md:w-full">
        <div className="flex flex-col space-y-[16px] max-md:text-center">
          <p className="max-md:hidden text-[36px] max-md:text-[28px] text-[#CEE7F0]">
            How it Works
          </p>
          <p className="text-[30px] font-bold text-[#071E24] text-start md:hidden">
            The Methodology
          </p>
          <p className="max-md:hidden text-[16px] max-md:text-[14px] text-[#BCC8D1] max-md:max-w-[500px] max-md:mx-auto">
            The editorial journey from silence to eloquence in three deliberate
            movements.
          </p>
        </div>

        <div className="flex gap-[48px] pt-[64px] w-full max-md:flex-col max-md:gap-[24px] max-md:pt-[48px]">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="w-[384px] h-[250px] bg-[#0A232A] rounded-[12px] max-md:bg-[#006688]
              max-md:w-full max-md:h-[248px] flex items-start p-6"
            >
              <p className="text-[36px] max-md:text-[28px] text-[#89D6FF] font-bold">
                {String(num).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
