import React from "react";
import { FONT, MONO } from "./theme";
import { Icon, lin, sp } from "./ui";
import { Bezel, Check, Chip, ClaudeIcon, P } from "./premium";

type SP = { t: number; s: number };
// Inhaltszone: x 110–940, y 330–960 (Sicherheitszonen eingehalten)
const Zone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 110, width: 830, top: 330, height: 630, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>{children}</div>
);
const rise = (p: number, dy = 60): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.6),
  transform: `perspective(1600px) translateY(${(1 - p) * dy}px) rotateX(${(1 - p) * 24}deg) scale(${0.92 + 0.08 * p})`,
});
const popIn = (p: number): React.CSSProperties => ({ opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p})` });
const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.round(lin(t, a, b, 0, text.length, false)));
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 21, fontWeight: 700, letterSpacing: 3, color: P.mid, ...style }}>{children}</div>
);
const Grad = `linear-gradient(160deg,#EA9070,${P.orange} 55%,${P.orangeDeep})`;
const IconTile: React.FC<{ n: string; size?: number; bg?: string }> = ({ n, size = 76, bg = Grad }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon n={n} s={size * 0.5} c="#fff" w={2.4} /></div>
);
const PhoneGlyph: React.FC<{ s?: number; c?: string }> = ({ s = 40, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
);
// Terminal-Fenster (dunkel)
const Term: React.FC<{ lines: React.ReactNode[]; style?: React.CSSProperties; title?: string }> = ({ lines, style, title = "claude" }) => (
  <Bezel dark style={{ width: 800, ...style }} inner={{ padding: 0 }} r={26}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 52, padding: "0 18px", background: "#1F1E1C", borderBottom: "2px solid #2B2A28" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 20, color: "#8A857E" }}>{title}</span>
    </div>
    <div style={{ padding: "18px 24px", fontFamily: MONO, fontSize: 27, lineHeight: 1.55, color: "#EDEAE5", minHeight: 150 }}>{lines}</div>
  </Bezel>
);
// Eingehender Anruf (Handy-Screen)
const IncomingCall: React.FC<{ t: number; title?: string; sub?: string; accept?: number; scale?: number }> = ({ t, title = "Claude Code", sub = "ruft an …", accept = 0, scale = 1 }) => {
  const pulse = 1 + Math.sin(t * 14) * 0.06 * (1 - accept);
  return (
    <div style={{ width: 340 * scale, height: 560 * scale, borderRadius: 54 * scale, background: "linear-gradient(180deg,#26241F,#141312)", border: `${8 * scale}px solid #0E0D0C`, boxShadow: "0 40px 60px -20px rgba(40,25,15,0.55)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 * scale, boxSizing: "border-box", color: "#fff", fontFamily: FONT, transform: `rotate(${Math.sin(t * 40) * 2 * (1 - accept)}deg)` }}>
      <ClaudeIcon size={110 * scale} />
      <div style={{ fontSize: 34 * scale, fontWeight: 800, marginTop: 18 * scale }}>{title}</div>
      <div style={{ fontSize: 22 * scale, color: "#A9A49C" }}>{accept > 0.5 ? "verbunden · 0:04" : sub}</div>
      <div style={{ display: "flex", gap: 60 * scale, marginTop: "auto", marginBottom: 60 * scale }}>
        <div style={{ width: 84 * scale, height: 84 * scale, borderRadius: "50%", background: "#E5484D", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(135deg)", opacity: 1 - accept * 0.6 }}><PhoneGlyph s={40 * scale} /></div>
        <div style={{ width: 84 * scale, height: 84 * scale, borderRadius: "50%", background: "#30A46C", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pulse})` }}><PhoneGlyph s={40 * scale} /></div>
      </div>
    </div>
  );
};

// ---------- Hook: Rest nach dem 3D-Telefon (schnelle Schnitte) ----------
const S0: React.FC<SP> = ({ t }) => {
  if (t < 1.72) return null; // 0–1.7 s gehört dem 3D-Telefon
  if (t < 2.4) {
    return (
      <Zone style={{ justifyContent: "center" }}>
        <Term style={popIn(sp(t, 1.72, 10, 260))} lines={[
          <div key={1} style={{ color: "#7FD49B" }}>✓ Komponenten gebaut</div>,
          <div key={2} style={{ color: "#F3A07F" }}>● Entscheidung nötig:</div>,
          <div key={3} style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>Knopf <span style={{ color: "#7AA7FF" }}>blau</span> oder <span style={{ color: P.orange }}>orange</span>?</div>,
        ]} />
      </Zone>
    );
  }
  return (
    <Zone style={{ justifyContent: "center", flexDirection: "row", gap: 40 }}>
      <div style={popIn(sp(t, 2.4, 9, 280))}><IncomingCall t={t} scale={0.74} /></div>
    </Zone>
  );
};

// ---------- Eigene Telefonnummer ----------
const S1: React.FC<SP> = ({ t, s }) => (
  <Zone style={{ justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26, ...popIn(sp(t, s, 10, 240)) }}>
      <ClaudeIcon size={120} />
      <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: -2 }}>Claude Code</div>
    </div>
    <Bezel style={{ width: 640, marginTop: 34, ...rise(sp(t, 4.6, 10, 200)) }} inner={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 20 }}>
      <IconTile n="phone" size={72} bg="linear-gradient(160deg,#3BB273,#2FA36B)" />
      <div><Label style={{ fontSize: 17 }}>EIGENE NUMMER</Label><div style={{ fontFamily: MONO, fontSize: 40, fontWeight: 800 }}>{typed("+49 30 9•• ••• •", t, 4.75, 5.5)}</div></div>
    </Bezel>
  </Zone>
);

// ---------- „Ich bin kurz einkaufen“ ----------
const S2: React.FC<SP> = ({ t, s }) => (
  <Zone style={{ justifyContent: "center" }}>
    <Term style={rise(sp(t, s, 11, 220))} lines={[
      <div key={1}><span style={{ color: P.orange }}>&gt; </span>{typed("Ich bin kurz einkaufen. Ruf mich an, wenn was ist.", t, 6.4, 7.6)}{Math.floor(t * 2.6) % 2 === 0 && <span style={{ background: "#EDEAE5" }}>&nbsp;</span>}</div>,
      t > 7.65 ? <div key={2} style={{ color: "#7FD49B", marginTop: 8 }}>✓ Alles klar – ich melde mich.</div> : null,
    ]} />
    <div style={{ marginTop: 26, ...popIn(sp(t, 6.9, 10, 220)) }}><Chip style={{ fontSize: 30 }}>🛒 kurz einkaufen</Chip></div>
  </Zone>
);

// ---------- Freigabe / Frage / Fertig → Handy klingelt ----------
const S3: React.FC<SP> = ({ t, s }) => {
  if (t >= 11.3) {
    return (
      <Zone style={{ justifyContent: "center" }}>
        <div style={popIn(sp(t, 11.3, 9, 280))}><IncomingCall t={t} scale={0.74} /></div>
      </Zone>
    );
  }
  const items: [string, string, number][] = [["Freigabe", "check", 8.6], ["Frage", "user", 9.7], ["Fertig", "file", 10.5]];
  return (
    <Zone style={{ justifyContent: "center" }}>
      <Label>CLAUDE RUFT AN BEI …</Label>
      <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
        {items.map(([l, ic, at]) => (
          <Bezel key={l} style={{ width: 250, ...popIn(sp(t, at, 9, 260)) }} inner={{ padding: "24px 18px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><IconTile n={ic} size={80} /></div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 14 }}>{l}</div>
          </Bezel>
        ))}
      </div>
    </Zone>
  );
};

// ---------- „Nimm die orange Variante“ ----------
const S4: React.FC<SP> = ({ t, s }) => {
  const pick = sp(t, 13.7, 10, 220);
  return (
    <Zone>
      <div style={{ display: "flex", gap: 30, alignItems: "center", marginTop: 6 }}>
        <div style={popIn(sp(t, s, 10, 240))}><IncomingCall t={t} accept={1} scale={0.74} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: "16px 22px", fontSize: 30, fontWeight: 800, boxShadow: "0 16px 30px -12px rgba(70,45,25,0.4)", ...rise(sp(t, 12.9, 11, 220), 30) }}>„Nimm die orange Variante.“</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["A", "#3E7BF0", "blau"], ["B", P.orange, "orange"]].map(([k, c, l]) => {
              const on = k === "B" ? pick : 0;
              return (
                <div key={k} style={{ width: 180, height: 120, borderRadius: 22, background: c, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, opacity: k === "A" ? 1 - pick * 0.6 : 1, transform: `scale(${1 + on * 0.1})`, outline: on > 0.5 ? `6px solid ${P.ink}` : "none", outlineOffset: 4 }}>
                  {k}<span style={{ fontSize: 22, fontWeight: 700 }}>{l}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Zone>
  );
};

// ---------- Antwort landet in der Session ----------
const S5: React.FC<SP> = ({ t, s }) => (
  <Zone style={{ justifyContent: "center" }}>
    <Term style={rise(sp(t, s, 11, 220))} title="claude · Session" lines={[
      <div key={1} style={{ color: "#8A857E" }}>● Entscheidung nötig: blau oder orange?</div>,
      <div key={2} style={{ color: P.orange, opacity: Math.min(1, sp(t, 15.8) * 2) }}>☎ Antwort per Anruf: <b>orange</b></div>,
      <div key={3} style={{ color: "#7FD49B", opacity: Math.min(1, sp(t, 16.9) * 2) }}>✓ Übernommen – arbeite weiter …</div>,
      <div key={4} style={{ marginTop: 10, height: 12, borderRadius: 6, background: "#2B2A28", opacity: Math.min(1, sp(t, 17.3) * 2) }}><div style={{ width: `${lin(t, 17.4, 18.6) * 100}%`, height: "100%", borderRadius: 6, background: P.orange }} /></div>,
    ]} />
  </Zone>
);

// ---------- Was du brauchst ----------
const S6: React.FC<SP> = ({ t, s }) => {
  if (t >= 23.7) {
    return (
      <Zone style={{ justifyContent: "center" }}>
        <Label>BEI BLAND HOLST DU DIR</Label>
        <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
          <Bezel style={{ width: 360, ...popIn(sp(t, 24.5, 9, 260)) }} inner={{ padding: "24px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><IconTile n="phone" size={80} bg="linear-gradient(160deg,#3BB273,#2FA36B)" /></div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 14 }}>Nummer</div>
          </Bezel>
          <Bezel style={{ width: 360, ...popIn(sp(t, 25.2, 9, 260)) }} inner={{ padding: "24px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><IconTile n="link" size={80} bg={`linear-gradient(160deg,#3A3633,${P.ink})`} /></div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 14 }}>Schlüssel</div>
            <div style={{ fontFamily: MONO, fontSize: 22, color: P.mid }}>org_••••</div>
          </Bezel>
        </div>
      </Zone>
    );
  }
  return (
    <Zone style={{ justifyContent: "center" }}>
      <Label>DAS BRAUCHST DU</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24 }}>
        <Bezel style={{ width: 340, ...popIn(sp(t, 19.8, 9, 260)) }} inner={{ padding: "24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><ClaudeIcon size={84} /></div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 14 }}>Claude-Abo</div>
        </Bezel>
        <span style={{ fontSize: 50, fontWeight: 900, color: P.gray, ...popIn(sp(t, 20.5)) }}>+</span>
        <Bezel style={{ width: 340, ...popIn(sp(t, 21.4, 9, 260)) }} inner={{ padding: "24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><IconTile n="phone" size={84} bg={`linear-gradient(160deg,#3A3633,${P.ink})`} /></div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 14 }}>Bland-Konto</div>
          <div style={{ fontSize: 21, color: P.mid, opacity: Math.min(1, sp(t, 22.1) * 2) }}>Telefondienst für KI</div>
        </Bezel>
      </div>
    </Zone>
  );
};

// ---------- Ein einziger Prompt ----------
const S7: React.FC<SP> = ({ t, s }) => (
  <Zone style={{ justifyContent: "center" }}>
    <Label style={{ ...popIn(sp(t, s, 10, 240)) }}>EIN EINZIGER PROMPT</Label>
    <Term style={{ marginTop: 20, ...rise(sp(t, s + 0.1, 11, 220)) }} lines={[
      <div key={1}><span style={{ color: P.orange }}>&gt; </span>{typed("Richte Anrufe über Bland ein.", t, 26.4, 27.4)}</div>,
      t > 28.3 ? <div key={2}>Handynummer: <span style={{ color: "#7AA7FF" }}>{typed("+49 1•• ••• ••••", t, 28.4, 29.0)}</span></div> : null,
      t > 29.4 ? <div key={3}>Schlüssel: <span style={{ border: `3px solid ${P.orange}`, borderRadius: 8, padding: "0 8px" }}>{typed("org_••••", t, 29.5, 29.9)}</span></div> : null,
    ]} />
  </Zone>
);

// ---------- Testanruf + Skill ----------
const S8: React.FC<SP> = ({ t, s }) => {
  if (t < 32.4) {
    const ok = t >= 31.3;
    return (
      <Zone style={{ justifyContent: "center" }}>
        <div style={popIn(sp(t, s, 9, 280))}><IncomingCall t={t} title="Claude Code" sub="Testanruf" accept={ok ? 1 : 0} scale={0.74} /></div>
        <div style={{ position: "absolute", right: 30, top: 60, ...popIn(sp(t, 31.3, 9, 260)) }}><Chip bg={P.green} c="#fff" style={{ fontSize: 28 }}>✓ Test klappt</Chip></div>
      </Zone>
    );
  }
  return (
    <Zone style={{ justifyContent: "center" }}>
      <Term style={rise(sp(t, 32.4, 11, 220))} lines={[
        <div key={1} style={{ color: "#7FD49B" }}>✓ Testanruf erfolgreich</div>,
        <div key={2} style={{ color: P.orange }}>✓ Skill angelegt: <span style={{ color: "#EDEAE5" }}>skills/anrufen/SKILL.md</span></div>,
        ...[["1", "Aufgabe klären", 33.5], ["2", "anrufen & zuhören", 33.9], ["3", "Antwort in die Session", 34.3]].map(([n, l, at]) => (
          <div key={n as string} style={{ color: "#A9A49C", opacity: Math.min(1, sp(t, at as number) * 2) }}>{n}  {l}</div>
        )),
      ]} />
    </Zone>
  );
};

// ---------- Morgen-Anruf ----------
const S9: React.FC<SP> = ({ t, s }) => {
  if (t >= 40.0) {
    return (
      <Zone style={{ justifyContent: "center" }}>
        <div style={popIn(sp(t, 40.0, 9, 280))}><IncomingCall t={t} title="Claude Code" sub="Dein Morgen-Überblick" scale={0.74} /></div>
      </Zone>
    );
  }
  const items: [string, string, number][] = [["Mails", "mail", 38.8], ["Termine", "layout", 39.3]];
  return (
    <Zone style={{ justifyContent: "center" }}>
      <Bezel style={{ width: 420, ...popIn(sp(t, s, 9, 240)) }} inner={{ padding: "22px", textAlign: "center" }}>
        <Label style={{ fontSize: 17 }}>MORGEN-ANRUF</Label>
        <div style={{ fontFamily: MONO, fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>{t > 37.7 ? "09:00" : "08:59"}</div>
      </Bezel>
      <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
        {items.map(([l, ic, at]) => (
          <div key={l} style={popIn(sp(t, at, 9, 260))}><Chip style={{ fontSize: 30, gap: 14 }}><Icon n={ic} s={32} c={P.orange} />{l} gecheckt</Chip></div>
        ))}
      </div>
    </Zone>
  );
};

// ---------- CTA ----------
const S10: React.FC<SP> = ({ t, s }) => {
  const word = typed("ANRUF", t, 42.4, 42.9);
  const following = t >= 43.4;
  return (
    <Zone>
      <div style={{ display: "flex", gap: 22, marginTop: 6 }}>
        <div style={popIn(sp(t, s))}><ClaudeIcon size={124} /></div>
        <div style={popIn(sp(t, s + 0.12))}><IconTile n="phone" size={124} bg="linear-gradient(160deg,#3BB273,#2FA36B)" /></div>
      </div>
      <Bezel style={{ width: 760, marginTop: 30, ...rise(sp(t, s + 0.15)) }} inner={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }} r={28}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: "#EFE6DE" }} />
        <span style={{ flex: 1, fontSize: word ? 40 : 30, fontWeight: word ? 900 : 600, color: word ? P.ink : P.gray, letterSpacing: word ? 2 : 0 }}>{word || "Kommentar hinzufügen …"}</span>
        <span style={{ fontSize: 28, fontWeight: 800, color: word.length === 5 ? P.blue : "#B9CBF2" }}>Posten</span>
      </Bezel>
      <Bezel style={{ width: 620, marginTop: 22, ...rise(sp(t, 43.1)) }} inner={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 16 }} r={26}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: "#EFE6DE" }} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 26, fontWeight: 800 }}>@deinhandle</div><div style={{ fontSize: 20, color: P.mid }}>Anruf-Kit: Prompt, Skill, Morgen-Anruf</div></div>
        <div style={{ background: following ? "#EFEFEF" : P.blue, color: following ? P.ink : "#fff", borderRadius: 12, padding: "10px 20px", fontSize: 24, fontWeight: 800 }}>{following ? "Gefolgt" : "Folgen"}</div>
      </Bezel>
      <div style={{ marginTop: 22, ...popIn(sp(t, 44.3, 10, 200)) }}><Chip style={{ fontSize: 24 }}><Icon n="file" s={30} c={P.orange} />Das Anruf-Kit (PDF)</Chip></div>
    </Zone>
  );
};

// keine Kapitel-Pille in diesem Video (schnelle Schnitte)
export const CHAPTERS: [number, number, string, string][] = [];
export const CHAPTER_END = 0;
export const CHAPTER_TOTAL = 1;

// Szenenwechsel inkl. Unter-Schnitten → für den Zoom-Punch
export const CUTS = [1.72, 2.4, 3.1, 4.6, 5.66, 7.92, 11.3, 12.48, 15.0, 18.62, 23.7, 26.08, 29.92, 32.4, 35.52, 40.0, 41.66];

export const SCENES: { start: number; C: React.FC<SP> }[] = [
  { start: 0, C: S0 },
  { start: 3.1, C: S1 },
  { start: 5.66, C: S2 },
  { start: 7.92, C: S3 },
  { start: 12.48, C: S4 },
  { start: 15.0, C: S5 },
  { start: 18.62, C: S6 },
  { start: 26.08, C: S7 },
  { start: 29.92, C: S8 },
  { start: 35.52, C: S9 },
  { start: 41.66, C: S10 },
];
