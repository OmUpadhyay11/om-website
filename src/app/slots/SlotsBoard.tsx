 "use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

/** Preload demo video once when user hovers project cards (no UI change). */
const videoPreloadSet = new Set<string>();

function preloadHeroVideoOnce(href: string) {
  if (videoPreloadSet.has(href)) return;
  videoPreloadSet.add(href);
  if (typeof document === "undefined") return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = href;
  document.head.appendChild(link);
}
type Slot = {
  slug: string;
  title: string;
  org: string;
  period?: string;
  cover: string;
  focus?: string;
  /** How the cover fills its frame. Logos often need `contain`. */
  coverFit?: "cover" | "contain";
  blurb?: string;
};

/** Content */
const experiences: Slot[] = [
  {
    slug: "magna",
    title: "R&D Engineering Intern",
    org: "Magna International",
    period: "Sept 2026 - Present",
    cover: "/magna-logo.png",
    focus: "center",
    blurb:
      "Working at the Promatek Research Centre on advanced manufacturing R&D, supporting automation and process development across active programs.",
  },
  {
    slug: "uw-formula-electric",
    title: "Chassis Subteam Member",
    org: "UW Formula Electric SAE",
    period: "Sept 2025 - Present",
    cover: "/uwfe-logo.png",
    focus: "center",
    coverFit: "contain",
    blurb:
      "Contributing to the University of Waterloo Formula Electric team — designing, building, and testing a formula-style electric race car for Formula SAE competition.",
  },
  {
    slug: "robim",
    title: "Engineering Design Intern",
    org: "RoBIM Technologies",
    period: "Jan - Apr 2026",
    cover: "/RoBIMLogo32.png",
    focus: "center",
    blurb:
      "Focused on robotics R&D execution for manufacturing workflows, through programming 6-DOF robots, end-effector integration, and process optimization for reliable production outcomes.",
  },
  {
    slug: "adams-internship",
    title: "Mechatronics Engineering Intern",
    org: "Additive Design and Manufacturing Lab",
    period: "May - Aug 2025",
    cover: "/ADAMSS.png",
    focus: "center",
    blurb:
      "Worked across CAD, 3D printing, sensing, and embedded systems to support advanced manufacturing experiments and mechatronics integration in the lab environment.",
  },
];

const projects: Slot[] = [
  {
    slug: "humanoid-29dof-simulation",
    title: "29-DOF Humanoid Simulation",
    org: "",
    period: "2026 | Project",
    cover: "/new_humanoid2.png",
    focus: "center",
  },
  {
    slug: "plywood-cutting-project",
    title: "6-DOF Robotic Machining",
    org: "RoBIM Technologies",
    period: "2026 | Project",
    cover: "/new_robocnc.png",
    focus: "center",
  },
  {
    slug: "integratedflight",
    title: "Voice Controlled Drone",
    org: "RedTeamHack",
    period: "2026 | Project",
    cover: "/new_drone2.png",
    focus: "center",
  },
  {
    slug: "VisionHat-project",
    title: "VisionHat AI",
    org: "HackED2026",
    period: "2026 | Project",
    cover: "/visionhat3.png",
    focus: "center",
  },
  {
    slug: "loadcell-experiment",
    title: "Volt2Force",
    org: "ADaMS Lab",
    period: "2025 | Project",
    cover: "/volt2force2.png",
    focus: "center",
  },
  {
    slug: "colourific",
    title: "Colourific",
    org: "University of Waterloo",
    period: "2024 | Project",
    cover: "/colourific4.png",
    focus: "center",
  },
];

function renderOrg(org: string) {
  let orgUrl: string | null = null;
  if (org === "Magna International") orgUrl = "https://www.magna.com/company/company-information";
  if (org === "UW Formula Electric SAE") orgUrl = "https://uwfsae.ca/";
  if (org === "RoBIM Technologies") orgUrl = "https://www.robimtech.com/";
  if (org === "Additive Design and Manufacturing Lab" || org === "ADaMS Lab") {
    orgUrl = "https://www.adams-lab.ca/";
  }
  if (!orgUrl) return org;

  return (
    <a
      href={orgUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
      onClick={(event) => event.stopPropagation()}
    >
      {org}
    </a>
  );
}

type SlotsBoardProps = {
  /** Which sections to render. Defaults to both, preserving the original page. */
  sections?: Array<"experience" | "projects">;
};

export default function SlotsBoard({
  sections = ["experience", "projects"],
}: SlotsBoardProps) {
  const showExperience = sections.includes("experience");
  const showProjects = sections.includes("projects");
  const router = useRouter();
  const [expandedExperienceSlug, setExpandedExperienceSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const onQuickJump = (event: Event) => {
      const custom = event as CustomEvent<string>;
      const target = custom.detail;
      if (target !== "experience" && target !== "projects") return;

      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    window.addEventListener("quick-jump", onQuickJump as EventListener);
    return () => window.removeEventListener("quick-jump", onQuickJump as EventListener);
  }, []);

  useEffect(() => {
    [...experiences, ...projects].forEach((slot) => {
      router.prefetch(`/work/${slot.slug}`);
    });
  }, [router]);

  return (
    <section className="w-full py-5 -mx-6 px-6 md:mx-auto md:max-w-5xl md:px-0">
      <div className="space-y-5">
        {showExperience && (
        <div id="experience" className="rounded-2xl border border-white/15 bg-zinc-900/70 p-3.5 backdrop-blur-sm md:p-5 scroll-mt-6">
          <div className="mb-4 text-center">
            <h2
              className="text-[20px] tracking-[0.12em] uppercase md:text-[24px]"
              style={{ fontFamily: "var(--font-michroma)" }}
            >
              Experience
            </h2>
          </div>

          <div id="experience-content" className="mx-auto max-w-2xl space-y-3.5 py-2">
            {experiences.map((s, idx) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.22 }}
              >
                <SlotCard
                  {...s}
                  compact
                  expandable
                  linkOrg
                  expanded={expandedExperienceSlug === s.slug}
                  onToggle={() =>
                    setExpandedExperienceSlug((prev) =>
                      prev === s.slug ? null : s.slug,
                    )
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
        )}

        {showProjects && (
        <div id="projects" className="rounded-2xl border border-white/15 bg-zinc-900/70 p-3.5 backdrop-blur-sm md:p-5 scroll-mt-6">
          <div className="mb-4 text-center">
            <h2
              className="text-[20px] tracking-[0.12em] uppercase md:text-[24px]"
              style={{ fontFamily: "var(--font-michroma)" }}
            >
              Projects
            </h2>
          </div>

          <div id="projects-content">
            <p
              className="mb-4 text-center text-[14px] text-white/90 md:text-[15px]"
              style={{ fontFamily: "var(--font-chakra)" }}
            >
              Engineering builds, hackathons, and independent project work.
            </p>
            <div className="grid gap-5 px-2 py-1 md:grid-cols-2">
              {projects.map((s, idx) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.06, duration: 0.22 }}
                >
                  <SlotCard {...s} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

/** Card — hover lift via CSS transform, no framer-motion needed */
function SlotCard({
  slug,
  title,
  org,
  period,
  cover,
  focus = "center",
  coverFit = "cover",
  blurb,
  compact = false,
  expandable = false,
  linkOrg = false,
  expanded = false,
  onToggle,
}: Slot & {
  compact?: boolean;
  expandable?: boolean;
  linkOrg?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const coverClass =
    coverFit === "contain"
      ? "object-contain bg-white p-2 transition-transform duration-500 group-hover:scale-[1.03]"
      : "object-cover transition-transform duration-500 group-hover:scale-[1.06]";
  const router = useRouter();
  const href = `/work/${slug}`;

  const prefetchDetailPage = () => {
    router.prefetch(href);
  };

  const cardClass = `group overflow-hidden rounded-xl border border-white/15 bg-zinc-800/70 outline-none shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all duration-250 ease-out hover:border-cyan-200/60 hover:shadow-[0_0_26px_rgba(34,211,238,0.30),0_14px_30px_rgba(34,211,238,0.18)] focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
    compact ? "mx-auto block w-full max-w-[760px]" : "block"
  }`;

  if (compact && expandable) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.007 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <div className={cardClass}>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="w-full text-left outline-none"
          >
            <div className="flex items-center gap-4 p-3 md:gap-5 md:p-4">
              <div className="relative h-[104px] w-[125px] shrink-0 overflow-hidden rounded-md border border-white/10">
                <Image
                  src={cover}
                  alt={`${title} cover`}
                  fill
                  className={coverClass}
                  style={{ objectPosition: focus }}
                  sizes="(min-width: 768px) 125px, 110px"
                  quality={100}
                  priority={false}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  className="text-center text-[16px] leading-tight tracking-[0.06em] text-white md:text-[18px]"
                  style={{ fontFamily: "var(--font-michroma)" }}
                >
                  {title}
                </h4>
                {org || period ? (
                  <div
                    className="mt-1.5 flex items-baseline justify-center gap-3 text-[13px] font-normal text-white/85 md:gap-4 md:text-[14px]"
                    style={{ fontFamily: "var(--font-chakra)" }}
                  >
                    {org ? (
                      <span className="min-w-0 truncate">
                        {linkOrg ? renderOrg(org) : org}
                      </span>
                    ) : null}
                    {org && period ? (
                      <span className="shrink-0 text-white/35" aria-hidden="true">
                        ·
                      </span>
                    ) : null}
                    {period ? (
                      <span className="shrink-0 text-white/80">({period})</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="mt-1 shrink-0 text-white"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {expanded && blurb ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 px-4 py-3 md:px-5">
                  <p
                    className="text-[13px] leading-relaxed text-white/95 md:text-sm"
                    style={{ fontFamily: "var(--font-chakra)" }}
                  >
                    {blurb}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.007 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <Link
        href={href}
        prefetch
        onMouseEnter={() => {
          prefetchDetailPage();
          if (slug === "humanoid-29dof-simulation") preloadHeroVideoOnce("/humanoid29DOF.mp4");
          if (slug === "plywood-cutting-project") preloadHeroVideoOnce("/PlywoodCNCTimeLapse.mov");
        }}
        onFocus={prefetchDetailPage}
        onTouchStart={prefetchDetailPage}
        className={cardClass}
      >
        {compact ? (
          <div className="flex items-center gap-4 p-3 md:gap-5 md:p-4">
            <div className="relative h-[104px] w-[125px] shrink-0 overflow-hidden rounded-md border border-white/10">
              <Image
                src={cover}
                alt={`${title} cover`}
                fill
                className={coverClass}
                style={{ objectPosition: focus }}
                sizes="(min-width: 768px) 125px, 110px"
                quality={100}
                priority={false}
              />
            </div>
            <div className="min-w-0 flex-1">
                <div>
                  <h4
                    className="text-center text-[16px] leading-tight tracking-[0.06em] text-white md:text-[18px]"
                    style={{ fontFamily: "var(--font-michroma)" }}
                  >
                    {title}
                  </h4>
                  {period ? (
                    <p
                      className="mt-1 text-center text-[13px] font-normal text-white/85 md:text-[14px]"
                      style={{ fontFamily: "var(--font-chakra)" }}
                    >
                      {period}
                    </p>
                  ) : null}
                </div>
            </div>
          </div>
        ) : (
          <>
            {/* Seamless card: title overlays image */}
            <div className="relative w-full overflow-hidden aspect-[3/2]">
              <Image
                src={cover}
                alt={`${title} cover`}
                fill
                className={coverClass}
                style={{ objectPosition: focus }}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                <div className="text-center">
                  <h4
                    className="inline-block text-[15px] leading-tight tracking-[0.05em] text-[#f6c453] md:text-[16px]"
                    style={{
                      fontFamily: "var(--font-michroma)",
                      WebkitTextStroke: "0.45px rgba(0,0,0,0.9)",
                      textShadow: "0 1px 1px rgba(0,0,0,0.55)",
                    }}
                  >
                    {title}
                  </h4>
                </div>
              </div>
            </div>
          </>
        )}
      </Link>
    </motion.div>
  );
}
