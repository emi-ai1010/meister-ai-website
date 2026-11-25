# Whisper-Wörter -> src/words.json (Untertitel-Daten).
# Allgemeine Korrekturen sind eingebaut; video-spezifische stehen in scripts/caption_fixes.json:
#   {"replace": {"falsch.": "falsch!"}, "merge": [["Skill", "Verzeichnis", "Skill-Verzeichnis"]],
#    "split": {"Beides": ["Weil", "es"]}, "replace_after": [["Wort", "Skills", "SKILLS,"]]}
import json, os

W = json.load(open("public/audio/whisper_words.json"))
fx = json.load(open("scripts/caption_fixes.json")) if os.path.exists("scripts/caption_fixes.json") else {}
rep, merges, splits = fx.get("replace", {}), fx.get("merge", []), fx.get("split", {})

out, i = [], 0
while i < len(W):
    w = dict(W[i]); t = w["w"]; nxt = W[i + 1]["w"] if i + 1 < len(W) else ""
    # Zahlen wie "1" + ",4" -> "1,4" und "8" + ".000" -> "8.000"
    if t.isdigit() and nxt[:1] in ",." and nxt[1:2].isdigit():
        out.append({"w": t + nxt, "s": w["s"], "e": W[i + 1]["e"]}); i += 2; continue
    # Bindestrich-Wörter wie "Skill" + "-Verzeichnis" und Domains wie "Claude" + ".ai"
    if nxt.startswith("-") or (nxt[:1] == "." and nxt[1:2].isalpha()):
        j, word = i + 1, t
        while j < len(W) and (W[j]["w"].startswith("-") or (W[j]["w"][:1] == "." and W[j]["w"][1:2].isalpha())):
            word += W[j]["w"]; j += 1
        out.append({"w": rep.get(word, word), "s": w["s"], "e": W[j - 1]["e"]}); i = j; continue
    m = next((m for m in merges if m[0] == t and nxt.strip(".,!?").startswith(m[1])), None)
    if m:
        out.append({"w": m[2] + nxt[len(m[1]):], "s": w["s"], "e": W[i + 1]["e"]}); i += 2; continue
    if t in splits:
        parts = splits[t]; step = (w["e"] - w["s"]) / len(parts)
        for k, p in enumerate(parts):
            out.append({"w": p, "s": round(w["s"] + k * step, 3), "e": round(w["s"] + (k + 1) * step, 3)})
        i += 1; continue
    prev = out[-1]["w"] if out else ""
    ctx = next((r[2] for r in fx.get("replace_after", []) if r[0] == prev and r[1] == t), None)
    w["w"] = ctx or rep.get(t, t)
    out.append(w); i += 1

for k in range(len(out) - 1):
    out[k]["e"] = min(out[k]["e"], out[k + 1]["s"])
open("src/words.json", "w").write(json.dumps(out, ensure_ascii=False, indent=0))
print(" ".join(o["w"] for o in out))
