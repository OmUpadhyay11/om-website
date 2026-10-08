"use client";

import dynamic from "next/dynamic";

const WorldTravelMap = dynamic(() => import("../components/WorldTravelMap"), {
  loading: () => (
    <div
      className="min-h-[520px] w-full rounded-xl border border-white/15 bg-zinc-800/40"
      aria-busy="true"
      aria-label="Loading map"
    />
  ),
});

export default function GalleryClient() {
  return (
    <div className="mx-auto mt-4 w-full max-w-5xl rounded-2xl border border-white/15 bg-zinc-900/70 p-4 backdrop-blur-sm md:p-5">
      <div className="rounded-xl border border-white/15 bg-zinc-800/70 p-4 md:p-5">
        <WorldTravelMap />
      </div>
    </div>
  );
}
