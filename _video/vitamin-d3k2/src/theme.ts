import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { spring, interpolate, Easing } from "remotion";

const fredoka = loadFredoka("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const nunito = loadNunito("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] });

export const HEAD = fredoka.fontFamily; // runde, freundliche Überschriften
export const FONT = nunito.fontFamily; // Fließtext, Untertitel

// ---------- Markenfarben: Pfirsich-Orange + Rosa ----------
export const C = {
  peach: "#FFA877", // Pfirsich-Orange (mittelhell) – Sunny / D3
  peachLight: "#FFC9A3", // helles Pfirsich
  peachSoft: "#FFE6D4",
  peachDeep: "#F08A55",
  pink: "#F59BB0", // Rosa – Kay / K2
  pinkLight: "#FCD3DD", // helles Rosa
  pinkSoft: "#FDEBEF",
  pinkDeep: "#E3708D",
  cream: "#FFF8F1",
  ink: "#3A2A26", // warmes Dunkelbraun statt Schwarz
  mid: "#8A716A",
  gray: "#C9B8B1",
  sage: "#A9C98F",
  sageDeep: "#7FA86A",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ---------- Zeit-Helfer ----------
export const sp = (t: number, at: number, damping = 13, stiffness = 170) =>
  t < at ? 0 : spring({ frame: (t - at) * FPS, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

export const lin = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const pop = (p: number, fromScale = 0.6, dy = 40): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.8),
  transform: `translateY(${(1 - p) * dy}px) scale(${fromScale + (1 - fromScale) * p})`,
});
