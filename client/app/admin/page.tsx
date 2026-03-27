import React from "react";
import Session from "./components/Session";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const page = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <div>
        <Header />
      </div>
      <Session />
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default page;
