"use client";

import { useEffect, useRef, useState } from "react";

type GarageLoaderProps = {
  finishing?: boolean;
  onFinished?: () => void;
};

function LoaderRaceCar({ spin = true }: { spin?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 56"
      width="148"
      height="52"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <ellipse cx="80" cy="50" rx="58" ry="3.5" fill="rgba(0,0,0,0.5)" />

      <path
        d="M28 34
           C30 28, 36 24, 48 22
           L62 16
           L78 15
           L92 17
           L108 22
           L128 26
           L142 28
           L146 32
           L142 36
           L28 36
           Z"
        fill="#8a919b"
      />
      <path d="M30 34 L142 34 L140 37 L32 37 Z" fill="#4e545e" />
      <path d="M64 16 L86 16 L90 24 L60 24 Z" fill="#3f444d" />
      <path d="M68 17 L82 17 L84 22 L66 22 Z" fill="#9ec0d2" />
      <path d="M128 26 L146 28 L142 34 L126 32 Z" fill="#6b727c" />

      <rect x="18" y="10" width="26" height="3.5" rx="1" fill="#E82127" />
      <rect x="24" y="13.5" width="3" height="14" rx="0.5" fill="#5a606a" />
      <rect x="35" y="13.5" width="3" height="14" rx="0.5" fill="#5a606a" />

      <rect x="132" y="33" width="26" height="3.2" rx="1" fill="#E82127" />
      <rect x="140" y="28" width="2.5" height="6" rx="0.4" fill="#5a606a" />
      <rect x="148" y="28" width="2.5" height="6" rx="0.4" fill="#5a606a" />

      <rect x="52" y="29" width="54" height="2" rx="1" fill="#E82127" />
      <rect x="20" y="31" width="10" height="2.5" rx="1" fill="#E82127" />

      <Wheel cx={42} cy={40} spin={spin} />
      <Wheel cx={118} cy={40} spin={spin} />

      <g opacity="0.4">
        <rect x="2" y="22" width="12" height="1.2" rx="0.6" fill="#E82127" />
        <rect x="4" y="27" width="9" height="1" rx="0.5" fill="rgba(255,255,255,0.35)" />
        <rect x="3" y="32" width="10" height="1" rx="0.5" fill="rgba(255,255,255,0.2)" />
      </g>
    </svg>
  );
}

function Wheel({ cx, cy, spin }: { cx: number; cy: number; spin: boolean }) {
  return (
    <g>
      {spin && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`360 ${cx} ${cy}`}
          dur="0.28s"
          repeatCount="indefinite"
        />
      )}
      <circle cx={cx} cy={cy} r="9" fill="#14161a" stroke="#3a3e46" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="3.5" fill="#6a707a" />
      <line x1={cx} y1={cy - 7.5} x2={cx} y2={cy + 7.5} stroke="#9aa1ab" strokeWidth="1.4" />
      <line x1={cx - 7.5} y1={cy} x2={cx + 7.5} y2={cy} stroke="#9aa1ab" strokeWidth="1.4" />
    </g>
  );
}

/**
 * Garage boot screen: formula car drives smoothly along a track.
 */
export default function GarageLoader({
  finishing = false,
  onFinished,
}: GarageLoaderProps) {
  const [display, setDisplay] = useState(8);
  const [spinWheels, setSpinWheels] = useState(true);
  const targetRef = useRef(8);
  const displayRef = useRef(8);
  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSpinWheels(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSpinWheels(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Staged target progress (same logic as before, but only updates the target)
  useEffect(() => {
    if (finishing) {
      targetRef.current = 100;
      return;
    }

    const id = window.setInterval(() => {
      const prev = targetRef.current;
      if (prev >= 88) return;
      const step = prev < 40 ? 2.4 : prev < 70 ? 1.2 : 0.4;
      targetRef.current = Math.min(88, prev + step);
    }, 100);

    return () => window.clearInterval(id);
  }, [finishing]);

  // Smooth lerp toward target every frame — kills the choppy left jumps
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = targetRef.current;
      const cur = displayRef.current;
      const next = cur + (target - cur) * 0.12;
      const clamped = Math.abs(target - next) < 0.05 ? target : next;
      displayRef.current = clamped;
      setDisplay(clamped);

      if (finishing && clamped >= 99.5 && !finishedRef.current) {
        finishedRef.current = true;
        window.setTimeout(() => onFinishedRef.current?.(), 180);
      }

      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [finishing]);

  const trackPad = 8; // % inset so car stays on asphalt
  const travel = Math.min(100, Math.max(0, display));
  // translateX as % of track — car width compensated via margin on the wrapper
  const carX = trackPad + (travel / 100) * (100 - trackPad * 2);

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#07080A]"
      role="status"
      aria-live="polite"
      aria-busy={!finishing}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(display)}
    >
      <p
        className="text-xs tracking-[0.3em] text-white/55 uppercase"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        Loading the garage
      </p>

      <div className="relative mt-10 w-[min(440px,82vw)]">
        {/* Track */}
        <div className="relative h-[58px]">
          <div className="absolute bottom-2 left-0 right-0 h-3.5 rounded-full bg-[#12141a] ring-1 ring-white/5" />

          {/* Progress fill */}
          <div
            className="absolute bottom-2 left-0 h-3.5 overflow-hidden rounded-full"
            style={{
              width: `${travel}%`,
              willChange: "width",
            }}
          >
            <div className="h-full w-full bg-gradient-to-r from-[#6e1014] via-[#E82127] to-[#ff5a5f]" />
          </div>

          {/* Lane dashes (static — smoother than animating stroke offset) */}
          <div
            className="pointer-events-none absolute bottom-[18px] left-3 right-3 h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 10px, transparent 10px 22px)",
            }}
          />

          {/* Car — GPU transform, not left */}
          <div
            className="absolute bottom-0"
            style={{
              left: 0,
              width: "100%",
              transform: `translate3d(calc(${carX}% - 74px), 0, 0)`,
              willChange: "transform",
            }}
          >
            <LoaderRaceCar spin={spinWheels} />
          </div>
        </div>

        {/* Checkers */}
        <div className="pointer-events-none absolute bottom-1.5 left-0 flex h-5 w-2 flex-col overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`h-1 w-full ${i % 2 === 0 ? "bg-white/75" : "bg-[#07080A]"}`}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-1.5 right-0 flex h-5 w-2 flex-col overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`h-1 w-full ${i % 2 === 0 ? "bg-white/75" : "bg-[#07080A]"}`}
            />
          ))}
        </div>
      </div>

      <p
        className="mt-5 text-[10px] tracking-[0.22em] text-white/35 tabular-nums"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        {Math.round(display)}%
      </p>
    </div>
  );
}
