"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

/** Types */
type Slot = {
  slug: string; // route: /work/[slug]
  title: string;
  org: string;
  period?: string;
  cover: string;
  focus?: string;
};

/** Content */
const projects: Slot[] = [
  {
    slug: "interviewai",
    title: "InterviewAI",
    org: "SpeechDojo",
    period: "2025 | Project",
    cover: "/InterviewAI_Pic.png",
    focus: "50% 40%",
  },
  {
    slug: "loadcell-experiment",
    title: "LoadCell Experiment",
    org: "ADaMS Lab",
    period: "2025 | Project",
    cover: "/LoadCellPic_32.png",
    focus: "center",
  },
];

const experience: Slot[] = [
  {
    slug: "adams-internship",
    title: "Mechatronics Systems & Manufacturing Intern",
    org: "ADaMS Lab (University of Alberta)",
    period: "May–Aug 2025 | Internship",
    cover: "/Adams_Lab32.png",
    focus: "center",
  },
  {
    slug: "colourific",
    title: "Colourific",
    org: "University of Waterloo",
    period: "2024 | Project",
    cover: "/Colourific32.png",
    focus: "center",
  },
];

/** Component */
export default function SlotsBoard() {
  return (
    <section className="w-full py-8 -mx-6 px-6 md:mx-auto md:max-w-7xl md:px-0">
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-center">
        Projects &amp; Experience
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Projects */}
        <div>
          <ColumnHeader title="" />
          <div className="space-y-6">
            {projects.map((s) => (
              <SlotCard key={s.slug} {...s} />
            ))}
          </div>
        </div>

        {/* Right: Experience */}
        <div>
          <ColumnHeader title="" />
          <div className="space-y-6">
            {experience.map((s) => (
              <SlotCard key={s.slug} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Subcomponents */
function ColumnHeader({ title }: { title: string }) {
  if (!title) return null;
  return (
    <div className="mb-4 px-1">
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

function SlotCard({ slug, title, org, period, cover, focus = "center" }: Slot) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400/60"
    >
      {/* 3:2 Fixed Aspect Ratio for Slot Covers */}
      <div className="relative w-full overflow-hidden rounded-t-2xl aspect-[3/2]">
        <Image
          src={cover}
          alt={`${title} cover`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: focus }}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold leading-tight">{title}</h4>
            <p className="mt-0.5 text-sm text-white/70">
              {org}{" "}
              {period ? (
                <span className="text-white/50">• {period}</span>
              ) : null}
            </p>
          </div>
          <ArrowUpRight className="mt-1 size-5 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </div>
      </div>

      {/* Subtle slot hover lift */}
      <motion.div
        aria-hidden
        initial={{ y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      />
    </Link>
  );
}
