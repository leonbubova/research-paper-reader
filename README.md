# Research Paper Reader — Harvard CS197

A clean, dark, distraction-light reading edition of Pranav Rajpurkar's
**CS197: AI Research Experiences** lecture notes, built to read comfortably
*and* to be fed straight to an LLM agent.

**Live site:** https://leonbubova.github.io/research-paper-reader/

## Why it exists

The lecture content lives as plain Markdown in [`/md`](./md). The site renders
those files at runtime, so:

- a human gets a nice reader (themes, adjustable type, table of contents, a
  per-sentence bookmark, link previews);
- an agent can fetch the raw `.md` directly (e.g.
  `…/research-paper-reader/md/lecture-03.md`) as a ready-made context pack.

The [benchmark page](./benchmark.html) sketches an experiment: does grounding an
agent in these notes beat an off-the-shelf frontier model at real research work?

## Stack

Deliberately lean. **No build step, no framework, no bundler, no `node_modules`.**

- Static HTML, one CSS file (`styles.css`), vanilla JS (`reader.js`).
- One vendored dependency: [`marked`](https://github.com/markedjs/marked)
  (~35 KB) for Markdown parsing.
- Content: Markdown files in `/md`, fetched with `fetch()` and rendered client-side.
- Hosted as plain static files on GitHub Pages (`.nojekyll`, served as-is).

To run locally you only need a static file server (browsers block `fetch()` of
local files over `file://`):

```
python3 -m http.server 8000
# open http://localhost:8000/
```

## Layout

```
index.html          lecture list / home
lecture.html        the reader shell (?l=03 selects the lecture)
benchmark.html      the research-with-context experiment design
styles.css          theme + layout
reader.js           markdown rendering, TOC, bookmark, hovercards, scroll
marked.min.js       vendored markdown parser
md/                 canonical lecture content (Markdown, front-matter + body)
assets/l3/          screenshots & figures for Lecture 3
```

## Provenance

Lecture prose and the "Notes"/"To understand" boxes are Pranav Rajpurkar's
original notes, transcribed. Blocks marked **"Added explanation"** were written
for this reader and are not the author's words. Paper abstracts are quoted from
the cited papers. Original course: https://cs197.seas.harvard.edu/
