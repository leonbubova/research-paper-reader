#!/usr/bin/env python3
"""Generate short Voxtral samples across a range of distinct speakers + an audition page."""
import os, re, json, base64, subprocess, tempfile, urllib.request
API="https://api.mistral.ai/v1/audio/speech"; MODEL="voxtral-mini-tts-2603"
KEY=os.environ["MISTRAL_API_KEY"]
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,"md","audio","samples")
SAMPLE=("Maybe you're trying to get into AI research, or you're in industry, "
        "presenting the latest advances to your colleagues. Either way, you'll face "
        "the task of understanding the state of a field and the gaps left to fill. "
        "A structured approach makes that far less daunting. Let's walk through how "
        "to read a research paper.")

def voices():
    req=urllib.request.Request("https://api.mistral.ai/v1/audio/voices",
        headers={"Authorization":"Bearer "+KEY})
    return json.load(urllib.request.urlopen(req, timeout=60)).get("items",[])

def synth(voice, fmt="mp3"):
    body=json.dumps({"model":MODEL,"input":SAMPLE,"voice":voice,"response_format":fmt}).encode()
    req=urllib.request.Request(API, data=body, method="POST",
        headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    return base64.b64decode(json.load(urllib.request.urlopen(req, timeout=120))["audio_data"])

def is_en(v): return any(str(l).lower().startswith(("en","gb","us")) for l in (v.get("languages") or []))
NEUTRALISH={"neutral","balanced","calm","even","relaxed","warm","clear","professional","narration"}

def pick(vs):
    # one variant per distinct speaker, prefer a neutral/narration-friendly tag
    by={}
    for v in vs:
        if not is_en(v): continue
        base=(v.get("name") or v.get("slug","")).split(" - ")[0].strip()
        score=len(NEUTRALISH & set(v.get("tags") or []))
        if base not in by or score>by[base][0]:
            by[base]=(score,v)
    return [t[1] for t in sorted(by.values(), key=lambda t:(-t[0], t[1].get("name","")))]

def main():
    os.makedirs(OUT, exist_ok=True)
    vs=voices()
    en=[v for v in vs if is_en(v)]; other=[v for v in vs if not is_en(v)]
    en.sort(key=lambda v:(v.get('name') or '')); other.sort(key=lambda v:(v.get('lang') if v.get('lang') else (v.get('languages') or [''])[0], v.get('name') or ''))
    sel=en+other
    print(f"{len(sel)} preset voices ({len(en)} English)")
    man=[]
    for v in sel:
        slug=v.get("slug") or v.get("id")
        try:
            audio=synth(slug); open(os.path.join(OUT, slug+".mp3"),"wb").write(audio)
            man.append({"slug":slug,"name":v.get("name"),"gender":v.get("gender"),
                        "lang":(v.get("languages") or [""])[0],"tags":v.get("tags") or []})
            print("  ok", slug)
        except Exception as e:
            print("  FAIL", slug, repr(e)[:120])
    json.dump({"sample":SAMPLE,"voices":man}, open(os.path.join(OUT,"manifest.json"),"w"), indent=2)
    print("manifest:", len(man), "samples")

if __name__=="__main__": main()
