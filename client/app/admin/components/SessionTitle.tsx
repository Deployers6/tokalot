// import React from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import DatePicker from "./Calendar";
// import { CircleAlert } from "lucide-react";

// const Sessions = () => {
//   return (
//     <div className="h-screen w-screen flex flex-col justify-between">
//       <div>
//         <Header />
//         <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
//           <DatePicker />
//         </div>

//         <div className="w-[358px] h-[61px] bg-[#C2E8FF] border-1 border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2 ">
//           <CircleAlert className="h-[20px] w-[20px] mt-0.5" />
//           <div className="mt-1">
//             <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
//             <p className="text-[11px] ">
//               Sessions with under 3 participants 48h before start are
//               automatically cancelled and closed.
//             </p>
//           </div>
//         </div>
//         <div className="flex w-screen justify-between px-5 mt-5">
//           <div>
//             <div className="font-extrabold">Today's Sessions</div>
//             <div>Wednesday</div>
//           </div>
//           <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-md shadow-[#20BEF9]">
//             +
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Sessions;
"use client";
import React from "react";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import DatePicker from "./Calendar";
import { CircleAlert } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SessionTitle = () => {
  const today = new Date();
  const [selected, setSelected] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  const displayDate = selected
    ? new Date(selected.year, selected.month, selected.day)
    : today;

  const dayName = DAYS[displayDate.getDay()];
  const monthName = MONTHS[displayDate.getMonth()];
  const dayNum = displayDate.getDate();

  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      <div>
        <Header />
        <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
          {/* selected болон setSelected-ийг Calendar руу дамжуулна */}
          <DatePicker selected={selected} setSelected={setSelected} />
        </div>

        <div className="w-[358px] h-[61px] bg-[#C2E8FF] border-1 border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2">
          <CircleAlert className="h-[20px] w-[20px] mt-0.5" />
          <div className="mt-1">
            <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
            <p className="text-[11px]">
              Sessions with under 3 participants 48h before start are
              automatically cancelled and closed.
            </p>
          </div>
        </div>

        <div className="flex w-screen justify-between px-5 mt-5">
          <div>
            <div className="font-extrabold">Today's Sessions</div>
            {/* Сонгосон огноог харуулна */}
            <div className="text-gray-500 text-sm">
              {dayName}, {monthName} {dayNum}
            </div>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-md shadow-[#20BEF9]">
            +
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SessionTitle;
