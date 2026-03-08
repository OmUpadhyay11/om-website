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
  gallery?: string[];
  bullets?: string[];
  conclusion?: string;
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

  robim: {
    title: "Robotics Engineering Intern",
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
  },

  "plywood-cutting-project": {
    title: "Robotic CNC Machining Project",
    org: "RoBIM Technologies",
    period: "2026 | Project",
    hero: "/plywood-hero.png",
    summary:
      "This project involved developing a robotic CNC cutting system using a 6-axis ABB industrial robot equipped with a high-speed spindle end-effector to machine large plywood sheets. Parts were designed in Fusion 360 and toolpaths were generated using CAM before being translated into ABB RAPID programs and executed on an IRC5 robot controller, with robot motion validated through simulation in ABB RobotStudio. Overall, the robotic workflow reduced production time by roughly 75% compared to traditional manual methods, enabling more efficient and reliable manufacturing of plywood components.",
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
      "Toolpath Optimization",
      "Industrial Robotics",
      "VFD Integration",
    ],
    gallery: ["/PlywoodCNC1.png", "/PlywoodCNC2.png", "/PlywoodCNC3.jpeg"],
  },

  "VisionHat-project": {
    title: "VisionHat AI",
    org: "HackED2026",
    period: "2026 | Project",
    hero: "/visionhat-hero.png",
    summary:
      "This project focused on developing a wearable computer vision system designed to assist visually impaired individuals by providing real-time awareness of their surroundings. A camera mounted on a hat captures the user's field of view while an onboard computer processes the video feed to detect objects in the environment. When objects are recognized, the system communicates this information to the wearer through audio feedback, allowing them to understand what is around them without needing to see it directly. The goal of the project was to demonstrate how edge AI and embedded vision can be integrated into a lightweight wearable platform to support assistive technologies.",
    bullets: [
      "Built a wearable embedded vision system using a Raspberry Pi 5 with a mounted USB camera for live video capture.",
      "Implemented YOLOv8 object detection to perform real-time identification of objects using computer vision.",
      "Developed an inference pipeline with Python to capture frames, run model inference, and extract detected object classes.",
      "Integrated a text-to-speech module to convert detected object labels into spoken audio feedback for the user.",
      "Optimized the system for real-time edge processing, enabling object detection directly on-device without cloud computation.",
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
    gallery: ["/visionhat-img1.png", "/visionhat-img2.png", "/visionhat-img3.png"],
  },
};

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = DETAILS[slug];
  if (!data) return notFound();

  /** =============== INTERVIEWAI =============== */
  if (slug === "interviewai") {
    const hero = data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={hero} alt="InterviewAI — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          </section>
          <section className="mx-auto mb-8 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white">
              <p className="text-lg md:text-xl font-medium">Project in Progress, More Updates Coming Soon!</p>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== ADaMS =============== */
  if (slug === "adams-internship") {
    const topImage = data.hero;
    const imgLeft = data.gallery?.[0] ?? data.hero;
    const imgRight = data.gallery?.[1] ?? data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={topImage} alt="ADaMS Lab — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-10 max-w-4xl text-white">
            <h2 className="mb-3 text-2xl font-semibold text-center">Overview</h2>
            <ul className="mx-auto list-disc pl-6 space-y-3 text-lg md:text-xl">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
          </section>
          <section className="mx-auto mb-12 w-full max-w-4xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative aspect-square overflow-hidden">
                <Image src={imgLeft} alt="ADaMS Lab — image 1" fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <div className="relative aspect-square overflow-hidden">
                <Image src={imgRight} alt="ADaMS Lab — image 2" fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
            </div>
          </section>
          <section className="mx-auto mb-12 grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== COLOURIFIC =============== */
  if (slug === "colourific") {
    const hero = data.hero;
    const mid = "/Colourific_Pic.jpg";
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={hero} alt="Colourific — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          </section>
          <section className="mx-auto mb-6 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={mid} alt="Colourific — mid image" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
            </div>
          </section>
          <section className="mx-auto mb-10 w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="hidden md:block" />
              <div className="flex justify-center">
                <Link href="https://github.com/OmUpadhyay11/Colourific_Block-Sorting-Robot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition">
                  <Github className="h-5 w-5" /><span>View GitHub Repository</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== VOLT2FORCE =============== */
  if (slug === "loadcell-experiment") {
    const hero = data.hero;
    const img1 = data.gallery?.[0] ?? data.hero;
    const img2 = data.gallery?.[1] ?? data.hero;
    const img3 = data.gallery?.[2] ?? data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={hero} alt="Volt2Force — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img1} alt="Volt2Force — image 1" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          </section>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img2} alt="Volt2Force — image 2" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
          </section>
          <section className="mx-auto mb-4 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img3} alt="Volt2Force — image 3" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="mb-4 flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
              <Link href="https://github.com/OmUpadhyay11/PneumaticHammer-LoadCell-Project" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition">
                <Github className="h-5 w-5" /><span>View GitHub Repository</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== ROBIM =============== */
  if (slug === "robim") {
    const hero = data.hero;
    const img1 = data.gallery?.[0] ?? data.hero;
    const img2 = data.gallery?.[1] ?? data.hero;
    const img3 = data.gallery?.[2] ?? data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={hero} alt="RoBIM — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img1} alt="RoBIM — image 1" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          </section>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img2} alt="RoBIM — image 2" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
          </section>
          <section className="mx-auto mb-4 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img3} alt="RoBIM — image 3" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="mb-4 flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
              <Link href="https://github.com/TODO-robim-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition">
                <Github className="h-5 w-5" /><span>View GitHub Repository</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== PLYWOOD CNC =============== */
  if (slug === "plywood-cutting-project") {
    const img1 = data.gallery?.[0] ?? data.hero;
    const img2 = data.gallery?.[1] ?? data.hero;
    const img3 = data.gallery?.[2] ?? data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>

          {/* Looping timelapse video — convert to .mp4 for cross-browser support:
              ffmpeg -i "public\PlywoodCNCTimeLapse.MOV" -vcodec h264 -acodec aac "public\PlywoodCNCTimeLapse.mp4"
              then change src to "/PlywoodCNCTimeLapse.mp4" */}
          <div className="mx-auto mb-10 w-full max-w-4xl overflow-hidden bg-black">
            <video src="/PlywoodCNCTimeLapse.MOV" autoPlay muted loop playsInline className="w-full h-auto" />
          </div>

          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img1} alt="Plywood CNC — image 1" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          </section>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img2} alt="Plywood CNC — image 2" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
          </section>
          <section className="mx-auto mb-4 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img3} alt="Plywood CNC — image 3" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="mb-4 flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
              <Link href="https://github.com/OmUpadhyay11/PlywoodCNC_ABBRapid_RobotCode" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition">
                <Github className="h-5 w-5" /><span>View GitHub Repository</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== VISIONHAT =============== */
  if (slug === "VisionHat-project") {
    const hero = data.hero;
    const img1 = data.gallery?.[0] ?? data.hero;
    const img2 = data.gallery?.[1] ?? data.hero;
    const img3 = data.gallery?.[2] ?? data.hero;
    return (
      <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 transition">
              <ArrowLeft className="h-4 w-4" /><span>Back</span>
            </Link>
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-2 text-white">{data.org}{data.period ? <span className="text-white"> • {data.period}</span> : null}</p>
          </header>
          <div className="relative mx-auto mb-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
            <Image src={hero} alt="VisionHat AI — overview" fill className="object-cover" sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw" priority />
          </div>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img1} alt="VisionHat — image 1" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Summary</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          </section>
          <section className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-semibold">Technical Overview</h2>
              <ul className="list-disc pl-6 space-y-2">{(data.bullets ?? []).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img2} alt="VisionHat — image 2" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
          </section>
          <section className="mx-auto mb-4 grid w-full max-w-5xl grid-cols-1 gap-10 items-start md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image src={img3} alt="VisionHat — image 3" fill className="object-cover" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 90vw" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
              <div className="mb-4 flex flex-wrap items-start gap-3">
                {data.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1.5 text-sm md:text-base text-white">{t}</span>)}
              </div>
              <Link href="https://github.com/TODO-visionhat-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 transition">
                <Github className="h-5 w-5" /><span>View GitHub Repository</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /** =============== DEFAULT (fallback) =============== */
  return (
    <main className="font-[family-name:var(--font-libre-baskerville)] min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-white hover:text-white underline underline-offset-4">← Back</Link>
        </div>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{DETAILS[slug].title}</h1>
          <p className="mt-2 text-white">{DETAILS[slug].org}{DETAILS[slug].period ? <span className="text-white"> • {DETAILS[slug].period}</span> : null}</p>
        </header>
        <div className="relative mb-8 overflow-hidden border border-white/10 aspect-[16/9]">
          <Image src={DETAILS[slug].hero} alt={`${DETAILS[slug].title} hero`} fill className="object-cover" sizes="(min-width: 1024px) 1024px, 100vw" priority />
        </div>
        <section className="mb-10">
          <p className="text-white leading-relaxed">{DETAILS[slug].summary}</p>
          {DETAILS[slug].tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {DETAILS[slug].tags.map((t) => <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[12px] tracking-wide text-white">{t}</span>)}
            </div>
          ) : null}
        </section>
        {DETAILS[slug].gallery?.length ? (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DETAILS[slug].gallery!.map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden border border-white/10">
                  <Image src={src} alt={`${DETAILS[slug].title} image ${i + 1}`} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = DETAILS[slug];
  return { title: data ? `${data.title} — Om Upadhyay` : "Project — Om Upadhyay" };
}