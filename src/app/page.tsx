// src/app/page.tsx — "The Garage" interactive 3D landing.
import { Suspense } from "react";
import GarageLanding from "./components/garage/GarageLanding";
import GarageLoader from "./components/garage/GarageLoader";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="relative h-dvh w-full overflow-hidden bg-[#07080A] text-white">
          <GarageLoader />
        </main>
      }
    >
      <GarageLanding />
    </Suspense>
  );
}
