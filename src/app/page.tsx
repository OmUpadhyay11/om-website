// src/app/page.tsx
import { Playfair_Display, Libre_Baskerville } from "next/font/google";
import AboutMeSection from "./components/AboutMeSection";
import HomeHeader from "./components/HomeHeader";
import SlotsBoard from "./slots/SlotsBoard";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: "italic",
});

export default function Home() {
  return (
    <main
      className={`min-h-screen bg-black relative text-white px-6 py-3 ${libre.className}`}
    >
      <HomeHeader playfairClassName={playfair.className} />

      {/* Slots: Projects (left) + Experience (right) */}
      <section id="slots" className="max-w-5xl mx-auto mt-3">
        <SlotsBoard />
      </section>

      <AboutMeSection />

      {/* Last Updated Status Block, bottom of page */}
      <div className="mx-auto mt-6 mb-4 flex w-full max-w-5xl justify-end">
        <a
          className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs md:text-sm text-white shadow-lg backdrop-blur hover:bg-white/10"
          aria-label="Status: open to opportunities"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>Last Updated: May 2026</span>
        </a>
      </div>
    </main>
  );
}
