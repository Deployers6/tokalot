"use client";

import { motion } from "framer-motion";

const teachers = [
  { id: 1, image: "/Teacher1.jpeg", name: "Teacher 1" },
  { id: 2, image: "/Teacher2.jpeg", name: "Teacher 2" },
  { id: 3, image: "/Teacher3.jpeg", name: "Teacher 3" },
  { id: 4, image: "/Teacher4.jpeg", name: "Teacher 4" },
  { id: 5, image: "/Teacher5.jpeg", name: "Teacher 5" },
];

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
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {[...teachers, ...teachers].map((teacher, i) => (
              <div
                key={i}
                className="min-w-[280px] h-[280px] max-md:min-w-[200px] rounded-[50%] overflow-hidden max-md:w-[220px] max-md:h-[220px] max-md:rounded-[50%] max-md:overflow-hidden"
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-[280px] h-full object-cover max-md:w-[220px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
