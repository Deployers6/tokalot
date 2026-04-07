"use client";

import { motion } from "framer-motion";

const teachers = ["1", "2", "3", "4", "5", "6", "7"];

export const MainThree = () => {
  return (
    <div className="w-full overflow-hidden bg-[#00161D] py-[100px] max-md:py-[64px]">
      <div className="flex flex-col items-center space-y-[16px] px-4 max-md:text-center">
        <p className="text-[36px] max-md:text-[28px] text-[#CEE7F0]">
          Meet our Speakers
        </p>

        <p className="text-[16px] max-md:text-[14px] text-[#BCC8D1]">
          Native mentors with background in literature, journalism, and public
          speaking.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative mt-[72px] max-md:mt-[48px] overflow-hidden w-full max-w-[1298px]">
          <motion.div
            className="flex gap-[24px] max-md:gap-[16px] w-max"
            animate={{ x: ["0px", "-100%"] }}
            transition={{
              repeat: Infinity,

              ease: "linear",

              duration: 60,
            }}
          >
            {[...teachers, ...teachers, ...teachers].map((_, i) => (
              <div
                key={i}
                className="

min-w-[286px] h-[381px]

max-md:min-w-[220px] max-md:h-[300px]

bg-white rounded-[12px] flex items-center justify-center

"
              >
                Teacher {(i % teachers.length) + 1}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
