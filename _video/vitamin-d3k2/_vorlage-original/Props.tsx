import React, { useMemo } from "react";
import * as THREE from "three";

// Claude-Stern als echte 3D-Form (extrudiert, abgerundete Kanten)
const RAYS = [1, 0.8, 0.95, 0.76, 1, 0.84, 0.93, 0.78, 0.98, 0.82, 0.9, 0.77];
const starShapes = () =>
  RAYS.map((len, i) => {
    const a = (i / RAYS.length) * Math.PI * 2 + (i % 2 ? 0.06 : -0.04);
    const L = len, w0 = 0.085, w1 = 0.05;
    const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;
    const s = new THREE.Shape();
    s.moveTo(px * w0, py * w0);
    s.lineTo(ux * L + px * w1, uy * L + py * w1);
    s.quadraticCurveTo(ux * (L + w1), uy * (L + w1), ux * L - px * w1, uy * L - py * w1);
    s.lineTo(-px * w0, -py * w0);
    s.lineTo(px * w0, py * w0);
    return s;
  });

export const Star3D: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; color?: string; depth?: number }> = ({ position, rotation, scale = 1, color = "#DD7A55", depth = 0.12 }) => {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(starShapes(), { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.022, bevelSegments: 4, curveSegments: 8 });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [depth]);
  return (
    <mesh geometry={geo} position={position} rotation={rotation} scale={scale} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.45} clearcoat={0.4} clearcoatRoughness={0.3} />
    </mesh>
  );
};

// Runder Keramik-Button mit abgerundeter Kante (für Logos)
export const LogoDisc: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; children?: React.ReactNode }> = ({ position, rotation = [0, 0, 0], scale = 1, children }) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const R = 1, T = 0.18, r = 0.16;
    // Profil: Oberseite → obere Rundung → Rand → untere Rundung → Unterseite (Lathe dreht es zur Scheibe)
    pts.push(new THREE.Vector2(0, T));
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI / 2 - (i / 10) * (Math.PI / 2);
      pts.push(new THREE.Vector2(R - r + Math.cos(a) * r, T - r + Math.sin(a) * r));
    }
    for (let i = 0; i <= 10; i++) {
      const a = -(i / 10) * (Math.PI / 2);
      pts.push(new THREE.Vector2(R - r + Math.cos(a) * r, -T + r + Math.sin(a) * r));
    }
    pts.push(new THREE.Vector2(0, -T));
    pts.reverse();
    const g = new THREE.LatheGeometry(pts, 96);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#F7F6F3" roughness={0.32} clearcoat={0.8} clearcoatRoughness={0.25} />
      </mesh>
      <group position={[0, 0, 0.2]}>{children}</group>
    </group>
  );
};
