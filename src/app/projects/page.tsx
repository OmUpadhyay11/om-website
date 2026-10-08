import type { Metadata } from "next";
import SectionShell from "../components/SectionShell";
import SlotsBoard from "../slots/SlotsBoard";

export const metadata: Metadata = {
  title: "Projects — Om Upadhyay",
  description: "Engineering builds, hackathons, and independent project work.",
};

export default function ProjectsPage() {
  return (
    <SectionShell title="Projects">
      <div className="mx-auto w-full max-w-5xl">
        <SlotsBoard sections={["projects"]} />
      </div>
    </SectionShell>
  );
}
