"use client";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { MainOne } from "@/components/landing/MainOne";
import { MainTwo } from "@/components/landing/MainTwo";git 
import { MainThree } from "@/components/landing/MainThree";
import { MainFour } from "@/components/landing/MainFour";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <MainOne />
        <MainTwo />
        <MainThree />
        <MainFour />
      </main>
      <Footer />
    </div>
  );
}
