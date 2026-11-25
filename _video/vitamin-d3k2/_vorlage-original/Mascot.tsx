import React from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Zylinder zwischen zwei Punkten + Mikrofon-Kapsel am Ende
const MicBoom: React.FC<{ from: [number, number, number]; to: [number, number, number]; cap?: boolean }> = ({ from, to, cap = true }) => {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a), len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const mid = a.clone().add(b).multiplyScalar(0.5);
  return (
    <>
      <mesh position={mid.toArray()} quaternion={q}>
        <cylinderGeometry args={[0.035, 0.035, len, 12]} />
        <meshPhysicalMaterial color="#2A2725" roughness={0.4} />
      </mesh>
      <mesh position={to} scale={cap ? 1 : 0.35}>
        <sphereGeometry args={[0.11, 24, 16]} />
        <meshPhysicalMaterial color="#1B1210" roughness={0.6} />
      </mesh>
    </>
  );
};

// Realistisches Claude-Code-Maskottchen (Three.js). Alle Animationen kommen als Props (frame-genau für Remotion).
export type Face = { blink?: number; brow?: number; worry?: number; mouthOpen?: number; lookX?: number };
export type Pose = { y?: number; ry?: number; rx?: number; squash?: number; waveL?: number; waveR?: number; legPhase?: number };

const BODY = "#DE8663";
const BODY_DARK = "#C8714F";
const INK = "#1B1210";

const skin = (c: string) => (
  <meshPhysicalMaterial color={c} roughness={0.52} clearcoat={0.3} clearcoatRoughness={0.45} sheen={0.4} sheenColor="#FFD2BF" />
);
const gloss = (c: string) => <meshPhysicalMaterial color={c} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />;

export const Mascot: React.FC<{ face?: Face; pose?: Pose; position?: [number, number, number]; scale?: number; headset?: number }> = ({ face = {}, pose = {}, position = [0, 0, 0], scale = 1, headset = 0 }) => {
  const { blink = 0, brow = 0, worry = 0, mouthOpen = 0.3, lookX = 0 } = face;
  const { y = 0, ry = 0, rx = 0, squash = 1, waveL = 0, waveR = 0, legPhase = 0 } = pose;
  const W = 2.6, H = 1.7, D = 1.5, zf = D / 2;
  const eyeH = 0.34 * (1 - blink * 0.9);
  const sy = squash, sxz = 1 / Math.sqrt(squash);
  return (
    <group position={position} scale={scale}>
      <group position={[0, y, 0]} rotation={[rx, ry, 0]}>
        {/* Squash & Stretch um die Fußlinie */}
        <group position={[0, -1.25, 0]} scale={[sxz, sy, sxz]}>
          <group position={[0, 1.25, 0]}>
            <RoundedBox args={[W, H, D]} radius={0.16} smoothness={5} castShadow receiveShadow>{skin(BODY)}</RoundedBox>

            {/* Augen mit Glanzpunkt */}
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.48 + lookX * 0.06, 0.06, zf + 0.01]}>
                <RoundedBox args={[0.22, eyeH, 0.08]} radius={0.04} smoothness={3}>{gloss(INK)}</RoundedBox>
                {blink < 0.5 && (
                  <mesh position={[0.035, 0.07, 0.045]}>
                    <planeGeometry args={[0.075, 0.075]} />
                    <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
                  </mesh>
                )}
              </group>
            ))}

            {/* Augenbrauen */}
            {[-1, 1].map((s) => (
              <RoundedBox key={s} args={[0.46, 0.075, 0.06]} radius={0.03} smoothness={3}
                position={[s * 0.52, 0.44 + brow * 0.12, zf + 0.02]} rotation={[0, 0, s * (-0.08 + worry * 0.28)]}>
                {gloss(INK)}
              </RoundedBox>
            ))}

            {/* Wangen */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.86, -0.2, zf + 0.012]}>
                <planeGeometry args={[0.3, 0.1]} />
                <meshStandardMaterial color="#F4A6A0" transparent opacity={0.85} roughness={0.9} />
              </mesh>
            ))}

            {/* Mund */}
            <group position={[0, -0.3, zf + 0.012]}>
              <RoundedBox args={[0.28, 0.06 + mouthOpen * 0.14, 0.05]} radius={0.025} smoothness={3}>
                <meshStandardMaterial color="#3B1A12" roughness={0.6} />
              </RoundedBox>
              {mouthOpen > 0.2 && (
                <mesh position={[0, -0.02 - mouthOpen * 0.02, 0.03]}>
                  <planeGeometry args={[0.16, 0.04 + mouthOpen * 0.03]} />
                  <meshStandardMaterial color="#E9877E" roughness={0.7} />
                </mesh>
              )}
            </group>

            {/* Arme (Drehpunkt an der Schulter) */}
            {[[-1, waveL], [1, waveR]].map(([s, w]) => (
              <group key={s} position={[s * (W / 2 - 0.05), 0.05, 0]} rotation={[0, 0, s * w * 1.2]}>
                <RoundedBox args={[0.52, 0.44, 0.62]} radius={0.12} smoothness={4} position={[s * 0.24, 0, 0]} castShadow>{skin(BODY_DARK)}</RoundedBox>
              </group>
            ))}

            {/* Headset (für Voice-Agent-Themen), headset = 0..1 blendet es ein */}
            {headset > 0.01 && (
              <group position={[0, 0.42 + (1 - headset) * 1.2, 0]} scale={[1, 1, 1]}>
                <mesh scale={[1, 0.5, 1]}>
                  <torusGeometry args={[1.38, 0.075, 16, 64, Math.PI]} />
                  <meshPhysicalMaterial color="#2A2725" roughness={0.35} clearcoat={0.6} />
                </mesh>
                {[-1, 1].map((sd) => (
                  <mesh key={sd} position={[sd * 1.38, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.34, 0.34, 0.2, 32]} />
                    <meshPhysicalMaterial color="#2A2725" roughness={0.4} clearcoat={0.5} />
                  </mesh>
                ))}
                {[-1, 1].map((sd) => (
                  <mesh key={`r${sd}`} position={[sd * 1.49, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
                    <meshPhysicalMaterial color="#DD7A55" roughness={0.4} />
                  </mesh>
                ))}
                {/* Mikrofon-Arm vom rechten Ohr zum Mund (exakt zwischen zwei Punkten) */}
                <MicBoom from={[1.42, -0.2, 0.45]} to={[1.18, -0.62, 0.86]} cap={false} />
                <MicBoom from={[1.18, -0.62, 0.86]} to={[0.42, -0.74, 0.86]} />
              </group>
            )}

            {/* Beine */}
            {[-0.92, -0.32, 0.32, 0.92].flatMap((x, i) =>
              [-0.38, 0.38].map((z, k) => {
                const lift = Math.max(0, Math.sin(legPhase + i * 1.3 + k * Math.PI)) * 0.12;
                return (
                  <RoundedBox key={`${i}-${k}`} args={[0.28, 0.42, 0.28]} radius={0.08} smoothness={3}
                    position={[x, -H / 2 - 0.18 + lift, z]} castShadow>{skin(BODY_DARK)}</RoundedBox>
                );
              }),
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
