import type { Metadata } from "next";
import SectionShell from "../components/SectionShell";
import SlotsBoard from "../slots/SlotsBoard";

export const metadata: Metadata = {
  title: "Experience — Om Upadhyay",
  description: "Co-op and internship experience in robotics and mechatronics.",
};

export default function ExperiencePage() {
  return (
    <SectionShell title="Experience">
      <div className="mx-auto w-full max-w-5xl">
        <SlotsBoard sections={["experience"]} />
      </div>
    </SectionShell>
  );
}
