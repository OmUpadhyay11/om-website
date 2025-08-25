// src/app/page.tsx
import { Playfair_Display, Libre_Baskerville } from "next/font/google";
import { Mail, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Logo from "./components/Logo";
import SlotsBoard from "./slots/SlotsBoard";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-3">
      {/* ===== Header (scrolls normally; preserves left offset + logo size) ===== */}
      <header className="w-full mb-12 -ml-6 -mr-6 pl-5 pr-0">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Left: Logo + Name + Icons */}
          <div className="p-3 flex items-center gap-[3.75rem]">
            <Logo size={200} />
            <div className="flex flex-col items-center md:items-start">
              <h1
                className={`text-2xl md:text-5xl italic text-center md:text-left md:whitespace-nowrap ${playfair.className}`}
              >
                Om Upadhyay
              </h1>
              <nav className="flex items-center justify-center md:justify-start gap-6 mt-5">
                <a
                  href="mailto:omupadhyay@gmail.com"
                  aria-label="Email"
                  className="text-blue-400 hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={30} />
                </a>
                <a
                  href="https://github.com/omupadhyay11"
                  aria-label="GitHub"
                  className="text-blue-400 hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={30} />
                </a>
                <a
                  href="https://linkedin.com/in/-om-upadhyay"
                  aria-label="LinkedIn"
                  className="text-blue-400 hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={30} />
                </a>
              </nav>
            </div>
          </div>

          {/* Right: Bio + UW logo */}
          <div className="flex items-start md:items-center gap-0 md:gap-10">
            <p
              className={`${libre.className} text-white text-center md:text-center text-sm md:text-base leading-relaxed md:max-w-[56ch] lg:max-w-[68ch]`}
            >
              <span className="whitespace-normal md:whitespace-nowrap text-[1.15em] md:text-[1.25em]">
                🤖{" "}
                <span className="italic text-[1.12em] md:text-[1.15em] align-baseline">
                  Mechatronics
                </span>{" "}
                Engineering | University of Waterloo 🍁
              </span>
              <br />
              <span className="whitespace-normal md:whitespace-nowrap">
                🏙️ Toronto &amp; Edmonton 📍
              </span>
              <br />
              🛠️ Building cool stuff with code and hardware 💻
              <br />
              🚀 Seeking Winter 2026 Co-op Opportunities 💼
            </p>

            <Image
              src="/WaterlooLogo.png"
              alt="University of Waterloo"
              width={320}
              height={90}
              priority
              className="h-auto w-[220px] md:w-[280px]"
            />
          </div>
        </div>
      </header>

      {/* ===== Slots: Projects (left) + Experience (right) ===== */}
      <section id="slots" className="max-w-6xl mx-auto mt-6">
        <SlotsBoard />
      </section>

      {/* ===== Bottom-right status footer ===== */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs md:text-sm text-white/90 shadow-lg backdrop-blur hover:bg-white/10"
          aria-label="Status: open to opportunities"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>Last Update: September 2025</span>
        </a>
      </div>
    </main>
  );
}
