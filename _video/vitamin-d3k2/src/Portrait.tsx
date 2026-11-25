import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { Drop } from "./Sunny";
import { C } from "./theme";

export const Lights: React.FC = () => (
  <>
    <ambientLight intensity={0.8} />
    <directionalLight position={[4, 8, 7]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
    <directionalLight position={[-4, 2, 8]} intensity={0.8} color="#FFF1E6" />
    <directionalLight position={[0, 3, -6]} intensity={1.6} color="#FFD9C2" />
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={3} position={[0, 6, 4]} scale={[10, 4, 1]} rotation={[-Math.PI / 3, 0, 0]} />
      <Lightformer form="rect" intensity={1.5} color="#FFE7D6" position={[-6, 1, 3]} scale={[4, 6, 1]} rotation={[0, Math.PI / 3, 0]} />
      <Lightformer form="rect" intensity={1.2} color="#FFD3DD" position={[6, 0, 3]} scale={[4, 6, 1]} rotation={[0, -Math.PI / 3, 0]} />
    </Environment>
  </>
);

export const Portrait: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF1E6" }}>
    <ThreeCanvas width={1200} height={900} camera={{ fov: 30, position: [0, 0.3, 11] }} gl={{ alpha: true, antialias: true }} shadows flat>
      <Lights />
      <group position={[-1.5, 0, 0]}><Drop t={1} color={C.peach} colorDark={C.peachDeep} sheen="#FFE0C8" rays={1} face={{ mouth: 0.7 }} pose={{ armR: 0.9 }} /></group>
      <group position={[1.7, -0.25, 0]} scale={0.78}><Drop t={1} color={C.pink} colorDark={C.pinkDeep} sheen="#FFE3EA" hat={1} face={{ worry: 0.6, brow: 0.5 }} pose={{ armL: 0.6 }} /></group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.4} scale={10} blur={2.4} far={2} color="#7a4a3a" />
    </ThreeCanvas>
  </AbsoluteFill>
);
