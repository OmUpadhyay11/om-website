import type { Metadata } from "next";
import SectionShell from "../components/SectionShell";
import ContactSection from "../components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Me — Om Upadhyay",
  description: "Get in touch with Om Upadhyay for co-ops, collaborations, and projects.",
};

export default function ContactPage() {
  return (
    <SectionShell title="Contact Me">
      <ContactSection />
    </SectionShell>
  );
}
