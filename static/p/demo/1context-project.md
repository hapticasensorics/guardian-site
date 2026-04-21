---
id: bs-page-1context
slug: 1context-project
title: 1Context — project overview
tier: public
tags: [project, internal, knowledge-base, agents]
updated: 2026-04-17T12:00:00Z
license: internal
alternate_formats:
  html: /1context-project.html
  mcp_handle: 1context://1context-project
---

# 1Context

> A credential broker and knowledge wiki built for collaborative work between humans and AI agents · Internal project page · Updated 2026-04-17

**1Context** is a self-hosted knowledge base and credential broker designed
from the start for collaboration between humans and AI agents working on the
same projects. It uses a stock [BookStack](https://www.bookstackapp.com/)
installation as the underlying wiki engine and adds two parallel surfaces on
top: a WikiWand-inspired editorial layer for human readers, and a
token-efficient, discoverable surface for any AI agent that's handed a
1Context URL.

The thesis is that the most useful place to store evolving project context —
design decisions, in-flight work, troubleshooting notes, infrastructure
runbooks, capability tokens — is somewhere both humans and agents can read,
write, and link to. URLs are the simplest unit of context handoff. 1Context
invests heavily in making both audiences productive against the same URLs.

## Overview

A 1Context deployment is a stock BookStack v26.03+ instance with the
`bookstack-opcontext-module` theme installed. The theme is a static asset
bundle (HTML + CSS + JS, no PHP) wired in via BookStack's standard theme
module mechanism. It overlays its own UI on top of BookStack's existing
chrome and uses BookStack's REST API for search and content retrieval.
Capability tokens, OAuth flows, and the AI chat backend live outside
BookStack in a small companion service referred to as the broker; pages
document but do not contain those secrets.

The project's design rule of thumb: every user-facing setting maps to one
`data-*` attribute on the `<html>` element. CSS reacts via attribute
selectors and shifts design tokens; JavaScript only writes
`<html>.dataset` and `localStorage`. The CSS does the rest. This keeps
the rendered DOM small and the state model legible.

## Origin and intent

The immediate motivation came from observing how often coding agents need
project-specific context to do useful work, and how brittle the conventional
handoffs are: pasting long blocks of context into a chat, sharing a Notion
link that an agent can't read, or relying on the human to re-explain
decisions that were already documented somewhere. A wiki is the natural
place to keep that context — what makes 1Context distinct is that the wiki
is treated as a first-class agent surface alongside the human-facing one.

The design also commits to using a generic underlying wiki engine
(BookStack) rather than building a bespoke storage layer. That keeps the
data portable, the authoring experience familiar, and the self-host story
straightforward.

## Architecture

The system has three layers, only the first of which is in this repository.
The other two are referenced here for completeness and tracked in their own
repos.

### Theme module

A BookStack theme module — a static `preview/` directory of HTML templates
plus a `css/theme.css` stylesheet and a `preview/js/enhance.js` bundle — that
ships into BookStack via the standard
`php artisan bookstack:install-module` command. In dev it runs under Vite
with hot reload; in production it's a pre-built bundle in `dist/`. The theme
is responsible for the WikiWand-style editorial layer, the right rail, the
customizer, the search and bookmarks modals, the AI chat panel, the
agent-view toggle, and all the mobile-specific affordances.

### Agent surface

A parallel set of affordances for any AI agent that fetches a page URL,
designed so the agent can find the token-efficient form of the content
without being taught about 1Context specifically. This includes a canonical
`.md` URL alongside every `.html` URL, an `HTTP Link` header (server-side,
planned), a `<link rel="alternate" type="text/markdown">` in `<head>`,
OpenGraph and JSON-LD tags, an in-page informational note placed after the
lead paragraph, and a Reader / Agent view toggle that lets a human inspect
what the agent would receive. The full design rationale is in
`agent-ui.md`.

### MCP server

A planned (not yet implemented) [Model Context
Protocol](https://modelcontextprotocol.io/) server exposing typed tools —
`list_pages`, `read_page(slug, format=md)`, `search`, `recent_changes` —
that any MCP-aware agent (Claude Code, Claude Desktop, Cursor, others) can
call directly. This is the lossless agent-to-agent context handoff path;
the URL stack improves the WebFetch experience marginally while MCP solves
the handoff problem completely. Tracked as Phase 8 in `THEME_PHASES.md`.

## User experience

The human-facing layer is patterned closely on
[WikiWand](https://www.wikiwand.com/)'s reader-mode aesthetic, with the
navigational primitives reverse-engineered from observation of the live
product (probe scripts in `tools/probe-wikiwand-*.py`) and tuned with three
rounds of empirical sweep-testing. The features are organized into seven
phases.

### Right rail and customizer

A 5-icon right rail (Account, Search, Bookmarks, Customize, AI Chat) lives
fixed to the right edge of the page. The customizer opens as a side drawer
with seven segmented controls — Theme, Table of Contents, Article Width,
Font Size, Links Style, Cover Image, Border Radius, Article Style — each
writing to one `data-*` attribute on the root. Defaults were chosen after a
probe-debt review of WikiWand's actual deployment: links style defaults to
color, border radius defaults to square. (Phase 1)

### Table of contents chrome

A sticky TOC sidebar with a hamburger toggle and a current-page label at
the top. Section headings get click-to-collapse chevrons that toggle their
h3 sublist with per-page `localStorage` persistence. Long appendix sections
(References, Further reading, External links) are auto-wrapped in
`<details>` elements so they don't dominate the article. Scroll-spy via
`IntersectionObserver` highlights the current section. (Phase 2)

### Hover preview cards

Hovering a cross-page link surfaces a 320px preview card with the target
page's title, thumbnail (if any), and a multi-line snippet. Implemented
against the live Wikipedia REST API in the preview environment; the
production wiring will point to a custom `/api/peek/{book}/{page}` theme
route since BookStack has no native page-summary endpoint. Hover delays of
300ms in / 100ms out, scroll-dismiss with a 40px anchor threshold,
in-flight token to avoid stale renders, and an LRU cache. Suppressed
entirely on touch devices via `matchMedia('(hover: hover)')`. (Phase 3)

### Search and bookmarks modals

⌘K opens a center-modal search dialog (against the Wikipedia title-search
API in preview, against BookStack's `GET /api/search` in production).
Results show a side preview pane on desktop; arrow keys navigate; Enter
selects. ⌘B opens a center-modal bookmarks dialog backed by
`localStorage`; the current page can be added or removed via a pill that
toggles label based on state. Both modals share a focus-trap, Esc-to-dismiss,
and a backdrop-blurred scrim. (Phase 4)

### AI chat panel

⌘I (or the rail's chat icon) opens an AI chat panel with two display modes
— a floating bubble drawer for ad-hoc questions, and a fixed side panel
for extended sessions — controlled by a two-attribute state machine
(`data-ai-display × data-ai-panel-visibility`). The fixed panel is
drag-resizable between 360px and 720px with the width persisted; in fixed
mode the body reserves space via `padding-right: var(--ai-panel-width)`.
The fixed-panel toggle is hidden below 1280px since the article would
otherwise be squished into a sliver. The preview's demo bot streams the
article's first real paragraph as a stand-in for a real LLM call. (Phase 5)

### Reader / Agent toggle

A segmented control in the header — eye icon for Reader, code icon for
Agent — lets a human switch the article between the rendered HTML view and
an IDE-styled monospace dark frame showing the raw markdown that was
fetched from the `<link rel="alternate">` URL. This is both a marketing
surface ("see exactly what your AI reads") and a debugging tool. State is
stored in `sessionStorage` only, never carrying across browser sessions, to
avoid bleeding a human's choice into a co-resident agent's session.
Reader is always the default on each page load. (Phase 7)

## Mobile experience

Mobile took three rounds of dedicated hardening because the user-found
regressions made it clear that resizing the viewport in headless Chromium
was missing a large class of bugs. The current mobile layer is verified
across iPhone 13 / WebKit, Pixel 5 / Chromium, and iPad Pro 11 / WebKit
using Playwright device emulation (Tier 2 + 3 mobile testing).

### Off-canvas drawer

At narrow widths (`max-width: 960px`) the TOC switches from the desktop's
in-flow column to a left-edge slide-out drawer with a backdrop scrim. The
drawer is pinned `top: calc(var(--header-height) + 5px)` so the parent
1Context header chrome stays visible behind it. `data-toc` is
force-defaulted to `"hidden"` at narrow widths on first load, and re-synced
when the viewport crosses the breakpoint, so a user's saved desktop
preference doesn't auto-open the drawer when they switch to a phone.

### iOS scrim-dismiss

iOS Safari does not always synthesize `click` events from taps on
non-interactive `<div>`s, even when `cursor: pointer` is set. Document-level
delegated click handlers will silently fail to fire, making any drawer/modal
scrim untappable on iOS. The fix — captured in the `addScrimDismiss` helper
in `enhance.js` — attaches both a `click` handler and a `touchend` handler
(with `preventDefault` to suppress the would-be synthesized click) directly
to the scrim element. `cursor: pointer` is added too as a belt-and-suspenders
heuristic. Applied to the TOC drawer scrim, the modal scrims (search and
bookmarks share the same class), and the customizer overlay.

### Safe-area insets

The viewport meta now declares `viewport-fit=cover` so iOS exposes
`env(safe-area-inset-*)` to CSS. The right-rail FAB stack and the AI bubble
FAB use `max(var(--size-N), env(safe-area-inset-N))` for their bottom and
right offsets, keeping them clear of the iPhone home indicator and any
rounded-corner notches.

### Body scroll lock

When any overlay is open (TOC drawer, customizer, search modal, bookmarks
modal, or — at narrow widths only — the full-screen AI panel) the body is
locked into `position: fixed` at the saved scroll offset, with a refcount
so multiple overlays can stack cleanly. On unlock, the saved scroll
position is restored. This prevents iOS Safari's rubber-band scroll bleed
under modals, which is otherwise jarring. The lock state is exposed as a
`[data-scroll-lock]` attribute on `<html>` for any adjacent CSS that needs
to react.

## Editorial model

1Context follows Wikipedia's editorial conventions rather than a
hierarchical documentation structure. Every page lives at the URL root
in a flat namespace; there are no shelves, books, or chapters.
Sub-article relationships are expressed in content rather than in the
filesystem: when a section in one page summarizes a topic that has its
own dedicated page, the section opens with a Wikipedia-style *Main
article:* hatnote pointing to the deep dive. Lateral pointers go in a
*See also* section at the bottom.

Two reasons. First, structure that emerges from links rather than from
hierarchy stays simpler at the human level — anyone can promote any page
to "main article" status for a section just by writing the hatnote, with
no central registry to update or parent-child relationships to maintain.
Second, every web-aware AI agent has already been trained on millions of
Wikipedia articles, so the conventions are zero-teach: an agent
encountering `Main article:` or `See also` on a 1Context page recognizes
the pattern instantly and follows the links the way Wikipedia would
intend.

## Agent UX (AX)

> Main article: [Agent UX (AX)](/agent-ux.html)

1Context treats the AI agent as a first-class audience alongside the human
reader. The discipline of designing the website surfaces an agent
encounters — format on the wire, discoverability, lossless handoff — is
what we call **Agent UX**, abbreviated **AX** by analogy with UX. It is
a deliberate stack of cheap, redundant signals: the canonical
`/page.md` URL convention, an `HTTP Link` response header (planned), a
`<link rel="alternate">` in HTML head, an informational note placed after
the lead paragraph, frontmatter `alternate_formats` metadata in the
markdown response, a Reader/Agent toggle in the page header that lets a
human inspect what the agent receives, forthcoming `llms.txt` +
`llms-full.txt` at site root (mirroring OpenAI's developer docs), and an
MCP server for lossless agent-to-agent handoff (planned, separate
project).

A controlled experiment with four parallel Opus subagents fetching four
format variants of the same article established empirically that Claude's
WebFetch summarizes every response down to ~300 tokens regardless of
source format — meaning the URL stack's biggest win is not for
summarizing agents but for the raw-fetch and typed-protocol classes
(Claude Code in Bash mode, Cursor terminal mode, RAG pipelines, MCP-aware
agents). The stack still raises the floor for everyone; only MCP solves
the lossless-handoff ceiling.

For the full philosophy, the design principles, the per-layer status,
the anti-patterns, and the open decisions, see the dedicated wiki
article: [**Agent UX (AX)**](agent-ux.html).

## Quality and testing

The repository ships four standalone Playwright-based verification scripts
under `tools/`, each guarding a different invariant or interaction class.
They're not in CI yet — they run on demand against the local dev server —
but the pattern is established for when CI is wired up.

### Parent-header invariant

`tools/audit-parent-header-invariant.py` exercises every overlay state
(default, drawer-open, AI-bubble-open, AI-panel-open, customizer-open,
search-modal-open, bookmarks-modal-open, scrolled-deep,
drawer-open-scrolled, AI-panel-scrolled) at every viewport
(375 / 414 / 768 / 1024 / 1440), 50 cases total. The single rule:
drawer-class UIs (persistent affordances) must NEVER cover the parent
1Context header. Modal-class UIs (focused-task overlays) are allowed to.
The audit found 12 drawer-class violations on first run, all of which
were fixed in the same commit. Current state: 38 drawer cases pass, 0
violations, 12 modal covers (expected by design).

### State-transition sweep

Earlier in the project a sweep across viewports × theme settings × UI
states caught state-transition bugs that single-config tests missed: the
TOC-hidden + narrow-viewport CSS specificity collision that squished the
article into a sliver, the hamburger that disappeared at the bottom of
long articles, the horizontal scrollbar from Wikipedia infobox tables
overflowing the viewport, and the AI fixed-panel mode squishing the
article at 1024px. All four were fixed.

### Mobile touch test (Tier 2+3)

`tools/verify-mobile-touch.py` uses Playwright device emulation combined
with the matching browser engine — iPhone 13 with WebKit, Pixel 5 with
Chromium, iPad Pro 11 with WebKit — to exercise real touch interactions
(`page.tap`, `page.touchscreen.tap`) and a battery of mobile-specific
assertions: `(hover: hover)` reports false on touch, drawer opens on tap,
scrim tap closes drawer, TOC link tap auto-closes drawer, no `:hover`
sticks after tap-elsewhere, parent header stays visible across all states,
view toggle works under touch, modals open and close on tap, touch targets
are ≥ 36×36, the page survives mid-state rotation and dark theme, body
scroll lock activates and releases cleanly. 117 assertions per
environment across 13 categories of behavior. The first run caught five
real WebKit-only bugs that pure viewport-resize testing had been silently
passing for hours.

### Agent-format experiment

`tools/build-format-experiment.py` generates five format variants of the
same article and serves them via the dev server through a Cloudflare
tunnel so that real Claude WebFetch instances (called by parallel Opus
subagents) can fetch them. The harness records what each agent received,
asked them to extract a specific test fact ("In what year did Einstein
emigrate to the United States?"), and aggregated the results. This was
the experiment that surfaced the summarizer-bottleneck finding above and
reshaped the agent-surface priority order.

## Roadmap

Near-term: Phase 6 (font selectors — heading and body, two options each,
Radix-style listbox UI mapped to `data-font-heading` / `data-font-body`
attributes). Phase 7 follow-ups: HTTP `Link` response header, the
`Sec-Fetch-Dest` server-side heuristic, an `llms.txt` at site root, a
"Copy markdown link" share menu, optional decision on whether the
Reader/Agent toggle should navigate to `/page.md` (URL-as-truth) once the
`.md` endpoint can do content negotiation. Medium-term: Phase 8 BookStack
production wiring (real `/api/search`, the `/api/peek/{book}/{page}`
proxy for hover previews, AI chat against the broker's `POST /chat`).
Separate-track: the MCP server, scoped as its own near-term project rather
than as part of the theme.

## References

- [`agent-ui.md`](agent-ui.md) — full design rationale for the agent
  surface, six layered tactics with implementation status table.
- [`THEME_PHASES.md`](THEME_PHASES.md) — phase plan with completion notes,
  probe-debt log, state-transition test matrix, and the BookStack
  production wiring reference.
- [BookStack](https://www.bookstackapp.com/) — the underlying wiki engine.
- [WikiWand](https://www.wikiwand.com/) — the visual and interaction
  reference for the human-facing layer.
- [Model Context Protocol](https://modelcontextprotocol.io/) — the typed-
  tools interface 1Context will eventually expose for lossless agent
  handoff.
