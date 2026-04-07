"use client";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { MainOne } from "@/components/landing/MainOne";
import { MainTwo } from "@/components/landing/MainTwo";
import { MainThree } from "@/components/landing/MainThree";
import { MainFour } from "@/components/landing/MainFour";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <MainOne />

        <section id="how-it-works">
          <MainTwo />
        </section>

        <section id="mentors">
          <MainThree />
        </section>

        <section id="membership">
          <MainFour />
        </section>
      </main>
      <Footer />
    </div>
  );
}
