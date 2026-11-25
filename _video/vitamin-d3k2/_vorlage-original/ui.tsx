import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { C, FONT, MONO, FPS } from "./theme";

// ---------- Zeit-Helfer ----------
export const sp = (t: number, at: number, damping = 14, stiffness = 170) =>
  t < at ? 0 : spring({ frame: (t - at) * FPS, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

export const lin = (t: number, a: number, b: number, from = 0, to = 1, ease = true) =>
  interpolate(t, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.bezier(0.33, 0, 0.2, 1) : undefined,
  });

export const pop = (p: number, fromScale = 0.85, dy = 30): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.6),
  transform: `translateY(${(1 - p) * dy}px) scale(${fromScale + (1 - fromScale) * p})`,
});

// ---------- Icons (lucide-artig) ----------
const P: Record<string, React.ReactNode> = {
  search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>),
  file: (<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8M16 17H8M10 9H8" /></>),
  pencil: (<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />),
  code: (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  chart: (<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>),
  image: (<><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></>),
  mail: (<><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>),
  flask: (<path d="M9 3h6M10 3v6L5 20h14l-5-11V3" />),
  db: (<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></>),
  link: (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  copy: (<><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>),
  paste: (<><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></>),
  hand: (<><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></>),
  send: (<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>),
  user: (<><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>),
  check: (<path d="M20 6 9 17l-5-5" />),
  plus: (<path d="M5 12h14M12 5v14" />),
  trophy: (<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>),
  github: (<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>),
  layout: (<><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M9 21V9" /></>),
  phone: (<><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>),
  x: (<path d="M18 6 6 18M6 6l12 12" />),
};

export const Icon: React.FC<{ n: keyof typeof P | string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 32, c = "currentColor", w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {P[n]}
  </svg>
);

export const Cursor: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.25))", zIndex: 50 }}>
    <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.5 13.4 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

// ---------- Basis-Karten ----------
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; hl?: number }> = ({ style, children, hl = 0 }) => (
  <div
    style={{
      background: C.card,
      borderRadius: 28,
      border: `${2 + hl * 2}px solid ${hl > 0.01 ? mix(C.line, C.accent, hl) : C.line}`,
      boxShadow: `0 18px 40px rgba(60,40,20,0.08), 0 2px 6px rgba(60,40,20,0.05)${hl > 0.01 ? `, 0 0 0 ${6 * hl}px rgba(217,119,87,0.12)` : ""}`,
      fontFamily: FONT,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const r = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
};

export const IconBadge: React.FC<{ n: string; s?: number; bg?: string; c?: string; r?: number }> = ({ n, s = 84, bg = C.accent, c = "#fff", r = 20 }) => (
  <div style={{ width: s, height: s, borderRadius: r, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon n={n} s={s * 0.5} c={c} w={2.4} />
  </div>
);

export const SkillCard: React.FC<{ hl?: number; muted?: boolean; style?: React.CSSProperties; width?: number; badge?: React.ReactNode; name?: string; by?: string }> = ({
  hl = 0, muted = false, style, width = 640, badge, name = "find-skills", by = "by vercel-labs",
}) => (
  <Card hl={hl} style={{ width, padding: "26px 30px", display: "flex", alignItems: "center", gap: 26, position: "relative", ...style }}>
    {muted ? (
      <div style={{ width: 84, height: 84, borderRadius: 20, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon n="search" s={40} c={C.gray} />
      </div>
    ) : (
      <IconBadge n="search" />
    )}
    <div>
      <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 600, color: muted ? C.gray : C.ink, letterSpacing: -0.5 }}>{name}</div>
      <div style={{ fontSize: 28, color: C.mid, marginTop: 2 }}>{by}</div>
    </div>
    {badge}
  </Card>
);

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; c?: string; style?: React.CSSProperties }> = ({ children, bg = C.green, c = "#fff", style }) => (
  <div style={{ background: bg, color: c, borderRadius: 999, padding: "8px 20px", fontSize: 28, fontWeight: 600, fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 8, ...style }}>{children}</div>
);

// ---------- 3D-Claude-Stern ----------
const RAYS = [1, 0.8, 0.95, 0.76, 1, 0.84, 0.93, 0.78, 0.98, 0.82, 0.9, 0.77];
const starPath = (() => {
  const cx = 100, cy = 100;
  let d = "";
  RAYS.forEach((len, i) => {
    const a = (i / RAYS.length) * Math.PI * 2 + (i % 2 ? 0.06 : -0.04);
    const L = 92 * len, w0 = 9, w1 = 5.4, r0 = 0;
    const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;
    const b1 = [cx + ux * r0 + px * w0, cy + uy * r0 + py * w0];
    const b2 = [cx + ux * r0 - px * w0, cy + uy * r0 - py * w0];
    const t1 = [cx + ux * L + px * w1, cy + uy * L + py * w1];
    const t2 = [cx + ux * L - px * w1, cy + uy * L - py * w1];
    const tip = [cx + ux * (L + w1), cy + uy * (L + w1)];
    d += `M${b1[0]},${b1[1]} L${t1[0]},${t1[1]} Q${tip[0]},${tip[1]} ${t2[0]},${t2[1]} L${b2[0]},${b2[1]} Z `;
  });
  return d;
})();

export const StarFlat: React.FC<{ s?: number; c?: string }> = ({ s = 40, c = C.accent }) => (
  <svg width={s} height={s} viewBox="0 0 200 200"><path d={starPath} fill={c} /></svg>
);

export const Star3D: React.FC<{ t: number; size?: number; style?: React.CSSProperties }> = ({ t, size = 460, style }) => {
  const ry = Math.sin(t * 1.3) * 32;
  const rx = 14 + Math.sin(t * 0.9) * 8;
  const rz = t * 18;
  const layers = 16;
  return (
    <div style={{ width: size, height: size * 1.15, position: "relative", ...style }}>
      <div style={{ position: "absolute", left: size * 0.18, right: size * 0.18, bottom: 0, height: size * 0.12, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(60,40,25,0.22), rgba(60,40,25,0))" }} />
      <div style={{ position: "absolute", inset: 0, height: size, perspective: 1400 }}>
        <div style={{ width: size, height: size, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
          {Array.from({ length: layers }).map((_, i) => {
            const k = i / (layers - 1);
            const col = i === layers - 1 ? "#E58763" : mix("#9C4A30", "#C9684A", k);
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${(i - layers) * 2.4}px)` }}>
                <svg width={size} height={size} viewBox="0 0 200 200"><path d={starPath} fill={col} /></svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- Mini-Karten-Raster in Perspektive ----------
export const MiniCard: React.FC<{ hl?: number; w?: number }> = ({ hl = 0, w = 120 }) => (
  <div style={{ width: w, height: w * 1.2, background: "#fff", borderRadius: w * 0.1, border: `2px solid ${C.line}`, padding: w * 0.12, boxSizing: "border-box", boxShadow: "0 6px 12px rgba(60,40,20,0.06)" }}>
    <div style={{ width: w * 0.32, height: w * 0.26, borderRadius: w * 0.06, background: hl ? mix("#E9E5DE", C.accent, hl) : "#ECE8E1" }} />
    <div style={{ height: w * 0.07, width: "90%", background: "#ECE8E1", borderRadius: 4, marginTop: w * 0.14 }} />
    <div style={{ height: w * 0.07, width: "65%", background: "#ECE8E1", borderRadius: 4, marginTop: w * 0.07 }} />
  </div>
);

export const PerspectiveGrid: React.FC<{ cols: number; rows: number; cw: number; gap: number; scale: number; tilt?: number; hl?: (i: number) => number; lift?: (i: number) => number; ty?: number; opacity?: number }> = ({
  cols, rows, cw, gap, scale, tilt = 56, hl, lift, ty = 0, opacity = 1,
}) => {
  const gw = cols * cw + (cols - 1) * gap;
  const gh = rows * cw * 1.2 + (rows - 1) * gap;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1600, perspectiveOrigin: "50% 30%", overflow: "hidden", opacity }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: gw, height: gh, marginLeft: -gw / 2, marginTop: -gh / 2, transformStyle: "preserve-3d", transform: `translateY(${ty}px) rotateX(${tilt}deg) scale(${scale})`, display: "grid", gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const l = lift ? lift(i) : 0;
          return (
            <div key={i} style={{ transform: `translateZ(${l * 160}px) rotateX(${-l * 40}deg)`, transformStyle: "preserve-3d" }}>
              <MiniCard w={cw} hl={hl ? hl(i) : 0} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
