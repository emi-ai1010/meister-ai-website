import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C } from "./theme";

export const GROUND = 1240; // y-Linie, auf der die Figuren stehen

// ---------- Hilfen ----------
const wave = (w: number, base: number, amp: number, seed: number, step = 40) => {
  let d = `M0,1920 L0,${base}`;
  for (let x = 0; x <= w; x += step) {
    const y = base - amp * (0.55 * Math.sin(x / 260 + seed) + 0.3 * Math.sin(x / 120 + seed * 2.3) + 0.15 * Math.sin(x / 61 + seed * 5));
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${w},1920 Z`;
};

const Cloud: React.FC<{ x: number; y: number; s: number; c?: string }> = ({ x, y, s, c = "#FFFFFF" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={20} rx={120} ry={38} fill={c} />
    <circle cx={-50} cy={0} r={46} fill={c} />
    <circle cx={10} cy={-22} r={62} fill={c} />
    <circle cx={70} cy={4} r={42} fill={c} />
  </g>
);

const Flower: React.FC<{ x: number; y: number; s: number; c: string; t: number; ph: number }> = ({ x, y, s, c, t, ph }) => (
  <g transform={`translate(${x},${y}) rotate(${Math.sin(t * 2 + ph) * 6}) scale(${s})`}>
    <path d="M0,0 Q4,22 0,46" stroke="#6E9E5A" strokeWidth={4} fill="none" />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 11} cy={Math.sin(a) * 11} r={10} fill={c} />;
    })}
    <circle r={8} fill="#FFD36E" />
  </g>
);

export const SunDisc: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 110 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r * 2.4} fill="url(#sunGlow)" />
    <g transform={`rotate(${t * 12})`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-9} y={-(r + 58)} width={18} height={38} rx={9} fill="#FFC47A" transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <circle r={r} fill="#FFC27A" />
    <circle r={r * 0.82} fill="#FFD49A" />
  </g>
);

// ---------- Haus mit Fenster (Ziel des Sprungs) ----------
export const HOUSE_X = 2150; // Weltkoordinate (links)
export const WINDOW = { x: HOUSE_X + 250, y: 1040 }; // Fenstermitte in Weltkoordinaten
const House: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(${HOUSE_X},0)`}>
    <rect x={20} y={880} width={460} height={340} rx={18} fill="#FFE3D1" />
    <path d="M-10,900 L250,700 L510,900 Z" fill={C.pinkDeep} stroke={C.pinkDeep} strokeWidth={24} strokeLinejoin="round" />
    <rect x={360} y={730} width={50} height={110} rx={8} fill="#E9A07F" />
    <circle cx={385} cy={700 - ((t * 40) % 60)} r={14 + ((t * 40) % 60) / 6} fill="#FFFFFF" opacity={0.7 - ((t * 40) % 60) / 100} />
    {/* Tür */}
    <rect x={60} y={1030} width={110} height={190} rx={55} fill={C.peachDeep} />
    <circle cx={150} cy={1130} r={8} fill="#FFE6A8" />
    {/* Fenster (Ziel) */}
    <rect x={WINDOW.x - HOUSE_X - 85} y={WINDOW.y - 85} width={170} height={170} rx={24} fill="#FFFFFF" />
    <rect x={WINDOW.x - HOUSE_X - 72} y={WINDOW.y - 72} width={144} height={144} rx={16} fill="#FFE7A8" />
    <rect x={WINDOW.x - HOUSE_X - 4} y={WINDOW.y - 72} width={8} height={144} fill="#FFFFFF" />
    <rect x={WINDOW.x - HOUSE_X - 72} y={WINDOW.y - 4} width={144} height={8} fill="#FFFFFF" />
    {/* Blumenkasten */}
    <rect x={WINDOW.x - HOUSE_X - 95} y={WINDOW.y + 88} width={190} height={34} rx={10} fill={C.peachDeep} />
    {[-60, -20, 20, 60].map((dx, i) => (
      <circle key={i} cx={WINDOW.x - HOUSE_X + dx} cy={WINDOW.y + 84} r={16} fill={i % 2 ? C.pink : "#FFFFFF"} />
    ))}
  </g>
);

// ---------- Wiese ----------
export const Meadow: React.FC<{ t: number; pan: number; gloom: number }> = ({ t, pan, gloom }) => {
  const Wd = 4200;
  const flowers = Array.from({ length: 140 }).map((_, i) => {
    const y = 1215 + Math.pow(random(`fy${i}`), 1.4) * 700;
    return { x: random(`fx${i}`) * Wd, y, s: 0.55 + ((y - 1215) / 700) * 0.9, c: [C.pink, "#FFFFFF", C.peach, C.pinkLight][i % 4], ph: i };
  });
  const tufts = Array.from({ length: 90 }).map((_, i) => ({ x: random(`tx${i}`) * Wd, y: 1225 + random(`ty${i}`) * 680 }));
  const cloudDrift = t * 14;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFCFB4" />
            <stop offset="0.55" stopColor="#FFE9DA" />
            <stop offset="1" stopColor="#FFF6EE" />
          </linearGradient>
          <linearGradient id="skyGloom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8E96A6" />
            <stop offset="1" stopColor="#C9CDD4" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#FFE2B0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B4D693" />
            <stop offset="1" stopColor="#8DBB6E" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sky)" />
        <rect width={1080} height={1920} fill="url(#skyGloom)" opacity={gloom * 0.75} />
        <SunDisc x={250 - pan * 0.04} y={420 + gloom * 30} t={t} />
        {/* Wolken (Hintergrund) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = ((i * 420 + cloudDrift - pan * 0.15) % 2100 + 2100) % 2100 - 300;
          return <Cloud key={i} x={x} y={330 + (i % 3) * 140} s={0.8 + (i % 2) * 0.4} />;
        })}
        <g transform={`translate(${-pan * 0.25},0)`}><path d={wave(Wd, 1010, 70, 1)} fill={gloom > 0 ? mixHex("#D5E7BE", "#B5BFAF", gloom) : "#D5E7BE"} /></g>
        <g transform={`translate(${-pan * 0.5},0)`}><path d={wave(Wd, 1120, 50, 4)} fill={mixHex("#BFDB9E", "#A3B096", gloom)} /></g>
        <g transform={`translate(${-pan},0)`}>
          <House t={t} />
          <path d={wave(Wd, 1212, 10, 7, 30)} fill="url(#grass)" />
          {tufts.map((g, i) => (
            <path key={i} d={`M${g.x},${g.y} q-6,-22 -14,-30 M${g.x},${g.y} q2,-26 2,-36 M${g.x},${g.y} q8,-20 16,-28`} stroke="#79A85E" strokeWidth={4} fill="none" strokeLinecap="round" />
          ))}
          {flowers.map((f, i) => <Flower key={i} {...f} t={t} />)}
        </g>
        {/* Regenwolken + Niesel (Oktober bis März) */}
        {gloom > 0.01 && (
          <g opacity={gloom}>
            <Cloud x={230 + (1 - gloom) * -500} y={380} s={1.9} c="#9AA1AE" />
            <Cloud x={720 + (1 - gloom) * 500} y={330} s={1.6} c="#A9AFBA" />
            <Cloud x={470} y={250 - (1 - gloom) * 300} s={1.4} c="#B7BCC5" />
            {Array.from({ length: 60 }).map((_, i) => {
              const x = (random(`rx${i}`) * 1200 + t * 60) % 1200 - 60;
              const y = (random(`ry${i}`) * 1900 + t * 900) % 1900;
              return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 34} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />;
            })}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Küche ----------
export const Kitchen: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDE3E7" />
          <stop offset="1" stopColor="#FFEFE6" />
        </linearGradient>
        <pattern id="tiles" width="90" height="90" patternUnits="userSpaceOnUse">
          <rect width="90" height="90" fill="#F9C9D3" />
          <rect x="4" y="4" width="82" height="82" rx="10" fill="#FFF7F8" />
        </pattern>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC49B" />
          <stop offset="1" stopColor="#F2A274" />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="#FFF0C8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFF0C8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD2B8" />
          <stop offset="1" stopColor="#FFF0E4" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#FFE2B0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#wall)" />
      {/* Fenster mit Sonne */}
      <g>
        <rect x={60} y={250} width={400} height={520} rx={40} fill="#FFFFFF" />
        <rect x={80} y={270} width={360} height={480} rx={28} fill="url(#winSky)" />
        <svg x={80} y={270} width={360} height={480} viewBox="0 0 360 480">
          <SunDisc x={110} y={150} t={t} r={56} />
          <path d="M0,380 Q90,330 180,370 T360,360 L360,480 L0,480 Z" fill="#BFDB9E" />
          <path d="M0,420 Q120,390 240,420 T360,410 L360,480 L0,480 Z" fill="#A6CC86" />
        </svg>
        <rect x={255} y={270} width={10} height={480} fill="#FFFFFF" />
        <rect x={80} y={505} width={360} height={10} fill="#FFFFFF" />
        <rect x={40} y={760} width={440} height={30} rx={12} fill="#FFFFFF" />
        {/* Pflanze auf Fensterbank */}
        <rect x={360} y={705} width={70} height={58} rx={12} fill={C.pink} />
        {[-30, -10, 10, 30].map((a, i) => (
          <ellipse key={i} cx={395 + a * 0.8} cy={680} rx={12} ry={34} fill="#8CBF72" transform={`rotate(${a + Math.sin(t * 2 + i) * 4} 395 705)`} />
        ))}
      </g>
      {/* Regal mit Gläsern */}
      <g>
        <rect x={620} y={640} width={420} height={22} rx={10} fill="#F2A274" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${660 + i * 125},${560})`}>
            <rect x={0} y={0} width={90} height={80} rx={18} fill="#FFFFFF" opacity={0.9} />
            <rect x={6} y={24} width={78} height={50} rx={14} fill={[C.peachLight, C.pinkLight, "#FFE7A8"][i]} />
            <rect x={-4} y={-14} width={98} height={20} rx={8} fill={[C.pinkDeep, C.peachDeep, C.pink][i]} />
          </g>
        ))}
      </g>
      {/* Lampe */}
      <line x1={800} y1={0} x2={800} y2={170} stroke="#C98C74" strokeWidth={5} />
      <circle cx={800} cy={240} r={170} fill="url(#lampGlow)" />
      <path d="M730,230 Q800,140 870,230 Z" fill={C.peachDeep} />
      {/* Fliesen + Arbeitsplatte + Schränke */}
      <rect x={0} y={950} width={1080} height={270} fill="url(#tiles)" />
      <rect x={0} y={1205} width={1080} height={48} rx={6} fill="url(#wood)" />
      <rect x={0} y={1247} width={1080} height={10} fill="#E58D5E" opacity={0.6} />
      <rect x={0} y={1257} width={1080} height={663} fill="#FFE6D6" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 350} y={1300} width={320} height={560} rx={26} fill="#FFF3EA" stroke="#F7CFB8" strokeWidth={4} />
          <rect x={160 + i * 350} y={1330} width={60} height={14} rx={7} fill={C.peachDeep} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// Hex-Mischung für Farben
export const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const kk = Math.max(0, Math.min(1, k));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * kk).toString(16).padStart(2, "0")).join("");
};
