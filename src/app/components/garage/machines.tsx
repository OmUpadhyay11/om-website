"use client";

/**
 * Procedural low-poly machines with a CAD "shaded with edges" look.
 * Each machine is a self-contained group so it can later be swapped for a
 * real glTF/GLB model without touching the camera, labels, or navigation:
 * replace the component body with a <primitive object={gltf.scene} /> and
 * keep the same root group and approximate footprint.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

export const ACCENT = "#E82127";
const STEEL = "#8e959f";
const STEEL_DARK = "#565c66";
const GLASS = "#a8c4d4";
const TIRE = "#26282c";
const EDGE = "#15171b";

export type MachineProps = {
  hovered?: boolean;
  reducedMotion?: boolean;
};

/** A box/cylinder part with dark CAD-style edge lines. */
function Part({
  geometry,
  color = STEEL,
  position,
  rotation,
  scale,
  metalness = 0.7,
  roughness = 0.38,
  emissive,
  emissiveIntensity = 0,
  edgeColor = EDGE,
}: {
  geometry: React.ReactNode;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  edgeColor?: string;
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow>
      {geometry}
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
      <Edges color={edgeColor} threshold={20} />
    </mesh>
  );
}

/** Recycled exhaust puffs drifting up and back from a tailpipe. */
function Exhaust({
  origin,
  direction = [0, 0.55, -0.6],
  count = 6,
  reducedMotion,
}: {
  origin: [number, number, number];
  direction?: [number, number, number];
  count?: number;
  reducedMotion?: boolean;
}) {
  const puffs = useRef<Array<THREE.Mesh | null>>([]);
  const dir = useMemo(() => new THREE.Vector3(...direction), [direction]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i += 1) {
      const mesh = puffs.current[i];
      if (!mesh) continue;
      const phase = (t * 0.45 + i / count) % 1;
      mesh.position.set(
        origin[0] + dir.x * phase + Math.sin(t * 2 + i * 7) * 0.04,
        origin[1] + dir.y * phase,
        origin[2] + dir.z * phase,
      );
      const s = 0.06 + phase * 0.22;
      mesh.scale.setScalar(s);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.3;
    }
  });

  if (reducedMotion) return null;

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            puffs.current[i] = el;
          }}
          position={origin}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#9aa2ab" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Wheel({
  position,
  radius = 0.42,
  width = 0.3,
}: {
  position: [number, number, number];
  radius?: number;
  width?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <Part
        geometry={<cylinderGeometry args={[radius, radius, width, 18]} />}
        color={TIRE}
        metalness={0.2}
        roughness={0.85}
      />
      <Part
        geometry={<cylinderGeometry args={[radius * 0.55, radius * 0.55, width + 0.02, 12]} />}
        color={STEEL_DARK}
      />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Humanoid robot: center-back flagship, dances in place.
 * ──────────────────────────────────────────────────────────────────── */
export function HumanoidBot({ reducedMotion }: MachineProps) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const foreL = useRef<THREE.Group>(null);
  const foreR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const shinL = useRef<THREE.Group>(null);
  const shinR = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;
    // Base lift keeps feet above the floor; bob only goes upward from there.
    const baseY = 0.16;
    if (reducedMotion) {
      root.current.position.y = baseY;
      return;
    }
    const t = clock.getElapsedTime();
    const beat = t * 1.7;

    root.current.position.y = baseY + Math.abs(Math.sin(beat)) * 0.028;
    root.current.rotation.z = Math.sin(beat * 0.5) * 0.015;
    if (torso.current) {
      torso.current.rotation.y = Math.sin(beat * 0.5) * 0.14;
      torso.current.rotation.z = Math.sin(beat) * 0.025;
    }
    if (armL.current) armL.current.rotation.x = Math.sin(beat) * 0.28 - 0.12;
    if (armR.current) armR.current.rotation.x = Math.sin(beat + Math.PI) * 0.28 - 0.12;
    if (armL.current) armL.current.rotation.z = 0.12 + Math.sin(beat * 0.5) * 0.05;
    if (armR.current) armR.current.rotation.z = -0.12 - Math.sin(beat * 0.5) * 0.05;
    if (foreL.current) foreL.current.rotation.x = -0.55 + Math.sin(beat + 0.6) * 0.18;
    if (foreR.current) foreR.current.rotation.x = -0.55 + Math.sin(beat + Math.PI + 0.6) * 0.18;

    // Smaller leg lifts so the planted foot stays on the floor.
    const liftL = Math.max(0, Math.sin(beat)) * 0.22;
    const liftR = Math.max(0, Math.sin(beat + Math.PI)) * 0.22;
    if (legL.current) legL.current.rotation.x = -liftL;
    if (legR.current) legR.current.rotation.x = -liftR;
    if (shinL.current) shinL.current.rotation.x = liftL * 0.85;
    if (shinR.current) shinR.current.rotation.x = liftR * 0.85;
  });

  const joint = (
    pos: [number, number, number],
    r = 0.11,
  ): React.ReactNode => (
    <Part
      geometry={<sphereGeometry args={[r, 12, 12]} />}
      color={ACCENT}
      position={pos}
      metalness={0.5}
      roughness={0.3}
    />
  );

  return (
    <group ref={root}>
      {/* Legs (hips at y=1.02) */}
      <group ref={legL} position={[-0.24, 1.02, 0]}>
        {joint([0, 0, 0], 0.12)}
        <Part geometry={<boxGeometry args={[0.2, 0.5, 0.24]} />} position={[0, -0.3, 0]} />
        <group ref={shinL} position={[0, -0.58, 0]}>
          {joint([0, 0, 0], 0.1)}
          <Part geometry={<boxGeometry args={[0.17, 0.46, 0.2]} />} color={STEEL_DARK} position={[0, -0.28, 0]} />
          <Part geometry={<boxGeometry args={[0.2, 0.09, 0.4]} />} position={[0, -0.55, 0.08]} />
        </group>
      </group>
      <group ref={legR} position={[0.24, 1.02, 0]}>
        {joint([0, 0, 0], 0.12)}
        <Part geometry={<boxGeometry args={[0.2, 0.5, 0.24]} />} position={[0, -0.3, 0]} />
        <group ref={shinR} position={[0, -0.58, 0]}>
          {joint([0, 0, 0], 0.1)}
          <Part geometry={<boxGeometry args={[0.17, 0.46, 0.2]} />} color={STEEL_DARK} position={[0, -0.28, 0]} />
          <Part geometry={<boxGeometry args={[0.2, 0.09, 0.4]} />} position={[0, -0.55, 0.08]} />
        </group>
      </group>

      {/* Pelvis */}
      <Part geometry={<boxGeometry args={[0.62, 0.26, 0.34]} />} color={STEEL_DARK} position={[0, 1.12, 0]} />

      {/* Torso and up (twists as a unit) */}
      <group ref={torso} position={[0, 1.25, 0]}>
        <Part geometry={<boxGeometry args={[0.72, 0.78, 0.4]} />} position={[0, 0.42, 0]} />
        <Part
          geometry={<boxGeometry args={[0.4, 0.3, 0.06]} />}
          color={ACCENT}
          position={[0, 0.48, 0.21]}
          emissive={ACCENT}
          emissiveIntensity={0.35}
        />
        {/* Head */}
        {joint([0, 0.92, 0], 0.09)}
        <Part geometry={<boxGeometry args={[0.3, 0.3, 0.3]} />} position={[0, 1.14, 0]} />
        <Part
          geometry={<boxGeometry args={[0.22, 0.08, 0.04]} />}
          color={GLASS}
          position={[0, 1.16, 0.16]}
          emissive={GLASS}
          emissiveIntensity={0.6}
          metalness={0.1}
        />

        {/* Arms (shoulders at y=0.72) */}
        <group ref={armL} position={[-0.46, 0.72, 0]}>
          {joint([0, 0, 0], 0.12)}
          <Part geometry={<boxGeometry args={[0.18, 0.48, 0.2]} />} position={[0, -0.3, 0]} />
          <group ref={foreL} position={[0, -0.56, 0]}>
            {joint([0, 0, 0], 0.09)}
            <Part geometry={<boxGeometry args={[0.15, 0.42, 0.17]} />} color={STEEL_DARK} position={[0, -0.26, 0]} />
          </group>
        </group>
        <group ref={armR} position={[0.46, 0.72, 0]}>
          {joint([0, 0, 0], 0.12)}
          <Part geometry={<boxGeometry args={[0.18, 0.48, 0.2]} />} position={[0, -0.3, 0]} />
          <group ref={foreR} position={[0, -0.56, 0]}>
            {joint([0, 0, 0], 0.09)}
            <Part geometry={<boxGeometry args={[0.15, 0.42, 0.17]} />} color={STEEL_DARK} position={[0, -0.26, 0]} />
          </group>
        </group>
      </group>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Pickup truck: heavy slow idle rumble plus tailpipe exhaust.
 * ──────────────────────────────────────────────────────────────────── */
export function PickupTruck({ reducedMotion }: MachineProps) {
  const body = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !body.current) return;
    const t = clock.getElapsedTime();
    body.current.position.y = Math.sin(t * 7) * 0.008 + Math.sin(t * 17) * 0.004;
    body.current.rotation.z = Math.sin(t * 7 + 1) * 0.004;
  });

  return (
    <group>
      <group ref={body}>
        {/* Chassis + bed */}
        <Part geometry={<boxGeometry args={[1.5, 0.5, 3.6]} />} position={[0, 0.72, 0]} />
        {/* Cab */}
        <Part geometry={<boxGeometry args={[1.4, 0.62, 1.3]} />} position={[0, 1.26, 0.5]} />
        <Part
          geometry={<boxGeometry args={[1.28, 0.4, 0.06]} />}
          color={GLASS}
          metalness={0.1}
          roughness={0.12}
          position={[0, 1.3, 1.14]}
          rotation={[-0.25, 0, 0]}
        />
        {/* Hood */}
        <Part geometry={<boxGeometry args={[1.42, 0.34, 1.0]} />} position={[0, 1.02, 1.65]} />
        {/* Bed walls */}
        <Part geometry={<boxGeometry args={[0.08, 0.34, 1.9]} />} color={STEEL_DARK} position={[-0.71, 1.12, -0.95]} />
        <Part geometry={<boxGeometry args={[0.08, 0.34, 1.9]} />} color={STEEL_DARK} position={[0.71, 1.12, -0.95]} />
        <Part geometry={<boxGeometry args={[1.5, 0.34, 0.08]} />} color={STEEL_DARK} position={[0, 1.12, -1.86]} />
        {/* Grille + lights */}
        <Part geometry={<boxGeometry args={[1.2, 0.24, 0.06]} />} color={STEEL_DARK} position={[0, 0.94, 2.16]} />
        <Part
          geometry={<boxGeometry args={[0.2, 0.1, 0.05]} />}
          color="#f5e6b8"
          emissive="#f5e6b8"
          emissiveIntensity={0.7}
          position={[-0.55, 0.98, 2.17]}
        />
        <Part
          geometry={<boxGeometry args={[0.2, 0.1, 0.05]} />}
          color="#f5e6b8"
          emissive="#f5e6b8"
          emissiveIntensity={0.7}
          position={[0.55, 0.98, 2.17]}
        />
        {/* Exhaust tip, red accent */}
        <Part
          geometry={<cylinderGeometry args={[0.06, 0.06, 0.3, 10]} />}
          color={ACCENT}
          rotation={[Math.PI / 2, 0, 0]}
          position={[-0.5, 0.45, -1.9]}
          emissive={ACCENT}
          emissiveIntensity={0.3}
        />
      </group>

      <Wheel position={[-0.78, 0.42, 1.3]} />
      <Wheel position={[0.78, 0.42, 1.3]} />
      <Wheel position={[-0.78, 0.42, -1.15]} />
      <Wheel position={[0.78, 0.42, -1.15]} />

      <Exhaust origin={[-0.5, 0.45, -2.08]} direction={[0, 0.6, -0.7]} reducedMotion={reducedMotion} />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Formula/race car: low, tight high-frequency shudder plus exhaust.
 * ──────────────────────────────────────────────────────────────────── */
export function RaceCar({ reducedMotion }: MachineProps) {
  const body = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !body.current) return;
    const t = clock.getElapsedTime();
    body.current.position.y = Math.sin(t * 42) * 0.006;
    body.current.rotation.z = Math.sin(t * 34) * 0.005;
    body.current.rotation.x = Math.sin(t * 27) * 0.003;
  });

  return (
    <group>
      <group ref={body}>
        {/* Monocoque */}
        <Part geometry={<boxGeometry args={[0.66, 0.3, 2.5]} />} position={[0, 0.34, 0]} />
        {/* Nose */}
        <Part geometry={<boxGeometry args={[0.4, 0.18, 0.9]} />} position={[0, 0.3, 1.6]} />
        {/* Cockpit halo */}
        <Part geometry={<boxGeometry args={[0.5, 0.24, 0.7]} />} color={STEEL_DARK} position={[0, 0.56, -0.1]} />
        <Part
          geometry={<boxGeometry args={[0.34, 0.12, 0.3]} />}
          color={GLASS}
          metalness={0.1}
          roughness={0.12}
          position={[0, 0.62, 0.32]}
        />
        {/* Engine cover */}
        <Part geometry={<boxGeometry args={[0.44, 0.3, 0.8]} />} position={[0, 0.5, -0.85]} />
        {/* Front wing, red accent */}
        <Part
          geometry={<boxGeometry args={[1.5, 0.05, 0.4]} />}
          color={ACCENT}
          position={[0, 0.16, 2.0]}
          emissive={ACCENT}
          emissiveIntensity={0.25}
        />
        {/* Rear wing, red accent */}
        <Part
          geometry={<boxGeometry args={[1.3, 0.05, 0.36]} />}
          color={ACCENT}
          position={[0, 0.78, -1.45]}
          emissive={ACCENT}
          emissiveIntensity={0.25}
        />
        <Part geometry={<boxGeometry args={[0.06, 0.34, 0.3]} />} color={STEEL_DARK} position={[-0.55, 0.6, -1.42]} />
        <Part geometry={<boxGeometry args={[0.06, 0.34, 0.3]} />} color={STEEL_DARK} position={[0.55, 0.6, -1.42]} />
        {/* Exhaust tip */}
        <Part
          geometry={<cylinderGeometry args={[0.05, 0.05, 0.22, 10]} />}
          color={ACCENT}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.42, -1.32]}
          emissive={ACCENT}
          emissiveIntensity={0.35}
        />
      </group>

      <Wheel position={[-0.62, 0.3, 1.15]} radius={0.3} width={0.26} />
      <Wheel position={[0.62, 0.3, 1.15]} radius={0.3} width={0.26} />
      <Wheel position={[-0.64, 0.34, -0.95]} radius={0.34} width={0.32} />
      <Wheel position={[0.64, 0.34, -0.95]} radius={0.34} width={0.32} />

      <Exhaust origin={[0, 0.42, -1.48]} direction={[0, 0.45, -0.8]} reducedMotion={reducedMotion} />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Quadcopter drone: floats in the air, props always spinning.
 * ──────────────────────────────────────────────────────────────────── */
export function QuadDrone({ reducedMotion }: MachineProps) {
  const root = useRef<THREE.Group>(null);
  const props = useRef<Array<THREE.Group | null>>([]);
  const shadow = useRef<THREE.Mesh>(null);

  const armOffsets: Array<[number, number]> = [
    [-0.62, -0.62],
    [0.62, -0.62],
    [-0.62, 0.62],
    [0.62, 0.62],
  ];

  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.5) * 0.14;
      root.current.rotation.z = Math.sin(t * 0.9) * 0.05;
      root.current.rotation.x = Math.sin(t * 1.2 + 1) * 0.04;
    }
    props.current.forEach((p, i) => {
      if (p) p.rotation.y += delta * 42 * (i % 2 === 0 ? 1 : -1);
    });
    if (shadow.current) {
      const s = 1 - Math.sin(t * 1.5) * 0.06;
      shadow.current.scale.setScalar(s);
      (shadow.current.material as THREE.MeshBasicMaterial).opacity =
        0.28 + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group>
      <group ref={root}>
        {/* Body */}
        <Part geometry={<boxGeometry args={[0.56, 0.2, 0.56]} />} position={[0, 0, 0]} />
        <Part geometry={<boxGeometry args={[0.3, 0.12, 0.3]} />} color={STEEL_DARK} position={[0, 0.16, 0]} />
        {/* Camera gimbal */}
        <Part
          geometry={<sphereGeometry args={[0.09, 10, 10]} />}
          color={GLASS}
          metalness={0.1}
          position={[0, -0.14, 0.2]}
          emissive={GLASS}
          emissiveIntensity={0.4}
        />

        {armOffsets.map(([x, z], i) => (
          <group key={i}>
            {/* Arm */}
            <Part
              geometry={<boxGeometry args={[0.75, 0.06, 0.1]} />}
              color={STEEL_DARK}
              position={[x * 0.5, 0.02, z * 0.5]}
              rotation={[0, Math.atan2(-z, x) + Math.PI / 2 + (x * z > 0 ? Math.PI / 2 : -Math.PI / 2), 0]}
            />
            {/* Motor */}
            <Part
              geometry={<cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />}
              position={[x, 0.06, z]}
            />
            {/* Prop ring, red accent */}
            <mesh position={[x, 0.13, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.34, 0.02, 8, 28]} />
              <meshStandardMaterial
                color={ACCENT}
                emissive={ACCENT}
                emissiveIntensity={0.45}
                metalness={0.4}
                roughness={0.4}
              />
            </mesh>
            {/* Spinning props */}
            <group
              ref={(el) => {
                props.current[i] = el;
              }}
              position={[x, 0.14, z]}
            >
              <mesh>
                <boxGeometry args={[0.62, 0.012, 0.05]} />
                <meshStandardMaterial
                  color="#c8ccd2"
                  transparent
                  opacity={0.85}
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[0.62, 0.012, 0.05]} />
                <meshStandardMaterial
                  color="#c8ccd2"
                  transparent
                  opacity={0.85}
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* Soft floor shadow (root group is positioned above the floor) */}
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.55, 0]}>
        <circleGeometry args={[0.85, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}
