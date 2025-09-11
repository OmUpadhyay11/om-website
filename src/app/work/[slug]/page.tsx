import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";

/** Data model for detail pages */
type Detail = {
  title: string;
  org: string;
  period?: string;
  hero: string;
  summary: string;
  tags: string[];
  gallery?: string[]; // extra images
  bullets?: string[]; // overview/technical bullets
  conclusion?: string; // (unused here)
};

/** Detail data for each slot (edit freely) */
const DETAILS: Record<string, Detail> = {
  interviewai: {
    title: "InterviewAI",
    org: "SpeechDojo",
    period: "2025 | Project",
    hero: "/InterviewAI_Pic.png",
    summary:
      "The AI Interview Agent is a real-time voice-based platform designed to simulate professional interview settings. It leverages conversational AI to provide instant feedback, helping users practice and refine their communication skills. Built with a modern web stack, the tool enables smooth, natural interactions through live speech transcription and dynamic response generation. By replicating the pressure and flow of real interviews, it allows candidates to prepare more effectively for high-stakes situations. The ultimate goal is to bridge the gap between practice and performance, making interview preparation more interactive and impactful.",
    tags: [
      "Conversational AI",
      "Human-AI Interaction",
      "Next.js",
      "React.js",
      "Node.js",
      "LLMs",
      "Speech-to-Text",
      "TypeScript",
      "OpenAI Realtime API",
      "WebRTC",
      "Realtime Audio Processing",
    ],
    bullets: [
      "Integrated OpenAI Realtime API with WebRTC to deliver low-latency speech-to-text transcription and conversational LLM-driven feedback during live interview simulations.",
      "Designed modular audio processing pipelines (WavRecorder, WavStreamPlayer) for real-time PCM16 audio streaming, dynamic playback interruption, and adaptive input handling.",
      "Implemented voice activity detection (VAD) and push-to-talk controls for natural human–AI dialogue flow, reducing latency and improving conversational alignment with LLM responses.",
      "Optimized system architecture across React.js front-end and Node.js backend, ensuring scalable LLM inference integration and robust session management for multi-user deployments.",
    ],
    gallery: ["/InterviewAI_Pic.png"],
  },

  /** ===== CUSTOM LAYOUT: Volt2Force (uses the 'loadcell-experiment' slug) ===== */
  "loadcell-experiment": {
    title: "Volt2Force: Load Cell Experiment",
    org: "ADaMS Lab",
    period: "2025 | Project",
    hero: "/LoadCellPic_32.png",
    summary:
      "This project focused on building a complete pipeline for real-time force measurement using a shear beam load cell. A 2.5 k-lb Anyload 102ES load cell was mounted with its hardware kit and integrated with an A1A-22B analog amplifier for signal conditioning. The amplified output was captured by a LabJack U6 DAQ, enabling precise voltage acquisition and data streaming to a computer. Python scripts were developed to process and visualize the voltage data, which was calibrated against known weights to establish a linear voltage-to-force conversion model. The system successfully demonstrated accurate and repeatable force measurements, highlighting expertise in mechanical integration, sensor calibration, and experimental testing.",
    bullets: [
      "Integrated a 2.5 k-lb Anyload 102ES shear beam load cell into a mechanically mounted fixture using precision alignment methods, ensuring accurate axial load transfer and minimizing installation-induced errors.",
      "Configured and tuned the A1A-22B analog amplifier to condition millivolt-level strain gauge outputs into a stable voltage signal, enabling high-fidelity input to the LabJack U6 DAQ.",
      "Programmed Python routines to acquire, timestamp, and process continuous DAQ voltage data streams, providing real-time monitoring and calibration-ready datasets.",
      "Derived a voltage-to-force regression model through controlled loading tests and linear curve fitting, achieving a validated calibration curve with reliable force estimation up to ~650 N.",
    ],
    tags: [
      "Analog Signal Conditioning",
      "Mechanical Mounting",
      "Data Acquisition Systems",
      "Anyload 102ES",
      "Double Shear Beam Load Cell",
      "A1A-22B Amplifier",
      "Force Calibration",
      "Labjack U6 DAQ",
      "Python (NumPy)",
      "MATLAB",
      "Real-time Data Processing",
    ],
    gallery: ["/IMG_7073.jpg", "/IMG_7082.jpg", "/IMG_7076.jpg"],
  },

  /** ===== CUSTOM LAYOUT: ADaMS Internship (kept as you had it) ===== */
  "adams-internship": {
    title: "Mechatronics Systems & Manufacturing Intern",
    org: "ADaMS Lab (University of Alberta)",
    period: "May–Aug 2025 | Internship",
    hero: "/Adams_Lab32.png",
    summary:
      "My time at ADaMS Lab gave me hands-on exposure to the full cycle of design, integration, and validation in advanced manufacturing systems. I strengthened my skills in SolidWorks CAD, FEA, and prototyping while also gaining practical experience with DAQ hardware, analog amplification, and embedded firmware. Working on projects such as the pneumatic hammer experiment and large-scale robotic 3D printing allowed me to bridge mechanical design with electrical systems and data-driven monitoring, significantly advancing my technical versatility as a mechatronics engineer.",
    tags: [
      "SolidWorks CAD",
      "3D Printing (FDM)",
      "G-Code Workflows",
      "Data Acquisition (DAQ)",
      "Load Cells",
      "Sensor Integration",
      "Arduino",
      "Embedded C/C++",
      "CNC Machining",
      "Python (NumPy, SciPy, Pandas)",
      "MATLAB",
      "Robotics Controls",
      "Analog Amplifiers",
      "Pneumatic Systems",
    ],
    gallery: ["/FixedCNCAdamsLabPic.jpeg", "/ConferenceLinkedIn_Pic.jpeg"],
    bullets: [
      "Designed and fabricated robotic end-effectors, fixtures, and mounts for large-scale 3D printing, using SolidWorks CAD, GD&T, and G-code workflows.",
      "Validated mechanical subsystems with ANSYS FEA, 3D printing, and CNC machining, ensuring durability under dynamic loading.",
      "Integrated load cells, DAQ modules, and analog amplifiers, wiring and calibrating circuits for closed-loop sensing.",
      "Developed a pneumatic hammer experiment with C/C++ firmware and Python/MATLAB sensor fusion for digital twin monitoring.",
    ],
  },

  /** ===== CUSTOM LAYOUT: Colourific ===== */
  colourific: {
    title: "Colourific — Robotic Toy Sorting System",
    org: "University of Waterloo (MTE 100/121)",
    period: "2024 | Project",
    hero: "/Colourific32.png",
    summary:
      "Colourific is a robotic toy-sorting system built to organize objects by color in a safe and accessible way. Using LEGO EV3 Mindstorm hardware, it integrates color, touch, and IR sensors with DC and servo motors to classify and sort blocks in real time. A simple button-based interface allows users to choose target colors and block counts, making the system interactive and adaptable. The robot emphasizes safety and usability through a sturdy, child-friendly design with smooth edges and modular components. By combining embedded programming with inclusive design, Colourific demonstrates how robotics can deliver practical solutions that support both play and learning.",
    bullets: [
      "Mechanical Design: Built a robust robotic chassis with integrated DC motors and servo actuators to support precise block handling and reliable motion control.",
      "Electrical Integration: Wired and calibrated LEGO EV3 components, ensuring stable power distribution and accurate signal transfer between motors and sensors.",
      "Sensor Setup: Configured EV3 color sensors, touch sensors, and IR guidance to enable accurate block detection, classification, and navigation.",
      "Software Programming: Developed control logic in RobotC and C++, integrating sensor data processing with motor coordination to achieve 95% sorting accuracy in real time.",
    ],
    tags: [
      "C++",
      "RobotC",
      "Color Sensing",
      "IR Beacon Navigation",
      "DC Motors",
      "Autonomous Robotics",
      "Servo Actuation",
      "Touch Sensor",
      "Embedded State Machines",
      "Mechatronics Integration",
      "Accessibility/HRI",
      "LEGO Mindstorms EV3",
      "Embedded Programming",
    ],
    gallery: ["/Colourific32.png", "/Colourific_Pic.jpg"],
  },
};

export default function WorkDetail({ params }: { params: { slug: string } }) {
  const data = DETAILS[params.slug];
  if (!data) return notFound();

  /** =============== INTERVIEWAI: simple in-progress layout =============== */
  if (params.slug === "interviewai") {
    const hero = data.hero;

    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* Title */}
          <header className="mb-6 text-center">
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

          {/* Hero — same size as the other pages (slightly inset) */}
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={hero}
              alt="InterviewAI — overview"
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
              priority
            />
          </div>

          {/* Row 1: Summary (left) + Technical Overview (right) */}
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>

            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">
                Technical Overview
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                {(data.bullets ?? []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Row 2: Progress note (left) + Skills (right) */}
          <section className="mx-auto mb-8 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white/85">
              <p className="text-lg md:text-xl">
                <span className="font-medium">
                  Project in Progress, More Updates Coming Soon!
                </span>
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== ADaMS: custom centered flow (unchanged) =============== */
  if (params.slug === "adams-internship") {
    const topImage = data.hero;
    const imgLeft = data.gallery?.[0] ?? data.hero;
    const imgRight = data.gallery?.[1] ?? data.hero;

    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back button - blue filled */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* Title */}
          <header className="mb-6 text-center">
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

          {/* Top centered image (hero) — not too wide */}
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={topImage}
              alt="ADaMS Lab — overview"
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
              priority
            />
          </div>

          {/* Overview — centered, larger text */}
          <section className="mx-auto mb-10 max-w-4xl text-white/85">
            <h2 className="mb-3 text-2xl font-semibold text-center">
              Overview
            </h2>
            <ul className="mx-auto list-disc pl-6 space-y-3 text-lg md:text-xl">
              {(data.bullets ?? []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>

          {/* Two side-by-side square images (smaller than top) */}
          <section className="mx-auto mb-12 w-full max-w-4xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={imgLeft}
                  alt="ADaMS Lab — image 1"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={imgRight}
                  alt="ADaMS Lab — image 2"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </div>
          </section>

          {/* Summary (left) + Skills (right) */}
          <section className="mx-auto mb-12 grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== COLOURIFIC: custom layout =============== */
  if (params.slug === "colourific") {
    const hero = data.hero;
    const mid = "/Colourific_Pic.jpg";

    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back button - blue filled */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* Title */}
          <header className="mb-6 text-center">
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

          {/* Top centered hero image */}
          <div className="relative mx-auto mb-10 aspect-[16/9] w/full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={hero}
              alt="Colourific — overview"
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
              priority
            />
          </div>

          {/* Summary left + Technical Overview right */}
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>

            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">
                Technical Overview
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                {(data.bullets ?? []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Mid row: image (left) + Skills (right) */}
          <section className="mx-auto mb-6 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            {/* Mid image, left-aligned */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl justify-self-start">
              <Image
                src={mid}
                alt="Colourific — mid image"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
              />
            </div>

            {/* Skills on the same row (right) */}
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* GitHub button row aligned under the Skills column, centered */}
          <section className="mx-auto mb-10 w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="hidden md:block" />
              <div className="flex justify-center">
                <Link
                  href="https://github.com/OmUpadhyay11/Colourific_Block-Sorting-Robot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition"
                >
                  <Github className="h-5 w-5" />
                  <span>View GitHub Repository</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== VOLT2FORCE (loadcell-experiment): custom layout =============== */
  if (params.slug === "loadcell-experiment") {
    const hero = data.hero;
    const img1 = data.gallery?.[0] ?? data.hero; // row 1 (left)
    const img2 = data.gallery?.[1] ?? data.hero; // row 2 (right)
    const img3 = data.gallery?.[2] ?? data.hero; // row 3 (left)

    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* Title */}
          <header className="mb-6 text-center">
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

          {/* Hero (same size as ADaMS/Colourific) */}
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={hero}
              alt="Volt2Force — overview"
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
              priority
            />
          </div>

          {/* ROW 1: left = 1:1 image, right = Summary */}
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={img1}
                alt="Volt2Force — image 1"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
              />
            </div>

            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          </section>

          {/* ROW 2: left = Technical bullets, right = 1:1 image */}
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="text-white/85">
              <h2 className="mb-2 text-2xl font-semibold">
                Technical Overview
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                {(data.bullets ?? []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={img2}
                alt="Volt2Force — image 2"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
              />
            </div>
          </section>

          {/* ROW 3: left = 1:1 image, right = Skills + GitHub button */}
          <section className="mx-auto mb-4 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={img3}
                alt="Volt2Force — image 3"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
              />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="mb-4 flex flex-wrap items-start gap-3">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <Link
                href="https://github.com/OmUpadhyay11/PneumaticHammer-LoadCell-Project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition"
              >
                <Github className="h-5 w-5" />
                <span>View GitHub Repository</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== DEFAULT for other pages =============== */
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
            {DETAILS[params.slug].title}
          </h1>
          <p className="mt-2 text-white/70">
            {DETAILS[params.slug].org}{" "}
            {DETAILS[params.slug].period ? (
              <span className="text-white/50">
                • {DETAILS[params.slug].period}
              </span>
            ) : null}
          </p>
        </header>

        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 aspect-[16/9]">
          <Image
            src={DETAILS[params.slug].hero}
            alt={`${DETAILS[params.slug].title} hero`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
        </div>

        {/* Summary + tags */}
        <section className="mb-10">
          <p className="text-white/85 leading-relaxed">
            {DETAILS[params.slug].summary}
          </p>
          {DETAILS[params.slug].tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {DETAILS[params.slug].tags.map((t) => (
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
        {DETAILS[params.slug].gallery?.length ? (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DETAILS[params.slug].gallery!.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                >
                  <Image
                    src={src}
                    alt={`${DETAILS[params.slug].title} image ${i + 1}`}
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

/** Metadata per project */
export function generateMetadata({ params }: { params: { slug: string } }) {
  const data = DETAILS[params.slug];
  return {
    title: data ? `${data.title} — Om Upadhyay` : "Project — Om Upadhyay",
  };
}
