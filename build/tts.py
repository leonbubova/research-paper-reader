#!/usr/bin/env python3
"""Prerender lecture narration with Mistral Voxtral TTS.

Reads md/lecture-*.md, converts to clean narration text, synthesizes with
Voxtral (chunked <300 words), concatenates to md/audio/lecture-<id>.mp3.
Skips lectures whose source text is unchanged (hash sidecar). Idempotent.

Env: MISTRAL_API_KEY   Usage: python build/tts.py [id ...]   (default: all)
"""
import os, re, sys, json, base64, hashlib, subprocess, tempfile, urllib.request

API = "https://api.mistral.ai/v1/audio/speech"
MODEL = "voxtral-mini-tts-2603"
VOICE = os.environ.get("TTS_VOICE", "en_paul_neutral")
KEY = os.environ.get("MISTRAL_API_KEY")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD = os.path.join(ROOT, "md"); OUT = os.path.join(MD, "audio")
MAXW = 200

def clean(md):
    # drop front-matter
    md = re.sub(r'^---\n.*?\n---\n', '', md, count=1, flags=re.S)
    # drop figure blocks entirely (visual)
    md = re.sub(r'^:::\s*figure[^\n]*\n.*?\n:::\s*$', '', md, flags=re.S|re.M)
    # added blocks -> spoken note
    md = re.sub(r'^:::\s*added\s*([^\n]*)\n(.*?)\n:::\s*$',
                lambda m: "Editor's note. " + (m.group(1).strip()+". " if m.group(1).strip() else "") + m.group(2).strip() + "\n",
                md, flags=re.S|re.M)
    # drop fenced code
    md = re.sub(r'```.*?```', ' ', md, flags=re.S)
    out=[]
    for ln in md.split('\n'):
        s=ln.rstrip()
        if not s.strip(): out.append(''); continue
        s=re.sub(r'^\s*>\s?', '', s)                 # blockquote
        h=re.match(r'^(#{1,6})\s+(.*)$', s)
        if h: s=h.group(2).rstrip('.')+'.'           # heading -> sentence
        s=re.sub(r'^\s*[-*+]\s+', '', s)             # bullets
        s=re.sub(r'^\s*\d+\.\s+', '', s)             # numbered
        s=re.sub(r'!\[[^\]]*\]\([^)]*\)', '', s)     # images
        s=re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s) # links -> text
        s=re.sub(r'https?://\S+', '', s)             # bare urls
        s=re.sub(r'[*_`#]', '', s)                   # md marks
        out.append(s.strip())
    text='\n'.join(out)
    text=re.sub(r'[ \t]+',' ',text)
    text=re.sub(r'\n{3,}','\n\n',text).strip()
    return text

def chunks(text):
    parts=[]; buf=[]; n=0
    # sentence-ish tokens, keep paragraph breaks as flush hints
    for para in text.split('\n\n'):
        sents=re.findall(r'[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$', para)
        for s in sents:
            w=len(s.split())
            if n+w>MAXW and buf:
                parts.append(' '.join(buf).strip()); buf=[]; n=0
            buf.append(s.strip()); n+=w
        if buf:
            parts.append(' '.join(buf).strip()); buf=[]; n=0
    return [p for p in parts if p]

def synth(text):
    body=json.dumps({"model":MODEL,"input":text,"voice":VOICE,"response_format":"mp3"}).encode()
    req=urllib.request.Request(API, data=body, method="POST",
        headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        d=json.load(r)
    return base64.b64decode(d["audio_data"])

def build(id):
    src=os.path.join(MD, f"lecture-{id}.md")
    if not os.path.exists(src): print(f"[{id}] no md, skip"); return
    text=clean(open(src, encoding="utf-8").read())
    h=hashlib.sha256(text.encode()).hexdigest()[:16]
    mp3=os.path.join(OUT, f"lecture-{id}.mp3"); sc=os.path.join(OUT, f"lecture-{id}.sha")
    if os.path.exists(mp3) and os.path.exists(sc) and open(sc).read().strip()==h and "--force" not in sys.argv:
        print(f"[{id}] up-to-date, skip"); return
    cs=chunks(text)
    chars=sum(len(c) for c in cs)
    print(f"[{id}] {len(cs)} chunks, {chars} chars (~${chars/1000*0.016:.2f})")
    tmp=tempfile.mkdtemp(); files=[]
    for i,c in enumerate(cs):
        audio=synth(c); fn=os.path.join(tmp, f"{i:04d}.mp3"); open(fn,"wb").write(audio); files.append(fn)
        print(f"  [{id}] chunk {i+1}/{len(cs)}", end="\r")
    print()
    listf=os.path.join(tmp,"list.txt"); open(listf,"w").write("".join(f"file '{f}'\n" for f in files))
    os.makedirs(OUT, exist_ok=True)
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",listf,
        "-c:a","libmp3lame","-b:a","48k","-ac","1",mp3], check=True,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    open(sc,"w").write(h)
    print(f"[{id}] wrote {mp3} ({os.path.getsize(mp3)//1024} KB)")

def main():
    if not KEY: sys.exit("MISTRAL_API_KEY not set")
    ids=[a for a in sys.argv[1:] if not a.startswith('-')]
    if not ids:
        ids=sorted(re.match(r'lecture-(.+)\.md',f).group(1)
                   for f in os.listdir(MD) if re.match(r'lecture-.+\.md',f))
    for i in ids: build(i)

if __name__=="__main__": main()
