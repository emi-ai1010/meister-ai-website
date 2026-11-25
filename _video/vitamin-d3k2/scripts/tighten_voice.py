# Stimme straffen: nur echte Stille-Pausen (> 0,36 s) auf ca. 0,26 s kürzen, Hook 1,12x, Rest 1,08x, -14 LUFS.
# Schreibt public/audio/voice.wav und src/words.json (Wort-Zeitstempel passend zur neuen Tonspur).
# Aufruf (im Projektordner): python3 -I scripts/tighten_voice.py
import json, re, wave, subprocess
import numpy as np

RAW = "public/audio/voice_raw.wav"
TIM = "public/audio/voice_raw_timing.json"
SILENCE_DB, MIN_PAUSE, PAD = -40, 0.26, 0.1  # Stille-Schwelle (dB), ab welcher Stille-Länge gekürzt wird, Rest-Stille je Seite
HOOK_SPEED, REST_SPEED = 1.15, 1.1
HOOK_WORDS = 15  # TTS-Wörter im Hook-Satz bis "Team!" (D-drei, K-zwei zählen doppelt)

w = wave.open(RAW); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
d = json.load(open(TIM))
ow = [o for o in d["original_words"] if re.sub(r"\W", "", o["text"])]

# 1) Pausen kürzen – NUR echte Stille im Audio (Lautstärke-Messung), Wörter werden nie angeschnitten
hop = int(0.01 * sr)
rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-9) for i in range(0, len(x) - hop, hop)])
db = 20 * np.log10(rms / (np.max(rms) + 1e-9))
silent = db < SILENCE_DB
runs, i = [], 0
while i < len(silent):
    if silent[i]:
        j = i
        while j < len(silent) and silent[j]: j += 1
        if (j - i) * 0.01 >= MIN_PAUSE: runs.append((i * 0.01, j * 0.01))
        i = j
    else: i += 1
# Anfang: Stille vor dem ersten Wort fast ganz weg; Ende: kurzer Ausklang
cuts = []
for s0, e0 in runs:
    if s0 <= 0.01: cuts.append((0.0, max(0.0, e0 - 0.06)))
    elif e0 >= len(x) / sr - 0.05: cuts.append((s0 + 0.3, len(x) / sr))
    else: cuts.append((s0 + PAD, e0 - PAD))  # in der Mitte der Pause schneiden, PAD Stille bleibt links und rechts
fade = int(0.008 * sr)
parts, mapping, t_new, pos = [], [], 0.0, 0.0
for cs, ce in cuts + [(len(x) / sr, len(x) / sr)]:
    if ce <= pos: continue
    seg = x[int(pos * sr):int(cs * sr)].copy()
    if len(seg) > 2 * fade:
        seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    parts.append(seg); mapping.append((pos, cs, t_new)); t_new += (cs - pos); pos = ce
y = np.concatenate(parts)
removed_peak = max((db[int(cs / 0.01):int(ce / 0.01)].max() for cs, ce in cuts if ce - cs > 0.02), default=-99)
print("lautester entfernter Abschnitt:", round(float(removed_peak), 1), "dB (muss unter", SILENCE_DB, "liegen)")

def cut_t(t):
    for s, e, n in mapping:
        if t <= e: return n + max(0.0, t - s)
    s, e, n = mapping[-1]; return n + (e - s)

# 2) Tempo: Hook schneller als der Rest
H = cut_t(ow[HOOK_WORDS]["start_time"] - 0.05)  # Grenze kurz vor dem ersten Wort nach dem Hook
def final_t(t):
    c = cut_t(t)
    return c / HOOK_SPEED if c <= H else H / HOOK_SPEED + (c - H) / REST_SPEED

def write(path, data):
    o = wave.open(path, "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes(np.clip(data, -32768, 32767).astype(np.int16).tobytes()); o.close()

hi = int(H * sr)
write("out/v_hook.wav", y[:hi]); write("out/v_rest.wav", y[hi:])
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "out/v_hook.wav", "-i", "out/v_rest.wav", "-filter_complex",
                f"[0]atempo={HOOK_SPEED}[a];[1]atempo={REST_SPEED}[b];[a][b]concat=n=2:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=11",
                "-ar", "44100", "public/audio/voice.wav"], check=True)

# 3) Wort-Zeitstempel an Untertitel-Wörter anpassen (D-drei -> D3 usw.)
src = open("src/script.ts").read()
caps = re.findall(r'cap: "([^"]+)"', src)
cw = [c for cap in caps for c in cap.split() if c != "–"]
n = lambda s: re.sub(r"\W", "", s).lower()
out, j = [], 0
for c in cw:
    target = n(c).replace("d3", "ddrei").replace("k2", "kzwei")
    acc, s = "", None
    while acc != target:
        o = ow[j]; j += 1
        if s is None: s = o["start_time"]
        acc += n(o["text"]); e = o["end_time"]
        assert len(acc) <= len(target), (c, acc)
    out.append({"w": c, "s": round(final_t(s), 3), "e": round(final_t(e), 3)})
json.dump(out, open("src/words.json", "w"), ensure_ascii=False)
print("Länge neu:", round(final_t(ow[-1]["end_time"]) + 0.25, 2), "s · Hook endet bei", round(H / HOOK_SPEED, 2), "s")
# Schnittstellen in der fertigen Zeitachse (zur Kontrolle)
splices = []
for s, e, n in mapping[:-1]:
    c = n + (e - s)
    splices.append(round(c / HOOK_SPEED if c <= H else H / HOOK_SPEED + (c - H) / REST_SPEED, 3))
json.dump(splices, open("out/splices.json", "w"))
