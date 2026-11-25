# Ruhige, lizenzfreie Erklärvideo-Musik (synthetisch): Marimba/Piano-Plucks, warme Fläche, leichter Shaker.
# Aufruf: python3 make_music_explainer.py <ausgabe.wav> <sekunden>
import numpy as np, wave, sys

SR = 44100
OUT = sys.argv[1]
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
BPM = 100
beat = 60 / BPM
N = int(SR * DUR)
out = np.zeros((N, 2))
rng = np.random.default_rng(11)

note = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    out[i:i + len(sig), 0] += sig * (1 - max(0, pan))
    out[i:i + len(sig), 1] += sig * (1 + min(0, pan))

def marimba(f, dur=0.9):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 18) + 0.15 * np.sin(2 * np.pi * f * 2 * t)
    return s * np.minimum(1, t / 0.004) * np.exp(-t * 4.2)

def piano(f, dur=1.6):
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(1, 1), (2, .4), (3, .18), (4, .08)])
    return s * np.minimum(1, t / 0.006) * np.exp(-t * 2.2)

def pad(freqs, dur):
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 0.3 * t) * 0.3) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8).clip(0, 1)
    return s * env

# Akkorde: C – G – Am – F (freundlich, „Erklärvideo“)
chords = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64], [53, 57, 60, 65]]
bass = [48, 43, 45, 41]
bar = 4 * beat
melody_pattern = [0, 2, 1, 2, 0, 2, 1, 2]  # Arpeggio-Indizes in Achteln
for b in range(int(DUR / bar) + 1):
    t0 = b * bar
    c = chords[b % 4]
    add(pad([note(m) for m in c], bar + 0.6), t0, gain=0.035)
    add(piano(note(bass[b % 4]), 1.8), t0, gain=0.18)
    for k, idx in enumerate(melody_pattern):
        m = c[idx % len(c)] + 12
        add(marimba(note(m)), t0 + k * beat / 2, pan=(0.25 if k % 2 else -0.25), gain=0.09 if k % 4 == 0 else 0.06)
    if b % 2 == 1:  # kleine Piano-Melodie jede 2. Takt
        for k, m in enumerate([c[-1] + 12, c[1] + 12, c[0] + 12]):
            add(piano(note(m), 1.2), t0 + (k * 1.5) * beat, pan=0.1, gain=0.07)
    for k in range(8):  # leiser Shaker
        tt = np.arange(int(0.05 * SR)) / SR
        nz = rng.standard_normal(len(tt)); hp = nz - np.roll(nz, 1)
        add(hp * np.exp(-tt * 90), t0 + k * beat / 2 + 0.01, pan=0.3, gain=0.018 if k % 2 else 0.028)

fade = int(1.2 * SR); out[:fade] *= np.linspace(0, 1, fade)[:, None]
fo = int(2.5 * SR); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
out /= np.max(np.abs(out)) * 1.12
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
print("ok", DUR)
