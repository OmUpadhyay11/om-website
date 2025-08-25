"use client";
// Tells Next.js this component is client-side (needed for animations & useState)

import Image from "next/image";
// Next.js Image component for optimized image loading
import { useState } from "react";
// useState lets us show/hide the animated ring

// Export the Logo component so we can import it anywhere
export default function Logo({ size = 44 }: { size?: number }) {
  // 'size' is a prop to control how big the logo appears (default = 44px)
  // 'showRing' state determines whether the animated ring is visible
  const [showRing, setShowRing] = useState(true);

  return (
    <div
      className="relative" // This makes the container position its children absolutely
      style={{ width: size, height: size }} // Set the container size to match the logo size
    >
      {/* The animated ring */}
      {showRing && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 spin-twice"
          onAnimationEnd={() => setShowRing(false)}
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="120 300" // draw part of the ring, leave gap
            style={{
              filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))",
            }}
          />
        </svg>
      )}

      {/* The OU logo image itself */}
      <Image
        src="/OU.svg" // Path to your logo in public/ folder
        alt="OU Logo" // Accessible alt text
        width={size} // Width matches the container size
        height={size} // Height matches the container size
        className="object-contain" // Keeps aspect ratio without distortion
        priority // Makes sure it loads immediately for better UX
      />
    </div>
  );
}
