"use client";
// Tells Next.js this component is client-side (needed for animations & useState)

import Image from "next/image";
// Next.js Image component for optimized image loading

// Export the Logo component so we can import it anywhere
export default function Logo({ size = 44 }: { size?: number }) {
  // 'size' is a prop to control how big the logo appears (default = 44px)

  return (
    <div
      className="relative" // This makes the container position its children absolutely
      style={{ width: size, height: size }} // Set the container size to match the logo size
    >
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
