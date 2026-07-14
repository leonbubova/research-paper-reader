#!/usr/bin/env python3
"""Prerender lecture narration with Mistral Voxtral TTS, one MP3 per (voice, lecture).

Output: md/audio/<voiceKey>/lecture-<id>.mp3  (+ .sha for change detection)
Voices come from build/voices.json {key: voiceSlugOrId} (or TTS_VOICE/TTS_VOICE_KEY env).
Usage: python build/tts.py [--voice KEY]... [--force] [lectureId ...]
Env: MISTRAL_API_KEY
"""
import os, re, sys, json, base64, hashlib, subprocess, tempfile, urllib.request

API="https://api.mistral.ai/v1/audio/speech"; MODEL="voxtral-mini-tts-2603"
KEY=os.environ.get("MISTRAL_API_KEY")
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD=os.path.join(ROOT,"md"); MAXW=200

def clean(md):
    md=re.sub(r'^---\n.*?\n---\n','',md,count=1,flags=re.S)
    md=re.sub(r'^:::\s*figure[^\n]*\n.*?\n:::\s*$','',md,flags=re.S|re.M)
    md=re.sub(r'^:::\s*added\s*([^\n]*)\n(.*?)\n:::\s*$',
        lambda m:"Editor's note. "+(m.group(1).strip()+". " if m.group(1).strip() else "")+m.group(2).strip()+"\n",
        md,flags=re.S|re.M)
    md=re.sub(r'```.*?```',' ',md,flags=re.S)
    out=[]
    for ln in md.split('\n'):
        s=ln.rstrip()
        if not s.strip(): out.append(''); continue
        s=re.sub(r'^\s*>\s?','',s)
        h=re.match(r'^(#{1,6})\s+(.*)$',s)
        if h: s=h.group(2).rstrip('.')+'.'
        s=re.sub(r'^\s*[-*+]\s+','',s); s=re.sub(r'^\s*\d+\.\s+','',s)
        s=re.sub(r'!\[[^\]]*\]\([^)]*\)','',s); s=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',s)
        s=re.sub(r'https?://\S+','',s); s=re.sub(r'[*_`#]','',s)
        out.append(s.strip())
    t='\n'.join(out); t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n{3,}','\n\n',t)
    return t.strip()

def chunks(text):
    parts=[]; buf=[]; n=0
    for para in text.split('\n\n'):
        for s in re.findall(r'[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$',para):
            w=len(s.split())
            if n+w>MAXW and buf: parts.append(' '.join(buf).strip()); buf=[]; n=0
            buf.append(s.strip()); n+=w
        if buf: parts.append(' '.join(buf).strip()); buf=[]; n=0
    return [p for p in parts if p]

def synth(text, voice):
    body=json.dumps({"model":MODEL,"input":text,"voice":voice,"response_format":"mp3"}).encode()
    req=urllib.request.Request(API,data=body,method="POST",
        headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    return base64.b64decode(json.load(urllib.request.urlopen(req,timeout=180))["audio_data"])

def build(key, voice, id, force):
    src=os.path.join(MD,f"lecture-{id}.md")
    if not os.path.exists(src): return
    out=os.path.join(MD,"audio",key); os.makedirs(out,exist_ok=True)
    text=clean(open(src,encoding="utf-8").read())
    h=hashlib.sha256((voice+"\n"+text).encode()).hexdigest()[:16]
    mp3=os.path.join(out,f"lecture-{id}.mp3"); sc=os.path.join(out,f"lecture-{id}.sha")
    if os.path.exists(mp3) and os.path.exists(sc) and open(sc).read().strip()==h and not force:
        print(f"[{key}/{id}] up-to-date"); return
    cs=chunks(text); print(f"[{key}/{id}] {len(cs)} chunks ~${sum(len(c) for c in cs)/1000*0.016:.2f}")
    tmp=tempfile.mkdtemp(); files=[]
    for i,c in enumerate(cs):
        open(os.path.join(tmp,f"{i:04d}.mp3"),"wb").write(synth(c,voice)); files.append(os.path.join(tmp,f"{i:04d}.mp3"))
    lst=os.path.join(tmp,"l.txt"); open(lst,"w").write("".join(f"file '{f}'\n" for f in files))
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c:a","libmp3lame","-b:a","48k","-ac","1",mp3],
        check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    open(sc,"w").write(h); print(f"[{key}/{id}] {os.path.getsize(mp3)//1024} KB")

def main():
    if not KEY: sys.exit("MISTRAL_API_KEY not set")
    a=sys.argv[1:]; force="--force" in a
    only=[a[i+1] for i,x in enumerate(a) if x=="--voice" and i+1<len(a)]
    ids=[x for i,x in enumerate(a) if not x.startswith("--") and not (i>0 and a[i-1]=="--voice")]
    reg={}
    vp=os.path.join(ROOT,"build","voices.json")
    if os.path.exists(vp): reg=json.load(open(vp))
    elif os.environ.get("TTS_VOICE"): reg={os.environ.get("TTS_VOICE_KEY","voice"):os.environ["TTS_VOICE"]}
    if only: reg={k:v for k,v in reg.items() if k in only}
    if not ids:
        ids=sorted(re.match(r'lecture-(.+)\.md',f).group(1) for f in os.listdir(MD) if re.match(r'lecture-.+\.md',f))
    for key,voice in reg.items():
        for i in ids: build(key,voice,i,force)

if __name__=="__main__": main()
