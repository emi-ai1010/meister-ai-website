import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Mascot, Face, Pose } from "./Mascot";
import { Star3D } from "./Props";
import { PhoneHook, hookMascot, HookTimes } from "./PhoneHook";

// ---------- Maskottchen-Regie: (Zeit, x-Position, Stimmung) ----------
export type Mood = "idle" | "worried" | "happy" | "surprised" | "think" | "wave" | "type";
export type Key = [number, number, Mood];

const WALK = 0.6; // Sekunden für einen Positionswechsel

const stateAt = (keys: Key[], t: number) => {
  let i = 0;
  keys.forEach(([k], n) => { if (t >= k) i = n; });
  const [k0, x0, mood] = keys[i];
  const prevX = i > 0 ? keys[i - 1][1] : x0;
  const p = Math.min(1, Math.max(0, (t - k0) / WALK));
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const walking = prevX !== x0 && p < 1;
  return { x: prevX + (x0 - prevX) * e, mood, since: t - k0, walking, dir: Math.sign(x0 - prevX) };
};

const animate = (keys: Key[], t: number): { face: Face; pose: Pose; x: number } => {
  const { x, mood, since, walking, dir } = stateAt(keys, t);
  const blink = (t % 3.1) > 2.96 ? 1 : 0;
  const face: Face = { blink, brow: 0.15, worry: 0.1, mouthOpen: 0.3, lookX: Math.sin(t * 1.1) * 0.6 };
  const pose: Pose = { ry: Math.sin(t * 0.9) * 0.25, rx: 0.06, squash: 1, legPhase: 0, y: Math.sin(t * 2.4) * 0.03 };
  if (walking) {
    pose.legPhase = t * 16;
    pose.ry = dir * 0.7;
    pose.y = Math.abs(Math.sin(t * 16)) * 0.08;
    face.lookX = dir;
  } else if (mood === "worried") {
    face.worry = 1; face.brow = -0.2; face.mouthOpen = 0.15;
    pose.ry = Math.sin(t * 14) * 0.28 * Math.max(0, 1 - since / 1.6);
  } else if (mood === "happy") {
    const hop = Math.abs(Math.sin(since * 7));
    pose.y = hop * 0.45;
    pose.squash = 1 + (hop < 0.15 ? -0.12 : 0.04);
    face.brow = 0.6; face.mouthOpen = 0.9; face.worry = 0;
    pose.waveL = 0.5; pose.waveR = 0.5;
  } else if (mood === "surprised") {
    face.brow = 1; face.mouthOpen = 1; face.worry = 0.2;
    pose.squash = 1 + Math.exp(-since * 6) * Math.sin(since * 30) * 0.08;
    pose.y = Math.exp(-since * 5) * 0.3;
  } else if (mood === "think") {
    face.worry = 0.6; face.brow = 0.3; face.mouthOpen = 0.12;
    face.lookX = Math.sin(t * 2) ; pose.ry = -0.35 * Math.sign(x || 1);
  } else if (mood === "wave") {
    pose.waveR = 0.95 + Math.sin(since * 12) * 0.35;
    face.brow = 0.5; face.mouthOpen = 0.7;
  } else if (mood === "type") {
    pose.rx = 0.22; pose.y = Math.abs(Math.sin(t * 18)) * 0.03;
    pose.waveL = 0.25 + Math.abs(Math.sin(t * 18)) * 0.15; pose.waveR = 0.25 + Math.abs(Math.cos(t * 18)) * 0.15;
    face.lookX = 0; face.mouthOpen = 0.2;
  }
  return { face, pose, x };
};

export const Stage3D: React.FC<{ t: number; width: number; height: number; keys: Key[]; enter?: number; headset?: number; hook?: HookTimes }> = ({ t, width, height, keys, enter = 0, headset = 0, hook }) => {
  const { face, pose, x } = animate(keys, t);
  const drop = t < enter ? 0 : Math.min(1, (t - enter) / 0.45);
  const fall = (1 - drop) * (1 - drop) * 9;
  const MY = -0.5, S = 0.55;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 0.2, 15] }} gl={{ alpha: true, antialias: true }} shadows>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 9, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <directionalLight position={[-3, 2, 9]} intensity={0.9} color="#FFF4EC" />
      <directionalLight position={[2, 3, -6]} intensity={1.4} color="#FFE2D2" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 4]} scale={[10, 4, 1]} rotation={[-Math.PI / 3, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} scale={[4, 6, 1]} rotation={[0, Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#FFD9C6" position={[6, 0, 3]} scale={[4, 6, 1]} rotation={[0, -Math.PI / 3, 0]} />
      </Environment>

      {/* Deko-Sterne an den Rändern (außerhalb der Textzonen) */}
      <Star3D position={[-2.35, 4.75, -3]} rotation={[0.2, 0.25, t * 0.06]} scale={2.0} depth={0.18} />
      <Star3D position={[2.45, -5.1, -3]} rotation={[-0.2, -0.3, -t * 0.05]} scale={2.2} depth={0.18} />

      {hook && <PhoneHook t={t} T={hook} />}
      {(() => {
        // Während des Hooks fliegt das Maskottchen aus dem Hörer, danach normale Regie
        if (hook && t < hook.land) {
          const h = hookMascot(t, hook, [0, MY, 0.6], S);
          if (!h.show) return null;
          return <Mascot position={h.pos} scale={h.s} pose={{ ...pose, y: 0, ry: h.ry, squash: 1, waveR: 0.6 }} face={{ ...face, brow: 0.8, mouthOpen: 1 }} headset={headset} />;
        }
        const sq = hook ? hookMascot(t, hook, [0, MY, 0.6], S).squash : 1;
        return <Mascot position={[x, MY + fall + (pose.y ?? 0) * S, 0.6]} scale={S} pose={{ ...pose, y: 0, squash: (pose.squash ?? 1) * sq }} face={face} headset={headset} />;
      })()}
      <ContactShadows position={[x * 0.98, MY - 1.25 * S - 0.02, 0.6]} opacity={0.42 * drop * (hook && t < hook.land ? 0 : 1)} scale={4} blur={2.4} far={2} resolution={512} color="#5a3a2a" />
    </ThreeCanvas>
  );
};
