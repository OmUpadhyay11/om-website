"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaBasketballBall, FaFutbol, FaUserNinja } from "react-icons/fa";
import Image from "next/image";
import { blogPosts, favoriteAlbums } from "./aboutContent";

const WorldTravelMap = dynamic(() => import("./WorldTravelMap"), {
  loading: () => (
    <div
      className="min-h-[520px] w-full rounded-xl border border-white/15 bg-zinc-800/40"
      aria-busy="true"
      aria-label="Loading map"
    />
  ),
});

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-3 text-center text-[15px] tracking-[0.14em] uppercase text-white md:text-[16px]"
      style={{ fontFamily: "var(--font-michroma)" }}
    >
      {children}
    </h3>
  );
}

export default function AboutMeSection({ showMap = true }: { showMap?: boolean }) {
  useEffect(() => {
    const onQuickJump = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (custom.detail !== "about") return;

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
        <div className="mb-4 text-center">
          <h2
            className="text-[20px] tracking-[0.12em] uppercase md:text-[24px]"
            style={{ fontFamily: "var(--font-michroma)" }}
          >
            About Me
          </h2>
        </div>

        <div className="rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
          <p
            className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-white/90 md:text-[15px]"
            style={{ fontFamily: "var(--font-chakra)" }}
          >
            I&apos;m a mechatronics engineering student focused primarily on
            robotics, controls, and intelligent manufacturing systems. My work
            spans embedded systems, computer vision, and humanoid manipulation,
            with a focus on translating real world problems into engineered
            solutions. Outside of school, I spend most of my time playing sports
            and chasing the competitive side of things. Below are a few
            highlights from my time in sports:
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-zinc-900/60 p-3">
              <div className="flex items-center gap-2">
                <SportBadgeIcon kind="soccer" />
                <p
                  className="flex-1 text-center text-[13px] tracking-[0.04em] text-white md:text-[14px]"
                  style={{ fontFamily: "var(--font-michroma)" }}
                >
                  Club Level Soccer
                </p>
              </div>
              <p
                className="-mt-1 text-center text-[14px] text-white/80"
                style={{ fontFamily: "var(--font-chakra)" }}
              >
                7 years
              </p>
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
                <p
                  className="flex-1 text-center text-[13px] tracking-[0.04em] text-white md:text-[14px]"
                  style={{ fontFamily: "var(--font-michroma)" }}
                >
                  Taekwondo Black Belt
                </p>
              </div>
              <p
                className="-mt-1 text-center text-[14px] text-white/80"
                style={{ fontFamily: "var(--font-chakra)" }}
              >
                10 years
              </p>
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
                <p
                  className="flex-1 text-center text-[13px] tracking-[0.04em] text-white md:text-[14px]"
                  style={{ fontFamily: "var(--font-michroma)" }}
                >
                  Varsity Basketball MVP
                </p>
              </div>
              <p
                className="-mt-1 text-center text-[14px] text-white/80"
                style={{ fontFamily: "var(--font-chakra)" }}
              >
                3 years
              </p>
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

        {/* Blog */}
        <div id="blog" className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
          <SectionHeading>Blog</SectionHeading>
          {blogPosts.length === 0 ? (
            <p
              className="text-center text-sm text-white/55"
              style={{ fontFamily: "var(--font-chakra)" }}
            >
              Articles coming soon.
            </p>
          ) : (
            <ul className="mx-auto max-w-2xl space-y-2.5">
              {blogPosts.map((post) => (
                <li key={post.href + post.title}>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3 rounded-lg border border-white/12 bg-zinc-900/55 px-3.5 py-3 transition hover:border-[#E82127]/55 hover:bg-zinc-900/80"
                  >
                    <div className="min-w-0">
                      <p
                        className="text-[14px] tracking-[0.04em] text-white md:text-[15px]"
                        style={{ fontFamily: "var(--font-michroma)" }}
                      >
                        {post.title}
                      </p>
                      <p
                        className="mt-1 text-[12px] text-white/50"
                        style={{ fontFamily: "var(--font-jetbrains)" }}
                      >
                        {post.date}
                      </p>
                      {post.summary ? (
                        <p
                          className="mt-1.5 text-[13px] leading-relaxed text-white/75 md:text-[14px]"
                          style={{ fontFamily: "var(--font-chakra)" }}
                        >
                          {post.summary}
                        </p>
                      ) : null}
                    </div>
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-white/40 transition group-hover:text-[#E82127]"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Favourite albums */}
        <div
          id="albums"
          className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5"
        >
          <SectionHeading>Favourite Albums</SectionHeading>
          {favoriteAlbums.length === 0 ? (
            <p
              className="text-center text-sm text-white/55"
              style={{ fontFamily: "var(--font-chakra)" }}
            >
              Album shelf coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {favoriteAlbums.map((album) => (
                <a
                  key={album.href}
                  href={album.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg border border-white/12 bg-zinc-900/60 outline-none transition hover:border-[#1DB954]/70 focus-visible:ring-2 focus-visible:ring-[#1DB954]/70"
                  aria-label={`${album.title} by ${album.artist} on Spotify`}
                >
                  <div className="relative aspect-square w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={album.cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3">
                      <p
                        className="truncate text-[12px] tracking-[0.04em] text-white md:text-[13px]"
                        style={{ fontFamily: "var(--font-michroma)" }}
                      >
                        {album.title}
                      </p>
                      <p
                        className="truncate text-[12px] text-white/70"
                        style={{ fontFamily: "var(--font-chakra)" }}
                      >
                        {album.artist}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {showMap && (
          <div
            className="mt-4 rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5"
            style={{ contentVisibility: "auto" }}
          >
            <WorldTravelMap />
          </div>
        )}
      </div>
    </section>
  );
}
