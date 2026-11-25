import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { ContactShadows } from "@react-three/drei";
import { C, FONT, HEAD, sp, lin, pop, clamp01 } from "./theme";
import { Drop, Face, Pose } from "./Sunny";
import { Lights } from "./Portrait";
import { Meadow, Kitchen, GROUND, WINDOW } from "./World";
import { Fly, Card, Pill, Slam, Confetti, Jar, GhostDrop, Badge, Ico } from "./Overlays";
import { SEGS, WORDS, START, at, END, HAS_VOICE, Word } from "./script";

export const HANDLE = "@sonnen.vitamin";
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

// ================= Zeitplan (alles hängt an Wort-Zeitstempeln) =================
const T = {
  rise: 0.1,
  ohne: at("hook", "ohne"),
  k2q: at("hook", "K2"),
  halbe: at("hook", "halbe"),
  sunny: START.sunny,
  sonne: at("sunny", "Sonne"),
  winter: START.winter,
  jump: START.jump,
  d3: START.d3,
  calcium: at("d3", "Calcium"),
  knochen: at("d3", "Knochen"),
  muskeln: at("d3", "Muskeln"),
  immun: at("d3", "Immunsystems"),
  k2: START.k2,
  kay: at("k2", "Kay", 1),
  vitK: at("k2", "Vitamin"),
  team: START.team,
  rein: at("team", "rein"),
  dream: at("team", "Dream"),
  tipp: START.tipp,
  fett: at("tipp", "fettlöslich"),
  mahl: at("tipp", "Mahlzeit"),
  gummy: START.gummy,
  zucker: at("gummy", "Zucker"),
  kuenst: at("gummy", "künstlichen"),
  natur: at("gummy", "natürlich"),
  cta: START.cta,
  guide: at("cta", "Guide"),
  sonneCta: at("cta", "SONNE"),
};
// Übergang Wiese -> Küche: Zoom durchs Fenster
const PAN_STOP = 900, PAN_END = 1900;
const ZOOM_A = T.jump + 1.1, ZOOM_B = ZOOM_A + 0.6;
const WIN_SX = WINDOW.x - PAN_END; // Fenster auf dem Bildschirm (x)
const WIN_SY = WINDOW.y;
const panAt = (t: number) => (t < T.winter ? lin(t, T.sunny, T.winter, 0, PAN_STOP) : lin(t, T.jump, T.jump + 1.0, PAN_STOP, PAN_END));

// ================= Figuren-Regie =================
type Mood = "idle" | "happy" | "worried" | "surprised" | "wave" | "cheer" | "think" | "walk";
type K = { t: number; x: number; g: number; s: number; mood: Mood; hops?: number };
const k = (t: number, x: number, g: number, s: number, mood: Mood, hops?: number): K => ({ t, x, g, s, mood, hops });

const SG = 0.72; // Größe Sunny
const KS = 0.6; // Größe Kay
const SUNNY: K[] = [
  k(0, 540, GROUND, SG, "surprised", 0),
  k(0.6, 540, GROUND, SG, "happy"),
  k(T.halbe, 470, GROUND, SG, "worried", 1),
  k(T.sunny, 470, GROUND, SG, "walk"),
  k(T.sonne, 470, GROUND, SG, "happy"),
  k(T.winter, 470, GROUND, SG, "worried"),
  k(T.jump + 0.05, 470, GROUND, SG, "happy"),
  k(T.jump + 0.55, WIN_SX - 40, GROUND, SG, "happy", 1),
  k(T.jump + 1.05, WIN_SX, WIN_SY + 60, 0.22, "surprised", 1),
  k(ZOOM_A + 0.05, WIN_SX, WIN_SY + 60, 0, "surprised", 0),
  k(ZOOM_B - 0.1, 540, -400, SG, "surprised", 0),
  k(ZOOM_B + 0.25, 540, GROUND, SG, "surprised", 1),
  k(ZOOM_B + 0.9, 540, GROUND, SG, "idle"),
  k(T.calcium, 540, GROUND, SG, "happy"),
  k(T.calcium + 0.8, 540, GROUND, SG, "idle"),
  k(T.immun, 540, GROUND, SG, "happy"),
  k(T.k2, 300, GROUND, SG, "surprised", 2),
  k(T.kay, 300, GROUND, SG, "idle"),
  k(T.team, 300, GROUND, SG, "idle"),
  k(T.dream, 380, GROUND, SG, "cheer", 1),
  k(T.tipp, 300, GROUND, SG, "think", 1),
  k(T.fett, 300, GROUND, SG, "happy"),
  k(T.fett + 0.6, 300, GROUND, SG, "think"),
  k(T.gummy, 220, GROUND, SG, "happy", 1),
  k(T.zucker, 220, GROUND, SG, "happy"),
  k(T.natur, 220, GROUND, SG, "cheer"),
  k(T.cta, 260, GROUND, SG, "wave"),
  k(T.sonneCta, 260, GROUND, SG, "cheer"),
  k(T.guide, 260, GROUND, SG, "wave"),
];
const KAY: K[] = [
  k(0, 790, -500, 0, "idle", 0),
  k(T.k2 + 0.15, 790, -500, KS, "surprised", 0),
  k(T.k2 + 0.5, 790, GROUND, KS, "surprised", 1),
  k(T.kay, 790, GROUND, KS, "wave"),
  k(T.vitK, 790, GROUND, KS, "happy"),
  k(T.vitK + 1.0, 790, GROUND, KS, "idle"),
  k(T.dream, 700, GROUND, KS, "cheer", 1),
  k(T.tipp, 790, GROUND, KS, "idle", 1),
  k(T.mahl, 790, GROUND, KS, "happy"),
  k(T.gummy, 860, GROUND, KS, "happy", 1),
  k(T.kuenst, 860, GROUND, KS, "happy"),
  k(T.natur, 860, GROUND, KS, "cheer"),
  k(T.cta, 800, GROUND, KS, "wave"),
  k(T.sonneCta + 0.1, 800, GROUND, KS, "cheer"),
  k(T.guide, 800, GROUND, KS, "wave"),
];

const direct = (keys: K[], t: number) => {
  let i = 0;
  keys.forEach((kk, n) => { if (t >= kk.t) i = n; });
  const cur = keys[i], prev = keys[Math.max(0, i - 1)];
  const since = t - cur.t;
  const dist = Math.hypot(cur.x - prev.x, cur.g - prev.g);
  const hops = cur.hops ?? (dist > 5 ? Math.max(1, Math.round(dist / 200)) : 0);
  const dur = hops === 0 ? 0 : Math.max(0.5, 0.42 * hops);
  if (i > 0 && hops > 0 && since < dur) {
    const p = since / dur;
    const e = ease(p);
    const lift = Math.abs(Math.sin(p * hops * Math.PI)) * (dist > 600 ? 200 : 80);
    return { x: prev.x + (cur.x - prev.x) * e, g: prev.g + (cur.g - prev.g) * e, s: prev.s + (cur.s - prev.s) * e, lift, mood: "air" as const, since, dir: Math.sign(cur.x - prev.x), land: -1 };
  }
  return { x: cur.x, g: cur.g, s: cur.s, lift: 0, mood: cur.mood, since: since - dur, dir: 0, land: since - dur };
};

const speaking = (t: number) => WORDS.some((w) => t >= w.s && t <= w.e);

const animate = (keys: K[], t: number, talk: boolean) => {
  const d = direct(keys, t);
  const blink = (t % 3.3) > 3.17 ? 1 : 0;
  const face: Face = { blink, brow: 0.2, worry: 0, mouth: 0.15, smile: 1, lookX: Math.sin(t * 0.6) * 0.3 };
  const pose: Pose = { squash: 1 + Math.sin(t * 2) * 0.008, armL: 0.05, armR: 0.05, tilt: 0, ry: Math.sin(t * 0.5) * 0.06 };
  let lift = d.lift;
  // Landung: kurzes Plattdrücken
  if (d.land >= 0 && d.land < 0.35) pose.squash = 1 - Math.exp(-d.land * 10) * Math.cos(d.land * 20) * 0.07;
  const s = d.since;
  switch (d.mood) {
    case "air":
      pose.squash = 1.08; pose.armL = 0.7; pose.armR = 0.7; face.mouth = 0.7; face.brow = 0.7; pose.ry = d.dir * 0.4; break;
    case "happy": {
      const hop = s < 0.45 ? Math.sin((s / 0.45) * Math.PI) : 0;
      lift += hop * 45; face.mouth = 0.6; face.brow = 0.6; pose.armL = 0.45; pose.armR = 0.45; break;
    }
    case "walk": {
      const hop = Math.abs(Math.sin(s * 3.6));
      lift += hop * 55; pose.squash = 1; pose.ry = 0.35; face.mouth = 0.45; face.lookX = 0.8; pose.armL = 0.3; pose.armR = 0.3; break;
    }
    case "worried":
      face.worry = 1; face.brow = -0.3; face.mouth = 0.1; face.smile = -1; pose.tilt = Math.sin(t * 18) * 0.015 * Math.max(0, 1 - s); pose.armL = 0; pose.armR = 0; break;
    case "surprised":
      face.brow = 1; face.mouth = 0.9; pose.armL = 0.6; pose.armR = 0.6; break;
    case "wave":
      pose.armR = 1.0 + Math.sin(s * 5) * 0.18; face.mouth = 0.6; face.brow = 0.5; break;
    case "cheer": {
      const hop = s < 1.2 ? Math.abs(Math.sin(s * 5.2)) * (1 - s / 1.2) : 0;
      lift += hop * 70; pose.armL = 1.1; pose.armR = 1.1; face.mouth = 1; face.brow = 0.9; break;
    }
    case "think":
      face.worry = 0.4; face.brow = 0.5; face.lookY = 1; face.lookX = 0.8; pose.armR = 0.75; pose.tilt = 0.08; break;
  }
  if (talk && speaking(t) && d.mood !== "air") face.mouth = Math.max(face.mouth ?? 0, 0.3 + Math.abs(Math.sin(t * 9)) * 0.25);
  return { ...d, face, pose, lift };
};

// Bildschirm-Pixel -> 3D-Welt (Kamera z=15, fov 30)
const PPU = 1920 / (2 * 15 * Math.tan((15 * Math.PI) / 180));
const wx = (px: number) => (px - 540) / PPU;
const wy = (py: number) => -(py - 960) / PPU;
const FOOT = 1.18;

const Stage: React.FC<{ t: number; width: number; height: number }> = ({ t, width, height }) => {
  const su = animate(SUNNY, t, true);
  const ka = animate(KAY, t, false);
  const inKitchen = t >= ZOOM_B - 0.15;
  const rays = inKitchen ? 0.72 : 1;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 0, 15] }} gl={{ alpha: true, antialias: true }} shadows flat>
      <Lights />
      {su.s > 0.01 && (
        <group position={[wx(su.x), wy(su.g - su.lift) + FOOT * su.s, 0]} scale={su.s}>
          <Drop t={t} color={C.peach} colorDark={C.peachDeep} sheen="#FFE0C8" rays={rays} face={su.face} pose={su.pose} />
        </group>
      )}
      {ka.s > 0.01 && (
        <group position={[wx(ka.x), wy(ka.g - ka.lift) + FOOT * ka.s, 0.4]} scale={ka.s}>
          <Drop t={t} color={C.pink} colorDark={C.pinkDeep} sheen="#FFE3EA" hat={clamp01((t - T.kay) / 0.4)} face={ka.face} pose={ka.pose} />
        </group>
      )}
      {su.s > 0.3 && <ContactShadows position={[wx(su.x), wy(su.g) - 0.01, 0]} opacity={0.35 * Math.max(0, 1 - su.lift / 300)} scale={2.6} blur={2.2} far={1.5} resolution={256} color="#7a4a3a" />}
      {ka.s > 0.3 && <ContactShadows position={[wx(ka.x), wy(ka.g) - 0.01, 0.4]} opacity={0.35 * Math.max(0, 1 - ka.lift / 300)} scale={2.2} blur={2.2} far={1.5} resolution={256} color="#7a4a3a" />}
    </ThreeCanvas>
  );
};

// Namensschild über einer Figur
const NameTag: React.FC<{ t: number; at: number; outAt: number; x: number; y: number; name: string; sub: string; bg: string }> = ({ t, at, outAt, x, y, name, sub, bg }) => {
  if (t < at || t > outAt + 0.3) return null;
  const p = sp(t, at, 11, 200), o = lin(t, outAt, outAt + 0.25);
  return (
    <div style={{ position: "absolute", left: x - 200, width: 400, top: y, display: "flex", justifyContent: "center", ...pop(p, 0.4, 30), opacity: Math.min(1, p * 2) * (1 - o) }}>
      <Pill bg={bg} c="#fff" fs={38}>{name}<span style={{ opacity: 0.85, fontWeight: 700 }}>· {sub}</span></Pill>
    </div>
  );
};

// Checkliste-Zeile
const Row: React.FC<{ t: number; at: number; icon: string; bg: string; children: React.ReactNode }> = ({ t, at, icon, bg, children }) => {
  const p = sp(t, at, 12, 190);
  const on = t >= at;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 16, opacity: on ? Math.min(1, 0.25 + p) : 0.25, transform: `translateX(${(1 - p) * 40}px)` }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * p})` }}><Badge n={icon} bg={on ? bg : C.gray} s={74} /></div>
      <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.12, flex: 1 }}>{children}</div>
      <div style={{ width: 54, height: 54, borderRadius: 27, background: on ? C.sageDeep : "transparent", border: on ? "none" : `4px solid ${C.gray}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.6 + 0.4 * sp(t, at + 0.15, 9, 260) : 1})` }}>{on && <Ico n="check" s={34} />}</div>
    </div>
  );
};

const Months: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const m = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const dark = (i: number) => i <= 2 || i >= 9;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginTop: 26 }}>
      {m.map((l, i) => {
        const p = sp(t, at + 0.15 + i * 0.05, 12, 220);
        const d = dark(i) && t > at + 0.9;
        return (
          <div key={i} style={{ height: 96, borderRadius: 24, background: d ? "#B8BDC7" : C.peachLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p, color: d ? "#fff" : C.peachDeep }}>
            <div style={{ fontFamily: HEAD, fontSize: 34, fontWeight: 700 }}>{l}</div>
            <Ico n={d ? "cloud" : "sun"} s={34} c={d ? "#fff" : C.peachDeep} />
          </div>
        );
      })}
    </div>
  );
};

// Fluss-Grafik: D3 holt Calcium rein -> K2 kümmert sich um die Knochen
const Flow: React.FC<{ t: number }> = ({ t }) => {
  const dots = Array.from({ length: 7 });
  return (
    <div style={{ position: "relative", height: 330 }}>
      <div style={{ position: "absolute", left: 0, top: 10, width: 250, textAlign: "center" }}>
        <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `linear-gradient(160deg, ${C.peachLight}, ${C.peach})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 72, color: "#fff", boxShadow: "0 18px 30px -12px rgba(240,138,85,0.7)" }}>D3</div>
        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 14, lineHeight: 1.1 }}>holt Calcium rein</div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 10, width: 250, textAlign: "center", opacity: lin(t, T.rein + 0.3, T.rein + 0.6), transform: `scale(${0.6 + 0.4 * sp(t, T.rein + 0.3, 11, 200)})` }}>
        <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `linear-gradient(160deg, ${C.pinkLight}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 30px -12px rgba(227,112,141,0.7)" }}><Ico n="bone" s={96} /></div>
        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 14, lineHeight: 1.1 }}>K2: mit für die Knochen</div>
      </div>
      {/* Calcium-Kügelchen wandern von links nach rechts */}
      {dots.map((_, i) => {
        const ph = ((t - T.team) * 0.7 + i / dots.length) % 1;
        const show = t > T.team + 0.3;
        const x = 210 + ph * 300;
        const y = 85 - Math.sin(ph * Math.PI) * 50;
        return show ? (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 50, height: 50, borderRadius: 25, background: "#FFFFFF", border: `4px solid ${C.peach}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: C.peachDeep, opacity: Math.sin(ph * Math.PI) * 1.4, transform: `scale(${0.7 + Math.sin(ph * Math.PI) * 0.4})` }}>Ca</div>
        ) : null;
      })}
    </div>
  );
};

// ================= Untertitel (max. 3 Wörter, aktives Wort hervorgehoben) =================
const chunks: Word[][] = (() => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of WORDS) {
    const len = cur.reduce((a, x) => a + x.w.length + 1, 0);
    if (cur.length && (cur.length >= 3 || len + w.w.length > 20 || w.seg !== cur[0].seg)) { out.push(cur); cur = []; }
    cur.push(w);
    if (/[,.!?:]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();

const Captions: React.FC<{ t: number }> = ({ t }) => {
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (t >= chunks[i][0].s - 0.05) idx = i;
  if (idx < 0) return null;
  const ch = chunks[idx];
  if (t > ch[ch.length - 1].e + 0.6) return null;
  const p = sp(t, ch[0].s - 0.05, 14, 260);
  const chars = ch.reduce((a, w) => a + w.w.length + 1, 0);
  const fs = Math.min(74, 700 / (chars * 0.6));
  return (
    <div style={{ position: "absolute", top: 1318, left: 100, width: 840, height: 120, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 14}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: fs, letterSpacing: -fs * 0.02, whiteSpace: "nowrap", display: "flex", gap: fs * 0.24, alignItems: "center", background: "rgba(255,255,255,0.92)", padding: `${fs * 0.16}px ${fs * 0.3}px`, borderRadius: fs * 0.5, boxShadow: "0 14px 28px -14px rgba(150,70,40,0.45)" }}>
        {ch.map((w, i) => {
          const next = ch[i + 1]?.s ?? w.e + 0.05;
          const active = t >= w.s && t < Math.min(next, w.e + 0.05);
          const done = t >= Math.min(next, w.e + 0.05);
          return active ? (
            <span key={i} style={{ color: "#fff", background: C.peachDeep, borderRadius: fs * 0.25, padding: `0 ${fs * 0.18}px` }}>{w.w}</span>
          ) : (
            <span key={i} style={{ color: done ? C.ink : C.gray }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

const Handle: React.FC = () => (
  <div style={{ position: "absolute", top: 1452, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "rgba(58,42,38,0.5)", textShadow: "0 0 12px rgba(255,255,255,0.9)" }}>{HANDLE}</div>
);

export const SHOW_SAFE = false;

// ================= Hauptvideo =================
export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const pan = panAt(t);
  const gloom = t < T.winter ? 0 : t < T.jump ? lin(t, T.winter, T.winter + 0.6) : 1 - lin(t, T.jump, T.jump + 0.4);
  const zoom = lin(t, ZOOM_A, ZOOM_B);
  const zoomS = Math.pow(8, zoom);
  const clipR = lin(t, ZOOM_A + 0.15, ZOOM_B + 0.05, 0, 1500);
  const showMeadow = t < ZOOM_B + 0.1;
  const showKitchen = t >= ZOOM_A;
  // Zoom-Punch bei jedem Segmentwechsel
  const cuts = SEGS.map((g) => START[g.id]).filter((c) => c > 0);
  const last = [...cuts].reverse().find((c) => t >= c);
  const kp = last === undefined ? 1 : Math.min(1, (t - last) / 0.3);
  const punch = 1;
  // sanfte Kamerafahrt in der Küche
  const push = 1;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.cream, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${punch * push})` }}>
        {showMeadow && (
          <AbsoluteFill style={{ transform: `scale(${zoomS})`, transformOrigin: `${WIN_SX}px ${WIN_SY}px` }}>
            <Meadow t={t} pan={pan} gloom={gloom} />
          </AbsoluteFill>
        )}
        {showKitchen && (
          <AbsoluteFill style={{ clipPath: t < ZOOM_B + 0.05 ? `circle(${clipR}px at ${WIN_SX}px ${WIN_SY}px)` : undefined }}>
            <Kitchen t={t} />
            <Jar t={t} at={T.gummy + 0.05} x={540} bottom={1238} />
          </AbsoluteFill>
        )}
        <AbsoluteFill><Stage t={t} width={width} height={height} /></AbsoluteFill>
      </AbsoluteFill>

      {/* ---------- 1 Hook ---------- */}
      <Slam t={t} at={0} size={150} y={360} outAt={T.sunny - 0.15} instant>D3 ohne K2?</Slam>
      <Fly t={t} inAt={T.halbe} outAt={T.sunny - 0.25} style={{ left: 140, width: 800, top: 590, display: "flex", justifyContent: "center" }}>
        <Pill bg={C.pinkDeep} c="#fff" fs={58}>= nur das halbe Team</Pill>
      </Fly>
      <GhostDrop t={t} at={T.k2q} outAt={T.sunny - 0.2} x={850} y={GROUND - 40} />

      {/* ---------- 2 Sunny auf der Wiese ---------- */}
      <NameTag t={t} at={T.sunny + 0.1} outAt={T.winter - 0.2} x={470} y={680} name="Sunny" sub="Vitamin D" bg={C.peachDeep} />
      <Fly t={t} inAt={T.sonne} outAt={T.winter - 0.2} style={{ left: 140, width: 800, top: 330 }}>
        <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "30px 36px" }}>
          <Badge n="sun" bg={C.peach} s={110} />
          <div style={{ fontFamily: HEAD, fontSize: 70, color: C.mid }}>+</div>
          <Badge n="hand" bg={C.pink} s={110} />
          <div style={{ fontFamily: HEAD, fontSize: 70, color: C.mid }}>=</div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 62, color: C.peachDeep, lineHeight: 1 }}>Vitamin D</div>
        </Card>
      </Fly>

      {/* ---------- 3 Oktober bis März ---------- */}
      <Fly t={t} inAt={T.winter + 0.15} outAt={T.jump - 0.15} style={{ left: 140, width: 800, top: 300 }}>
        <Card>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, lineHeight: 1.05 }}>Okt – März: <span style={{ color: "#7D8594" }}>zu wenig Sonne*</span></div>
          <Months t={t} at={T.winter + 0.15} />
          <div style={{ fontSize: 24, color: C.mid, marginTop: 18, fontWeight: 700 }}>*für die Vitamin-D-Bildung über die Haut in Deutschland · Quelle: RKI</div>
        </Card>
      </Fly>

      {/* ---------- 4 Sprung in die Küche ---------- */}
      <Slam t={t} at={T.jump + 0.2} size={120} y={420} outAt={ZOOM_A - 0.1} color={C.peachDeep} rot={4}>Ab in die Küche!</Slam>

      {/* ---------- 5 D3 ---------- */}
      <Fly t={t} inAt={T.d3 + 0.05} outAt={T.k2 - 0.2} style={{ left: 120, width: 840, top: 250 }}>
        <Card style={{ padding: "26px 34px 28px" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 56 }}><span style={{ color: C.peachDeep }}>Vitamin D3</span> trägt bei zu …</div>
          <Row t={t} at={T.calcium} icon="drop" bg={C.peach}>normaler Aufnahme von Calcium</Row>
          <Row t={t} at={T.knochen} icon="bone" bg={C.peach}>Erhaltung normaler Knochen</Row>
          <Row t={t} at={T.muskeln} icon="muscle" bg={C.peach}>normaler Muskelfunktion</Row>
          <Row t={t} at={T.immun} icon="shield" bg={C.peach}>normaler Funktion des Immunsystems</Row>
        </Card>
      </Fly>

      {/* ---------- 6 K2 / Kay ---------- */}
      <NameTag t={t} at={T.kay} outAt={T.team + 0.2} x={790} y={820} name="Kay" sub="K2" bg={C.pinkDeep} />
      <NameTag t={t} at={T.kay + 0.25} outAt={T.team + 0.2} x={300} y={700} name="Sunny" sub="D3" bg={C.peachDeep} />
      <Fly t={t} inAt={T.vitK} outAt={T.team - 0.15} style={{ left: 140, width: 800, top: 330 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Badge n="bone" bg={C.pink} s={130} />
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.15 }}><span style={{ color: C.pinkDeep }}>Vitamin K</span> trägt zur Erhaltung normaler Knochen bei.</div>
        </Card>
      </Fly>

      {/* ---------- 7 Dream-Team ---------- */}
      <Fly t={t} inAt={T.team + 0.1} outAt={T.dream - 0.1} style={{ left: 140, width: 800, top: 290 }}>
        <Card style={{ padding: "34px 34px 26px" }}><Flow t={t} /></Card>
      </Fly>
      <Slam t={t} at={T.dream} size={140} y={420} outAt={T.tipp - 0.2} color={C.pinkDeep}>Dream-Team!</Slam>
      <Confetti t={t} at={T.dream} />

      {/* ---------- 8 Tipp ---------- */}
      <Fly t={t} inAt={T.tipp + 0.05} outAt={T.gummy - 0.15} style={{ left: 140, width: 800, top: 300 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Badge n="bulb" bg="#FFC24B" s={80} />
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60 }}>Kleiner Tipp</div>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 26 }}>
            {[{ at: T.fett, n: "drop", bg: C.peach, l: "fettlöslich" }, { at: T.mahl, n: "plate", bg: C.pink, l: "zur Mahlzeit" }].map((x, i) => {
              const p = sp(t, x.at, 12, 200);
              return (
                <div key={i} style={{ flex: 1, borderRadius: 30, background: i ? C.pinkSoft : C.peachSoft, padding: "24px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.25 + 0.75 * Math.min(1, p), transform: `scale(${0.85 + 0.15 * p})` }}>
                  <Badge n={x.n} bg={x.bg} s={100} />
                  <div style={{ fontSize: 42, fontWeight: 900 }}>{x.l}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </Fly>

      {/* ---------- 9 Gummies ---------- */}
      {[{ at: T.zucker, n: "nosugar", l: "ohne Zucker", bg: C.peachDeep }, { at: T.kuenst, n: "leaf", l: "ohne künstlichen Schnickschnack", bg: C.pinkDeep }, { at: T.natur, n: "sun", l: "einfach natürlich", bg: C.sageDeep }].map((b, i) => (
        <Fly key={i} t={t} inAt={b.at} outAt={T.cta - 0.2} style={{ left: 140, width: 800, top: 330 + i * 125, display: "flex", justifyContent: "center" }}>
          <Pill bg="#fff" fs={44}><Badge n={b.n} bg={b.bg} s={68} />{b.l}</Pill>
        </Fly>
      ))}

      {/* ---------- 10 CTA ---------- */}
      <Fly t={t} inAt={T.cta} outAt={999} style={{ left: 140, width: 800, top: 300 }}>
        <div style={{ position: "relative" }}>
          <Card style={{ textAlign: "center", padding: "34px 30px" }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.mid }}>Kommentier</div>
            <div style={{ display: "inline-block", marginTop: 8, padding: "6px 46px", borderRadius: 999, background: `linear-gradient(160deg, ${C.peach}, ${C.peachDeep})`, fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: "#fff", opacity: t < T.sonneCta - 0.05 ? 0.25 : 1, transform: `scale(${t < T.sonneCta - 0.05 ? 0.8 : 1.6 - 0.6 * sp(t, T.sonneCta - 0.05, 9, 230)}) rotate(${t < T.sonneCta ? 0 : -3 * (1 - sp(t, T.sonneCta, 8, 160))}deg)`, boxShadow: "0 20px 34px -14px rgba(240,138,85,0.8)" }}>SONNE</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 22, ...pop(sp(t, T.guide, 12, 200), 0.7, 20) }}>
              <Badge n="gift" bg={C.pink} s={70} />
              <div style={{ fontSize: 40, fontWeight: 900 }}>Gratis-Guide: D3 + K2</div>
            </div>
          </Card>
          <svg width={90} height={60} viewBox="0 0 90 60" style={{ position: "absolute", left: 120, bottom: -46 }}><path d="M0,0 L90,0 L20,60 Z" fill="#FFFFFF" /></svg>
        </div>
      </Fly>
      <Confetti t={t} at={T.sonneCta} />
      {t >= T.cta && (
        <div style={{ position: "absolute", left: 140, width: 800, top: 258, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.mid, opacity: lin(t, T.cta + 0.5, T.cta + 1) }}>
          Nahrungsergänzungsmittel ersetzen keine ausgewogene Ernährung und gesunde Lebensweise.
        </div>
      )}

      <Captions t={t} />
      <Handle />
      {!HAS_VOICE && (
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pill bg="rgba(58,42,38,0.75)" c="#fff" fs={28}>STILTEST · ohne Stimme · Timing geschätzt</Pill>
        </div>
      )}
      {SHOW_SAFE && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 250, background: "rgba(255,0,0,0.18)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 480, background: "rgba(255,0,0,0.18)" }} />
          <div style={{ position: "absolute", right: 0, top: 250, bottom: 480, width: 140, background: "rgba(255,0,0,0.10)" }} />
        </>
      )}
      {HAS_VOICE && <Audio src={staticFile("audio/voice.wav")} />}
      <Audio src={staticFile("audio/music.wav")} volume={(f) => (HAS_VOICE ? 0.14 + 0.1 * clamp01((f / fps - END - 0.2) / 0.5) : 0.5)} />
    </AbsoluteFill>
  );
};
