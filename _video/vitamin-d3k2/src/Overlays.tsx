import React from "react";
import { random } from "remotion";
import { C, FONT, HEAD, sp, lin, pop } from "./theme";

// ---------- Icons (eigene, schlichte SVGs) ----------
export const Ico: React.FC<{ n: string; s?: number; c?: string }> = ({ n, s = 64, c = "#fff" }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const p: Record<string, React.ReactNode> = {
    sun: (<><circle cx="12" cy="12" r="4.5" {...st} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="12" y1="2.5" x2="12" y2="5" {...st} transform={`rotate(${a} 12 12)`} />)}</>),
    hand: (<path {...st} d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />),
    bone: (<path {...st} d="M17 10c.7-.7 1.7-.7 2.5 0a2 2 0 0 0 0-3 2 2 0 0 0-2.5-2.5 2 2 0 0 0-3 0c.7.8.7 1.8 0 2.5L7 14c-.7.7-1.7.7-2.5 0a2 2 0 0 0 0 3 2 2 0 0 0 2.5 2.5 2 2 0 0 0 3 0c-.7-.8-.7-1.8 0-2.5Z" />),
    muscle: (<path {...st} d="M4 18c2-1 3.5-3.5 3.5-7 0-2 .5-4.5 2.5-6l2 1.5-1 2.5 2.5.5c2.5.5 5 2.5 6 5 .8 2-.5 4-2.5 4.5-3 .8-6 .2-8-1-1.5 1-3 1.5-5 0Z" />),
    shield: (<><path {...st} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path {...st} d="m9 12 2 2 4-4" /></>),
    drop: (<path {...st} d="M12 2.7S6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-11.3-6-11.3Z" />),
    plate: (<><circle cx="12" cy="12" r="8" {...st} /><circle cx="12" cy="12" r="4.5" {...st} /><path {...st} d="M2 4v5M4 4v5M3 9v11M22 4c-1.5 1-2 3-2 6h2v10" /></>),
    bulb: (<path {...st} d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />),
    check: (<path {...st} strokeWidth={3.4} d="M20 6 9 17l-5-5" />),
    cloud: (<path {...st} d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />),
    leaf: (<><path {...st} d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" /><path {...st} d="M2 21c0-3 1.9-5.4 5.1-6" /></>),
    nosugar: (<><rect x="5" y="7" width="14" height="12" rx="2" {...st} /><path {...st} d="M3 3l18 18" /></>),
    gift: (<><rect x="3" y="8" width="18" height="4" rx="1" {...st} /><path {...st} d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>),
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>{p[n]}</svg>;
};

export const Badge: React.FC<{ n: string; bg: string; s?: number }> = ({ n, bg, s = 96 }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.32, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 ${s * 0.12}px ${s * 0.22}px -${s * 0.08}px rgba(160,80,60,0.45), inset 0 ${s * 0.04}px 0 rgba(255,255,255,0.45)`, flexShrink: 0 }}>
    <Ico n={n} s={s * 0.56} />
  </div>
);

// ---------- Karte mit Ein- und Ausflug (Wisch-Übergang mit Unschärfe) ----------
export const Fly: React.FC<{ t: number; inAt: number; outAt: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ t, inAt, outAt, children, style, from = 0.6 }) => {
  if (t < inAt - 0.01 || t > outAt + 0.4) return null;
  const p = sp(t, inAt, 12, 180);
  const o = lin(t, outAt, outAt + 0.3);
  return (
    <div style={{ position: "absolute", ...style, ...pop(p, from, 60), ...(o > 0 ? { transform: `translateX(${-o * 1100}px) scale(${1 - o * 0.1}) rotate(${-o * 6}deg)`, filter: `blur(${o * 14}px)`, opacity: 1 - o * 0.6 } : {}) }}>
      {children}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 48, padding: 10, background: "linear-gradient(180deg,#FFFFFF,#FFE9DE)", boxShadow: "0 50px 70px -28px rgba(170,90,60,0.45), 0 14px 24px rgba(170,90,60,0.12)" }}>
    <div style={{ borderRadius: 40, background: "#FFFFFF", padding: "34px 40px", fontFamily: FONT, color: C.ink, ...style }}>{children}</div>
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; c?: string; fs?: number; style?: React.CSSProperties }> = ({ children, bg = "#fff", c = C.ink, fs = 40, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: fs * 0.35, padding: `${fs * 0.28}px ${fs * 0.7}px`, borderRadius: 999, background: bg, color: c, fontFamily: FONT, fontWeight: 900, fontSize: fs, boxShadow: "0 16px 30px -12px rgba(170,90,60,0.5)", whiteSpace: "nowrap", ...style }}>{children}</div>
);

// Großes Wort, das reinknallt (fällt groß rein, Feder)
export const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; size: number; color?: string; y: number; outAt?: number; rot?: number }> = ({ t, at, children, size, color = C.peachDeep, y, outAt = 999, rot = -3 }) => {
  if (t < at) return null;
  const p = sp(t, at, 11, 210);
  const o = lin(t, outAt, outAt + 0.25);
  const sc = 2.2 - 1.2 * p;
  return (
    <div style={{ position: "absolute", left: 60, width: 880, top: y, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - o), transform: `scale(${sc * (1 - o * 0.3)}) rotate(${rot * p}deg)` }}>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", letterSpacing: -size * 0.01, lineHeight: 1, WebkitTextStroke: `${size * 0.06}px #FFFFFF`, paintOrder: "stroke fill", filter: "drop-shadow(0 14px 18px rgba(170,80,50,0.35))" }}>{children}</div>
    </div>
  );
};

// Konfetti in Markenfarben
export const Confetti: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at || t > at + 3) return null;
  const k = t - at;
  return (
    <>
      {Array.from({ length: 70 }).map((_, i) => {
        const a = random(`ca${i}`) * Math.PI - Math.PI; // nach oben
        const v = 900 + random(`cv${i}`) * 900;
        const x = 540 + Math.cos(a) * v * k;
        const y = 820 + Math.sin(a) * v * k + 1400 * k * k;
        const col = [C.peach, C.pink, "#FFD36E", C.pinkLight, C.peachLight][i % 5];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 12 + (i % 3) * 6, borderRadius: 4, background: col, transform: `rotate(${k * 600 * (i % 2 ? 1 : -1) + i * 30}deg)`, opacity: 1 - Math.max(0, k - 2) }} />;
      })}
    </>
  );
};

// Gummy-Glas (2D), fällt auf die Arbeitsplatte
export const Jar: React.FC<{ t: number; at: number; x: number; bottom: number }> = ({ t, at, x, bottom }) => {
  if (t < at) return null;
  const k = t - at;
  const fall = Math.min(1, k / 0.42);
  const y = bottom - 340 - (1 - fall * fall) * 1500;
  const land = k > 0.42 ? Math.exp(-(k - 0.42) * 7) * Math.sin((k - 0.42) * 30) : 0;
  const sq = 1 - land * 0.12;
  const gummies = Array.from({ length: 16 }).map((_, i) => ({ x: 30 + (i % 4) * 46 + (Math.floor(i / 4) % 2) * 22, y: 250 - Math.floor(i / 4) * 44, c: i % 3 === 0 ? C.pink : i % 3 === 1 ? C.peach : C.peachLight, r: (i * 47) % 40 - 20 }));
  return (
    <div style={{ position: "absolute", left: x - 130, top: y, width: 260, height: 340, transform: `scale(${1 / sq}, ${sq})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: -14, height: 26, borderRadius: "50%", background: "rgba(150,70,40,0.25)", filter: "blur(6px)", opacity: fall }} />
      <svg width={260} height={340} viewBox="0 0 260 340" style={{ position: "absolute", inset: 0 }}>
        <rect x={34} y={0} width={192} height={52} rx={18} fill={C.pinkDeep} />
        <rect x={34} y={8} width={192} height={10} rx={5} fill="#FFFFFF" opacity={0.3} />
        <rect x={14} y={48} width={232} height={290} rx={46} fill="#FFFFFF" opacity={0.75} />
        {gummies.map((g, i) => (
          <g key={i} transform={`translate(${g.x + 12},${g.y + 40}) rotate(${g.r})`}>
            <path d="M0,-26 C14,-10 22,0 22,10 A22,22 0 0 1 -22,10 C-22,0 -14,-10 0,-26 Z" fill={g.c} />
            <ellipse cx={-7} cy={4} rx={5} ry={8} fill="#FFFFFF" opacity={0.5} />
          </g>
        ))}
        <rect x={40} y={150} width={180} height={100} rx={22} fill="#FFFFFF" />
        <text x={130} y={196} textAnchor="middle" fontFamily={HEAD} fontWeight={700} fontSize={40} fill={C.peachDeep}>D3 + K2</text>
        <text x={130} y={232} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.pinkDeep}>Gummies</text>
        <rect x={30} y={66} width={20} height={250} rx={10} fill="#FFFFFF" opacity={0.55} />
      </svg>
    </div>
  );
};

// Platzhalter-Silhouette: "Wo ist K2?"
export const GhostDrop: React.FC<{ t: number; at: number; outAt: number; x: number; y: number }> = ({ t, at, outAt, x, y }) => {
  if (t < at || t > outAt + 0.3) return null;
  const p = sp(t, at, 10, 200);
  const o = lin(t, outAt, outAt + 0.25);
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - 270, width: 220, height: 270, opacity: (1 - o) * Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p}) rotate(${Math.sin(t * 5) * 4}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={220} height={270} viewBox="0 0 220 270">
        <path d="M110,12 C150,70 196,120 196,170 A86,86 0 0 1 24,170 C24,120 70,70 110,12 Z" fill="rgba(255,255,255,0.55)" stroke={C.pinkDeep} strokeWidth={7} strokeDasharray="18 14" />
        <text x={110} y={200} textAnchor="middle" fontFamily={HEAD} fontWeight={700} fontSize={64} fill={C.pinkDeep}>K2?</text>
      </svg>
    </div>
  );
};
