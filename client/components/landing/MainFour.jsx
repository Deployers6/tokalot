export const MainFour = () => {
  return (
    <div className="w-full h-[816px] max-md:h-auto bg-[#001016] flex items-center justify-center max-md:px-6 max-md:py-16">
      <div className="flex flex-col items-center justify-center w-full max-w-[1200px]">
        <p className="text-[36px] max-md:text-[28px] text-[#CEE7F0] text-center">
          Membership Benefits
        </p>

        <div
          className="flex gap-[48px] items-center justify-center pt-[100px] w-full
                        max-md:flex-col max-md:gap-[32px] max-md:pt-[48px]"
        >
          <div className="flex flex-col gap-[24px] w-full max-md:w-full">
            <div className="flex gap-[24px] max-md:flex-col">
              <div
                className="w-[280px] h-[174px] bg-[#162D34] rounded-[8px]
                              max-md:w-full"
              ></div>
              <div
                className="w-[280px] h-[174px] bg-[#162D34] rounded-[8px]
                              max-md:w-full"
              ></div>
            </div>

            <div className="flex gap-[24px] max-md:flex-col">
              <div
                className="w-[280px] h-[174px] bg-[#162D34] rounded-[8px]
                              max-md:w-full"
              ></div>
              <div
                className="w-[280px] h-[174px] bg-[#162D34] rounded-[8px]
                              max-md:w-full"
              ></div>
            </div>
          </div>

          <div
            className="w-[584px] h-[456px] bg-[#162D34] rounded-[16px] flex items-end justify-center p-8
                          max-md:w-full max-md:h-auto max-md:p-6"
          >
            <button
              className="w-[502px] h-[60px] rounded-[8px] text-[#004963] text-[18px] bg-[#89D6FF] font-bold
                               max-md:w-full max-md:h-[56px] max-md:text-[16px]"
            >
              Apply for Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
