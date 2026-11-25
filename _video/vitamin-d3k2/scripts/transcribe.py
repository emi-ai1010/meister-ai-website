# Wort-Zeitstempel mit Whisper erzeugen.
# Aufruf: python3 scripts/transcribe.py public/audio/voice.wav public/audio/whisper_words.json "Claude, GitHub, ..."
import sys, json
from faster_whisper import WhisperModel

audio, out_path = sys.argv[1], sys.argv[2]
hint = sys.argv[3] if len(sys.argv) > 3 else "Claude, Skills, GitHub"
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = m.transcribe(audio, language="de", word_timestamps=True, initial_prompt=hint)
out = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump(out, open(out_path, "w"), ensure_ascii=False)
print(" ".join(o["w"] for o in out))
