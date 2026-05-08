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
  blurb?: string;
};

/** Content */
const experiences: Slot[] = [
  {
    slug: "robim",
    title: "Robotics R&D Engineering Intern",
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
    title: "29-DOF Humanoid",
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

/** Component — server component, no "use client" needed */
export default function SlotsBoard() {
  const router = useRouter();
  const [isExperienceCollapsed, setIsExperienceCollapsed] = useState(false);
  const [isProjectsCollapsed, setIsProjectsCollapsed] = useState(false);
  const [expandedExperienceSlug, setExpandedExperienceSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const onQuickJump = (event: Event) => {
      const custom = event as CustomEvent<string>;
      const target = custom.detail;
      if (target !== "experience" && target !== "projects") return;

      if (target === "experience") setIsExperienceCollapsed(false);
      if (target === "projects") setIsProjectsCollapsed(false);

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
        <div id="experience" className="rounded-2xl border border-white/15 bg-zinc-900/70 p-3.5 backdrop-blur-sm md:p-5 scroll-mt-6">
          <div className="mb-4">
            <div className="relative text-center">
              <h2 className="text-[23px] font-bold tracking-tight md:text-[27px]">
                Experience
              </h2>
              <button
                type="button"
                onClick={() => setIsExperienceCollapsed((prev) => !prev)}
                aria-expanded={!isExperienceCollapsed}
                aria-controls="experience-content"
                className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/[0.08] p-2 text-cyan-100 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-300/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <motion.span
                  animate={{ rotate: isExperienceCollapsed ? -90 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!isExperienceCollapsed && (
              <motion.div
                id="experience-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mx-auto max-w-2xl space-y-3.5 py-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div id="projects" className="rounded-2xl border border-white/15 bg-zinc-900/70 p-3.5 backdrop-blur-sm md:p-5 scroll-mt-6">
          <div className="mb-4">
            <div className="relative text-center">
              <h2 className="text-[23px] font-bold tracking-tight md:text-[27px]">
                Projects
              </h2>
              <button
                type="button"
                onClick={() => setIsProjectsCollapsed((prev) => !prev)}
                aria-expanded={!isProjectsCollapsed}
                aria-controls="projects-content"
                className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/[0.08] p-2 text-cyan-100 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-300/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <motion.span
                  animate={{ rotate: isProjectsCollapsed ? -90 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!isProjectsCollapsed && (
              <motion.div
                id="projects-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mb-4 text-center text-[14px] text-white md:text-[15px]">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  style={{ objectPosition: focus }}
                  sizes="(min-width: 768px) 125px, 110px"
                  quality={100}
                  priority={false}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div>
                  <h4 className="text-center text-[19px] font-bold leading-tight text-white md:text-[21px]">
                    {title}
                  </h4>
                  {period ? (
                    <p className="mt-1 text-center text-[13px] font-normal text-white/85 md:text-[14px]">
                      {period}
                    </p>
                  ) : null}
                </div>
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
                  <p className="text-[13px] leading-relaxed text-white/95 md:text-sm">
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
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                style={{ objectPosition: focus }}
                sizes="(min-width: 768px) 125px, 110px"
                quality={100}
                priority={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <h4 className="text-center text-[19px] font-bold leading-tight text-white md:text-[21px]">
                  {title}
                </h4>
                {period ? (
                  <p className="mt-1 text-center text-[13px] font-normal text-white/85 md:text-[14px]">
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
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                style={{ objectPosition: focus }}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                <div className="text-center">
                  <h4
                    className="inline-block text-[18px] font-bold leading-tight text-[#f6c453] md:text-[19px]"
                    style={{
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
