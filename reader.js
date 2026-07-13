// CS197 Reader — renders a Markdown lecture file into the styled reader.
// The Markdown files in /md are the canonical source; this only presents them.
//
// Content provenance:
//   - Normal prose + "Notes"/"To understand" blockquotes = the original author's lecture notes,
//     transcribed verbatim.
//   - ::: added ... :::  blocks = explanations ADDED for this reader (not the author's words).
//   - ::: figure <tag> <src>\n caption \n :::  = a screenshot/figure from the original notes.

(function(){
  var params = new URLSearchParams(location.search);
  var id = (params.get('l') || '').replace(/[^0-9\-]/g,'');
  var root = document.getElementById('doc');
  if(!root) return;
  if(!id){ root.innerHTML = '<p>No lecture specified. <a href="index.html">Back to the index</a>.</p>'; return; }

  fetch('md/lecture-' + id + '.md')
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); })
    .then(function(md){ render(md, id); })
    .catch(function(e){
      root.innerHTML = '<p>Could not load <code>md/lecture-'+id+'.md</code> ('+e.message+').<br>'+
        'If you opened this file directly from disk, browsers block loading local files. '+
        'Run a small server instead:</p><pre><code>cd cs197-reader\npython3 -m http.server</code></pre>'+
        '<p>then open <code>http://localhost:8000/lecture.html?l='+id+'</code>.</p>';
    });

  // ---------- front-matter (small YAML subset) ----------
  function parseFront(md){
    var fm = {}, body = md;
    var m = md.match(/^---\n([\s\S]*?)\n---\n?/);
    if(m){
      body = md.slice(m[0].length);
      var key = null;
      m[1].split('\n').forEach(function(ln){
        var li = ln.match(/^\s*-\s+(.*)$/);
        if(li && key){ (fm[key]=fm[key]||[]).push(strip(li[1])); return; }
        var kv = ln.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if(kv){
          key = kv[1]; var v = kv[2].trim();
          if(v === ''){ fm[key] = []; }
          else if(v[0]==='['){ fm[key] = v.replace(/^\[|\]$/g,'').split(',').map(function(s){return strip(s);}).filter(Boolean); key=null; }
          else { fm[key] = strip(v); key=null; }
        }
      });
    }
    return {fm:fm, body:body};
  }
  function strip(s){ return s.trim().replace(/^["']|["']$/g,''); }

  // ---------- custom container directives ----------
  function extractBlocks(body, store){
    // ::: figure <tag> <src> ... :::
    body = body.replace(/^:::\s*figure\s+(\S+)\s+(\S+)\s*\n([\s\S]*?)\n:::\s*$/gm,
      function(_, tag, src, cap){
        var i = store.length; store.push({type:'figure', tag:tag, src:src, cap:cap.trim()});
        return '\n\n@@BLK'+i+'@@\n\n';
      });
    // ::: added [optional title] ... :::
    body = body.replace(/^:::\s*added\s*(.*)\n([\s\S]*?)\n:::\s*$/gm,
      function(_, title, inner){
        var i = store.length; store.push({type:'added', title:title.trim(), md:inner.trim()});
        return '\n\n@@BLK'+i+'@@\n\n';
      });
    return body;
  }

  function blockHTML(b){
    if(b.type==='figure'){
      var cap = marked.parseInline(b.cap || '');
      var label = (b.cap.split(/[.—]/)[0] || 'Figure').trim();
      var labelHtml = marked.parseInline(label);
      var alt = label.replace(/"/g,'');
      var pic = '<span class="zoom-wrap"><img class="zoom" loading="lazy" src="'+ esc(b.src) +'" alt="'+ alt +'">'+
        '<span class="hint">Click to enlarge</span></span>';
      var figcap = b.cap ? '<figcaption>'+ cap +'</figcaption>' : '';
      // diagrams/charts/flavor images show open inline; UI screenshots collapse
      var openTags = ['portrait','art','open','flavor','photo','figure','diagram','chart'];
      if(openTags.indexOf(b.tag) >= 0){
        return '<figure class="inline'+(b.tag==='portrait'?' portrait':'')+'">'+ pic + figcap +'</figure>';
      }
      return '<details class="fig"><summary><span class="ico" aria-hidden="true">▸</span> '+ labelHtml +
        ' <span class="tag">'+ esc(b.tag) +'</span></summary>'+
        '<div class="body">'+ pic + figcap +'</div></details>';
    }
    if(b.type==='added'){
      return '<aside class="added" aria-label="Added explanation, not part of the original lecture">'+
        '<p class="added-h"><span class="added-ico" aria-hidden="true">✎</span> Added explanation'+
        (b.title? ' — '+esc(b.title):'') +'</p>'+ marked.parse(b.md) +'</aside>';
    }
    return '';
  }

  function render(md, id){
    var parsed = parseFront(md), fm = parsed.fm;
    var blocks = []; var body = extractBlocks(parsed.body, blocks);

    marked.setOptions({gfm:true, breaks:false, headerIds:false, mangle:false});
    var html = marked.parse(body);
    html = html.replace(/<p>@@BLK(\d+)@@<\/p>/g, function(_, n){ return blockHTML(blocks[+n]); });

    document.title = 'Lecture ' + (fm.lecture||id) + ' · ' + (fm.title||'') + ' — CS197 Reader';
    var crumb = document.querySelector('.topbar .crumb');
    if(crumb) crumb.textContent = 'Lecture ' + (fm.lecture||id) + (fm.title? ' — '+fm.title : '');
    var srcA = document.getElementById('srclink');
    if(srcA && fm.source_notes) srcA.href = fm.source_notes;

    // header
    var h = '';
    h += '<p class="kicker">'+ esc(fm.course||'CS197 Harvard') + (fm.term? ' · '+esc(fm.term):'') +
         ' · Lecture ' + esc(fm.lecture||id) +'</p>';
    h += '<h1>'+ esc(fm.title||('Lecture '+id)) +'</h1>';
    if(fm.subtitle) h += '<p class="subtitle">'+ esc(fm.subtitle) +'</p>';
    var meta = [];
    if(fm.instructor) meta.push('Notes by '+esc(fm.instructor));
    if(fm.source_notes) meta.push('<a href="'+esc(fm.source_notes)+'" target="_blank" rel="noopener">original ↗</a>');
    meta.push('<a href="md/lecture-'+id+'.md" target="_blank" rel="noopener">raw .md ↗</a>');
    h += '<p class="meta">'+ meta.join(' · ') +'</p>';

    // provenance legend
    var legend = '<div class="legend" role="note">'+
      '<span><span class="sw orig"></span> Original lecture notes by '+ esc(fm.instructor||'the author') +'</span>'+
      '<span><span class="sw add"></span> <span class="added-ico" aria-hidden="true">✎</span> Explanation added for this reader</span>'+
      '</div>';

    root.innerHTML = '<header class="lec">'+h+'</header>'+ legend +'<div class="mdbody">'+html+'</div>';

    decorate(root);
    afterRender(id);
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  // group a long text into paragraphs of ~n sentences (for readability of quoted abstracts)
  function groupSentences(text, n){
    var sents = text.match(/[^.!?]+[.!?]+["')\]]?(?:\s+|$)/g) || [text];
    var out = [], buf = [];
    sents.forEach(function(s){ buf.push(s.trim()); if(buf.length >= n){ out.push(buf.join(' ')); buf = []; } });
    if(buf.length) out.push(buf.join(' '));
    return out;
  }

  // fast, distance-capped smooth scroll (default CSS smooth is too slow on long jumps)
  var OFFSET = 72;
  var scrolling = null;
  function scrollToEl(el, block){
    if(!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var start = window.pageYOffset || document.documentElement.scrollTop;
    var target = start + el.getBoundingClientRect().top - (block==='center' ? window.innerHeight/2 - 40 : OFFSET);
    target = Math.max(0, target);
    var dist = target - start;
    if(reduce || Math.abs(dist) < 4){ window.scrollTo(0, target); return; }
    var dur = Math.min(420, Math.max(200, Math.abs(dist) * 0.22));
    var t0 = null; var token = {}; scrolling = token;
    function ease(t){ return t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; } // easeInOutQuad
    function step(ts){
      if(scrolling !== token) return;         // a newer scroll superseded this one
      if(t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, start + dist * ease(p));
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // blockquotes -> note asides; heading ids
  function decorate(scope){
    scope.querySelectorAll('.mdbody blockquote').forEach(function(bq){
      var strong = bq.querySelector('strong');
      var head = strong ? strong.textContent.trim() : '';
      var lower = head.toLowerCase();
      if(lower.indexOf('exercise')===0){
        var tip = document.createElement('div'); tip.className='tip';
        tip.innerHTML = '<p class="tip-h">Exercise</p>' + stripLead(bq, strong);
        bq.replaceWith(tip); return;
      }
      if(lower.indexOf('abstract')===0){
        // long quoted abstracts: upright text, split into short paragraphs for readability
        var full = bq.textContent.trim();
        var body = full.slice(head.length).replace(/^\s*[—:\-]?\s*/,'').trim();
        var card = document.createElement('div'); card.className = 'note abstract';
        card.innerHTML = '<p class="note-h">'+esc(head)+'</p>' +
          groupSentences(body, 3).map(function(par){ return '<p>'+esc(par)+'</p>'; }).join('');
        bq.replaceWith(card); return;
      }
      if(lower.indexOf('notes')===0 || lower.indexOf('to understand')===0){
        var isTU = lower.indexOf('to understand')===0;
        var doc = head.replace(/^notes\s*[—:-]?\s*/i,'').replace(/^to understand\s*[—:-]?\s*/i,'');
        var note = document.createElement('div'); note.className='note';
        var kind = isTU ? 'To understand' : 'Notes';
        note.innerHTML = '<p class="note-h">'+kind+ (doc? ' <span class="doc">'+esc(doc)+'</span>':'') +'</p>' + stripLead(bq, strong);
        note.querySelectorAll('em').forEach(function(em){
          if(/self-comment|not sure what|maybe that/i.test(em.textContent)) em.classList.add('qn');
        });
        bq.replaceWith(note); return;
      }
    });
    scope.querySelectorAll('.mdbody h2, .mdbody h3').forEach(function(hh){
      if(!hh.id) hh.id = hh.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    });
  }
  function stripLead(bq, strong){
    var clone = bq.cloneNode(true);
    var s = clone.querySelector('strong');
    if(s){
      var p = s.parentElement; s.remove();
      p.innerHTML = p.innerHTML.replace(/^\s*[—:-]?\s*[^<]*<br\s*\/?>/i, '');
      p.innerHTML = p.innerHTML.replace(/^\s*[—:-]\s*/,'');
      if(p.textContent.trim()==='' && !p.querySelector('a,img')) p.remove();
    }
    return clone.innerHTML;
  }

  function afterRender(id){
    // heading anchors (fast scroll on click)
    document.querySelectorAll('.mdbody h2[id], .mdbody h3[id]').forEach(function(hh){
      var a = document.createElement('a'); a.href='#'+hh.id; a.className='anchor';
      a.textContent='#'; a.setAttribute('aria-label','Link to this section');
      a.addEventListener('click', function(e){ e.preventDefault(); scrollToEl(hh, 'start'); history.replaceState(null,'','#'+hh.id); });
      hh.appendChild(a);
    });
    // progress bar
    var bar = document.getElementById('progress');
    if(bar){
      var onScroll = function(){
        var d=document.documentElement, max=d.scrollHeight-d.clientHeight;
        bar.style.width = (max>0 ? (d.scrollTop/max*100) : 0) + '%';
      };
      document.addEventListener('scroll', onScroll, {passive:true}); onScroll();
    }
    // lightbox
    var lb=document.getElementById('lb'), lbi=lb?lb.querySelector('img'):null;
    if(lb&&lbi){
      document.querySelectorAll('img.zoom').forEach(function(im){
        im.addEventListener('click', function(){ lbi.src=im.currentSrc||im.src; lb.classList.add('open'); });
      });
      lb.addEventListener('click', function(){ lb.classList.remove('open'); lbi.src=''; });
      document.addEventListener('keydown', function(e){ if(e.key==='Escape') lb.classList.remove('open'); });
    }
    buildTOC(id);
    setupHovercards();
    setupBookmark(id);
    if(location.hash){ var t=document.getElementById(location.hash.slice(1)); if(t) scrollToEl(t, 'start'); }
  }

  // ---------- link hovercards ----------
  function setupHovercards(){
    if(window.matchMedia && window.matchMedia('(hover:none)').matches) return;
    var PREV = [
      {re:/2205\.12005/,  img:'assets/l3/mplug-card.png',           t:'mPLUG — arXiv paper'},
      {re:/2205\.14100/,  img:'assets/l3/git-card.png',             t:'GIT — arXiv paper'},
      {re:/1812\.08658/,  img:'assets/l3/nocaps-card.png',          t:'nocaps — arXiv paper'},
      {re:/1504\.00325/,  img:'assets/l3/coco-card.png',            t:'Microsoft COCO Captions — arXiv paper'},
      {re:/9706348|ieeexplore/, img:'assets/l3/survey-abstract.png',t:'From Show to Tell — survey'},
      {re:/paperswithcode\.com\/task/, img:'assets/l3/pwc-image-captioning.png', t:'Papers with Code — Image Captioning'},
      {re:/paperswithcode\.com\/dataset/, img:'assets/l3/pwc-datasets.png', t:'Papers with Code — Datasets'}
    ];
    var card = document.createElement('div'); card.id='hovercard';
    var im = document.createElement('img'); im.alt='';
    var tt = document.createElement('div'); tt.className='hc-t';
    var uu = document.createElement('div'); uu.className='hc-u';
    card.appendChild(im); card.appendChild(tt); card.appendChild(uu);
    document.body.appendChild(card);
    var hideT = null;
    function place(a){
      var r = a.getBoundingClientRect();
      card.style.left = Math.max(8, Math.min(window.innerWidth - card.offsetWidth - 8, r.left)) + 'px';
      var below = r.bottom + 8;
      card.style.top = below + 'px';
      requestAnimationFrame(function(){
        var h = card.offsetHeight;
        if(below + h > window.innerHeight - 8) card.style.top = Math.max(8, r.top - h - 8) + 'px';
      });
    }
    document.querySelectorAll('.mdbody a[href^="http"]').forEach(function(a){
      a.addEventListener('mouseenter', function(){
        clearTimeout(hideT);
        var href = a.href, hit = null;
        for(var i=0;i<PREV.length;i++){ if(PREV[i].re.test(href)){ hit = PREV[i]; break; } }
        if(hit){ im.src = hit.img; card.classList.add('has-img'); tt.textContent = hit.t; }
        else {
          // live page thumbnail of the destination (WordPress mShots — no key required)
          card.classList.add('has-img');
          im.onerror = function(){ card.classList.remove('has-img'); };
          im.src = 'https://s.wordpress.com/mshots/v1/' + encodeURIComponent(href) + '?w=520';
          tt.textContent = (a.textContent||'').trim().replace(/\s+/g,' ').slice(0,90) || 'External link';
        }
        try{ var url = new URL(href); uu.textContent = url.hostname.replace(/^www\./,'') + (url.pathname==='/'?'':url.pathname); }
        catch(e){ uu.textContent = href; }
        card.classList.add('show'); place(a);
      });
      a.addEventListener('mouseleave', function(){ hideT = setTimeout(function(){ card.classList.remove('show'); }, 120); });
    });
  }

  // ---------- desktop table of contents + reading stats ----------
  function buildTOC(id){
    var body = document.querySelector('.mdbody');
    if(!body) return;
    var heads = Array.prototype.slice.call(body.querySelectorAll('h2, h3'));

    // reading size
    var words = (body.innerText.trim().match(/\S+/g) || []).length;
    var mins = Math.max(1, Math.round(words/200));
    var pages = Math.max(1, Math.round(words/450));

    var toc = document.createElement('nav');
    toc.className = 'toc'; toc.setAttribute('aria-label','On this page');
    var meta = '<div class="toc-meta"><strong>Lecture '+esc(id.replace(/^0/,''))+'</strong> of 21'+
      '<br>'+words.toLocaleString()+' words · ~'+mins+' min · ~'+pages+' pp.</div>';
    function sectionWords(h){
      var n = 0, el = h.nextElementSibling;
      while(el && !/^H[23]$/.test(el.tagName)){
        n += (el.innerText.trim().match(/\S+/g) || []).length;
        el = el.nextElementSibling;
      }
      return n;
    }
    var items = heads.map(function(h){
      var lvl = h.tagName === 'H3' ? ' h3' : '';
      var wc = sectionWords(h);
      var label = esc(h.textContent.replace(/#$/,'').trim());
      return '<li><a class="toclink'+lvl+'" href="#'+h.id+'">'+
        '<span class="tt">'+label+'</span>'+
        (wc ? '<span class="wc">'+wc+'</span>' : '') +'</a></li>';
    }).join('');
    toc.innerHTML = meta + '<nav><ul>'+items+'</ul></nav>';
    document.body.appendChild(toc);

    var links = Array.prototype.slice.call(toc.querySelectorAll('.toclink'));
    var map = {};
    links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });

    // smooth-scroll without jumping the hash
    var active = null;
    function setActive(a){ if(active===a) return; if(active) active.classList.remove('active'); active=a; if(a) a.classList.add('active'); }

    links.forEach(function(a){
      a.addEventListener('click', function(e){
        var el = document.getElementById(a.getAttribute('href').slice(1));
        if(el){ e.preventDefault(); scrollToEl(el, 'start');
          setActive(a);                                   // highlight immediately (fixes last/short sections)
          history.replaceState(null,'',a.getAttribute('href')); }
      });
    });

    function atBottom(){ return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2; }
    // scrollspy
    if('IntersectionObserver' in window){
      var visible = {};
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
        if(atBottom() && heads.length){ setActive(map[heads[heads.length-1].id]); return; }
        // pick the topmost heading that is at/above the reading line
        var best=null, bestTop=Infinity;
        heads.forEach(function(h){
          var r=h.getBoundingClientRect();
          if(r.top < 140 && r.top > -9999){ if(140-r.top < bestTop){ bestTop=140-r.top; best=h; } }
        });
        if(!best && heads.length){ best = heads[0]; }
        if(best) setActive(map[best.id]);
      }, {rootMargin:'-120px 0px -70% 0px', threshold:[0,1]});
      heads.forEach(function(h){ io.observe(h); });
    }
    // fallback: also update on scroll (cheap)
    var ticking=false;
    document.addEventListener('scroll', function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var best=null, bestDelta=Infinity;
        heads.forEach(function(h){ var t=h.getBoundingClientRect().top; if(t<=140){ var d=140-t; if(d<bestDelta){bestDelta=d;best=h;} } });
        if(!best && heads.length) best=heads[0];
        if(best) setActive(map[best.id]);
        ticking=false;
      });
    }, {passive:true});
  }

  // ---------- bookmark / Lesezeichen — sentence granularity ----------
  function wrapSentences(p){
    if(p.querySelector('.s')) return;
    var nodes = Array.prototype.slice.call(p.childNodes);
    var frag = document.createDocumentFragment();
    var cur = null;
    function ns(){ cur = document.createElement('span'); cur.className='s'; frag.appendChild(cur); }
    ns();
    nodes.forEach(function(node){
      if(node.nodeType === 3){
        var parts;
        try{ parts = node.textContent.split(/(?<=[.!?…])\s+/); }
        catch(e){ parts = [node.textContent]; }         // no lookbehind support
        parts.forEach(function(part, i){
          if(i > 0){ cur.appendChild(document.createTextNode(' ')); ns(); }
          if(part) cur.appendChild(document.createTextNode(part));
        });
      } else {
        cur.appendChild(node);
      }
    });
    p.textContent = ''; p.appendChild(frag);
  }

  function setupBookmark(id){
    var KEY = 'cs197-bookmark-' + id;
    var mdbody = document.querySelector('.mdbody'); if(!mdbody) return;

    mdbody.querySelectorAll('p').forEach(wrapSentences);
    // drop empty sentence spans
    mdbody.querySelectorAll('p .s').forEach(function(s){ if(!s.textContent.trim()) s.remove(); });

    // ordered targets: sentences, list items, headings, and whole special blocks
    var targets = Array.prototype.slice.call(
      mdbody.querySelectorAll('p > .s, li, h2, h3, figure, details, .note, .tip, .added')
    );
    targets.forEach(function(t, i){ t.dataset.bmk = i; });

    var svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>';
    var marker = document.createElement('button');
    marker.className = 'bm'; marker.type = 'button';
    marker.setAttribute('aria-label','Bookmark this line'); marker.innerHTML = svg;
    document.body.appendChild(marker);

    var resume = document.getElementById('resume');
    var current = null, saved = null, markerHover = false, hideTimer = null;
    try{ saved = localStorage.getItem(KEY); }catch(e){}

    function show(t){
      var r = t.getBoundingClientRect(), mr = mdbody.getBoundingClientRect();
      marker.style.top = (r.top + 1) + 'px';
      marker.style.left = mr.left + 'px';
      marker.classList.add('show');
    }
    function hideSoon(){ clearTimeout(hideTimer); hideTimer = setTimeout(function(){ if(!markerHover) marker.classList.remove('show'); }, 260); }

    mdbody.addEventListener('mouseover', function(e){
      var t = e.target.closest && e.target.closest('[data-bmk]');
      if(!t || !mdbody.contains(t)) return;
      current = t; clearTimeout(hideTimer); show(t);
    });
    mdbody.addEventListener('mouseleave', hideSoon);
    marker.addEventListener('mouseenter', function(){ markerHover = true; clearTimeout(hideTimer); });
    marker.addEventListener('mouseleave', function(){ markerHover = false; hideSoon(); });
    marker.addEventListener('click', function(){ if(current) toggle(current); });
    document.addEventListener('scroll', function(){ marker.classList.remove('show'); }, {passive:true});

    // click the sentence (or list item) itself to set the bookmark there
    mdbody.addEventListener('click', function(e){
      if(e.target.closest('a, button, summary, img, input, select, .bm')) return;
      var sel = window.getSelection && window.getSelection().toString();
      if(sel && sel.length) return;                 // don't fire while selecting text
      var t = e.target.closest('[data-bmk]');
      if(t && mdbody.contains(t)) toggle(t);
    });

    function clearMark(){ mdbody.querySelectorAll('.bmk').forEach(function(e){ e.classList.remove('bmk'); }); }
    function apply(i){ clearMark(); var t = targets[i]; if(!t) return; t.classList.add('bmk'); if(resume) resume.classList.add('show'); }
    function toggle(t){
      var i = t.dataset.bmk;
      if(i === saved){ try{ localStorage.removeItem(KEY); }catch(e){} saved = null; clearMark(); if(resume) resume.classList.remove('show'); return; }
      saved = String(i); try{ localStorage.setItem(KEY, saved); }catch(e){} apply(+i);
    }

    if(saved !== null && targets[+saved]) apply(+saved);
    if(resume){
      var go = resume.querySelector('.go');
      (go||resume).addEventListener('click', function(){ if(saved!==null && targets[+saved]) scrollToEl(targets[+saved], 'center'); });
      var x = resume.querySelector('.x');
      if(x) x.addEventListener('click', function(ev){ ev.stopPropagation(); resume.classList.remove('show'); });
    }
  }
})();
