#!/bin/zsh
# Rohe Sprachaufnahme -> fertige voice.wav + Wort-Zeitstempel.
# Aufruf (im Projektordner): scripts/process_voice.sh <roh.mp3> ["Whisper-Hinweiswörter"]
# Tempo anpassen: TEMPO=1.25 scripts/process_voice.sh ...
set -e
IN="$1"
HINT="${2:-Claude, Skills, GitHub}"
TEMPO="${TEMPO:-1.2}"
A=public/audio
mkdir -p $A

# Stille am Anfang entfernen, Pausen > 0,22 s auf 0,16 s kürzen, Tempo hoch, Lautheit -14 LUFS
ffmpeg -hide_banner -loglevel error -y -i "$IN" \
  -af "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.22:stop_threshold=-45dB:stop_silence=0.16,atempo=$TEMPO,loudnorm=I=-14:TP=-1" \
  -ar 44100 -ac 1 $A/voice.wav
ffmpeg -i $A/voice.wav 2>&1 | grep Duration

python3 scripts/transcribe.py $A/voice.wav $A/whisper_words.json "$HINT"
python3 scripts/make_captions.py
