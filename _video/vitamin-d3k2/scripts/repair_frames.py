# Findet kaputte Einzelbilder (zufällige Render-Glitches) in out/seq und listet sie auf.
# Ein Bild gilt als kaputt, wenn es stark von BEIDEN Nachbarn abweicht, die Nachbarn sich aber ähneln.
# Aufruf: python3 scripts/repair_frames.py out/seq  -> druckt Frame-Nummern
import sys, os, subprocess
import numpy as np

d = sys.argv[1]
files = sorted(f for f in os.listdir(d) if f.endswith(".jpeg") or f.endswith(".jpg") or f.endswith(".png"))

def small(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-vf", "scale=54:96", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).astype(np.float32)

imgs = [small(os.path.join(d, f)) for f in files]
bad = []
for i in range(1, len(imgs) - 1):
    a = np.abs(imgs[i] - imgs[i - 1]).mean()
    b = np.abs(imgs[i] - imgs[i + 1]).mean()
    c = np.abs(imgs[i - 1] - imgs[i + 1]).mean()
    if min(a, b) > 6 and c < min(a, b) * 0.5:
        bad.append(i)
print(" ".join(str(int(files[i].split("-")[-1].split(".")[0])) for i in bad))
