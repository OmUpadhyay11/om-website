"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FaBasketballBall, FaFutbol, FaUserNinja } from "react-icons/fa";
import Image from "next/image";
import WorldTravelMap from "./WorldTravelMap";

type SportIconKind = "soccer" | "taekwondo" | "basketball";

function SportBadgeIcon({ kind }: { kind: SportIconKind }) {
  const Icon =
    kind === "soccer"
      ? FaFutbol
      : kind === "taekwondo"
        ? FaUserNinja
        : FaBasketballBall;

  const iconClass =
    kind === "soccer"
      ? "text-slate-100"
      : kind === "taekwondo"
        ? "text-zinc-100"
        : "text-orange-300";

  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-zinc-800/70"
      aria-hidden="true"
    >
      <Icon className={`h-[18px] w-[18px] ${iconClass}`} />
    </motion.span>
  );
}

export default function AboutMeSection() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onQuickJump = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (custom.detail !== "about") return;
      setIsCollapsed(false);

      requestAnimationFrame(() => {
        const el = document.getElementById("about");
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    window.addEventListener("quick-jump", onQuickJump as EventListener);
    return () => window.removeEventListener("quick-jump", onQuickJump as EventListener);
  }, []);

  return (
    <section id="about" className="mx-auto mt-5 w-full max-w-5xl">
      <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-4 backdrop-blur-sm md:p-5">
        <div className="mb-4">
          <div className="relative text-center">
            <h2 className="text-[23px] font-bold tracking-tight md:text-[27px]">
              About Me
            </h2>
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-expanded={!isCollapsed}
              aria-controls="about-content"
              className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/[0.08] p-2 text-cyan-100 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-300/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            >
              <motion.span
                animate={{ rotate: isCollapsed ? -90 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                <ChevronDown className="size-5" />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              id="about-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
                <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-white/90 md:text-[15px]">
                I&apos;m a mechatronics engineering student focused primarily on
                  robotics, controls, and intelligent manufacturing systems. My
                  work spans embedded systems, computer vision, and humanoid
                  manipulation, with a focus on translating real world problems
                  into engineered solutions. Outside of school, I spend most of
                  my time playing sports and chasing the competitive side of
                  things. Below are a few highlights from my time in sports:
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-white/15 bg-zinc-900/60 p-3">
                    <div className="flex items-center gap-2">
                      <SportBadgeIcon kind="soccer" />
                      <p className="flex-1 text-center text-[16px] font-semibold text-white">
                        Club Level Soccer
                      </p>
                    </div>
                    <p className="-mt-1 text-center text-[14px] text-white/80">7 years</p>
                    <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-md border border-white/20 bg-zinc-800/60">
                      <Image
                        src="/young_soccer_pic.JPG"
                        alt="Club level soccer photo"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/15 bg-zinc-900/60 p-3">
                    <div className="flex items-center gap-2">
                      <SportBadgeIcon kind="taekwondo" />
                      <p className="flex-1 text-center text-[16px] font-semibold text-white">
                        Taekwondo Black Belt
                      </p>
                    </div>
                    <p className="-mt-1 text-center text-[14px] text-white/80">10 years</p>
                    <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-md border border-white/20 bg-zinc-800/60">
                      <Image
                        src="/blackbelt.jpeg"
                        alt="Taekwondo black belt photo"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/15 bg-zinc-900/60 p-3">
                    <div className="flex items-center gap-2">
                      <SportBadgeIcon kind="basketball" />
                      <p className="flex-1 text-center text-[16px] font-semibold text-white">
                        Varsity Basketball MVP
                      </p>
                    </div>
                    <p className="-mt-1 text-center text-[14px] text-white/80">3 years</p>
                    <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-md border border-white/20 bg-zinc-800/60">
                      <Image
                        src="/osa_ballMVP.jpeg"
                        alt="Basketball MVP award photo"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
                <WorldTravelMap />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
