# Stimme straffen: Pausen > 0,22 s auf 0,16 s kürzen, Hook 1,3x, Rest 1,2x, -14 LUFS.
# Schreibt public/audio/voice.wav und src/words.json (Wort-Zeitstempel passend zur neuen Tonspur).
# Aufruf (im Projektordner): python3 -I scripts/tighten_voice.py
import json, re, wave, subprocess
import numpy as np

RAW = "public/audio/voice_raw.wav"
TIM = "public/audio/voice_raw_timing.json"
MAXGAP, KEEP = 0.22, 0.16
HOOK_SPEED, REST_SPEED = 1.3, 1.2
HOOK_WORDS = 15  # TTS-Wörter im Hook-Satz bis "Team!" (D-drei, K-zwei zählen doppelt)

w = wave.open(RAW); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
d = json.load(open(TIM))
ow = [o for o in d["original_words"] if re.sub(r"\W", "", o["text"])]

# 1) Pausen kürzen -> Liste behaltener Abschnitte (raw_start, raw_end)
keep = []
cur = max(0.0, ow[0]["start_time"] - 0.05)
for a, b in zip(ow, ow[1:]):
    gap = b["start_time"] - a["end_time"]
    if gap > MAXGAP:
        keep.append((cur, a["end_time"] + KEEP / 2))
        cur = b["start_time"] - KEEP / 2
keep.append((cur, min(len(x) / sr, ow[-1]["end_time"] + 0.3)))

fade = int(0.006 * sr)
parts, mapping, t_new = [], [], 0.0
for s, e in keep:
    seg = x[int(s * sr):int(e * sr)].copy()
    seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    parts.append(seg); mapping.append((s, e, t_new)); t_new += (e - s)
y = np.concatenate(parts)

def cut_t(t):
    for s, e, n in mapping:
        if t <= e: return n + max(0.0, t - s)
    s, e, n = mapping[-1]; return n + (e - s)

# 2) Tempo: Hook schneller als der Rest
H = cut_t(ow[HOOK_WORDS - 1]["end_time"] + KEEP / 2)
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
