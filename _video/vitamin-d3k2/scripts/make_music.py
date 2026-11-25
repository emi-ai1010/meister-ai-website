# Erzeugt einen leichten, lizenzfreien Lo-Fi/Tech-Beat (synthetisch) als WAV.
import numpy as np, wave, sys
SR = 44100
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 78.0
BPM = 112
beat = 60 / BPM
N = int(SR * DUR)
out = np.zeros((N, 2))
rng = np.random.default_rng(7)

def note(m):  # MIDI -> Hz
    return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    out[i:i + len(sig), 0] += sig * (1 - max(0, pan))
    out[i:i + len(sig), 1] += sig * (1 + min(0, pan))

def tone(f, dur, harm=(1, .5, .25, .12), att=0.01, dec=None):
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * (k + 1) * t + k) for k, a in enumerate(harm))
    env = np.minimum(1, t / att)
    env *= np.exp(-t / dec) if dec else np.minimum(1, (dur - t) / 0.3).clip(0, 1)
    return s * env

# Akkorde: Am7 - Fmaj7 - C - G (je 1 Takt = 4 Beats)
chords = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]]
bass = [45, 41, 48, 43]
bar = 4 * beat
nbars = int(DUR / bar) + 1
kick_times = []
for b in range(nbars):
    t0 = b * bar
    c = chords[b % 4]
    # Pad (weich, leicht verstimmt)
    for m in c:
        for det in (-0.08, 0.08):
            add(tone(note(m) * (1 + det / 100), bar, harm=(1, .3, .1, .05), att=0.4), t0, pan=det * 4, gain=0.05)
    # Bass
    for k in (0, 2.5):
        add(tone(note(bass[b % 4]), beat * 1.4, harm=(1, .35, .1), att=0.005, dec=0.35), t0 + k * beat, gain=0.22)
    # Pluck-Arpeggio (Achtel)
    if b >= 1:
        arp = [c[0] + 12, c[2] + 12, c[1] + 12, c[3] + 12]
        for k in range(8):
            add(tone(note(arp[k % 4]), 0.5, harm=(1, .5, .2, .1, .05), att=0.003, dec=0.12), t0 + k * beat / 2, pan=0.3 if k % 2 else -0.3, gain=0.05)
    # Drums
    for k in range(4):
        tk = t0 + k * beat
        if k in (0, 2) or (b % 2 and k == 3):
            t = np.arange(int(0.35 * SR)) / SR
            f = 50 + 90 * np.exp(-t * 30)
            add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9), tk, gain=0.5)
            kick_times.append(tk)
        if k in (1, 3):  # Snare/Clap weich
            t = np.arange(int(0.25 * SR)) / SR
            nz = rng.standard_normal(len(t))
            add((nz - np.roll(nz, 1)) * 0.5 * np.exp(-t * 18) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.4, tk, gain=0.16)
        for h in (0, 0.5):  # Hi-Hats
            t = np.arange(int(0.06 * SR)) / SR
            nz = rng.standard_normal(len(t)); hp = nz - np.roll(nz, 1)
            add(hp * np.exp(-t * 70), tk + h * beat, pan=0.2, gain=0.05 if h else 0.07)

# Sidechain-Pumpen auf Kick
env = np.ones(N)
for tk in kick_times:
    i = int(tk * SR); L = int(0.25 * SR)
    seg = 1 - 0.45 * np.exp(-np.arange(L) / SR * 14)
    env[i:i + L] = np.minimum(env[i:i + L], seg[: max(0, min(L, N - i))])
out *= env[:, None]
# Ein- und Ausblenden
fade = int(1.0 * SR); out[:fade] *= np.linspace(0, 1, fade)[:, None]
fo = int(2.5 * SR); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
out /= np.max(np.abs(out)) * 1.12
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
print("ok", DUR)
