"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GaragePhase } from "./GarageScene";
import GarageLoader from "./GarageLoader";

const GarageScene = dynamic(() => import("./GarageScene"), {
  ssr: false,
});

const SECTIONS = [
  { label: "Contact Me", route: "/contact" },
  { label: "Projects", route: "/projects" },
  { label: "Experience", route: "/experience" },
  { label: "About Me", route: "/about" },
];

export default function GarageLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Returning from a section: land already inside the open bay.
  const bayOpen = searchParams.get("bay") === "open";

  const [phase, setPhase] = useState<GaragePhase>("closed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fading, setFading] = useState(false);
  const [beginRequested, setBeginRequested] = useState(bayOpen);
  const [instantOpen] = useState(bayOpen);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(!bayOpen);
  const readyOnce = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    SECTIONS.forEach((s) => router.prefetch(s.route));
  }, [router]);

  const siteReady = sceneMounted && !loaderVisible;

  const requestBegin = useCallback(() => {
    if (!siteReady || phase !== "closed") return;
    setBeginRequested(true);
  }, [phase, siteReady]);

  useEffect(() => {
    if (!siteReady || phase !== "closed") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestBegin();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, requestBegin, siteReady]);

  const onOpeningStart = useCallback(() => setPhase("opening"), []);
  const onOpened = useCallback(() => setPhase("open"), []);
  const onFlyStart = useCallback(() => setFading(true), []);
  const onNavigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router],
  );
  const onReady = useCallback(() => {
    if (readyOnce.current) return;
    readyOnce.current = true;
    setSceneMounted(true);
  }, []);
  const onLoaderFinished = useCallback(() => setLoaderVisible(false), []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#07080A] text-white">
      <GarageScene
        reducedMotion={reducedMotion}
        phase={phase}
        beginRequested={beginRequested}
        instantOpen={instantOpen}
        beginHint={
          !siteReady || instantOpen
            ? null
            : phase === "closed"
              ? "Click anywhere to begin"
              : phase === "opening"
                ? "Opening the garage"
                : null
        }
        onOpeningStart={onOpeningStart}
        onOpened={onOpened}
        onFlyStart={onFlyStart}
        onNavigate={onNavigate}
        onReady={onReady}
      />

      {loaderVisible && (
        <GarageLoader finishing={sceneMounted} onFinished={onLoaderFinished} />
      )}

      {/* Click anywhere to open — only after the garage has finished loading */}
      {siteReady && phase === "closed" && !instantOpen && (
        <button
          type="button"
          aria-label="Click anywhere to begin"
          onClick={requestBegin}
          className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent"
        />
      )}

      {/* Keyboard and screen reader path into every section */}
      <nav aria-label="Portfolio sections" className="sr-only">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.route}>
              <a href={s.route}>{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Fade to black while the camera flies into a machine */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-700 ${
          fading ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </main>
  );
}
