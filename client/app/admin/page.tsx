

// "use client";
// import React from "react";
// import Session from "./components/Session";
// import Footer from "./components/Footer";
// import Header from "./components/Header";

// const AdminPage = () => {
//   return (
//     // Desktop: Саарал nền | Mobile: Цагаан
//     <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
//       {/* Phone Container */}
//       <div
//         className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
//                       md:max-w-[430px] md:h-[88vh] md:rounded-[40px] md:border-[8px] md:border-white"
//       >
//         {/* Header */}
//         <Header />

//         {/* Content Area - Scrollable */}
//         <div className="flex-1 overflow-y-auto pb-[90px] scrollbar-hide">
//           <Session />
//         </div>

//         {/* Footer - Absolute positioned at the bottom of the container */}
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default AdminPage;
"use client";
import React from "react";
import Session from "./components/Session";
import Footer from "./components/Footer";
import Header from "./components/Header";

const AdminPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      {/* Phone Frame Wrapper */}
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
      >
        {/* Header - Одоо контейнерын ирмэгт шууд тулна */}
        <Header />

        {/* Content Area - Энд л scroll болон дотор талын зай байна */}
        <div className="flex-1 overflow-y-auto pb-[90px] scrollbar-hide bg-[#F8FDFF]">
          <Session />
        </div>

        {/* Footer - Одоо контейнерын ирмэгт шууд тулна */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;
