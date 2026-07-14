#!/usr/bin/env python3
"""Prerender lecture narration with Mistral Voxtral TTS + per-chapter timing sidecar.

Output per (voice, lecture):
  md/audio/<voiceKey>/lecture-<id>.mp3     concatenated narration
  md/audio/<voiceKey>/lecture-<id>.json    { duration, chapters:[{id,title,t}] }
  md/audio/<voiceKey>/lecture-<id>.sha     change-detection hash
Voices from build/voices.json {key: voiceSlugOrId} (or TTS_VOICE/TTS_VOICE_KEY env).
Usage: python build/tts.py [--voice KEY]... [--force] [lectureId ...]
Blocked (guardrail) or invalid chunks are skipped, not fatal. Env: MISTRAL_API_KEY
"""
import os, re, sys, json, base64, hashlib, subprocess, tempfile, urllib.request, time

API="https://api.mistral.ai/v1/audio/speech"; MODEL="voxtral-mini-tts-2603"
KEY=os.environ.get("MISTRAL_API_KEY")
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD=os.path.join(ROOT,"md"); MAXW=200

def slug(t): return re.sub(r'[^a-z0-9]+','-', t.lower()).strip('-')

def segments(md):
    """Return [(text, heading_id, heading_title)] chunks, each under one heading."""
    md=re.sub(r'^---\n.*?\n---\n','',md,count=1,flags=re.S)
    md=re.sub(r'^:::\s*figure[^\n]*\n.*?\n:::\s*$','',md,flags=re.S|re.M)
    md=re.sub(r'^:::\s*added\s*([^\n]*)\n(.*?)\n:::\s*$',
        lambda m:"## __added__\nEditor's note. "+(m.group(1).strip()+". " if m.group(1).strip() else "")+m.group(2).strip()+"\n",
        md,flags=re.S|re.M)
    md=re.sub(r'```.*?```',' ',md,flags=re.S)
    segs=[]; buf=[]; n=0; cid=""; ctitle=""
    def flush(cid,ctitle):
        if buf:
            segs.append((' '.join(buf).strip(), cid, ctitle))
    for ln in md.split('\n'):
        s=ln.rstrip()
        h=re.match(r'^(#{1,6})\s+(.*)$', s)
        if h:
            flush(cid,ctitle); buf.clear(); n=0
            title=h.group(2).strip()
            if title=="__added__":
                # keep current chapter, do not create a heading segment
                continue
            cid=slug(title); ctitle=title
            buf.append(title.rstrip('.')+'.'); n=len(title.split())
            continue
        if not s.strip(): continue
        s=re.sub(r'^\s*>\s?','',s)
        s=re.sub(r'^\s*[-*+]\s+','',s); s=re.sub(r'^\s*\d+\.\s+','',s)
        s=re.sub(r'!\[[^\]]*\]\([^)]*\)','',s); s=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',s)
        s=re.sub(r'https?://\S+','',s); s=re.sub(r'[*_`#]','',s); s=re.sub(r'[ \t]+',' ',s).strip()
        if not s: continue
        for sent in re.findall(r'[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$', s):
            sent=sent.strip()
            if not sent: continue
            w=len(sent.split())
            if n+w>MAXW and buf:
                flush(cid,ctitle); buf.clear(); n=0
            buf.append(sent); n+=w
    flush(cid,ctitle)
    return [x for x in segs if x[0]]

_win=[]; LIMIT=18000
def _throttle(chars):
    while True:
        now=time.time()
        while _win and _win[0][0]<now-60: _win.pop(0)
        if not _win or sum(c for _,c in _win)+chars<=LIMIT: break
        time.sleep(1.0)
    _win.append((time.time(),chars)); time.sleep(0.35)

def synth(text, voice):
    _throttle(len(text))
    body=json.dumps({"model":MODEL,"input":text,"voice":voice,"response_format":"mp3"}).encode()
    for attempt in range(6):
        req=urllib.request.Request(API,data=body,method="POST",
            headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
        try:
            with urllib.request.urlopen(req,timeout=180) as r:
                return base64.b64decode(json.load(r)["audio_data"])
        except urllib.error.HTTPError as e:
            b=e.read()
            if e.code==403 and b'guardrail' in b: print("    [skip] guardrail-blocked chunk"); return None
            if e.code in (400,422): print("    [skip] rejected (%d)"%e.code); return None
            if e.code in (429,500,502,503) or (e.code==403 and b'rate' in b.lower()):
                ra=e.headers.get("Retry-After"); time.sleep(float(ra) if ra else min(45,3*2**attempt)); continue
            print("    [skip] HTTP %d: %r"%(e.code,b[:120])); return None
    print("    [skip] exhausted retries"); return None

def dur(path):
    out=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",path],
        capture_output=True,text=True).stdout.strip()
    try: return float(out)
    except: return 0.0

def build(key, voice, id, force):
    src=os.path.join(MD,f"lecture-{id}.md")
    if not os.path.exists(src): return
    out=os.path.join(MD,"audio",key); os.makedirs(out,exist_ok=True)
    raw=open(src,encoding="utf-8").read()
    segs=segments(raw)
    h=hashlib.sha256((voice+"\n"+"\n".join(s[0] for s in segs)).encode()).hexdigest()[:16]
    mp3=os.path.join(out,f"lecture-{id}.mp3"); js=os.path.join(out,f"lecture-{id}.json"); sc=os.path.join(out,f"lecture-{id}.sha")
    if os.path.exists(mp3) and os.path.exists(js) and os.path.exists(sc) and open(sc).read().strip()==h and not force:
        print(f"[{key}/{id}] up-to-date"); return
    print(f"[{key}/{id}] {len(segs)} chunks ~${sum(len(s[0]) for s in segs)/1000*0.016:.2f}")
    tmp=tempfile.mkdtemp(); files=[]; skipped=0; cum=0.0; chapters=[]; last=None
    for txt,hid,title in segs:
        a=synth(txt,voice)
        if a is None: skipped+=1; continue
        fn=os.path.join(tmp,f"{len(files):04d}.mp3"); open(fn,"wb").write(a); files.append(fn)
        if hid and hid!=last:
            chapters.append({"id":hid,"title":title,"t":round(cum,2)}); last=hid
        cum+=dur(fn)
    if not files: print(f"[{key}/{id}] all chunks skipped"); return
    lst=os.path.join(tmp,"l.txt"); open(lst,"w").write("".join(f"file '{f}'\n" for f in files))
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c:a","libmp3lame","-b:a","48k","-ac","1",mp3],
        check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    json.dump({"duration":round(dur(mp3),2),"chapters":chapters}, open(js,"w"))
    open(sc,"w").write(h)
    print(f"[{key}/{id}] {os.path.getsize(mp3)//1024} KB, {len(chapters)} chapters"+(f", {skipped} skipped" if skipped else ""))

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
