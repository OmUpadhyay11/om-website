"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type SectionShellProps = {
  title: string;
  children: React.ReactNode;
};

const GARAGE_INSIDE_HREF = "/?bay=open";

/**
 * Wrapper for isolated section routes. Renders a "Back to Garage" control
 * that returns inside the open bay, and Esc does the same.
 */
export default function SectionShell({ title, children }: SectionShellProps) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      router.push(GARAGE_INSIDE_HREF);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <main className="min-h-screen bg-black px-6 py-4 text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center py-2">
        <Link
          href={GARAGE_INSIDE_HREF}
          aria-label={`Back to Garage from ${title}`}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900/70 px-3.5 py-2 text-sm tracking-wide text-white/90 backdrop-blur transition hover:border-[#E82127]/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E82127]/70"
          style={{ fontFamily: "var(--font-chakra)" }}
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Garage</span>
        </Link>
      </div>
      {children}
      <p
        className="mx-auto mt-6 mb-2 w-full max-w-5xl text-right text-[11px] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        Press Esc to return to the garage
      </p>
    </main>
  );
}
