// Skript + Timing. "cap" = Untertitel, "tts" = Sprechtext (Zahlen/Abkürzungen lautsprachlich).
// Solange noch keine Stimme da ist, werden die Startzeiten geschätzt (STIL-TEST).
// Nach der Sprachaufnahme: words.json mit echten Wort-Zeitstempeln füllen -> alles richtet sich automatisch danach.
import WORDS_REAL from "./words.json";

export type Seg = { id: string; cap: string; tts: string; est: number };

export const SEGS: Seg[] = [
  { id: "hook", est: 4.0, cap: "Du nimmst Vitamin D3 – aber ohne K2? Dann fehlt dir das halbe Team!", tts: "Du nimmst Vitamin D-drei – aber ohne K-zwei? Dann fehlt dir das halbe Team!" },
  { id: "sunny", est: 6.0, cap: "Das ist Sunny. Im Sommer tankt dein Körper Vitamin D ganz easy über die Sonne auf deiner Haut.", tts: "Das ist Sunny. Im Sommer tankt dein Körper Vitamin D ganz easy über die Sonne auf deiner Haut." },
  { id: "winter", est: 4.3, cap: "Aber von Oktober bis März? Da reicht die Sonne bei uns meistens nicht.", tts: "Aber von Oktober bis März? Da reicht die Sonne bei uns meistens nicht." },
  { id: "jump", est: 3.0, cap: "Also kommt die Sonne einfach zu dir in die Küche!", tts: "Also kommt die Sonne einfach zu dir in die Küche!" },
  { id: "d3", est: 8.0, cap: "Vitamin D3 trägt zur normalen Aufnahme von Calcium bei, zu normalen Knochen und Muskeln – und zu einer normalen Funktion des Immunsystems.", tts: "Vitamin D-drei trägt zur normalen Aufnahme von Calcium bei, zu normalen Knochen und Muskeln – und zu einer normalen Funktion des Immunsystems." },
  { id: "k2", est: 5.5, cap: "Und das hier ist Kay. Kay wie K2. Vitamin K trägt zur Erhaltung normaler Knochen bei.", tts: "Und das hier ist Kay. Kay wie K-zwei. Vitamin K trägt zur Erhaltung normaler Knochen bei." },
  { id: "team", est: 7.0, cap: "Stell's dir so vor: D3 holt das Calcium rein, K2 kümmert sich mit um deine Knochen. Zusammen: ein echtes Dream-Team!", tts: "Stell's dir so vor: D-drei holt das Calcium rein, K-zwei kümmert sich mit um deine Knochen. Zusammen: ein echtes Dream-Team!" },
  { id: "tipp", est: 4.6, cap: "Kleiner Tipp: Beide sind fettlöslich. Nimm sie am besten zu einer Mahlzeit.", tts: "Kleiner Tipp: Beide sind fettlöslich. Nimm sie am besten zu einer Mahlzeit." },
  { id: "gummy", est: 4.8, cap: "Und als Gummies? Ohne Zucker, ohne künstlichen Schnickschnack – einfach natürlich.", tts: "Und als Gummies? Ohne Zucker, ohne künstlichen Schnickschnack – einfach natürlich." },
  { id: "cta", est: 5.6, cap: "Kommentier SONNE und ich schick dir meinen Guide, worauf du bei D3 und K2 achten solltest!", tts: "Kommentier Sonne und ich schick dir meinen Guide, worauf du bei D-drei und K-zwei achten solltest!" },
];

export type Word = { w: string; s: number; e: number; seg: number };

const real = WORDS_REAL as { w: string; s: number; e: number }[];

// Geschätzte Wort-Zeiten: Dauer pro Segment proportional zur Wortlänge verteilen
const estimate = (): Word[] => {
  const out: Word[] = [];
  let t = 0.25;
  SEGS.forEach((g, si) => {
    const ws = g.cap.split(/\s+/).filter((w) => w !== "–");
    const total = ws.reduce((a, w) => a + w.length + 2, 0);
    const speak = g.est - 0.35;
    let c = t;
    ws.forEach((w) => {
      const d = ((w.length + 2) / total) * speak;
      out.push({ w, s: c, e: c + d * 0.92, seg: si });
      c += d;
    });
    t += g.est;
  });
  return out;
};

// Echte Zeitstempel einem Segment zuordnen (gleiche Wortanzahl je Segment wie im Untertitel-Text)
const fromReal = (): Word[] => {
  const out: Word[] = [];
  let i = 0;
  SEGS.forEach((g, si) => {
    const n = g.cap.split(/\s+/).filter((w) => w !== "–").length;
    for (let k = 0; k < n && i < real.length; k++, i++) out.push({ ...real[i], seg: si });
  });
  return out;
};

export const HAS_VOICE = real.length > 0;
export const WORDS: Word[] = HAS_VOICE ? fromReal() : estimate();

// Segment-Startzeiten (erstes Wort minus kleiner Vorlauf)
export const START: Record<string, number> = {};
SEGS.forEach((g, si) => {
  const first = WORDS.find((w) => w.seg === si);
  START[g.id] = si === 0 ? 0 : (first ? first.s - 0.12 : 0);
});
// Zeit, zu der ein bestimmtes Wort (Teilstring) in einem Segment beginnt – für Animationen auf dem Wort
export const at = (seg: string, word: string, nth = 0): number => {
  const si = SEGS.findIndex((g) => g.id === seg);
  const hits = WORDS.filter((w) => w.seg === si && w.w.toLowerCase().includes(word.toLowerCase()));
  const h = hits[nth] ?? hits[0];
  return h ? h.s : START[seg];
};
export const END = WORDS[WORDS.length - 1].e;
export const DURATION = END + 1.1;
