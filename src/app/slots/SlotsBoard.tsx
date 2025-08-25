"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

/** Types */
type Slot = {
  title: string;
  org: string;
  period?: string;
  href?: string;
  cover: string;
  summary?: string;
  tags?: string[];
};

/** Content — edit freely */
const projects: Slot[] = [
  {
    title: "Pneumatic Hot Peening System",
    org: "Personal / Lab",
    period: "2025",
    href: "https://github.com/omupadhyay11", // replace with real repo or write-up
    cover:
      "https://images.unsplash.com/photo-1581091013111-1b89a9c6b37e?q=80&w=1200&auto=format&fit=crop",
    summary:
      "End-to-end system for WAAM steel: sensors, analog signal conditioning, and control logic with robotics integration.",
    tags: ["Robotics", "Sensors", "Control", "WAAM"],
  },
];

const experience: Slot[] = [
  {
    title: "Mechatronics Systems & Manufacturing Intern",
    org: "ADaMS Lab (University of Alberta)",
    period: "May–Aug 2025",
    href: "#",
    cover: "/adams-lab.png", // <— your new file path (relative to /public)
    summary:
      "Integrated load cells with pneumatic hammers; DAQ + control code; calibration workflow (R²>0.99); designed test rigs; ±1.5% FS repeatability.",
    tags: ["DAQ", "Pneumatics", "Load Cells", "Python", "MATLAB", "Control"],
  },
  {
    title: "Robotics Autonomy Engineer (WARG)",
    org: "University of Waterloo",
    period: "2024–present",
    href: "#",
    cover:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Autonomy prototypes and flight-test tooling; contributed to CI and telemetry utilities.",
    tags: ["Autonomy", "CI", "Tooling"],
  },
];

/** Component */
export default function SlotsBoard() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-center">
        Projects &amp; Experience
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Projects */}
        <div>
          <ColumnHeader title="" />
          <div className="space-y-6">
            {projects.map((s, i) => (
              <SlotCard key={`proj-${i}`} {...s} />
            ))}
          </div>
        </div>

        {/* Right: Experience */}
        <div>
          <ColumnHeader title="" />
          <div className="space-y-6">
            {experience.map((s, i) => (
              <SlotCard key={`exp-${i}`} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Subcomponents */
function ColumnHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 bg-black/60 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

function SlotCard({
  title,
  org,
  period,
  cover,
  summary,
  tags = [],
  href = "#",
}: Slot) {
  return (
    <a
      href={href}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400/60"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={cover}
          alt={`${title} cover`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-80" />
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

        {summary && <p className="mt-3 text-sm text-white/85">{summary}</p>}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] tracking-wide text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtle hover lift */}
      <motion.div
        aria-hidden
        initial={{ y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      />
    </a>
  );
}
