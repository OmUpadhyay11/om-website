"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Html, Line, Billboard, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import { ACCENT, HumanoidBot, PickupTruck, QuadDrone, RaceCar } from "./machines";

export type GaragePhase = "closed" | "opening" | "open";

export type GarageSceneProps = {
  reducedMotion: boolean;
  phase: GaragePhase;
  beginRequested: boolean;
  instantOpen?: boolean;
  /** Hint shown under the door stencil (e.g. "Click anywhere to begin"). */
  beginHint?: string | null;
  onOpeningStart: () => void;
  onOpened: () => void;
  onFlyStart: (route: string) => void;
  onNavigate: (route: string) => void;
  onReady?: () => void;
};

const CONCRETE = "#26282e";
const CONCRETE_DARK = "#1d1f24";
const FLOOR = "#1b1d22";
const WALL = "#22242a";

const DOOR_W = 12;
const DOOR_H = 5;
const DOOR_Z = 5.8;
const SECTIONS = 5;

const CAM_CLOSED = { pos: [0, 3.4, 19.5] as const, look: [0, 2.9, 6] as const };
const CAM_OPEN = { pos: [0, 3.6, 11.5] as const, look: [0, 1.6, -2] as const };

type Station = {
  id: string;
  label: string;
  route: string;
  position: [number, number, number];
  rotationY: number;
  labelOffset: [number, number, number];
  hitSize: [number, number, number];
  hitCenterY: number;
  bay?: { w: number; d: number };
  ring?: { r: number };
  labelScale?: number;
  Machine: React.ComponentType<{ reducedMotion?: boolean }>;
  iconSvg: string;
};

const ICON_SVG = {
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1"/><path d="M8 16h10l2.5-6H10.5L8 16Z"/></svg>`,
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
} as const;

const STATIONS: Station[] = [
  {
    id: "contact",
    label: "Contact Me",
    route: "/contact",
    position: [0, 0, -5.2],
    rotationY: 0,
    labelOffset: [0, 3.25, 0],
    hitSize: [1.6, 2.8, 1.2],
    hitCenterY: 1.4,
    bay: { w: 3, d: 3 },
    Machine: HumanoidBot,
    iconSvg: ICON_SVG.mail,
  },
  {
    id: "projects",
    label: "Projects",
    route: "/projects",
    position: [-5.8, 0, -2.2],
    rotationY: 0.32,
    labelOffset: [0, 2.7, 0],
    hitSize: [2.4, 2.2, 4.6],
    hitCenterY: 1.0,
    bay: { w: 3.4, d: 5.6 },
    Machine: PickupTruck,
    iconSvg: ICON_SVG.folder,
  },
  {
    id: "experience",
    label: "Experience",
    route: "/experience",
    position: [0, 0, 0.9],
    rotationY: -0.06,
    labelOffset: [0, 1.75, 0],
    hitSize: [2.0, 1.4, 4.4],
    hitCenterY: 0.6,
    bay: { w: 2.6, d: 5.2 },
    labelScale: 0.82,
    Machine: RaceCar,
    iconSvg: ICON_SVG.briefcase,
  },
  {
    id: "about",
    label: "About Me",
    route: "/about",
    position: [5.6, 2.55, -1.8],
    rotationY: -0.4,
    labelOffset: [0, 1.25, 0],
    hitSize: [2.2, 1.4, 2.2],
    hitCenterY: 0,
    ring: { r: 1.1 },
    Machine: QuadDrone,
    iconSvg: ICON_SVG.user,
  },
];

function rectPoints(w: number, d: number): Array<[number, number, number]> {
  const hw = w / 2;
  const hd = d / 2;
  return [
    [-hw, 0, -hd],
    [hw, 0, -hd],
    [hw, 0, hd],
    [-hw, 0, hd],
    [-hw, 0, -hd],
  ];
}

function circlePoints(r: number, n = 40): Array<[number, number, number]> {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, 0, Math.sin(a) * r] as [number, number, number];
  });
}

const BRAND_LINKS = [
  { href: "https://github.com/omupadhyay11", label: "GitHub", x: -1.97 },
  { href: "https://linkedin.com/in/-om-upadhyay", label: "LinkedIn", x: -0.66 },
  { href: "mailto:omupadhyay@gmail.com", label: "Email", x: 0.66 },
  { href: "https://devpost.com/omupadhyay", label: "Devpost", x: 1.97 },
] as const;

const BRAND_ICON_SVG: Record<(typeof BRAND_LINKS)[number]["label"], string> = {
  GitHub: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  Email: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/></svg>`,
  Devpost: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1.2 21.6 6.7v10.6L12 22.8 2.4 17.3V6.7L12 1.2z"/><path d="M8.75 7.5h3.5a4.5 4.5 0 0 1 0 9h-3.5v-9z"/></svg>`,
};

function cssFont(varName: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load brand icon"));
    };
    img.src = url;
  });
}

/** Draw letter-spaced text centered, scaled to fit maxWidth so ends never clip. */
function fillFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  fontCss: string,
  trackingEm: number,
  maxWidth: number,
  fillStyle: string,
) {
  ctx.font = fontCss;
  const fontSizeMatch = fontCss.match(/([\d.]+)px/);
  const fontSize = fontSizeMatch ? Number(fontSizeMatch[1]) : 16;
  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const tracking = fontSize * trackingEm;
  const total = widths.reduce((a, b) => a + b, 0) + tracking * Math.max(0, chars.length - 1);
  const scale = total > maxWidth ? maxWidth / total : 1;

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  let x = -total / 2;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, 0);
    x += widths[i] + tracking;
  }
  ctx.restore();
}

async function paintBrandCanvas(
  canvas: HTMLCanvasElement,
  icons: Record<(typeof BRAND_LINKS)[number]["label"], HTMLImageElement>,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const michroma = cssFont("--font-michroma", "Michroma, sans-serif");
  const chakra = cssFont("--font-chakra", "Chakra Petch, sans-serif");
  const pad = w * 0.04;

  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 4;

  fillFittedText(
    ctx,
    "OM UPADHYAY",
    w / 2,
    h * 0.28,
    `400 200px ${michroma}`,
    0.22,
    w - pad * 2,
    "#ffffff",
  );

  fillFittedText(
    ctx,
    "MECHATRONICS ENGINEERING • UNIVERSITY OF WATERLOO",
    w / 2,
    h * 0.52,
    `500 48px ${chakra}`,
    0.22,
    w - pad * 2,
    "rgba(255,255,255,0.95)",
  );

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const gap = 240;
  const iconSize = 96;
  const iconY = h * 0.78;
  const startX = w / 2 - gap * 1.5;
  BRAND_LINKS.forEach((link, i) => {
    const img = icons[link.label];
    if (!img) return;
    ctx.drawImage(img, startX + i * gap - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
  });
}

/**
 * Real mesh brand on the back wall — depth-tested like machines so walls can
 * partially occlude it (DOM Html can only fully show/hide).
 */
function BackWallBrand({ visible }: { visible: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 3072;
    canvas.height = 900;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  useEffect(() => {
    let alive = true;
    const paint = async () => {
      const entries = await Promise.all(
        BRAND_LINKS.map(async (link) => [link.label, await loadSvgImage(BRAND_ICON_SVG[link.label])] as const),
      );
      if (!alive) return;
      const icons = Object.fromEntries(entries) as Record<
        (typeof BRAND_LINKS)[number]["label"],
        HTMLImageElement
      >;
      const run = () => {
        if (!alive) return;
        void paintBrandCanvas(texture.image as HTMLCanvasElement, icons);
        texture.needsUpdate = true;
      };
      run();
      void document.fonts.ready.then(run);
    };
    void paint();
    return () => {
      alive = false;
      texture.dispose();
    };
  }, [texture]);

  const openLink = useCallback((href: string) => {
    if (href.startsWith("mailto:")) {
      window.location.href = href;
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  if (!visible) return null;

  const planeW = 16.8;
  const planeH = 4.15;
  const iconY = -1.2;

  return (
    <group position={[0, 6.05, -7.92]}>
      <mesh>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.08}
          depthTest
          depthWrite
          toneMapped={false}
        />
      </mesh>
      {BRAND_LINKS.map((link) => (
        <mesh
          key={link.label}
          position={[link.x, iconY, 0.03]}
          onClick={(e) => {
            e.stopPropagation();
            openLink(link.href);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <planeGeometry args={[0.55, 0.55]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Machine section label as real meshes (billboard + depth test) so walls
 * clip them like the machines — DOM Html would show through walls.
 */
function StationLabel({
  label,
  iconSvg,
  position,
  hovered,
  interactive,
  reducedMotion,
  scale = 1,
  onHover,
  onSelect,
}: {
  label: string;
  iconSvg: string;
  position: [number, number, number];
  hovered: boolean;
  interactive: boolean;
  reducedMotion: boolean;
  scale?: number;
  onHover: (on: boolean) => void;
  onSelect: () => void;
}) {
  const dot = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 384;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
    return tex;
  }, [gl]);

  useEffect(() => {
    let alive = true;
    const paint = async () => {
      const icon = await loadSvgImage(iconSvg);
      if (!alive) return;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const chakra = cssFont("--font-chakra", "Chakra Petch, sans-serif");
      const pillH = 220;
      const pillY = (h - pillH) / 2;
      const pillR = pillH / 2;
      const iconSize = 96;
      ctx.font = `600 92px ${chakra}`;
      ctx.letterSpacing = "0.12em";
      const text = label.toUpperCase();
      const textW = ctx.measureText(text).width;
      const pillW = Math.min(w - 48, 72 + iconSize + 40 + textW + 72);
      const pillX = (w - pillW) / 2;

      // Soft shadow behind pill for readability
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
      ctx.fillStyle = hovered ? "rgba(20,21,24,0.98)" : "rgba(12,13,16,0.94)";
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
      ctx.lineWidth = 8;
      ctx.strokeStyle = hovered ? ACCENT : "rgba(255,255,255,0.35)";
      ctx.stroke();

      const iconX = pillX + 52;
      const iconY = pillY + (pillH - iconSize) / 2;
      ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);

      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = `600 92px ${chakra}`;
      ctx.letterSpacing = "0.12em";
      ctx.fillText(text, iconX + iconSize + 28, h / 2 + 2);

      texture.needsUpdate = true;
    };
    void paint();
    void document.fonts.ready.then(() => {
      if (alive) void paint();
    });
    return () => {
      alive = false;
    };
  }, [hovered, iconSvg, label, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    if (!dot.current || reducedMotion) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * Math.PI) * 0.18;
    dot.current.scale.setScalar(s);
  });

  // World size — larger + sharper than the old DOM pills at typical garage distance
  const planeW = Math.min(4.2, 1.65 + label.length * 0.18);
  const planeH = 0.78;
  const pillY = 0.55;

  return (
    <Billboard position={position} follow>
      <group scale={scale}>
        <mesh
          position={[0, pillY, 0]}
          onPointerOver={(e) => {
            if (!interactive) return;
            e.stopPropagation();
            onHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            onHover(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            if (!interactive) return;
            e.stopPropagation();
            document.body.style.cursor = "auto";
            onSelect();
          }}
        >
          <planeGeometry args={[planeW, planeH]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.08}
            depthTest
            depthWrite
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.028, 0.32, 0.028]} />
          <meshBasicMaterial
            color={hovered ? ACCENT : "#ffffff"}
            transparent
            opacity={hovered ? 0.95 : 0.4}
            depthTest
            depthWrite
            toneMapped={false}
          />
        </mesh>

        <mesh ref={dot} position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={hovered ? 1.2 : 0.9}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      </group>
    </Billboard>
  );
}

/** One machine parking spot: hover lift, glowing bay, label, click-to-fly. */
function MachineStation({
  station,
  visible,
  interactive,
  reducedMotion,
  onSelect,
  registerScaleRef,
}: {
  station: Station;
  visible: boolean;
  interactive: boolean;
  reducedMotion: boolean;
  onSelect: (station: Station) => void;
  registerScaleRef: (id: string, g: THREE.Group | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lift = useRef<THREE.Group>(null);
  const { Machine } = station;

  useFrame((_, delta) => {
    if (!lift.current) return;
    const target = hovered && interactive ? 0.16 : 0;
    lift.current.position.y = THREE.MathUtils.damp(
      lift.current.position.y,
      target,
      8,
      delta,
    );
  });

  const setCursor = (on: boolean) => {
    document.body.style.cursor = on ? "pointer" : "auto";
  };

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Painted bay outline or floor ring */}
      {station.bay && (
        <Line
          points={rectPoints(station.bay.w, station.bay.d)}
          color={hovered && interactive ? ACCENT : "#6c727c"}
          lineWidth={hovered && interactive ? 3 : 1.5}
          position={[0, 0.02 - station.position[1], 0]}
        />
      )}
      {station.ring && (
        <Line
          points={circlePoints(station.ring.r)}
          color={hovered && interactive ? ACCENT : "#6c727c"}
          lineWidth={hovered && interactive ? 3 : 1.5}
          position={[0, 0.02 - station.position[1], 0]}
        />
      )}

      <group
        ref={(g) => {
          registerScaleRef(station.id, g);
        }}
      >
        <group ref={lift}>
          <Machine reducedMotion={reducedMotion} />

          {/* Invisible hit volume for easy pointing */}
          <mesh
            position={[0, station.hitCenterY, 0]}
            visible={false}
            onPointerOver={(e) => {
              if (!interactive) return;
              e.stopPropagation();
              setHovered(true);
              setCursor(true);
            }}
            onPointerOut={() => {
              setHovered(false);
              setCursor(false);
            }}
            onClick={(e) => {
              if (!interactive) return;
              e.stopPropagation();
              setCursor(false);
              onSelect(station);
            }}
          >
            <boxGeometry args={station.hitSize} />
          </mesh>

          {visible && (
            <StationLabel
              label={station.label}
              iconSvg={station.iconSvg}
              position={station.labelOffset}
              hovered={hovered}
              interactive={interactive}
              reducedMotion={reducedMotion}
              scale={station.labelScale ?? 1}
              onHover={setHovered}
              onSelect={() => onSelect(station)}
            />
          )}
        </group>
      </group>
    </group>
  );
}

/** Sectional matte garage door — fully opaque so the bay stays hidden until open. */
function GarageDoor({
  doorRef,
  sectionRefs,
  stencilRef,
  onOpen,
  interactive,
  raised = false,
  beginHint = null,
}: {
  doorRef: React.RefObject<THREE.Group | null>;
  sectionRefs: React.MutableRefObject<Array<THREE.Group | null>>;
  stencilRef: React.RefObject<HTMLDivElement | null>;
  onOpen: () => void;
  interactive: boolean;
  raised?: boolean;
  beginHint?: string | null;
}) {
  const sectionH = DOOR_H / SECTIONS;
  // Slight vertical overlap so no light leaks between tiles.
  const panelH = sectionH + 0.02;
  const cellW = (DOOR_W - 0.9) / 4;
  const insetW = cellW - 0.16;

  return (
    <group ref={doorRef} position={[0, raised ? DOOR_H + 0.6 : 0, DOOR_Z]}>
      {/* Outer frame — catches exterior light so the door reads clearly when the lamp is off */}
      <mesh position={[0, DOOR_H / 2, -0.02]}>
        <boxGeometry args={[DOOR_W + 0.28, DOOR_H + 0.28, 0.12]} />
        <meshStandardMaterial color="#3d4149" roughness={0.88} metalness={0.12} />
      </mesh>

      {Array.from({ length: SECTIONS }, (_, i) => (
        <group
          key={i}
          ref={(g) => {
            sectionRefs.current[i] = g;
          }}
          position={[0, sectionH * (i + 0.5), 0]}
        >
          {/* Solid matte panel (opaque) */}
          <mesh>
            <boxGeometry args={[DOOR_W, panelH, 0.16]} />
            <meshStandardMaterial color="#5a5f69" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Recessed inset tiles — darker for readable panel grid */}
          {Array.from({ length: 4 }, (_, j) => (
            <mesh
              key={j}
              position={[-DOOR_W / 2 + 0.45 + (j + 0.5) * cellW, 0, 0.095]}
            >
              <boxGeometry args={[insetW, sectionH - 0.2, 0.05]} />
              <meshStandardMaterial color="#454950" roughness={0.94} metalness={0.06} />
            </mesh>
          ))}
          {/* Horizontal rib between sections */}
          <mesh position={[0, -sectionH / 2, 0.11]}>
            <boxGeometry args={[DOOR_W + 0.06, 0.07, 0.07]} />
            <meshStandardMaterial color="#343840" roughness={0.85} metalness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Top + bottom edge rails */}
      <mesh position={[0, DOOR_H - 0.04, 0.12]}>
        <boxGeometry args={[DOOR_W + 0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#343840" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.04, 0.12]}>
        <boxGeometry args={[DOOR_W + 0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#343840" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Stenciled name on the door */}
      <Html transform position={[0, 2.85, 0.14]} scale={0.5} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <div
          ref={stencilRef}
          style={{
            position: "relative",
            textAlign: "center",
            color: "rgba(245,247,250,0.95)",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1.15,
            opacity: raised ? 0 : 1,
            textShadow: "0 2px 10px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-michroma)",
              fontSize: 52,
              letterSpacing: "0.28em",
            }}
          >
            OM UPADHYAY
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: "var(--font-chakra)",
              fontSize: 26,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(220,226,234,0.82)",
            }}
          >
            Engineering Portfolio
          </div>
          {beginHint && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 50,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 14,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(245,247,250,0.55)",
                whiteSpace: "nowrap",
              }}
            >
              {beginHint}
            </div>
          )}
        </div>
      </Html>

      {/* Full-door click target (also covered by the landing overlay) */}
      {interactive && (
        <mesh
          position={[0, DOOR_H / 2, 0.12]}
          visible={false}
          onClick={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
            onOpen();
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[DOOR_W, DOOR_H, 0.4]} />
        </mesh>
      )}
    </group>
  );
}

function SceneContents({
  reducedMotion,
  phase,
  beginRequested,
  instantOpen = false,
  beginHint = null,
  onOpeningStart,
  onOpened,
  onFlyStart,
  onNavigate,
  onReady,
}: GarageSceneProps) {
  const camera = useThree((s) => s.camera);
  const controls = useRef<OrbitControlsImpl>(null);
  const room = useRef<THREE.Group>(null);

  const doorRef = useRef<THREE.Group>(null);
  const sectionRefs = useRef<Array<THREE.Group | null>>([]);
  const stencilRef = useRef<HTMLDivElement>(null);
  const lampLight = useRef<THREE.SpotLight>(null);
  const lampTargetRef = useRef<THREE.Object3D>(null);
  const lampBulbMat = useRef<THREE.MeshStandardMaterial>(null);
  const interiorLights = useRef<Array<THREE.PointLight | null>>([]);
  const fixtureMats = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const stationScales = useRef<Record<string, THREE.Group | null>>({});
  const lookTarget = useRef(
    new THREE.Vector3(...(instantOpen ? CAM_OPEN.look : CAM_CLOSED.look)),
  );
  const flying = useRef(false);
  const opening = useRef(false);

  const isOpen = phase === "open";

  const setLampGlow = useCallback((lightIntensity: number, bulbGlow: number) => {
    if (lampLight.current) lampLight.current.intensity = lightIntensity;
    if (lampBulbMat.current) lampBulbMat.current.emissiveIntensity = bulbGlow;
  }, []);

  // Signal the landing overlay that the WebGL scene is live.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Aim the barn lamp at the door and set the initial camera.
  useEffect(() => {
    if (instantOpen) {
      camera.position.set(...CAM_OPEN.pos);
      lookTarget.current.set(...CAM_OPEN.look);
    } else {
      camera.position.set(...CAM_CLOSED.pos);
    }
    camera.lookAt(lookTarget.current);
    if (lampLight.current && lampTargetRef.current) {
      lampLight.current.target = lampTargetRef.current;
    }
  }, [camera, instantOpen]);

  // Keep the camera aimed while GSAP drives it (controls take over once open).
  useFrame(({ pointer }, delta) => {
    if (!isOpen || flying.current) {
      camera.lookAt(lookTarget.current);
    }
    // Subtle mouse parallax on the whole room once open.
    if (room.current) {
      const targetY = isOpen && !reducedMotion ? pointer.x * 0.02 : 0;
      const targetX = isOpen && !reducedMotion ? -pointer.y * 0.012 : 0;
      room.current.rotation.y = THREE.MathUtils.damp(room.current.rotation.y, targetY, 4, delta);
      room.current.rotation.x = THREE.MathUtils.damp(room.current.rotation.x, targetX, 4, delta);
    }
  });

  const setInteriorIntensity = useCallback((v: number) => {
    interiorLights.current.forEach((l) => {
      if (l) l.intensity = v;
    });
    fixtureMats.current.forEach((m) => {
      if (m) m.emissiveIntensity = v * 1.6;
    });
  }, []);

  const revealInstant = useCallback(() => {
    if (doorRef.current) doorRef.current.position.y = DOOR_H + 0.6;
    if (stencilRef.current) stencilRef.current.style.opacity = "0";
    setLampGlow(2.4, 0.9);
    setInteriorIntensity(1.1);
    Object.values(stationScales.current).forEach((g) => g?.scale.setScalar(1));
    camera.position.set(...CAM_OPEN.pos);
    lookTarget.current.set(...CAM_OPEN.look);
    camera.lookAt(lookTarget.current);
    onOpened();
  }, [camera, onOpened, setInteriorIntensity, setLampGlow]);

  const openDoor = useCallback(() => {
    if (opening.current || phase !== "closed") return;
    opening.current = true;
    onOpeningStart();

    if (reducedMotion || instantOpen) {
      revealInstant();
      return;
    }

    const door = doorRef.current;
    const lamp = lampLight.current;
    if (!door || !lamp) {
      revealInstant();
      return;
    }

    const interior = { v: 0 };
    const lampFx = { i: 0, g: 0 };
    const applyLamp = () => setLampGlow(lampFx.i, lampFx.g);
    const camPos = camera.position;
    const look = lookTarget.current;

    const tl = gsap.timeline({
      onComplete: () => {
        onOpened();
      },
    });

    // 1. Lamp flickers awake (starts off — bulb + spotlight).
    tl.to(lampFx, { i: 0.4, g: 0.2, duration: 0.06, onUpdate: applyLamp })
      .to(lampFx, { i: 0.05, g: 0.02, duration: 0.05, onUpdate: applyLamp })
      .to(lampFx, { i: 1.6, g: 0.65, duration: 0.07, onUpdate: applyLamp })
      .to(lampFx, { i: 0.3, g: 0.12, duration: 0.06, onUpdate: applyLamp })
      .to(lampFx, { i: 2.4, g: 0.9, duration: 0.12, onUpdate: applyLamp });

    // 2. Motor clunk: the door dips in anticipation.
    tl.to(door.position, { y: -0.12, duration: 0.16, ease: "power2.in" }, "+=0.15");
    tl.to(door.position, { y: 0, duration: 0.12, ease: "power2.out" });

    // 3. Door raises as one unit, with a ripple through its sections.
    tl.addLabel("raise", "+=0.05");
    tl.to(
      door.position,
      { y: DOOR_H + 0.6, duration: 1.7, ease: "power3.inOut" },
      "raise",
    );
    sectionRefs.current.forEach((s, i) => {
      if (!s) return;
      tl.to(s.rotation, { x: -0.055, duration: 0.22, ease: "sine.out" }, `raise+=${0.12 + i * 0.09}`);
      tl.to(s.rotation, { x: 0, duration: 0.3, ease: "sine.inOut" }, `raise+=${0.34 + i * 0.09}`);
    });
    if (stencilRef.current) {
      tl.to(stencilRef.current, { opacity: 0, duration: 0.5 }, "raise+=0.3");
    }

    // 4. Interior light leaks through the glass as the door lifts.
    tl.to(
      interior,
      {
        v: 0.35,
        duration: 1.2,
        onUpdate: () => setInteriorIntensity(interior.v),
      },
      "raise+=0.2",
    );

    // 5. Fluorescent flicker as the garage lights come on.
    tl.addLabel("lights", "raise+=1.5");
    const flicker = [0.12, 0.9, 0.25, 1.25, 0.7, 1.1];
    flicker.forEach((v, i) => {
      tl.to(
        interior,
        {
          v,
          duration: 0.07,
          onUpdate: () => setInteriorIntensity(interior.v),
        },
        `lights+=${i * 0.08}`,
      );
    });

    // 6. Camera dollies into the bay.
    tl.addLabel("dolly", "raise+=1.2");
    tl.to(
      camPos,
      { x: CAM_OPEN.pos[0], y: CAM_OPEN.pos[1], z: CAM_OPEN.pos[2], duration: 1.6, ease: "power2.inOut" },
      "dolly",
    );
    tl.to(
      look,
      { x: CAM_OPEN.look[0], y: CAM_OPEN.look[1], z: CAM_OPEN.look[2], duration: 1.6, ease: "power2.inOut" },
      "dolly",
    );

    // 7. Machines pop into place.
    STATIONS.forEach((st, i) => {
      const g = stationScales.current[st.id];
      if (!g) return;
      tl.to(
        g.scale,
        { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.8)" },
        `dolly+=${0.55 + i * 0.13}`,
      );
    });
  }, [camera, instantOpen, onOpened, onOpeningStart, phase, reducedMotion, revealInstant, setInteriorIntensity, setLampGlow]);

  // Landing overlay / keyboard "click anywhere" signal.
  useEffect(() => {
    if (beginRequested && phase === "closed") openDoor();
  }, [beginRequested, openDoor, phase]);

  const selectStation = useCallback(
    (station: Station) => {
      if (flying.current || !isOpen) return;
      flying.current = true;
      onFlyStart(station.route);

      if (reducedMotion) {
        onNavigate(station.route);
        return;
      }

      if (controls.current) controls.current.enabled = false;
      const m = new THREE.Vector3(
        station.position[0],
        station.position[1] + station.hitCenterY + 0.4,
        station.position[2],
      );
      const dir = camera.position.clone().sub(m).normalize();
      const dest = m.clone().add(dir.multiplyScalar(3.4));
      dest.y = Math.max(dest.y, 1.7);

      gsap.to(camera.position, {
        x: dest.x,
        y: dest.y,
        z: dest.z,
        duration: 0.95,
        ease: "power2.in",
      });
      gsap.to(lookTarget.current, {
        x: m.x,
        y: m.y,
        z: m.z,
        duration: 0.95,
        ease: "power2.in",
        onUpdate: () => camera.lookAt(lookTarget.current),
        onComplete: () => onNavigate(station.route),
      });
    },
    [camera, isOpen, onFlyStart, onNavigate, reducedMotion],
  );

  const registerScaleRef = useCallback(
    (id: string, g: THREE.Group | null) => {
      stationScales.current[id] = g;
      if (!g) return;
      if (instantOpen || reducedMotion || phase !== "closed") {
        g.scale.setScalar(1);
      } else {
        g.scale.setScalar(0.001);
      }
    },
    [instantOpen, phase, reducedMotion],
  );

  const fixtures = useMemo(() => [-4.5, 0, 4.5], []);

  return (
    <>
      {/* Exterior fill — original closed-door look */}
      <hemisphereLight args={["#4a5262", "#0a0b0d", 0.55]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 9, 20]} intensity={1.35} color="#aebdd2" />
      <directionalLight position={[-8, 5, 14]} intensity={0.45} color="#7d8aa0" />

      {/* Exterior barn lamp above the door */}
      <spotLight
        ref={lampLight}
        position={[0, 6.5, 7.6]}
        angle={0.72}
        penumbra={0.55}
        intensity={0}
        decay={0}
        color="#ffe8c4"
      />
      <object3D ref={lampTargetRef} position={[0, 2.2, 5.9]} />

      <group ref={room}>
        {/* ── Exterior facade ── */}
        {/* Lintel above the door (hides the raised door) */}
        <mesh position={[0, DOOR_H + 2.5, DOOR_Z + 0.35]}>
          <boxGeometry args={[DOOR_W + 8.2, 5, 0.5]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Side facade pillars */}
        <mesh position={[-(DOOR_W / 2 + 2.05), 4, DOOR_Z + 0.35]}>
          <boxGeometry args={[4.1, 8, 0.5]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh position={[DOOR_W / 2 + 2.05, 4, DOOR_Z + 0.35]}>
          <boxGeometry args={[4.1, 8, 0.5]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Barn lamp fixture */}
        <group position={[0, 6.35, DOOR_Z + 0.85]}>
          <mesh position={[0, 0.35, -0.35]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
            <meshStandardMaterial color="#31343b" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh rotation={[0, 0, 0]}>
            <coneGeometry args={[0.42, 0.3, 16, 1, true]} />
            <meshStandardMaterial color="#2c2f36" metalness={0.75} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial
              ref={lampBulbMat}
              color="#3a3834"
              emissive="#ffe8c4"
              emissiveIntensity={0}
              roughness={0.45}
              metalness={0.1}
            />
          </mesh>
        </group>
        {/* Concrete apron outside */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, DOOR_Z + 4.5]}>
          <planeGeometry args={[DOOR_W + 8.2, 9]} />
          <meshStandardMaterial color={CONCRETE_DARK} roughness={0.95} />
        </mesh>

        {/* ── Garage interior ── */}
        {/* Floor with subtle grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
          <planeGeometry args={[20.4, 14.4]} />
          <meshStandardMaterial color={FLOOR} roughness={0.85} metalness={0.08} />
        </mesh>
        <Grid
          args={[20.4, 13.4]}
          position={[0, 0.012, -1.45]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#2e3138"
          sectionSize={4}
          sectionThickness={1}
          sectionColor="#363a42"
          fadeDistance={60}
          fadeStrength={0.6}
        />
        {/* Back wall */}
        <mesh position={[0, 4, -8.1]}>
          <boxGeometry args={[20.4, 8, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={0.9} />
        </mesh>
        <BackWallBrand visible={isOpen || instantOpen} />
        {/* Red safety stripe on the back wall */}
        <mesh position={[0, 1.15, -7.98]}>
          <boxGeometry args={[20.4, 0.28, 0.02]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.28} roughness={0.6} />
        </mesh>
        {/* Side walls */}
        <mesh position={[-10.2, 4, -1]}>
          <boxGeometry args={[0.2, 8, 14.4]} />
          <meshStandardMaterial color={WALL} roughness={0.9} />
        </mesh>
        <mesh position={[10.2, 4, -1]}>
          <boxGeometry args={[0.2, 8, 14.4]} />
          <meshStandardMaterial color={WALL} roughness={0.9} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, 8.1, -1]}>
          <boxGeometry args={[20.4, 0.2, 14.4]} />
          <meshStandardMaterial color="#1a1c20" roughness={0.95} />
        </mesh>
        {/* Fluorescent fixtures */}
        {fixtures.map((x, i) => (
          <group key={i} position={[x, 7.9, -2]}>
            <mesh>
              <boxGeometry args={[0.5, 0.12, 5]} />
              <meshStandardMaterial color="#3a3e46" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.07, 0]}>
              <boxGeometry args={[0.34, 0.04, 4.7]} />
              <meshStandardMaterial
                ref={(m) => {
                  fixtureMats.current[i] = m;
                }}
                color="#eef2f6"
                emissive="#e8f0f8"
                emissiveIntensity={0}
              />
            </mesh>
            <pointLight
              ref={(l) => {
                interiorLights.current[i] = l;
              }}
              position={[0, -0.6, 0]}
              intensity={0}
              decay={0}
              color="#dbe6f0"
            />
          </group>
        ))}

        {/* ── The door ── */}
        <GarageDoor
          doorRef={doorRef}
          sectionRefs={sectionRefs}
          stencilRef={stencilRef}
          onOpen={openDoor}
          interactive={phase === "closed" && !instantOpen}
          raised={instantOpen}
          beginHint={beginHint}
        />

        {/* ── Machines ── */}
        {STATIONS.map((st) => (
          <MachineStation
            key={st.id}
            station={st}
            visible={isOpen || instantOpen}
            interactive={isOpen}
            reducedMotion={reducedMotion}
            onSelect={selectStation}
            registerScaleRef={registerScaleRef}
          />
        ))}
      </group>

      <OrbitControls
        ref={controls}
        enabled={isOpen}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        target={new THREE.Vector3(...CAM_OPEN.look)}
        minPolarAngle={1.12}
        maxPolarAngle={1.68}
        minAzimuthAngle={-0.55}
        maxAzimuthAngle={0.55}
      />
    </>
  );
}

export default function GarageScene(props: GarageSceneProps) {
  const startCam = props.instantOpen ? CAM_OPEN.pos : CAM_CLOSED.pos;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 45, near: 0.1, far: 80, position: startCam as unknown as [number, number, number] }}
      gl={{ antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#07080A"]} />
      <fog attach="fog" args={["#07080A", 24, 44]} />
      <SceneContents {...props} />
    </Canvas>
  );
}
