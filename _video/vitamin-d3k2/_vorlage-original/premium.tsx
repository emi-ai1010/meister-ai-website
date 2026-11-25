import React from "react";
import { FONT, MONO } from "./theme";
import { Icon, StarFlat } from "./ui";

// ---------- Farben des neuen Looks ----------
export const P = {
  ink: "#1C1A18",
  mid: "#6E6963",
  gray: "#B9B4AD",
  line: "#E7E3DD",
  orange: "#DD7A55",
  orangeDeep: "#C4603D",
  pink: "#E0457B",
  purple: "#8A4FD8",
  amber: "#F08A24",
  blue: "#3E7BF0",
  green: "#2FA36B",
  dark: "#141312",
};

// Weiße Karte mit dicker, plastischer Kante und tiefem Schatten
export const Bezel: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties; inner?: React.CSSProperties; r?: number }> = ({ children, dark, style, inner, r = 34 }) => (
  <div style={{ borderRadius: r + 10, padding: 10, background: "linear-gradient(180deg, #FFFFFF, #E8E4DE)", boxShadow: "0 50px 70px -24px rgba(70,45,25,0.38), 0 16px 26px rgba(70,45,25,0.12), inset 0 2px 0 #fff", ...style }}>
    <div style={{ borderRadius: r, background: dark ? P.dark : "#FFFFFF", overflow: "hidden", boxShadow: dark ? "inset 0 2px 14px rgba(0,0,0,0.6)" : "inset 0 0 0 1px rgba(0,0,0,0.04)", fontFamily: FONT, color: dark ? "#fff" : P.ink, ...inner }}>{children}</div>
  </div>
);

// App-Icons (plastisch, mit Glanz)
const iconBase = (size: number, bg: string): React.CSSProperties => ({
  width: size, height: size, borderRadius: size * 0.26, background: bg, position: "relative", overflow: "hidden",
  boxShadow: `0 ${size * 0.18}px ${size * 0.3}px -${size * 0.08}px rgba(70,40,20,0.45), inset 0 ${size * 0.03}px 0 rgba(255,255,255,0.45), inset 0 -${size * 0.05}px ${size * 0.08}px rgba(0,0,0,0.18)`,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
});
const Gloss: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: size * 0.5, background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))" }} />
);
export const InstaIcon: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <div style={iconBase(size, "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)")}>
    <Gloss size={size} />
    <div style={{ width: size * 0.58, height: size * 0.58, borderRadius: size * 0.17, border: `${size * 0.065}px solid #fff`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: size * 0.24, height: size * 0.24, borderRadius: "50%", border: `${size * 0.06}px solid #fff`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", right: size * 0.06, top: size * 0.06, width: size * 0.07, height: size * 0.07, borderRadius: "50%", background: "#fff" }} />
    </div>
  </div>
);
export const ClaudeIcon: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <div style={iconBase(size, `linear-gradient(160deg, #EA9070, ${P.orange} 55%, ${P.orangeDeep})`)}>
    <Gloss size={size} />
    <div style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))" }}><StarFlat s={size * 0.58} c="#FFFFFF" /></div>
  </div>
);
export const OttoIcon: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <div style={iconBase(size, "linear-gradient(180deg, #FFFFFF, #ECE9E4)")}>
    <div style={{ width: size * 0.56, height: size * 0.56, borderRadius: "50%", border: `${size * 0.075}px solid ${P.amber}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: size * 0.24, color: P.amber }}>O</div>
  </div>
);

// Kleine Kapitel-Pille oben ("01 / 05 · Reels, gerendert")
export const ChapterPill: React.FC<{ n: number; label: string; color: string; total?: number; style?: React.CSSProperties }> = ({ n, label, color, total = 5, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,0.92)", boxShadow: "0 12px 26px -10px rgba(70,45,25,0.35)", fontFamily: FONT, fontSize: 30, fontWeight: 700, color: P.ink, ...style }}>
    <div style={{ width: 22, height: 22, borderRadius: 6, background: color }} />
    <span style={{ fontFamily: MONO, color: P.gray, fontWeight: 600 }}>0{n} / 0{total}</span>
    {label}
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode; bg?: string; c?: string; style?: React.CSSProperties }> = ({ children, bg = "#fff", c = P.ink, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: bg, color: c, fontFamily: FONT, fontWeight: 700, fontSize: 28, boxShadow: "0 10px 22px -10px rgba(70,45,25,0.35)", ...style }}>{children}</div>
);

export const Check: React.FC<{ on: number; color?: string; size?: number }> = ({ on, color = P.purple, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", border: on > 0.5 ? "none" : `3px solid ${P.line}`, background: on > 0.5 ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * on})`, boxSizing: "border-box", flexShrink: 0 }}>
    {on > 0.5 && <Icon n="check" s={size * 0.62} c="#fff" w={3.4} />}
  </div>
);
