import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";

/** ─── Data model ─────────────────────────────────────────────── */
type Detail = {
  title: string;
  org: string;
  period?: string;
  hero: string;
  summary: string;
  tags: string[];
  gallery?: string[];
  bullets?: string[];
  conclusion?: string;
  video?: string; // optional looping video (replaces hero, e.g. plywood timelapse)
  githubUrl?: string; // optional GitHub link shown in Skills column
  wip?: boolean; // shows "Project in Progress" notice
  layout?: "default" | "alternating" | "adams" | "cnc" | "colourific" | "visionhat" | "humanoid"; // non-default layouts can omit hero and use custom section flow
};

/** ─── Content ────────────────────────────────────────────────── */
const DETAILS: Record<string, Detail> = {
  integratedflight: {
    title: "Voice Controlled Drone",
    org: "RedTeamHack",
    period: "2026 | Project",
    hero: "/IntegratedFlight_Cover.png", // swap to your hero image when ready
    summary:
      'IntegratedFlight is a safety-first drone command and mission control platform built for the Canadian Armed Forces–themed Voice-Driven UxS Hackathon at SAIT. The system lets a single operator issue plain-English voice commands — such as "Alpha take off to 10 meters" or "Fly to the northwest watch tower" — which are parsed by an LLM-powered command brain, validated against hard mission constraints (IFF logic, no-go zones, altitude limits), and executed against a simulated drone stack. The goal was to bridge natural command UX with deterministic safety rules, so operators can act quickly under pressure without bypassing mission-critical safeguards.',
    bullets: [
      "Built a Whisper-based speech-to-text backend in FastAPI to capture and transcribe operator voice commands in real time, producing clean text input for downstream parsing.",
      "Developed a Groq-powered LLM command parser that resolves plain-English speech into structured drone actions, mapping spoken phrases to canonical waypoint IDs and mission parameters.",
      "Implemented a hard-block safety validation layer that rejects commands violating no-go zones, altitude limits, invalid waypoints, or prohibited IFF targeting patterns before any execution reaches the drone stack.",
      'Designed an operator confirmation flow for ambiguous or high-risk commands, with session memory supporting context-aware follow-ups such as "do that again" or "same target."',
      "Built a React/Vite operator UI for real-time command logging, mission state display, and voice response feedback, giving operators continuous visibility into system decisions.",
      "Integrated telemetry-ready MAVLink/SITL hooks and multi-waypoint route tasking, enabling validated commands to drive a live simulated drone in Gazebo.",
    ],
    tags: [
      "Python",
      "FastAPI",
      "Groq API",
      "LLM Command Parsing",
      "OpenAI Whisper (STT)",
      "React",
      "Vite",
      "MAVLink",
      "SITL / Gazebo",
      "IFF Logic",
      "Natural Language Processing",
      "Voice-Driven C2",
      "Autonomous UxS",
      "Mission Safety Enforcement",
    ],
    gallery: [
      "/vcd_frontend.png",
      "/vcd_gazeboSim.jpeg",
      "/IntegratedFlight_3.png",
    ],
    githubUrl: "https://github.com/OmUpadhyay11/VoiceControlled_Drone",
    layout: "alternating",
  },

  "loadcell-experiment": {
    title: "Volt2Force: Load Cell Experiment",
    org: "ADaMS Lab",
    period: "2025 | Project",
    hero: "/LoadCellPic_32.png",
    summary:
      "A complete pipeline for real-time force measurement, from sensor to software. A 2.5k-lb Anyload shear beam load cell feeds an A1A-22B amplifier and LabJack U6 DAQ, while Python handles streaming, visualization, and calibration against known weights to produce a linear voltage-to-force model with accurate, repeatable results.",
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
    githubUrl:
      "https://github.com/OmUpadhyay11/PneumaticHammer-LoadCell-Project",
    layout: "adams",
  },

  "adams-internship": {
    title: "Mechatronics Engineering Intern",
    org: "Additive Design and Manufacturing Lab",
    period: "May - Aug 2025 | Internship",
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
    layout: "adams",
  },

  colourific: {
    title: "Colourific",
    org: "University of Waterloo",
    period: "2024 | Project",
    hero: "/Colourific32.png",
    summary:
      "Colourific is an accessibility-focused sorting robot built on LEGO EV3 Mindstorms, fusing color, touch, and IR sensor data to drive coordinated DC and servo motors that classify and transport blocks in real time. A button interface and IR beacon navigation enable autonomous sort cycles, while a rounded, modular chassis makes it safe for children with visual impairments and early-stage cognitive development.",
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
    githubUrl: "https://github.com/OmUpadhyay11/Colourific_Block-Sorting-Robot",
    layout: "colourific",
  },

  "humanoid-29dof-simulation": {
    title: "29-DOF Humanoid",
    org: "",
    period: "2026 | Project",
    hero: "/Humanoid_Sim.png",
    video: "/humanoid29DOF.mp4",
    summary:
      "29-DOF Humanoid Simulation brings an industrial humanoid to life in MuJoCo. A full Unitree G1 model is driven by a custom control stack that maintains balance under disturbance and reaches target positions through inverse kinematics, prototyping the whole-body coordination needed for the next generation of industrial humanoid robots.",
    bullets: [
      "Set up a MuJoCo physics simulation environment with the Unitree G1 humanoid model, exposing all 29 degrees of freedom for full-body control.",
      "Implemented PD-based joint controllers to maintain upright posture and stable balance under external disturbances.",
      "Developed a Jacobian-based inverse kinematics solver to drive the end-effector to target positions in Cartesian space, enabling precise arm reaching.",
      "Integrated balance and IK controllers into a unified control loop, coordinating whole-body motion to keep the robot stable while executing reach tasks.",
    ],
    tags: [
      "MuJoCo",
      "Unitree G1",
      "Python",
      "NumPy",
      "SciPy",
      "Forward Kinematics",
      "Inverse Kinematics",
      "Jacobian Methods",
      "PD Control",
      "Task-Space Control",
      "Rigid Body Dynamics",
      "Center of Mass Control",
      "Humanoid Control",
      "Whole-Body Coordination",
      "Robotics Simulation",
    ],
    gallery: ["/29-dof_data.png", "/29-dof-pic1.png"],
    githubUrl: "https://github.com/OmUpadhyay11/g1-humanoid-control",
    layout: "humanoid",
  },

  robim: {
    title: "Robotics R&D Engineering Intern",
    org: "RoBIM Technologies",
    period: "Jan - Apr 2026 | Internship",
    hero: "/robim-hero.png",
    summary: "TODO: Add your RoBIM internship summary here.",
    bullets: [
      "TODO: Add bullet point 1.",
      "TODO: Add bullet point 2.",
      "TODO: Add bullet point 3.",
      "TODO: Add bullet point 4.",
    ],
    tags: [
      "6-Axis Industrial Robotics",
      "ABB IRC5 Controller",
      "RAPID Programming",
      "Robotic I/O Management",
      "TCP Calibration",
      "End-Effector Development",
      "VFD Configuration",
      "Wireless FTP File Management Development",
      "ABB RobotStudio Simulation",
      "CNC Spindle Integration",
      "Fusion360 CAD/CAM",
      "FEA for Robotic Systems",
      "Production Optimization + LEAN Manufacturing Methods",
      "Digital I/O Management",
      "PLC Fundamentals",
    ],
    gallery: ["/robim-img1.png", "/robim-img2.png", "/robim-img3.png"],
    githubUrl: "https://github.com/TODO-robim-repo",
  },

  "plywood-cutting-project": {
    title: "6-DOF Robotic Machining",
    org: "RoBIM Technologies",
    period: "2026 | Project",
    hero: "/plywood-hero.png",
    video: "/PlywoodCNCTimeLapse.mov",
    summary:
      "This project involved developing a robotic CNC cutting system using a 6-axis ABB industrial robot equipped with a VFD controlled spindle end-effector to machine large plywood sheets. Parts were designed in Fusion 360 and toolpaths were generated using CAM before being translated into ABB RAPID programs and executed on an IRC5 robot controller, with robot motion validated through simulation in ABB RobotStudio. Overall, the robotic workflow reduced production time by roughly 75% compared to traditional manual methods, enabling more efficient and reliable manufacturing of plywood components.",
    bullets: [
      "Designed a robotic CNC cutting system using a 6-axis ABB industrial robot with an IRC5 controller.",
      "Developed CAD models and CAM toolpaths in Autodesk Fusion 360 for plywood machining.",
      "Programmed robotic motion using ABB RAPID, translating CAM toolpaths into executable robot paths.",
      "Performed TCP and Workobject calibration to ensure accurate tool positioning and repeatable cuts.",
      "Integrated a high-speed spindle end-effector with VFD control for variable spindle speed operation.",
      "Validated toolpaths and robot motion through offline simulation in ABB RobotStudio before physical testing.",
    ],
    tags: [
      "ABB RobotStudio",
      "RAPID Programming",
      "Fusion360 (CAD/CAM)",
      "ABB IRC5",
      "Robotic CNC Machining",
      "TCP Calibration",
      "End-Effector Integration",
      "VFD Integration",
      "Toolpath Optimization",
      "Industrial Robotics",
    ],
    gallery: ["/PlywoodCNC1.png", "/PlywoodCNC2.png", "/PlywoodCNC3.jpeg"],
    layout: "cnc",
  },

  "VisionHat-project": {
    title: "VisionHat AI",
    org: "HackED2026",
    period: "2026 | Project",
    hero: "/visionhat-hero.png",
    summary:
      "VisionHat translates sight into sound. A camera embedded in a hat captures the wearer's field of view, while onboard AI detects surrounding objects and delivers instant audio descriptions, giving visually impaired users a new way to navigate the world.",
    bullets: [
      "Built a wearable embedded vision system using a Raspberry Pi 5 with a mounted USB camera for live video capture.",
      "Implemented YOLOv8 object detection to perform real-time identification of objects using computer vision.",
      "Developed an inference pipeline with Python to capture frames, run model inference, and extract detected object classes.",
      "Integrated a text-to-speech module to convert detected object labels into spoken audio feedback for the user.",
    ],
    tags: [
      "Raspberry Pi 5",
      "YoloV8 Ultralytics",
      "Computer Vision",
      "Embedded Linux",
      "OpenCV",
      "Python",
      "Real-Time Object Detection",
      "Text-To-Speech Feedback",
      "Assistive Technology Design",
    ],
    gallery: [
      "/viz_hat.jpeg",
      "/visionhat_om.jpeg",
      "/visionhat_tg.jpeg",
      "/visionhat_wiring.jpg",
    ],
    githubUrl: "https://github.com/TODO-visionhat-repo",
    layout: "visionhat",
  },
};

/** ─── Shared primitives ───────────────────────────────────────── */

function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-500 active:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
    </div>
  );
}

function PageHeader({
  title,
  org,
  period,
  githubUrl,
}: {
  title: string;
  org: string;
  period?: string;
  githubUrl?: string;
}) {
  return (
    <div className="mb-6 flex justify-center">
      <header className="inline-block max-w-[92vw] rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-7 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2 text-white">
          <span>
            {org ? (
              <>
                {org}
                {period ? <span> • {period}</span> : null}
              </>
            ) : period ? (
              <>{period}</>
            ) : null}
          </span>
          {githubUrl ? <GitHubIconLink url={githubUrl} /> : null}
        </div>
      </header>
    </div>
  );
}

function HeroMedia({ data }: { data: Detail }) {
  if (data.video) {
    return (
      <div className="mx-auto mb-10 w-full max-w-4xl overflow-hidden bg-black">
        {/* Convert .MOV → .mp4 first:
            ffmpeg -i "public/PlywoodCNCTimeLapse.MOV" -vcodec h264 -acodec aac "public/PlywoodCNCTimeLapse.mp4" */}
        <video
          src={data.video}
          autoPlay
          muted
          loop
          playsInline
          className="h-auto w-full"
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
      <Image
        src={data.hero}
        alt={`${data.title} — overview`}
        fill
        className="object-cover"
        sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
        priority
      />
    </div>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
        quality={100}
      />
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-3">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white md:text-base"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function GitHubIconLink({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub repository"
      className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white transition hover:border-white/40 hover:bg-white/10"
    >
      <Github className="h-4 w-4" />
    </Link>
  );
}

/** ─── Alternating layout (no hero, interleaved text+image rows) ── */
function AlternatingLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />
        <PageHeader
          title={data.title}
          org={data.org}
          period={data.period}
          githubUrl={data.githubUrl}
        />

        {/* Top hero image */}
        {imgs[0] && (
          <section className="mx-auto mb-12 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/60 p-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={imgs[0]}
                alt={`${data.title} — hero`}
                fill
                className="object-contain"
                sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
                quality={100}
                priority
              />
            </div>
          </section>
        )}

        {/* Summary (left) + image slot (right) */}
        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 md:p-7">
            <h2 className="mb-3 text-2xl font-semibold">Summary</h2>
            <p className="leading-relaxed text-white">{data.summary}</p>
          </div>
          {imgs[1] ? (
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/60 p-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={imgs[1]}
                  alt={`${data.title} — image slot`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw"
                  quality={100}
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-white/25 bg-zinc-900/40 text-sm text-white/70">
              Image Slot
            </div>
          )}
        </section>

        {/* Workflow */}
        {data.bullets?.length ? (
          <section className="mx-auto mb-12 w-full max-w-5xl">
            <h2 className="mb-5 text-center text-2xl font-semibold">
              Workflow
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/15 bg-zinc-900/70 p-5"
                >
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                    Step {i + 1}
                  </p>
                  <p className="text-white md:text-[16px]">{bullet}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Full-width skills section */}
        <section className="mx-auto mb-12 w-full max-w-5xl">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 md:p-7">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              Skills & Tools
            </h2>
            <TagList tags={data.tags} />
          </div>
        </section>
      </div>
    </main>
  );
}

function AdamsLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-zinc-900 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />

        <div className="mb-12 flex justify-center">
          <header className="inline-block max-w-[92vw] rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              {data.title}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm tracking-wide text-white md:text-base">
              <span>{data.period}</span>
              {data.githubUrl ? <GitHubIconLink url={data.githubUrl} /> : null}
            </div>
          </header>
        </div>

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-800/70 p-7 backdrop-blur md:flex md:flex-col md:justify-center md:p-8">
            <h2 className="mb-6 text-center text-2xl font-bold md:mb-8 md:text-3xl">
              Overview
            </h2>
            <p className="mx-auto max-w-[50ch] text-[16px] leading-8 text-white/95 md:text-[18px]">
              {data.summary}
            </p>
          </div>
          {imgs[0] && (
            <div className="rounded-2xl border border-white/15 bg-zinc-800/60 p-2">
              <GalleryImage src={imgs[0]} alt={`${data.title} — lab work`} />
            </div>
          )}
        </section>

        {data.bullets?.length ? (
          <section className="mx-auto mb-12 w-full max-w-5xl">
            <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">
              Workflow
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {data.bullets.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/15 bg-zinc-800/70 p-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                    Step {i + 1}
                  </p>
                  <p className="text-white md:text-[17px]">{b}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-800/70 p-6">
            <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
              Skills & Tools
            </h2>
            <TagList tags={data.tags} />
          </div>
          {imgs[1] ? (
            <div className="rounded-2xl border border-white/15 bg-zinc-800/60 p-2">
              <GalleryImage src={imgs[1]} alt={`${data.title} — systems integration`} />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-zinc-800/70 p-6 text-white md:text-[17px]">
              Cross-domain integration across mechanical design, controls, sensing,
              and manufacturing workflows.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CncLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />

        <div className="mb-10 flex justify-center">
          <header className="inline-block max-w-[92vw] rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              {data.title}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm tracking-wide text-white md:text-base">
              <span>
                {data.org}
                {data.period ? <span> • {data.period}</span> : null}
              </span>
              {data.githubUrl ? <GitHubIconLink url={data.githubUrl} /> : null}
            </div>
          </header>
        </div>

        <section className="mx-auto mb-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/55">
          <HeroMedia data={data} />
        </section>

        <section className="mx-auto mb-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-4 text-center">
            <p className="text-[11px] tracking-[0.16em] text-cyan-200 uppercase">
              Robot
            </p>
            <p className="mt-1 text-base font-semibold md:text-lg">
              6-axis IRB 6700
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-4 text-center">
            <p className="text-[11px] tracking-[0.16em] text-cyan-200 uppercase">
              Controller
            </p>
            <p className="mt-1 text-base font-semibold md:text-lg">ABB IRC5</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-4 text-center">
            <p className="text-[11px] tracking-[0.16em] text-cyan-200 uppercase">
              Throughput Gain
            </p>
            <p className="mt-1 text-base font-semibold md:text-lg">~75% Faster</p>
          </div>
        </section>

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">Overview</h2>
            <p className="leading-relaxed text-white md:text-[17px]">
              {data.summary}
            </p>
          </div>
          {imgs[0] ? (
            <div className="rounded-2xl border border-white/15 bg-zinc-900/60 p-2">
              <GalleryImage src={imgs[0]} alt={`${data.title} — machining setup`} />
            </div>
          ) : null}
        </section>

        {data.bullets?.length ? (
          <section className="mx-auto mb-12 w-full max-w-5xl">
            <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">
              Workflow
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/15 bg-zinc-900/70 p-5"
                >
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-white md:text-[16px]">{bullet}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 md:flex md:min-h-[430px] md:flex-col">
            <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl">
              Skills & Tools
            </h2>
            <TagList tags={data.tags} />
          </div>
          {imgs[1] ? (
            <div className="rounded-2xl border border-white/15 bg-zinc-900/60 p-2 md:min-h-[430px]">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={imgs[1]}
                  alt={`${data.title} — toolpath verification`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 90vw"
                  quality={100}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 text-white md:text-[17px]">
              Process emphasizes reliable calibration, toolpath confidence, and
              repeatable manufacturing output.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

function ColourificLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />

        <div className="mb-12 flex justify-center">
          <header className="inline-flex max-w-[92vw] flex-col items-center rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              {data.title}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm tracking-wide text-white md:text-base">
              <span>
                {data.org}
                {data.period ? <span> • {data.period}</span> : null}
              </span>
              {data.githubUrl ? <GitHubIconLink url={data.githubUrl} /> : null}
            </div>
          </header>
        </div>

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 backdrop-blur md:flex md:aspect-square md:flex-col md:justify-start md:px-8 md:pt-7 md:pb-6">
            <h2 className="mb-4 text-center text-2xl font-bold md:mb-6 md:text-3xl">
              Overview
            </h2>
            <p className="mx-auto max-w-[50ch] text-[16px] leading-8 text-white md:text-[17px]">
              {data.summary}
            </p>
          </div>
          {imgs[1] ? (
            <div className="rounded-2xl border border-white/15 bg-zinc-900/60 p-2 md:aspect-square">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={imgs[1]}
                  alt={`${data.title} — final system`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 90vw"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 text-white md:text-[17px]">
              Focused on dependable block sorting, clear user interaction, and safe
              hardware integration for a practical robotics demo.
            </div>
          )}
        </section>

        {data.bullets?.length ? (
          <section className="mx-auto mb-12 w-full max-w-5xl">
            <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">
              Workflow
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {data.bullets.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                    Step {i + 1}
                  </p>
                  {b.includes(":") ? (
                    <>
                      <p className="mb-2 text-center text-[16px] underline decoration-white/75 underline-offset-2 md:text-[18px]">
                        {b.split(":")[0]}:
                      </p>
                      <p className="text-white md:text-[17px]">
                        {b.split(":").slice(1).join(":").trim()}
                      </p>
                    </>
                  ) : (
                    <p className="text-white md:text-[17px]">{b}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">
            Skills & Tools
          </h2>
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6">
            <TagList tags={data.tags} />
          </div>
        </section>
      </div>
    </main>
  );
}

function VisionHatLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  const imageSlot = (
    index: number,
    alt: string,
    ratioClass = "aspect-[3/4]",
    imageClassName = "object-cover",
  ) => (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/70 p-2">
      {imgs[index] ? (
        <div className={`relative w-full overflow-hidden rounded-xl ${ratioClass}`}>
          <Image
            src={imgs[index]}
            alt={alt}
            fill
            className={imageClassName}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 90vw"
          />
        </div>
      ) : (
        <div className={`w-full rounded-xl border border-dashed border-white/25 bg-zinc-900/40 ${ratioClass}`} />
      )}
    </div>
  );

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />

        <div className="mb-12 flex justify-center">
          <header className="inline-block max-w-[92vw] rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              {data.title}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm tracking-wide text-white md:text-base">
              <span>
                {data.org}
                {data.period ? <span> • {data.period}</span> : null}
              </span>
              {data.githubUrl ? <GitHubIconLink url={data.githubUrl} /> : null}
            </div>
          </header>
        </div>

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-7 md:flex md:aspect-[5/4] md:flex-col md:justify-center md:p-8">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Overview</h2>
            <p className="max-w-[62ch] text-[16px] leading-8 text-white/95 md:text-[18px]">
              {data.summary}
            </p>
          </div>
          {imageSlot(0, `${data.title} — feature photo`, "aspect-[5/4]")}
        </section>

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">Workflow</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(data.bullets ?? []).map((bullet, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/15 bg-zinc-900/70 p-5"
              >
                <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                  Step {i + 1}
                </p>
                <p className="text-white md:text-[16px]">{bullet}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
            {imageSlot(1, `${data.title} — image 1`)}
            {imageSlot(2, `${data.title} — image 2`)}
          </div>
        </section>

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="h-full rounded-2xl border border-white/15 bg-zinc-900/70 p-6 md:flex md:flex-col md:px-7 md:pt-7 md:pb-6">
              <h2 className="mb-14 text-center text-2xl font-bold md:text-3xl">
                Skills & Tools
              </h2>
              <TagList tags={data.tags} />
            </div>
            {imageSlot(
              3,
              `${data.title} — photo slot 3`,
              "aspect-[800/782]",
              "object-contain",
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function HumanoidLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  const photoSlot = (
    index: number,
    alt: string,
    ratioClass = "aspect-[5/4]",
    objectPosition = "center",
  ) => (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/70 p-2">
      {imgs[index] ? (
        <div className={`relative w-full overflow-hidden rounded-xl ${ratioClass}`}>
          <Image
            src={imgs[index]}
            alt={alt}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 90vw"
          />
        </div>
      ) : (
        <div className={`w-full rounded-xl border border-dashed border-white/25 bg-zinc-900/40 ${ratioClass}`} />
      )}
    </div>
  );

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />

        <div className="mb-12 flex justify-center">
          <header className="inline-block max-w-[92vw] rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.08] via-cyan-300/[0.03] to-transparent px-8 py-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              {data.title}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm tracking-wide text-white md:text-base">
              <span>{data.period}</span>
              {data.githubUrl ? <GitHubIconLink url={data.githubUrl} /> : null}
            </div>
          </header>
        </div>

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/60">
            {data.video ? (
              <video
                src={data.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-auto w-full"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center text-center text-sm text-white/70 md:text-base">
                Add your demo at `public/humanoid-demo.mp4` and set the project
                video path to enable autoplay here.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 backdrop-blur md:flex md:aspect-[5/4] md:flex-col md:justify-start md:px-8 md:pt-7 md:pb-6">
            <h2 className="mb-4 text-center text-2xl font-bold md:mb-6 md:text-3xl">
              Overview
            </h2>
            <p className="mx-auto max-w-[50ch] text-[16px] leading-8 text-white md:text-[17px]">
              {data.summary}
            </p>
          </div>
          {photoSlot(0, `${data.title} — feature image`, "aspect-[5/4]", "center 10%")}
        </section>

        {data.bullets?.length ? (
          <section className="mx-auto mb-12 w-full max-w-5xl">
            <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">
              Workflow
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {data.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                    Step {i + 1}
                  </p>
                  <p className="text-white md:text-[17px]">{bullet}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mb-12 w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-zinc-900/70 p-6 md:flex md:min-h-[560px] md:flex-col md:px-7 md:pt-7 md:pb-6">
              <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl">
                Skills & Tools
              </h2>
              <TagList tags={data.tags} />
            </div>
            {photoSlot(1, `${data.title} — photo slot 1`, "aspect-[3/4]", "center 32%")}
          </div>
        </section>
      </div>
    </main>
  );
}

function DetailLayout({ data }: { data: Detail }) {
  const imgs = data.gallery ?? [];

  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <BackButton />
        <PageHeader
          title={data.title}
          org={data.org}
          period={data.period}
          githubUrl={data.githubUrl}
        />
        <HeroMedia data={data} />

        {/* Summary + Technical Overview */}
        <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
            <p className="leading-relaxed text-white">{data.summary}</p>
          </div>
          {data.bullets?.length ? (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">
                Technical Overview
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-white">
                {data.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* Gallery rows — pairs of images, third image beside skills */}
        {imgs.length > 0 && (
          <section className="mx-auto mb-12 w-full max-w-5xl space-y-6">
            {imgs.length >= 2 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <GalleryImage src={imgs[0]} alt={`${data.title} — image 1`} />
                <GalleryImage src={imgs[1]} alt={`${data.title} — image 2`} />
              </div>
            )}
            {imgs.length === 1 && (
              <GalleryImage src={imgs[0]} alt={`${data.title} — image 1`} />
            )}
            {imgs.length >= 3 && (
              <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
                <GalleryImage src={imgs[2]} alt={`${data.title} — image 3`} />
                <div>
                  <h2 className="mb-16 text-center text-2xl font-semibold">
                    Skills
                  </h2>
                  <TagList tags={data.tags} />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Skills + GitHub — shown here when there's no third gallery image */}
        {imgs.length < 3 && (
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            {data.wip ? (
              <p className="text-lg font-medium md:text-xl">
                Project in Progress, More Updates Coming Soon!
              </p>
            ) : (
              <div />
            )}
            <div>
              <h2 className="mb-16 text-center text-2xl font-semibold">
                Skills
              </h2>
              <TagList tags={data.tags} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/** ─── Page ───────────────────────────────────────────────────── */
export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = DETAILS[slug];
  if (!data) return notFound();

  if (data.layout === "adams") return <AdamsLayout data={data} />;
  if (data.layout === "cnc") return <CncLayout data={data} />;
  if (data.layout === "colourific") return <ColourificLayout data={data} />;
  if (data.layout === "visionhat") return <VisionHatLayout data={data} />;
  if (data.layout === "humanoid") return <HumanoidLayout data={data} />;
  if (data.layout === "alternating") return <AlternatingLayout data={data} />;
  return <DetailLayout data={data} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = DETAILS[slug];
  return {
    title: data ? `${data.title} — Om Upadhyay` : "Project — Om Upadhyay",
  };
}
