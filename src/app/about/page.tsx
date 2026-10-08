import type { Metadata } from "next";
import SectionShell from "../components/SectionShell";
import AboutMeSection from "../components/AboutMeSection";

export const metadata: Metadata = {
  title: "About Me — Om Upadhyay",
  description:
    "Mechatronics Engineering at the University of Waterloo, Class of 2029.",
};

export default function AboutPage() {
  return (
    <SectionShell title="About Me">
      <AboutMeSection showMap />
    </SectionShell>
  );
}
