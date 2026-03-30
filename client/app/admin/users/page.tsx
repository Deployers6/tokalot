import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const User = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      <div>
        <Header />
      </div>
      <div></div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default User;
