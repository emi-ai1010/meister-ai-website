import React, { useMemo } from "react";
import * as THREE from "three";

// ---------- Tropfen-Form (Lathe): Spitze oben, runder Bauch unten ----------
const N = 64;
const profile = (() => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * Math.PI; // 0 = Spitze oben, PI = Boden
    const x = 1.12 * Math.sin(th) * Math.pow(Math.sin(th / 2), 1.15);
    const y = Math.cos(th) * 1.08 - 0.02;
    pts.push(new THREE.Vector2(Math.max(0.0001, x), y));
  }
  return pts;
})();
// Radius des Körpers in Höhe y (für Gesicht auf der Oberfläche)
export const rAt = (y: number) => {
  let best = 0;
  for (let i = 1; i < profile.length; i++) {
    const a = profile[i - 1], b = profile[i];
    if ((a.y - y) * (b.y - y) <= 0) best = Math.max(best, a.x + ((y - a.y) / (b.y - a.y || 1)) * (b.x - a.x));
  }
  return best;
};

export type Face = { blink?: number; brow?: number; worry?: number; mouth?: number; smile?: number; lookX?: number; lookY?: number };
export type Pose = { squash?: number; armL?: number; armR?: number; tilt?: number; ry?: number };

const gummy = (c: string, sheen: string, glow = 0.18) => (
  <meshPhysicalMaterial color={c} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} sheen={0.6} sheenColor={sheen} emissive={c} emissiveIntensity={glow} />
);
const INK = "#3A211C";

// weiches Leuchten (radialer Verlauf) hinter Sunny
let _glow: THREE.Texture | null = null;
const glowTex = () => {
  if (_glow) return _glow;
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "rgba(255,226,180,0.95)"); r.addColorStop(0.5, "rgba(255,214,160,0.55)"); r.addColorStop(1, "rgba(255,214,160,0)");
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  _glow = new THREE.CanvasTexture(c); _glow.colorSpace = THREE.SRGBColorSpace;
  return _glow;
};

// Auf die Oberfläche setzen: Position (x,y) auf der Vorderseite, leicht nach außen gedreht
const onSurface = (x: number, y: number, out = 0.0): { pos: [number, number, number]; rot: [number, number, number] } => {
  const r = rAt(y);
  const z = Math.sqrt(Math.max(0.0001, r * r - x * x));
  return { pos: [x, y, z + out], rot: [0, Math.atan2(x, z), 0] };
};

export const Drop: React.FC<{
  t: number;
  color: string;
  colorDark: string;
  sheen: string;
  rays?: number; // 0..1 Sonnenstrahlen-Kranz
  hat?: number; // 0..1 Bauhelm (Kay)
  face?: Face;
  pose?: Pose;
}> = ({ t, color, colorDark, sheen, rays = 0, hat = 0, face = {}, pose = {} }) => {
  const { blink = 0, brow = 0, worry = 0, mouth = 0.2, smile = 1, lookX = 0, lookY = 0 } = face;
  const { squash = 1, armL = 0, armR = 0, tilt = 0, ry = 0 } = pose;
  const geo = useMemo(() => new THREE.LatheGeometry([...profile].reverse(), 96), []);
  const sxz = 1 / Math.sqrt(squash);
  const eyeY = 0.0, eyeX = 0.34;
  const mouthP = onSurface(0, -0.36, 0.005);
  return (
    <group rotation={[0, ry, tilt]}>
      {/* Squash & Stretch um den Boden */}
      <group position={[0, -1.1, 0]} scale={[sxz, squash, sxz]}>
        <group position={[0, 1.1, 0]}>
          <mesh geometry={geo} castShadow receiveShadow>{gummy(color, sheen, rays > 0.01 ? 0.32 : 0.2)}</mesh>

          {/* Sonnenstrahlen-Kranz: weiche, runde Strahlen + sanftes Leuchten */}
          {rays > 0.01 && (
            <group position={[0, -0.18, -0.5]} scale={rays}>
              <mesh>
                <circleGeometry args={[2.2, 64]} />
                <meshBasicMaterial map={glowTex()} transparent depthWrite={false} toneMapped={false} />
              </mesh>
              <group rotation={[0, 0, 0]} scale={1 + Math.sin(t * 2) * 0.02}>
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  const len = i % 2 ? 0.27 : 0.36;
                  const R = 1.18 + len * 0.55;
                  const deg = (a * 180) / Math.PI;
                  if (deg > 220 && deg < 320) return null; // unten (hinter den Füßen) keine Strahlen
                  return (
                    <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]} rotation={[0, 0, a - Math.PI / 2]} scale={[0.17, len, 0.07]}>
                      <sphereGeometry args={[1, 24, 16]} />
                      <meshPhysicalMaterial color={i % 2 ? "#FFD08A" : "#FFBA6E"} roughness={0.35} clearcoat={1} emissive="#FFB060" emissiveIntensity={0.35} />
                    </mesh>
                  );
                })}
              </group>
            </group>
          )}

          {/* Augen: glänzende Ovale mit Lichtpunkt */}
          {[-1, 1].map((s) => {
            const p = onSurface(s * eyeX + lookX * 0.05, eyeY + lookY * 0.04, -0.03);
            return (
              <group key={s} position={p.pos} rotation={p.rot}>
                <mesh scale={[0.12, 0.17 * (1 - blink * 0.92), 0.07]}>
                  <sphereGeometry args={[1, 32, 24]} />
                  <meshPhysicalMaterial color={INK} roughness={0.08} clearcoat={1} />
                </mesh>
                {blink < 0.5 && (
                  <mesh position={[0.035, 0.06, 0.07]}>
                    <circleGeometry args={[0.04, 20]} />
                    <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
                  </mesh>
                )}
              </group>
            );
          })}

          {/* Augenbrauen */}
          {[-1, 1].map((s) => {
            const p = onSurface(s * 0.36, 0.3 + brow * 0.07, 0.0);
            return (
              <group key={s} position={p.pos} rotation={[0, p.rot[1], s * (-0.12 + worry * 0.45)]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <capsuleGeometry args={[0.028, 0.15, 6, 12]} />
                  <meshPhysicalMaterial color={INK} roughness={0.2} />
                </mesh>
              </group>
            );
          })}

          {/* Wangen (rosa) */}
          {[-1, 1].map((s) => {
            const p = onSurface(s * 0.6, -0.2, 0.004);
            return (
              <mesh key={s} position={p.pos} rotation={p.rot} scale={[1.35, 0.8, 1]}>
                <circleGeometry args={[0.1, 28]} />
                <meshStandardMaterial color="#FF7F9C" transparent opacity={0.55} roughness={1} />
              </mesh>
            );
          })}

          {/* Mund: Lächeln (Bogen) oder offener Mund */}
          <group position={mouthP.pos} rotation={mouthP.rot}>
            {mouth < 0.25 ? (
              <mesh rotation={[0, 0, Math.PI]} scale={[1, smile, 1]}>
                <torusGeometry args={[0.12, 0.026, 10, 32, Math.PI]} />
                <meshPhysicalMaterial color={INK} roughness={0.3} />
              </mesh>
            ) : (
              <group>
                <mesh scale={[0.14, 0.05 + mouth * 0.11, 0.03]}>
                  <sphereGeometry args={[1, 28, 16]} />
                  <meshStandardMaterial color="#5A221C" roughness={0.6} />
                </mesh>
                <mesh position={[0, -0.025 - mouth * 0.03, 0.02]} scale={[0.08, 0.035, 0.02]}>
                  <sphereGeometry args={[1, 20, 12]} />
                  <meshStandardMaterial color="#FF8A9C" roughness={0.7} />
                </mesh>
              </group>
            )}
          </group>

          {/* Ärmchen (Drehpunkt an der Seite) */}
          {[[-1, armL], [1, armR]].map(([s, a]) => (
            <group key={s} position={[s * (rAt(-0.42) - 0.04), -0.42, 0.18]} rotation={[0, 0, s * (0.55 + a * 1.9)]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <capsuleGeometry args={[0.1, 0.24, 8, 16]} />
                {gummy(colorDark, sheen)}
              </mesh>
            </group>
          ))}

          {/* Füßchen */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.36, -1.08, 0.12]} scale={[0.2, 0.1, 0.26]} castShadow>
              <sphereGeometry args={[1, 24, 16]} />
              {gummy(colorDark, sheen)}
            </mesh>
          ))}

          {/* Bauhelm (Kay = Baumeisterin für die Knochen) */}
          {hat > 0.01 && (
            <group position={[0, 0.78 + (1 - hat) * 2.2, 0]} rotation={[-0.12, 0, 0.12]}>
              <mesh castShadow>
                <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial color="#FFC24B" roughness={0.25} clearcoat={1} />
              </mesh>
              <mesh position={[0, 0.01, 0.06]} scale={[1, 1, 1.12]}>
                <cylinderGeometry args={[0.55, 0.55, 0.05, 40]} />
                <meshPhysicalMaterial color="#FFB531" roughness={0.3} clearcoat={1} />
              </mesh>
              <mesh position={[0, 0.3, 0]} scale={[0.09, 0.14, 0.42]}>
                <sphereGeometry args={[1, 16, 12]} />
                <meshPhysicalMaterial color="#FFB531" roughness={0.3} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
