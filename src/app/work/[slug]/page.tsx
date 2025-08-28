import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/** Detail data for each slot (edit freely) */
const DETAILS: Record<
  string,
  {
    title: string;
    org: string;
    period?: string;
    hero: string;
    summary: string;
    tags: string[];
    gallery?: string[];
  }
> = {
  interviewai: {
    title: "InterviewAI",
    org: "SpeechDojo",
    period: "2025 | Project",
    hero: "/InterviewAI_Pic.png",
    summary:
      "One-paragraph overview of the project: problem, approach, stack, and outcome. Link to demos or repos here.",
    tags: ["Next.js", "TypeScript", "OpenAI", "Vercel"],
    gallery: ["/InterviewAI_Pic.png"],
  },
  "loadcell-experiment": {
    title: "LoadCell Experiment",
    org: "ADaMS Lab",
    period: "2025 | Project",
    hero: "/LoadCellPic_32.png",
    summary:
      "Bench-tested a double-ended load cell (Wheatstone bridge) with instrumentation amplifier → DAQ. Built calibration curve, filtering, and repeatability analysis.",
    tags: ["Load Cell", "Instrumentation", "DAQ", "Python", "MATLAB"],
    gallery: ["/LoadCellPic_32.png"],
  },
  "adams-internship": {
    title: "Mechatronics Systems & Manufacturing Intern",
    org: "ADaMS Lab (University of Alberta)",
    period: "May–Aug 2025 | Internship",
    hero: "/Adams_Lab32.png",
    summary:
      "Integrated load cells with pneumatic hammers; designed test rigs; DAQ + control code; calibration workflow (R² > 0.99).",
    tags: ["Pneumatics", "DAQ", "Controls", "Lab Tooling"],
    gallery: ["/Adams_Lab32.png"],
  },
  colourific: {
    title: "Colourific",
    org: "University of Waterloo",
    period: "2024 | Project",
    hero: "/Colourific32.png",
    summary:
      "Block-sorting robot: brief description of your role, stack, and results.",
    tags: ["Robotics", "Computer Vision", "C++"],
    gallery: ["/Colourific32.png"],
  },
};

export default function WorkDetail({ params }: { params: { slug: string } }) {
  const data = DETAILS[params.slug];
  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-white/70 hover:text-white underline underline-offset-4"
          >
            ← Back
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {data.title}
          </h1>
          <p className="mt-2 text-white/70">
            {data.org}{" "}
            {data.period ? (
              <span className="text-white/50">• {data.period}</span>
            ) : null}
          </p>
        </header>

        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 aspect-[16/9]">
          <Image
            src={data.hero}
            alt={`${data.title} hero`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
        </div>

        {/* Summary + tags */}
        <section className="mb-10">
          <p className="text-white/85 leading-relaxed">{data.summary}</p>
          {data.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-2 py-0.5 text-[12px] tracking-wide text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        {/* Gallery */}
        {data.gallery?.length ? (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                >
                  <Image
                    src={src}
                    alt={`${data.title} image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

/** Optional: set nice <title> per project */
export function generateMetadata({ params }: { params: { slug: string } }) {
  const data = DETAILS[params.slug];
  return {
    title: data ? `${data.title} — Om Upadhyay` : "Project — Om Upadhyay",
  };
}
