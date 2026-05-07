"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowRight } from "lucide-react";

type HomeHeaderProps = {
  playfairClassName: string;
};

function TypeReveal({
  text,
  delay,
  duration,
  className = "",
  block = false,
}: {
  text: string;
  delay: number;
  duration: number;
  className?: string;
  block?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <span className={`${block ? "block" : "inline-block"} ${className}`}>{text}</span>
    );
  }

  return (
    <span
      className={`relative ${block ? "block mx-auto w-fit" : "inline-block"} ${className}`}
      style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
    >
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(-0.12em 100% -0.12em 0)" }}
        animate={{ clipPath: "inset(-0.12em 0% -0.12em 0)" }}
        transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function TypeRevealInline({
  delay,
  duration,
  children,
}: {
  delay: number;
  duration: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <span
      className="relative inline-block"
      style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
    >
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(-0.12em 100% -0.12em 0)" }}
        animate={{ clipPath: "inset(-0.12em 0% -0.12em 0)" }}
        transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HomeHeader({ playfairClassName }: HomeHeaderProps) {
  const socialBaseClass =
    "text-cyan-100 transition-colors duration-200 hover:text-white";

  const triggerQuickJump =
    (targetId: "experience" | "projects" | "about") =>
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("quick-jump", { detail: targetId }));

      const scrollToTarget = () => {
        const section = document.getElementById(targetId);
        if (!section) return;
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      // First attempt immediately, second attempt after collapse/expand animation.
      requestAnimationFrame(scrollToTarget);
      window.setTimeout(scrollToTarget, 260);
    };

  return (
    <header className="mx-auto mb-12 w-full max-w-5xl">
      <motion.div
        className="rounded-3xl border border-white/15 bg-zinc-900/80 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between">
          <motion.div
            className="w-full rounded-2xl border border-white/15 bg-zinc-800/70 p-5 md:w-[68%] md:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45 }}
          >
            <div className="flex flex-col items-center">
              <p className="text-xs tracking-[0.18em] text-cyan-200 uppercase">
                Engineering Portfolio
              </p>
              <h1 className={`mt-2 text-center text-3xl italic md:text-5xl ${playfairClassName}`}>
                <TypeReveal text="Om Upadhyay" delay={0.05} duration={0.75} />
              </h1>
              <p className="mt-2 text-center text-sm text-white md:text-base">
                <TypeRevealInline delay={0.8} duration={0.65}>
                  <a
                    href="https://uwaterloo.ca/mechanical-mechatronics-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/35 underline-offset-2 transition hover:decoration-white"
                  >
                    Mechatronics Engineering
                  </a>{" "}
                  · University of Waterloo
                </TypeRevealInline>
              </p>

              <nav className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <motion.a
                  href="mailto:omupadhyay@gmail.com"
                  aria-label="Email"
                  className={socialBaseClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <Mail size={22} />
                </motion.a>
                <motion.a
                  href="https://github.com/omupadhyay11"
                  aria-label="GitHub"
                  className={socialBaseClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <Github size={22} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/-om-upadhyay"
                  aria-label="LinkedIn"
                  className={socialBaseClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <Linkedin size={22} />
                </motion.a>
                <motion.a
                  href="https://devpost.com/omupadhyay"
                  aria-label="Devpost"
                  className={socialBaseClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1.2L21.6 6.7v10.6L12 22.8 2.4 17.3V6.7L12 1.2z" />
                    <path d="M8.75 7.5h3.5a4.5 4.5 0 010 9h-3.5v-9z" />
                  </svg>
                </motion.a>
              </nav>
            </div>
          </motion.div>

          <motion.aside
            className="w-full rounded-2xl border border-white/15 bg-zinc-800/70 p-4 md:w-[28%] md:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            <p className="mb-3 text-center text-xs tracking-[0.16em] text-cyan-200 uppercase">
              Quick Jump
            </p>
            <div className="space-y-2">
              <a
                href="#experience"
                onClick={triggerQuickJump("experience")}
                className="group flex items-center justify-between rounded-lg border border-white/15 bg-zinc-900/70 px-3 py-2 text-sm text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
              >
                <span>Experience</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#projects"
                onClick={triggerQuickJump("projects")}
                className="group flex items-center justify-between rounded-lg border border-white/15 bg-zinc-900/70 px-3 py-2 text-sm text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
              >
                <span>Projects</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#about"
                onClick={triggerQuickJump("about")}
                className="group flex items-center justify-between rounded-lg border border-white/15 bg-zinc-900/70 px-3 py-2 text-sm text-white transition hover:border-cyan-200/60 hover:text-cyan-100"
              >
                <span>About Me</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </header>
  );
}
