import React from "react";
import { RoundedBox } from "@react-three/drei";

// 3D-Hook: klingelndes Tischtelefon, Hand greift den Hörer, Maskottchen springt heraus.
// Alle Zeiten kommen als Props (frame-genau für Remotion).

export type HookTimes = { enter: number; grab: number; lift: number; pop: number; land: number; out: number };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const p = clamp01(x); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const back = (x: number) => { const p = clamp01(x), c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

const cream = (c = "#F4EFE8") => <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.2} />;
const dark = (c = "#2A2725") => <meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.15} />;
const skin = <meshPhysicalMaterial color="#E9B48F" roughness={0.55} clearcoat={0.25} sheen={0.5} sheenColor="#FFD9C4" />;

// Hörer (Griff + Hör- und Sprechmuschel)
const Handset: React.FC = () => (
  <group>
    <RoundedBox args={[2.3, 0.3, 0.42]} radius={0.14} smoothness={4} castShadow>{dark()}</RoundedBox>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 1.02, -0.2, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.34, 0.3, 0.34, 40]} />{dark()}</mesh>
        <mesh position={[0, -0.175, 0]}><cylinderGeometry args={[0.24, 0.24, 0.02, 32]} /><meshStandardMaterial color="#DD7A55" roughness={0.5} /></mesh>
      </group>
    ))}
  </group>
);

// Tischtelefon (Gehäuse, Wählscheibe, Gabel)
const PhoneBase: React.FC = () => (
  <group>
    <RoundedBox args={[2.5, 0.85, 1.7]} radius={0.28} smoothness={5} castShadow receiveShadow>{cream()}</RoundedBox>
    <RoundedBox args={[1.9, 0.3, 1.3]} radius={0.14} smoothness={4} position={[0, 0.5, -0.05]} castShadow>{cream("#EDE6DC")}</RoundedBox>
    {[-0.85, 0.85].map((x) => (
      <RoundedBox key={x} args={[0.32, 0.32, 0.5]} radius={0.1} smoothness={3} position={[x, 0.72, -0.05]}>{cream("#E4DCD0")}</RoundedBox>
    ))}
    <group position={[0, 0.0, 0.86]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.46, 0.46, 0.08, 48]} /><meshPhysicalMaterial color="#DD7A55" roughness={0.4} clearcoat={0.6} /></mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 1.6 + 0.6;
        return <mesh key={i} position={[Math.cos(a) * 0.32, 0.05, Math.sin(a) * 0.32]}><cylinderGeometry args={[0.055, 0.055, 0.04, 16]} /><meshStandardMaterial color="#F4EFE8" /></mesh>;
      })}
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.13, 0.13, 0.03, 24]} /><meshStandardMaterial color="#F4EFE8" /></mesh>
    </group>
  </group>
);

// Hand im Knet-Stil (greift von oben)
const Hand: React.FC<{ grip: number }> = ({ grip }) => (
  <group>
    <RoundedBox args={[0.95, 1.0, 0.38]} radius={0.17} smoothness={4} castShadow>{skin}</RoundedBox>
    {[-0.34, -0.11, 0.12, 0.35].map((x, i) => (
      <group key={i} position={[x, -0.5, 0.05]} rotation={[0.25 + grip * 1.15, 0, 0]}>
        <RoundedBox args={[0.2, 0.62 - Math.abs(i - 1.5) * 0.06, 0.22]} radius={0.09} smoothness={3} position={[0, -0.28, 0]} castShadow>{skin}</RoundedBox>
      </group>
    ))}
    <group position={[-0.5, -0.15, 0.1]} rotation={[0.3 * grip, 0, 0.75 - grip * 0.35]}>
      <RoundedBox args={[0.22, 0.52, 0.24]} radius={0.1} smoothness={3} position={[0, -0.22, 0]} castShadow>{skin}</RoundedBox>
    </group>
    {/* Ärmel */}
    <RoundedBox args={[1.05, 1.1, 0.6]} radius={0.2} smoothness={4} position={[0.05, 1.0, -0.02]} castShadow>
      <meshPhysicalMaterial color="#DD7A55" roughness={0.6} sheen={0.4} />
    </RoundedBox>
  </group>
);

// Klingel-Ringe
const Rings: React.FC<{ t: number; until: number }> = ({ t, until }) => {
  if (t > until + 0.2) return null;
  return (
    <>
      {[0, 1, 2].map((k) => {
        const ph = ((t * 2.8 + k / 3) % 1);
        const fade = t > until ? Math.max(0, 1 - (t - until) / 0.2) : 1;
        return (
          <mesh key={k} position={[0, 0.3, -0.2]} rotation={[Math.PI / 2.4, 0, 0]} scale={1 + ph * 2.2}>
            <torusGeometry args={[1.0, 0.03, 8, 64]} />
            <meshBasicMaterial color="#DD7A55" transparent opacity={(1 - ph) * 0.8 * fade} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

// Gesamte Hook-Szene + Maskottchen-Flugbahn
export const PHONE_POS: [number, number, number] = [0.15, 1.0, 0];
const LIFT = 1.0, TILT = -0.3, REST_Y = 0.82;
export const hookMascot = (t: number, T: HookTimes, landPos: [number, number, number], landScale: number) => {
  if (t < T.pop) return { show: false, pos: landPos, s: 0, ry: 0, squash: 1 };
  const f = clamp01((t - T.pop) / (T.land - T.pop));
  // Startpunkt = Hörmuschel des angehobenen Hörers (gleiche Pose wie im Hook)
  const sx = PHONE_POS[0] + 0.5 - 1.02 * Math.cos(TILT), sy = PHONE_POS[1] + REST_Y + LIFT - 1.02 * Math.sin(TILT) - 0.35;
  const x = sx + (landPos[0] - sx) * f;
  const y = sy + (landPos[1] - sy) * f + Math.sin(f * Math.PI) * 0.45;
  const z = landPos[2] + Math.sin(f * Math.PI) * 3.2; // springt auf die Kamera zu
  const s = landScale * (0.15 + 0.85 * back(Math.min(1, f * 2.2)));
  const ry = (1 - ease(f)) * Math.PI * 2;
  const after = t - T.land;
  const squash = after > 0 ? 1 - Math.exp(-after * 8) * Math.sin(after * 26) * 0.2 : 1;
  return { show: true, pos: [x, y, z] as [number, number, number], s, ry, squash };
};

export const PhoneHook: React.FC<{ t: number; T: HookTimes }> = ({ t, T }) => {
  if (t > T.out + 0.6) return null;
  const ringing = t < T.grab;
  const shake = ringing ? Math.sin(t * 46) : 0;
  // Hand: kommt von oben rechts, greift, hebt
  const inP = ease((t - T.enter) / (T.grab - T.enter));
  const liftP = ease((t - T.lift) / (T.pop + 0.15 - T.lift));
  const outP = ease((t - T.out) / 0.5);
  const grip = clamp01((t - T.grab + 0.08) / 0.12);
  const hsX = liftP * 0.5 + outP * 4.0, hsY = REST_Y + liftP * LIFT + outP * 3.0, hsRz = liftP * TILT - outP * 0.4;
  const handX = (1 - inP) * 3.8 + hsX + 0.05, handY = (1 - inP) * 1.2 + hsY + 0.75;
  const baseOut = ease((t - T.out) / 0.35);
  return (
    <group position={PHONE_POS}>
      <group scale={Math.max(0.001, 1 - baseOut)} rotation={[0.12, -0.18, shake * 0.05]}>
        <PhoneBase />
        <Rings t={t} until={T.grab} />
      </group>
      {/* Hörer liegt auf und wackelt beim Klingeln, wird dann angehoben */}
      <group position={[hsX, hsY + (ringing ? Math.abs(shake) * 0.06 : 0), -0.05]} rotation={[0.12, -0.18, hsRz + shake * 0.06]}>
        <Handset />
      </group>
      {t > T.enter && (
        <group position={[handX, handY, 0.1]} rotation={[0.15, -0.2, hsRz - 0.15]} scale={1.3}>
          <Hand grip={grip} />
        </group>
      )}
    </group>
  );
};
