import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Mascot } from "./Mascot";

// Freigestelltes Maskottchen (transparent) für PDFs/Thumbnails
export const MascotPortrait: React.FC = () => (
  <AbsoluteFill>
    <ThreeCanvas width={1200} height={900} camera={{ fov: 30, position: [0, 0.4, 11] }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} shadows>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 9, 7]} intensity={2.4} castShadow />
      <directionalLight position={[-3, 2, 9]} intensity={0.9} color="#FFF4EC" />
      <directionalLight position={[2, 3, -6]} intensity={1.4} color="#FFE2D2" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 4]} scale={[10, 4, 1]} rotation={[-Math.PI / 3, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} scale={[4, 6, 1]} rotation={[0, Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#FFD9C6" position={[6, 0, 3]} scale={[4, 6, 1]} rotation={[0, -Math.PI / 3, 0]} />
      </Environment>
      <Mascot position={[0, 0.3, 0]} scale={1.1} pose={{ ry: -0.32, rx: 0.08, waveR: 0.95 }} face={{ brow: 0.6, mouthOpen: 0.9, worry: 0, lookX: 0.3 }} />
      <ContactShadows position={[0, -1.08, 0]} opacity={0.45} scale={8} blur={2.6} far={3} resolution={512} color="#5a3a2a" />
    </ThreeCanvas>
  </AbsoluteFill>
);
