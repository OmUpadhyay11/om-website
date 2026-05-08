"use client";

import { useEffect } from "react";

type HeroVideoProps = {
  src: string;
  className?: string;
};

/**
 * Autoplay hero video with an early `<link rel="preload" as="video">` so the
 * browser starts fetching before paint settles (same visuals, faster start).
 */
export default function HeroVideo({ src, className = "h-auto w-full" }: HeroVideoProps) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [src]);

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    />
  );
}
