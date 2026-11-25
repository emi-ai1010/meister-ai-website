# Erzeugt lizenzfreie Soundeffekte (synthetisch): Pops, tiefer Plopp, Whoosh (links -> rechts).
# Aufruf: python3 scripts/make_sfx.py public/sfx
import numpy as np, wave, sys, os

SR = 44100
out_dir = sys.argv[1] if len(sys.argv) > 1 else "public/sfx"
os.makedirs(out_dir, exist_ok=True)
rng = np.random.default_rng(3)

def save(name, st):
    st = np.atleast_2d(st)
    if st.shape[0] == 1: st = np.vstack([st, st])
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.9
    with wave.open(os.path.join(out_dir, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st.T * 32767).astype("<i2").tobytes())

def pop(f0, f1, dur, decay):
    t = np.arange(int(dur * SR)) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 45)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s += 0.25 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * np.exp(-t * 60)
    env = np.minimum(1, t / 0.002) * np.exp(-t / decay)
    click = np.zeros_like(t); n = int(0.003 * SR); click[:n] = rng.standard_normal(n) * np.linspace(1, 0, n) * 0.3
    return s * env + click

save("pop1.wav", pop(1100, 380, 0.16, 0.045))
save("pop2.wav", pop(1300, 460, 0.16, 0.04))
save("pop3.wav", pop(950, 330, 0.17, 0.05))
save("pop_low.wav", pop(420, 110, 0.32, 0.09))

def whoosh(dur=0.42, f_lo=500, f_hi=4200, pan=True):
    n = int(dur * SR); N = 1024; hop = 256
    out = np.zeros(n + N); win = np.hanning(N)
    freqs = np.fft.rfftfreq(N, 1 / SR)
    for k, i in enumerate(range(0, n, hop)):
        x = i / n
        fc = f_lo + (f_hi - f_lo) * np.sin(np.pi * x) ** 1.2
        mag = np.exp(-((freqs - fc) / (fc * 0.55)) ** 2)
        spec = mag * np.exp(1j * rng.uniform(0, 2 * np.pi, len(freqs)))
        out[i:i + N] += np.fft.irfft(spec, N) * win
    s = out[:n]
    t = np.arange(n) / n
    s *= np.sin(np.pi * t) ** 1.6
    if not pan: return s
    left = s * np.cos(t * np.pi / 2); right = s * np.sin(t * np.pi / 2)
    return np.vstack([left, right])

save("whoosh.wav", whoosh())
save("whoosh_short.wav", whoosh(0.26, 700, 5000))
print("ok", sorted(os.listdir(out_dir)))
