"use client";

import { Github, Linkedin, Mail } from "lucide-react";

function DevpostIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 1.2L21.6 6.7v10.6L12 22.8 2.4 17.3V6.7L12 1.2z" />
      <path d="M8.75 7.5h3.5a4.5 4.5 0 010 9h-3.5v-9z" />
    </svg>
  );
}

const CHANNELS = [
  {
    label: "Email",
    href: "mailto:omupadhyay@gmail.com",
    detail: "omupadhyay@gmail.com",
    Icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/-om-upadhyay",
    detail: "linkedin.com/in/-om-upadhyay",
    Icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/omupadhyay11",
    detail: "github.com/omupadhyay11",
    Icon: Github,
    external: true,
  },
  {
    label: "Devpost",
    href: "https://devpost.com/omupadhyay",
    detail: "devpost.com/omupadhyay",
    Icon: DevpostIcon,
    external: true,
  },
] as const;

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto mt-5 w-full max-w-5xl">
      <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-4 backdrop-blur-sm md:p-5">
        <div className="mb-5 text-center">
          <h2
            className="text-[20px] tracking-[0.12em] uppercase md:text-[24px]"
            style={{ fontFamily: "var(--font-michroma)" }}
          >
            Contact Me
          </h2>
          <p
            className="mx-auto mt-3 max-w-2xl text-sm text-white/85 md:text-[15px]"
            style={{ fontFamily: "var(--font-chakra)" }}
          >
            Open to co-ops, collaborations, and conversations about robotics,
            controls, and building things that move.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CHANNELS.map(({ label, href, detail, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center gap-4 rounded-xl border border-white/15 bg-zinc-800/70 px-4 py-4 transition hover:border-[#E82127]/55 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E82127]/70"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-zinc-900/80 text-white/80 transition group-hover:border-[#E82127]/50 group-hover:text-white">
                <Icon size={22} />
              </span>
              <span className="min-w-0">
                <span
                  className="block text-[13px] tracking-[0.08em] text-white uppercase md:text-[14px]"
                  style={{ fontFamily: "var(--font-michroma)" }}
                >
                  {label}
                </span>
                <span
                  className="mt-1 block truncate text-[13px] text-white/70 md:text-sm"
                  style={{ fontFamily: "var(--font-chakra)" }}
                >
                  {detail}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
