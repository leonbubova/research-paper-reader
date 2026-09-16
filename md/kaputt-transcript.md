---
collection: Papers
kind: paper
title: "Building kaputt with Claude Code: an annotated prompt transcript"
authors: Leon Bubova
affiliation: Independent
published: Session transcript, 1–16 September 2026
year: "2026"
source_notes: https://github.com/leonbubova/kaputt
source_label: kaputt on GitHub
tags: [claude-code, agentic-coding, prompting, kubernetes, wargame, subagents, workflow]
learning_outcomes:
  - See how a project goes from one vague prompt to a shipped repo, site, CI and issue tracker in one night, and what the human actually typed.
  - Notice the prompt patterns that work: short corrections, "status?", pasting a screenshot instead of describing it, asking "convince me" before accepting a proposal.
  - Watch a real failure (subagent overspawn crashing the laptop) and how the recovery was handled.
provenance: Prompts are reproduced verbatim from the Claude Code session logs, typos included. The summaries under each prompt were written afterwards and condense what Claude Code did; they are not Claude's original replies.
---

::: added How to read this
Every bold timestamp line is a prompt Leon typed into Claude Code, exactly as typed. The indented block after it summarises what Claude Code did before the next prompt. `[screenshot]` marks an image pasted into the chat.

The project is **kaputt**, a break/fix terminal wargame: each level spins up a real environment (k3d cluster, container, repo), sabotages one thing, hands you a ticket, and `wg check` verifies you fixed it. Repo: [github.com/leonbubova/kaputt](https://github.com/leonbubova/kaputt). Site: [leonbubova.github.io/kaputt](https://leonbubova.github.io/kaputt/).

Things worth watching for:

- **Prompt length is tiny compared to output.** Most prompts are one line. The long ones are dumps of several thoughts at once, and Claude splits them itself.
- **Corrections are blunt and short.** "i feel like you didnt change the design at all?" or "revert it and do all" is enough.
- **Screenshots replace descriptions.** Design feedback happens by pasting a picture, not by explaining pixels.
- **"status?" is a real command.** Long agent runs are polled, not babysat.
- **Pushback is asked for.** "convince me that that is really needed" gets a proposal dropped.
- **The one big failure** is in Session 1 at 00:05: ~18 subagents ran Docker tests at once on an 8 GB laptop.
:::

## Session 1 — 2026-09-01/02 · from a typing drill to 18 tracks, a landing page and 33 GitHub issues

**22:18** `gib mir ein gutes interaktives kubernetes lern kapitel für monkeytype`
> Researched how typing drills turn into retention, wrote a set of monkeytype custom-text files (`task cue: command`, 8 items per chapter, memory funbox).

**22:22** `so its more like a quiz then? i like the setting up and debugging a system approach, cant we build an interactive k3s setup in a vm or container or something? that could work in my own terminal or on station44 or something, like a ctf or wargame you understand me?`
> Pivoted to a break/fix wargame concept. Sandbox blocked SSH to the server, so it asked to build locally with k3d first.

**22:25** `sandbox off`
> Built the whole thing from scratch: `wg` bash CLI, 18 k8s levels (each with break.sh / check.sh / hints / solution), installer, README, test harness. Booted a k3d cluster, fixed two macOS bash 3.2 bugs.

**23:04** `why so long for a programmatic termincal cli program testing? that should be instant no?`
> Explained: each level tears down a namespace, waits for rollouts, and the pre-fix check must time out on purpose → 1–2 min per level. Offered 3 options, recommended a `WG_FAST=1` mode.

**23:04** `hello?`
> Took that as go-ahead. Added fast mode, ran all 18 levels, fixed 3 check bugs and 2 levels that didn't break hard enough. Deployed to the server (installed Docker/k3d/kubectl/helm there). All green.

**23:41** `ok lets do the same for linux and helm then, then for supabase as well, move this to separate subagents so this chat stays responsive, why do i have to do newgrp docker, didnt you check with that? why do you do it? why is it even necessary, ah do one for docker and docker compose as well, and then explain everything you did to set this up, like every step in detail so i understand what you built and what the architecture is`
> Admitted the `newgrp` instruction was wrong (group applies on next login). Refactored CLI into tracks, added `wg shell`, wrote a track spec, spawned 8 subagents (linux, docker, helm, supabase, nextjs, nestjs, trigger, git), wrote `docs/ARCHITECTURE.md` and explained the 3-layer design.

**23:48** `what database? what are you talking about? did you built this yourself?`
> Clarified: "database" meant `/etc/group`; the game has no DB, just text files. Confirmed everything was written from scratch. Meanwhile verified and committed the git (16) and nestjs (15) tracks as they landed.

**00:02** `the nestjs track seems like it skips the basics`
> Agreed. Messaged the nestjs, nextjs and trigger agents to prepend "build it" basics levels before the debugging levels.

**00:03** `yes, add basics for k8s too and all other tracks, that was the idea, from total beginner to pro on all the tools`
> Made it a spec rule (every track opens with ~⅓ basics), pushed it to all 9 agents, spawned one for k8s basics.

**00:05** `add all the tracks you proposed as well and add one for pentesting a webapplication so that we have a starting point to test our production setups as well and know what to look out for`
> Spawned ~12 more agents (postgres, nginx, redis, tls, networking, systemd, bash, terraform, pentest, landing page…). **This crashed the Mac**: ~18 agents running Docker integration tests on a 4 GB VM → load 14, disk full, Colima died. Claude killed all agents, pruned Docker, recovered 20 GB, owned the mistake, and asked whether to continue on the server or locally one at a time.

**00:16** `can we just do it here one by one?`
> Verified k8s (25) and helm (20) serially in the foreground, found a cross-track contamination bug. Then split remaining work into 3 safe lanes (Docker VM serial, host Node serial, remote server) with a memory watchdog.

**00:55** `how are you doing the writes on station44? i dont get it`
> Explained: rsync up, edit via `ssh 'cat > file <<EOF'`, test remotely, rsync back, commit locally. Kept committing tracks as lanes reported: 17 tracks / 284 levels by the end.

**01:27** `if everything is done, build the landing page, different repo, enable github pages, then give me a recap on everything that has been build and how and lets think of a strategy to market that thing`
> Built a static site generator reading level data, created public repo `leonbubova/kaputt`, enabled GitHub Pages, confirmed HTTP 200. Wrote a full recap + marketing plan (Show HN, Reddit, try-in-browser, Pro/Teams tiers…).

**01:33** `add the explanation of what this is to the wargame repo as well, make sure to not expose security issues about the setup, reason about what security issues this project actually has and lets create a github issue about the "making the game multiplayer" part, anything else we could build? how could i monetizse this?`
> Scrubbed the private hostname from the repo (now an env var), rewrote README, wrote `SECURITY.md` with a threat model, **fixed two real bugs** (postgres bound to 0.0.0.0, kubectl-context guard so `wg` can never delete a prod namespace). Filed issue #1 (multiplayer). tls track landed → 18 tracks / 294 levels live.

**01:41** `now create actual tickets/issues out of everything you proposed in the marketing approach, all sounds very good, also add ticket to redesign the page, take shush.love and take screenshots, try to land on a similar style, because this is what i like, kaputt.sh and kaputt.dev sound cool, check if available, also i like the idea of kaputt as name, but lets find alternatives, kaputt is a bit to negatively framed, also "repairing" isnt the core game loop, core game loop is doing simple commands incrementally until you understand a stack or tool, then being able to repoeat it multiple times, other than that, good progress`
> Checked domains (kaputt.sh free, kaputt.dev taken, kata.sh free). Created 31 GitHub issues with labels: launch, growth, monetization, features, 9 new-track tickets under an epic, redesign, naming.

**01:47** `for the naming ticket, comment that we decided on kata.sh but will not change the name until later and start with all other high flagged tickets, also the repo is the landing page? does the other code not have to be a repo? are they both in one repo? is that smart?`
> Commented on #31. Tried to capture shush.love: first only text, then real full-page screenshots via headless Chrome/Playwright.

**01:50** `[screenshot]` `[screenshot]` `[screenshot]`
> Realised shush.love is dark + serif + purple accent, the opposite of what the text analysis suggested. Rebuilt the page in that style, pushed. Answered the repo question: two repos exist (site public, game local) and recommended a monorepo.

**01:53** `the commit is not showimg my real gh account i think`
> Found it used the wrong email vs. the GitHub noreply one. Rewrote history in both repos, force-pushed, verified GitHub now attributes commits to the account.

**01:56** `monorepo, and publish the wargame, check design once more, the text is stretched a bit, also alignment and size of hero is a bit off, check it with realistic browser sizes and double check with shush.love, match the design more closely`
> Capped headline size, reworked hero. Screenshotted at 1280/1440/390.

**01:58** `[screenshot]` `[screenshot]`
> Merged game + site into one monorepo (site under `site/`), pushed it as the public repo, switched Pages to a GitHub Actions workflow.

**02:04** `i feel like you didnt change the design at all?`
> Verified live CSS byte-for-byte = dark redesign. Diagnosed browser cache, added `?v=2` cache-busting to assets.

**02:05** `the horizontal centering and margins dont look great, fix, also fonts dont match, as well as background`
> Pulled shush.love's real CSS tokens: font is Newsreader (had Instrument Serif), bg `#121215`, accent `#c4b5fd`. Rewrote to match.

**02:07** `[screenshot]`
> Deployed v3.

**02:10** `still left hugging, colors and cards were nicer before, also general question about the flow of the game, how do i know what to do if i dont know the commands yet, this is literally what i am trying to learn, is that how it works?`
> Honest answer on game flow: ticket → 3 escalating hints → `wg spoil` → repeat. Flagged the real gap: no upfront primer for total beginners. Fixed layout to a 760px column, restored card definition.

**02:13** `[screenshot]`
> Deployed v4. Proposed the beginner on-ramp as a design decision.

**02:17** `design still doesnt really look like shush? you have all the code and images, can you not compare? are you not seing the images correctly? whats wrong?`
> Did a proper side-by-side. Named the real difference: structure, not colors. Airy top-anchored hero, concentric-ring background, more whitespace.

**02:17** `[screenshot]` `[screenshot]`
**02:19** `[screenshot]`
> Deployed v6. Explained what can't be replicated 1:1 (shush is a single-message page, kaputt has real content).

**02:24** `start working on the 5 most important tickets, update tickets as needed`
> Built `wg primer` (new #32), `wg random` + `wg speedrun` (#18), streaks & achievements (#19), namespace groundwork for multiplayer, and a GitHub Actions CI that plays the git + bash tracks end-to-end on every push. CI green on first run.

**02:32** `what is the difference between the two?`
> Compared Killercoda (hosted, their format, no ownership) vs. self-hosted web terminal (ttyd/xterm.js, one container per visitor).

**02:32** `what you mean with runs in github runner?`
> Explained GitHub Actions runners: throwaway VM that clones the repo and runs the harness, i.e. the game is played to completion on every commit.

**02:34** `ok, i dont want killercoda, we go selfhosted but only for one or two tracks, that are very cheap to run`
> Built `playground/`: 76 MB image with git + bash tracks, ttyd on the server as a systemd service, tailnet-only. Each visitor: no network, 128 MB RAM, read-only root, 45 min timeout. Verified with a headless browser.

**02:46** `write a ticket for going public with the browser shell. then explain the architecture, how did you make this work how is the shell connected to the browser? how is it so responsive`
> Filed #33 (domain → Caddy TLS → firewall → security pass). Explained the chain with an ASCII diagram: xterm.js ⇄ WebSocket ⇄ ttyd ⇄ pty ⇄ `docker run`.

**02:50** `start working on those 5 tickets, update them when hitting milestones or finished`
> Delegated pure-writing tasks (11 primers, launch drafts) to text-only agents, did code/infra itself.

**02:56** `[screenshot]`
> Reported: primers for all 18 tracks, new `shell` track zero (14 lessons, default in playground), real demo GIF of a CrashLoopBackOff solve in README + site, 328 SEO pages + sitemap, launch drafts, namespace refactor under verification.

**03:28** `done?`
> Not yet: 12/45 levels through the k8s+helm verification. Later: 45/45 green, namespace refactor committed, #1 updated. Left one design decision for Leon.

**03:51** `man not working in interactive shell, #32 open sub item decision pls, i want to know how many levels are in the track i am working on right now, and what level i am in, remove the streak i dont want to see it everytime, id rather see level all the time, also i think on moving to next level the pwd should change to the one needed in the level? or is moving to the correct dir also a skill that needs to be trained?`
> Five fixes: man pages added to image, concept-first hint 1 rewritten on all 308 levels (via agent, independently verified), `wg status` + prompt shows `kaputt shell 03/14`, streak removed from solve line, auto-cd on level load (except on the shell track, on purpose). Stopped at the multiplayer architecture decision.

**04:07** `yes go with option 2 for everyone already, lets find a fix for the less security, build it then`
> Chose Sysbox (Docker-in-Docker without `--privileged`). Built a 1.4 GB air-gapped sandbox image with k3s images pre-baked, per-visitor own Docker daemon + 3-node k3d cluster, 4 GB / 2 CPU / 45 min caps. Verified the real harness inside a sandbox. Also filed #35 "Explain-first" as a design proposal with 6 questions.

**13:44** `what happens if i just rm -rf my player dir?`
> Explained both cases (local: fresh player, nothing breaks; sandbox: only your own throwaway container). Proposed a protection mechanism.

**13:46** `convince me that that is really needed, why is a new browser tab not enough?`
> Conceded: not needed, a new tab is enough. Dropped the proposal.

---

## Session 2 — 2026-09-02 · the "teach-first" rework (#35, PR #36)

**14:10** `i added a comment do #35`
> Read the comment, rewrote #35 with the decisions (no LESSON.md, lesson in README, learn/test phases, `wg help`). Proposed step 1.

**14:12** `what you mean go on step1?`
> Explained: CLI + spec + bash track as reference, then Leon plays it, then fan-out to 16 tracks.

**14:14** `/goal do every level like that one by one until you are finished and ready to present a human testable level that should satisfy me`
> Built CLI changes, rewrote 150 READMEs across 18 tracks via 17 parallel agents, regenerated site, opened PR #36.

**14:22** `I told you to not make it a readme. No, I think it was in the comment pretty sure. So why did you do it like that? Isn't it now more complicated than I wanted it to be? Now it's a different step. I just wanted more steps with different content.`
> Admitted misreading "no readme": Leon wanted teaching by doing (more, smaller levels), not lesson text. Proposed reverting and inserting small build-it levels instead.

**14:23** `revert it and do all`
> Reverted. Wave 1: 15 tracks in parallel, each agent inserts one-concept ramp levels and runs the harness. Long wait.

**14:48** `status`
> 13/15 done, all green; tls and supabase still booting.

**14:48** `continue with wave 2`
> Started k8s, then docker, then helm sequentially (their wipes clash with other tracks).

**15:00** `status`
> Three harnesses running (supabase 24, docker 27, k8s 33).

**15:01** `35minutes for one agent`
> Killed orphan processes. Explained the harness restarts on a transient k3d API stall.

**15:11** `my mac is quite slow`
> Killed two runaway loops from a 13 h old check and two stale dev servers; the rest is 3 harnesses on the Docker VM.

**15:16** `status?`
> Long serial finish: supabase 24/24, docker 27/27, k8s 33/33, helm 25/25. Pushed PR #36: 308 → 408 levels, every ramp level one new command, all 17 tracks green, plus a fixed pre-existing hang in a docker check.

**20:34** `all good?`
> Tree clean, PR mergeable, nothing running.

**20:53** `what can i play, is readme up to date? what about website, is there a tutorial?`
> Listed tracks by prerequisite (no Docker / Docker / k3d / node). README up to date. No separate tutorial; the `shell` track is the tutorial.

---

## Session 3 — 2026-09-15 · finding it again two weeks later

**13:53** `search my wargame "kaputt" that also has a git repo`
> Found two checkouts of the same repo under a client project folder (game + stale site clone).

**13:53** `can you move it so the wargames folder?`
> Moved both to `~/vault/wargames/`. Flagged the second one as a stale duplicate.

**13:54** `check if its working with that state, if so merge and push, is the webpage also in that repo?`
> Ran shell/git/bash tracks green, removed a broken lint script, merged PR #36 into master, deleted the branch. Yes, site is in `site/` of the same repo.

**13:59** `gimme steps to get ready`
> Tools already installed, only PATH missing. 4-step quickstart.

**14:01** `why is the terminal game and the site in two different folders now? i thought its one repo?`
> Explained the stale clone, deleted it. One folder now.

**14:19** `now ready to play?`
> Fixed a duplicate PATH line in `.zshrc`, patched `install.sh` to dedupe, pushed. Shell track level 1 loaded.

**14:24** `how to list all tracks`
> `wg` / `wg list`. Also noticed its own `commit -a` had swept in uncommitted kotlin files from a parallel session → reverted that.

---

## Session 4 — 2026-09-15/16 · kotlin track (parallel session)

**14:01** `can you add a track for kotlin?`
> Built a 22-level kotlin track: auto-downloads kotlinc, hidden `check.kt` judge, 8 build-it + 14 incident levels, harness green twice.

**14:24** `make sure its correct commit and push`
> Hostile review pass found one real bug (Homebrew kotlinc symlink), fixed it, pushed branch. PR creation failed (gh TLS in sandbox).

**14:28** `if you think its fine, merge pr, i dont even think we need prs but can you can create them`
> Fast-forward merged to master. Saved to memory: this project uses no PRs.

**14:29** `how do i update my local version? to play the kt track?`
> Already on master. 4 commands to start.

**14:29** `what you mean with wg shell?`
> Explained: built-in CLI command that cds into the level's working dir. Optional.

**14:33** `am i stupid or is the wargame becoming really unintuitive? for example the kotlin track is not handholding at all, are other levels better in that way? i wanted a beginner level`
> "Not you." Only the `shell` track teaches from zero; every other track assumes you know the tool. Proposed prepending lesson levels.

**14:33** `like even for a complete coding beginner`
> Started prepending an 8-level lesson block (edit → run → variables → … → null). Session lost network mid-work.

**08:30 (next day)** `status?`
> Resumed: kotlin now 30/30 green with lessons, committed. Spawned 18 agents to add lesson blocks to every other track. *In progress at time of export.*
