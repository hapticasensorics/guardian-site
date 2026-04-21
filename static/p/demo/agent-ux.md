---
id: bs-page-agent-ux
slug: agent-ux
title: Agent UX (AX) — how 1Context presents itself to AI agents
summary: The discipline of designing a website's surfaces so AI agents that fetch its URLs can read, handoff, and use the content effectively without being taught — both the philosophy and the v0.1 implementation spec.
doc_id: project-agent-ux
section: project
tags: [project, agents, ax, design, spec, internal]
canonical_url: /p/demo/agent-ux.html
md_url: /p/demo/agent-ux.md
llms_section_url: /p/demo/llms-full.txt
last_updated: 2026-04-20
version: 2
access: public
source_type: authored
alternate_formats:
  html: /p/demo/agent-ux.html
  mcp_handle: 1context://agent-ux
---

# Agent UX (AX)

> How 1Context presents itself to AI agents · Philosophy + implementation spec v0.1 · Updated 2026-04-20

**Agent UX** — abbreviated **AX**, parallel to UX — is the discipline of
designing a website's surfaces so that AI agents who fetch its URLs can read,
handoff, and act on the content without being taught about the site
specifically. It is to LLM-driven web consumers what UX is to humans, and
it is what 1Context invests in deliberately.

This page is the canonical reference for AX in 1Context. It covers the
philosophy and design principles, the layered stack of tactics we use, the
anti-patterns we avoid, the empirical findings that shape our priorities,
and the v0.1 implementation spec (URL layout, content tiers, frontmatter
schemas, generated discovery files, build validation, HTTP behavior).
One page, everything in one place.

## What is Agent UX

Agent UX is everything that happens between an agent receiving a URL and
the agent doing something useful with the content behind it. That includes:
which format the response is served in, whether the agent can discover
that an alternative format exists, how token-efficiently the response packs
the actual information, whether the agent can hand the content off to
another agent without loss, and what affordances the human sharer has to
pre-select the right format for the recipient.

Crucially, AX is *not* SEO for AI. SEO-like disciplines (AEO, GEO, LLMO,
AI-SEO) are about being found by crawlers and surfaced in answer engines.
AX is about what happens *after* the agent has the URL — the
comprehensibility, efficiency, and lossless-handoff properties of the
response itself. The two are complementary; this article is only about the
latter.

## What to call this

The field hasn't fully settled on a name. The candidates we considered:

- **Agent UX (AX)** — parallel to UX, captures the breadth (reading +
  handoff + UI affordances), memorable abbreviation. Our pick.
- **Agent-readability** — narrow but clean, parallel to accessibility
  (a11y). Good for the subset focused on parsing/comprehension.
- **Machine-readable surface** — formal and unambiguous; less catchy.
- **Agent affordances** — captures the design rationale (the page provides
  affordances; the agent uses them); a bit abstract for a project name.
- **Agentic IO**, **AIO** — too jargony, easy to confuse with "all-in-one".

We use **Agent UX** as the section title and **AX** as the abbreviation. We
use *agent-readability* when we mean specifically "can an agent parse
this," which is a subset of AX.

## Why it matters

### The summarizer bottleneck

We ran a controlled experiment (`tools/build-format-experiment.py` + four
parallel Opus subagents fetching four format variants of the same Albert
Einstein article through a Cloudflare tunnel) and discovered something
uncomfortable: *the format on the wire is approximately invisible to the
calling LLM through Claude's WebFetch tool*.

All four variants — 407KB full HTML, 405KB HTML with `<link rel=alternate>`,
403KB stripped HTML (just `<article>`), and 338KB pure markdown — produced
summaries of 200-450 tokens. None of the four agents could answer "in what
year did Einstein emigrate to the United States?" from their summary,
despite the answer (1933) being plainly in the source. WebFetch (and most
equivalent tools) runs every response through a small-model summarizer
before handing it to the calling LLM, and the summarizer drops specifics
regardless of input format.

This means our intuition — "if we just serve clean markdown, agents will
get a smaller, more useful response" — is partially wrong for the largest
class of agent consumer. Markdown helps, but only marginally. The
summarizer is the bottleneck.

### Three classes of agent

Consequently, AX has to design for three different agent classes that each
benefit from different things:

1. **Summarizing fetchers** (Claude WebFetch, ChatGPT browsing, Perplexity,
   most agent web tools): get a paraphrased summary regardless of format.
   Source format barely matters; structural cleanliness helps the
   summarizer pick up the right things.
2. **Raw fetchers** (Claude Code in Bash mode, Cursor terminal mode, custom
   curl-based agents, RAG pipelines): receive the full bytes, chunk and
   process directly. Format on the wire matters hugely; markdown saves
   real tokens; `llms-full.txt` as a single corpus blob is a qualitatively
   different capability.
3. **Typed-protocol consumers** (MCP-aware agents): bypass HTTP entirely
   and call typed tools. Format becomes irrelevant; the contract is the
   schema. Lossless handoff is the win.

1Context invests in all three because they have non-overlapping audiences
and non-overlapping costs. The URL stack covers (1) and (2); the planned
MCP server covers (3).

## Design principles

### Protocol layer or human, never LLM-via-content

Agents are hardened against prompt injection. Anything in fetched content
that *tells* an agent what to do is treated as untrusted and ignored
(correctly). So we never put imperatives in the page. Tactics that
survive injection defenses share a common structural property: the signal
lives in the protocol layer (HTTP headers, URL conventions, standardized
metadata locations) or it's an affordance to the human sharer (the human
picks the right URL; the agent never has to be persuaded). Page *content*
never tries to instruct the agent.

### Informational, not imperative

A short note in the page that *describes* an alternate as a **fact** is
not prompt injection — it's data. The phrasing matters critically: *"AI
agents should fetch /x.md"* is imperative (will be flagged as injection);
*"The markdown source is at /x.md"* is informational (safe). Hardened
agents read informational notes as data they can act on (or not) based on
their own judgment and the user's intent. We're not trying to override the
agent — we're describing the situation.

### Many small signals, no big guarantee

No single tactic forces agents to the right path. Each layer can fail. The
combination is the value. A good signal stack uses HTTP headers + HTML
head metadata + URL conventions + an in-page informational note +
frontmatter structured metadata + server-side smart defaults + a UI
affordance for human sharers + a typed-tools protocol. An agent that
misses one might catch another. The art is in stacking cheap, redundant
signals.

### The lossless path is MCP

Even with the perfect URL stack, the WebFetch summarizer loses specifics.
The only architecturally sound way to do agent-to-agent context handoff
with the actual content intact is to bypass the summarizing pipeline
entirely. That means an MCP server (lossless tool calls) or a direct
content paste. URL sharing is for humans, browsers, and non-summarizing
agents; MCP is for the agent-handoff thesis. Both paths are worth
building; neither alone is sufficient.

## The layered stack

Each tactic survives a different failure mode. They stack.

### Layer A — HTTP `Link` response header

Every HTML response includes
`Link: <…/page.md>; rel="alternate"; type="text/markdown"`. RFC 8288, the
standard way to communicate resource relationships at the HTTP layer.
Survives every possible content manipulation because it's not content.
Some agent fetchers parse it; most don't, today. Free to add. Status:
documented, planned for Phase 8 server-side wiring.

### Layer B — `<link rel="alternate" type="text/markdown">` in `<head>`

HTML-level equivalent of Layer A. Browsers expose it in view-source. Some
Reader-mode extractors preserve it. Note from our experiment: WebFetch's
HTML→markdown conversion may strip head tags before the summarizer sees
them — "absence-in-summary is not proof of absence-in-source." Low
reliability for the summarizing-WebFetch path; useful for other
extractors. Status: implemented in every preview HTML.

### Layer C — Canonical `.md` URL convention

Every page is reachable at two parallel URLs: `/page-slug` for the
rendered HTML and `/page-slug.md` for raw markdown with YAML frontmatter.
The convention mirrors GitHub's raw paths, Reddit's `/.json`, and
Wikipedia's `?action=raw`. Token-conscious agents who try the `.md`
variant succeed without anyone telling them. The URL itself is the
affordance. Status: implemented as parallel files for every page that has
an .md companion.

### Layer D — Server-side `Sec-Fetch` heuristic

Browsers send `Sec-Fetch-Dest: document` on top-level navigation. Curl,
Python requests, Node fetch, most agent HTTP clients do not. Server-side
rule: bare URL hits with no browser-navigation headers get a 302 redirect
to the `.md` URL; the original URL always serves HTML for browsers. Naive
agents land on the redirect → markdown automatically. No teaching needed.
*Important: redirect, don't substitute content at the same URL — same-URL
substitution breaks link previews (Slack, Discord), CDN caching without
proper Vary support, and search snippets.* Status: documented, planned
for Phase 8.

### Layer E — Visible informational note (in HTML view)

A short, branded, factual note placed *after the lead paragraph*:
"1Context · A wiki for humans and AI agents. The markdown source is at
/page.md…". *Not* the first sentence, because summarizers over-weight
the first content of a page and would describe the article as "a page
about 1Context that has a markdown version" — useless. The note
triple-duties as a signal an agent's summarizer might preserve, marketing
copy reinforcing the brand, and documentation for humans wondering what
1Context is. Hidden in agent view because the agent on the .md page has
already solved the discoverability problem. Status: implemented in
`enhance.js`.

### Layer F — Frontmatter `alternate_formats` block

The `.md` response includes structured metadata in YAML frontmatter
listing alternate URLs and the planned MCP handle. Listed as data, not
instruction. Markdown-aware extractors preserve frontmatter cleanly.
Status: implemented in every `.md` we ship.

### Layer G — Reader / Agent toggle in the header

A two-state segmented control in the header. When the user clicks
**Agent**, the page transforms in place to show what an agent would see —
chrome hidden, content rendered as raw markdown in a monospace IDE-styled
frame, with "Copy as markdown" and "Open .md ↗" affordances. State is
`sessionStorage` only (not persistent across sessions) so a human's
choice doesn't bleed into a co-resident agent's session. Marketing: makes
the agent-first thesis visible and demonstrable. Functional: a one-click
way to see what's actually going to the agent. Status: implemented.

### Layer H — Share menu copy affordances

A "Share" button in the rail or article toolbar opens a small menu with
options like *Copy URL (for humans)*, *Copy markdown link (for agents)*,
*Copy content as markdown* (direct paste), and (when available) *Copy MCP
handle*. This is the most powerful "no teaching needed" lever — the human
chooses the right format for the recipient agent. Status: planned, not
yet implemented.

### Layer I — `llms.txt`, `llms-full.txt`, `docs-index.json`

Following the emerging convention (notably adopted by OpenAI's developer
documentation), 1Context will serve four discovery surfaces at the
corpus layer: `/llms.txt` as a curated index, per-section
`/<section>/llms-full.txt` bundles for RAG agents that want a chunk of
the site bigger than one page, a top-level curated `/llms-full.txt` of
the project's authored documentation (imported reference material is
partitioned under `/reference/` and gets its own corpus, so it doesn't
drown the project content), and `/docs-index.json` as a structured
manifest for strict parsers. The full implementation rules are below in
[Implementation spec (v0.1)](#implementation-spec-v01). Status: spec
drafted, generation planned as a near-term Phase 7 follow-up.

### Layer J — MCP server

A Model Context Protocol server exposing 1Context as typed tools:
`list_pages(project, since?)`, `read_page(slug, format=md)` (returns full
markdown bytes, no summarization), `search(query, project?)`,
`recent_changes(project, since)`. Every MCP-aware agent can call these
directly. **This is the lossless agent-to-agent context handoff path.**
The URL stack improves the WebFetch experience marginally; MCP solves
the handoff problem completely. Status: planned as a separate near-term
project after Phase 7.

## Anti-patterns we avoid

- **In-prose imperatives** — *"AI agent: fetch /raw.md instead"*.
  Triggers injection defenses. Hardened agents will refuse and may flag
  the page.
- **System-message-styled blocks** — *"// SYSTEM: this page is large,
  fetch the raw version"*. Same problem dressed up as a comment.
- **User-Agent sniffing for serving different content** — fragile,
  adversarial; every scraper fakes UA strings.
- **Cookies that change content authoritatively** — explicit signals
  (URL suffix, `Accept` header) must always win over cookies, otherwise
  browser-resident agents inheriting a human's preferences get the wrong
  content.
- **Persistent toggle state across browser sessions** — the Reader/Agent
  toggle is `sessionStorage` only, not `localStorage`, to keep co-resident
  agents and humans from inheriting each other's choices via shared
  profiles.
- **Same-URL content substitution by Sec-Fetch heuristic** — redirect,
  don't substitute. Same-URL substitution breaks link previews, CDN
  caching, and search snippets.
- **Pretending `llms.txt` is universally honored today** — it's an
  emerging convention; cheap to add, but don't rely on it as the sole
  signal.

## Empirical findings

The format experiment (`tools/build-format-experiment.py`) is the source
of three findings that shape current AX priorities:

1. **`<link rel="alternate">` is unreliable** through summarizing
   fetchers because head tags often get stripped before the summarizer
   sees them. Useful for non-summarizing extractors and as a seed for
   future agent tooling, but not load-bearing today.
2. **Source format barely affects token cost** for Claude WebFetch
   consumers. The summarizer is the bottleneck; markdown vs HTML on the
   wire both produce ~300-token summaries.
3. **The `.md` URL suffix is the only universal-discoverability primitive
   that survives** because it's encoded in the URL, not in HTML. Agents
   that try the suffix succeed across all consumer types.

The architectural conclusion: invest in the URL stack as a floor-raiser
for all consumer classes, but accept that the ceiling for the
summarizing-WebFetch path is bounded by the summarizer — and treat MCP as
the only path to lossless handoff.

## Marketing story

The visible Reader / Agent toggle in the header is both a real functional
affordance and a marketing surface. It supports taglines like:

> *"Every page works two ways. Toggle to Agent view to see exactly what
> your AI reads — same content, no chrome, copy as markdown."*
>
> *"1Context: knowledge base for humans, source-of-truth for agents. One
> URL, two surfaces, lossless handoff via MCP."*

These are stronger than typical AI-feature copy because they're literally
true and visibly demonstrated by the in-product toggle. The honesty is the
product.

## Implementation spec (v0.1)

The concrete rules for URL layout, content tiers, frontmatter schemas,
generated discovery files (`llms.txt`, `llms-full.txt`,
`docs-index.json`), build pipeline, and HTTP behavior so that any
1Context deployment can ship an agent-friendly surface that behaves
predictably across humans, raw fetchers, RAG agents, search agents, and
machine clients alike. Patterned after [OpenAI's developer
documentation](https://developers.openai.com/llms.txt), extended with
project-specific rules around imported reference material, access tiers,
supersession, and build-time validation. The corpus-layer spec below is
exactly Layer I expanded; the page-layer extensions (Sec-Fetch
heuristic, informational note, Reader/Agent toggle, MCP) are documented
above as Layers D, E, G, J.

### Design goals — five reading modes

The site must be readable in **five** distinct modes:

1. Human in browser
2. Raw HTTP fetcher / curl agent
3. Search agent that only knows to look for `llms.txt`
4. RAG agent that wants a section corpus
5. Machine client that wants a structured manifest

The whole spec exists to satisfy all five with the smallest possible
amount of duplicated content.

### URL layout

```text
/
├── llms.txt
├── llms-full.txt
├── docs-index.json
├── api/
│   ├── llms-full.txt
│   └── docs/<slug>
│       └── <slug>.md
├── product/
│   ├── llms-full.txt
│   └── docs/<slug>
│       └── <slug>.md
├── ops/
│   ├── llms-full.txt
│   └── docs/<slug>
│       └── <slug>.md
└── reference/
    ├── llms-full.txt
    └── docs/<slug>
        └── <slug>.md
```

Every canonical page exists at **both** the `/section/docs/<slug>` path
(HTML) and the `/section/docs/<slug>.md` path (markdown twin). Section
names are project-specific stable identifiers (e.g. `api`, `product`,
`ops`, `reference`). Each section gets its own `llms-full.txt` bundle so
a RAG agent can fetch just the section it cares about.

Imported encyclopedia/reference content lives **only** under
`/reference/` with its own corpus export. It is **never** folded into
the top-level `/llms-full.txt` — imported material can be 100x the size
of authored docs and would dominate retrieval. Project's authored docs
are the constitution; imported docs are annexes.

### Content tiers (A–E)

Five tiers, one per reading mode:

- **Tier A — canonical HTML.** Human-readable page with full chrome
  (navigation, styling, search box, auth chrome, the WikiWand-style
  editorial layer, the right rail, the customizer, the Reader/Agent
  toggle). This is what a browser shows.
- **Tier B — markdown twin.** Clean content-only representation for
  agents and scripts. Path rule: append `.md` to the canonical HTML
  path.
- **Tier C — section corpus.** Concatenated markdown for a section,
  served at `/<section>/llms-full.txt`. Each entry separated by a
  hard separator with metadata.
- **Tier D — site discovery (`llms.txt`).** A small, curated,
  opinionated `llms.txt` at the site root. A map, not a dump.
- **Tier E — machine manifest (`docs-index.json`).** JSON file at
  `/docs-index.json` with every authored page's frontmatter as
  structured fields.

### Page frontmatter schema

Every `.md` page begins with YAML frontmatter. Required fields are the
minimum needed to generate `docs-index.json` and enforce build-time
validation. Optional fields are additive and adopted progressively.

```yaml
---
title: WebSocket Mode
summary: Persistent socket transport for long-running, tool-heavy workflows.
doc_id: api-websocket-mode
section: api
tags:
  - responses
  - websocket
  - streaming
canonical_url: /p/demo/api/docs/guides/websocket-mode
md_url: /p/demo/api/docs/guides/websocket-mode.md
llms_section_url: /p/demo/api/llms-full.txt
last_updated: 2026-04-20
version: 1
access: public
source_type: authored
supersedes: null
---
```

**Required:** `title`, `summary`, `doc_id`, `section`, `canonical_url`,
`md_url`, `last_updated`, `access` (`public | shared | private` —
matches the visibility-bar tier), `source_type` (`authored | imported`).

**Optional but recommended:** `tags`, `version`, `supersedes`,
`deprecated`, `replaced_by`, `owner`, `review_status`,
`llms_section_url`, `alternate_formats`, `original_source` (for
imported docs).

### Markdown twin rules

The `.md` twin is content-first, not a lossy DOM scrape.

**Preserve:** headings + heading anchors, code fences, tables,
ordered/unordered lists, blockquotes, internal links, "last updated"
metadata.

**Strip:** nav, footers, cookie banners, interactive UI junk
(toolbars, modals), unrelated sidebar content, duplicated title
blocks if frontmatter already covers them.

**Heading rule:** generate stable slug anchors and keep them stable
across rebuilds. Anchor format must be deterministic with explicit
collision handling. Agents cite by anchor; renaming an anchor breaks
every prior citation.

### `llms.txt` spec

Small, curated, opinionated. A map, not a dump. Example:

```text
# 1Context Docs

> Agent-readable index for 1Context documentation.

Core docs:
- Project overview: /1context-project
- Agent UX (AX): /agent-ux
- Theme phases plan: /THEME_PHASES

Corpus exports:
- Core authored docs: /llms-full.txt
- Reference / imported docs: /reference/llms-full.txt

Machine-readable manifest:
- /docs-index.json

Markdown pages:
- Most docs are available as `.md` twins at the same path.
```

What it should do: tell the agent what the site is, define section
boundaries, point to corpus files and the JSON manifest, highlight the
5–20 pages that matter most. What it should not do: list 500 pages,
repeat entire docs, become a second full export.

### `llms-full.txt` generation spec

Each full export is a concatenated markdown bundle. Order predictably:

1. Overview / getting started
2. Concepts
3. Guides
4. Reference
5. Changelog / deprecations

Between docs, inject a hard separator with per-doc metadata:

```text
================================================================================
DOC_START
title: WebSocket Mode
doc_id: api-websocket-mode
canonical_url: /p/demo/api/docs/guides/websocket-mode
md_url: /p/demo/api/docs/guides/websocket-mode.md
last_updated: 2026-04-20
section: api
source_type: authored
================================================================================
```

Then the page body. The separator is intentionally ugly in a
grep-friendly way. Agents like ugly when it is stable: a RAG pipeline
can split on `DOC_START`, parse the metadata header, and chunk
reliably.

**Top-level `/llms-full.txt` includes:** overview docs, important
product docs, core API docs, auth + permissions + secrets handling,
sync model, agent workflow docs.
**Excludes:** giant imported reference dumps (under
`/reference/llms-full.txt`), low-value release notes, duplicate
generated pages, thin stubs.

**Size target:** "large but sane." The point isn't bytes — it's
relevance density. A bloated corpus with low-value pages is worse for
retrieval than a smaller curated one.

### `docs-index.json` spec

One entry per authored page. Example:

```json
[
  {
    "title": "WebSocket Mode",
    "summary": "Persistent socket transport for long-running, tool-heavy workflows.",
    "doc_id": "api-websocket-mode",
    "section": "api",
    "canonical_url": "/api/docs/guides/websocket-mode",
    "md_url": "/api/docs/guides/websocket-mode.md",
    "llms_section_url": "/api/llms-full.txt",
    "tags": ["responses", "websocket", "streaming", "tools"],
    "last_updated": "2026-04-20",
    "access": "public",
    "source_type": "authored"
  }
]
```

Why JSON in addition to markdown frontmatter: some agents are better
at markdown extraction; others are better at JSON manifest parsing.
Costs almost nothing to emit both. Removes friction.

### Auth and secrets

For **public** docs, all five surfaces are open. For **private** docs,
the HTML page, the `.md` twin, the section corpus, and the JSON
manifest **must** all obey the same auth boundary. Don't let `.md` or
`llms-full.txt` become the accidental side door.

For pages that document secret schemas, the markdown and corpus
exports expose the **schema**, not the value:

```text
GitHub Token
Type: secret
Status: user-provided
Access: permitted to authorized agent actions
Value: [REDACTED]
```

Never:

```text
GitHub Token: ghp_...   # ✗ leaks the actual secret into the corpus
```

### Imported / reference corpus policy

Keep imported material in its own URL space and its own corpus:

```text
/reference/docs/einstein-biography
/reference/llms-full.txt
```

Mark it in frontmatter:

```yaml
source_type: imported
original_source: https://en.wikipedia.org/wiki/Albert_Einstein
```

Never mix imported docs into the primary top-level corpus. Project
docs are the constitution; imported docs are annexes.

### Change management and supersession

Docs change. Agents need to know what replaced what so they don't cite
dead doctrine. Add the optional fields to frontmatter:

```yaml
deprecated: true
replaced_by: /api/docs/guides/new-websocket-mode
supersedes: /api/docs/guides/old-websocket-mode
```

And mirror in `docs-index.json`:

```json
{
  "deprecated": true,
  "replaced_by": "/api/docs/guides/new-websocket-mode"
}
```

### Build pipeline and validation

At build time:

1. Collect all source docs
2. Render canonical HTML
3. Render clean `.md` twin (apply Markdown twin rules)
4. Emit `docs-index.json`
5. Emit each section `llms-full.txt`
6. Emit top-level curated `llms-full.txt`
7. Emit top-level `llms.txt`

**Fail the build if:**

- A canonical HTML page lacks a `.md` twin
- Frontmatter is missing a required field
- `llms.txt` points to missing pages
- `docs-index.json` and the markdown twins disagree on metadata
- A section corpus contains duplicate `doc_id`s
- Private pages leak into a public corpus export
- Heading anchors changed without an explicit redirect entry

### HTTP behavior

For `.md`, `.txt`, `.json` responses:

- Correct, explicit `Content-Type` (`text/markdown`, `text/plain`,
  `application/json`)
- Strong caching with `ETag`
- gzip or brotli
- Stable `Last-Modified`
- HEAD requests cleanly supported
- No anti-bot challenges (Cloudflare's automatic bot scoring) on
  docs URLs

*Agent-friendly docs should behave like a library, not a nightclub.*

## Phased rollout

Highest-ROI sequence for a new deployment:

- **Phase 1** — per-page `.md` twins, frontmatter on every page,
  `docs-index.json`, `llms.txt`. Unlocks reading modes 1, 2, 3, and 5
  (browser + curl + search + machine).
- **Phase 2** — section `llms-full.txt` bundles. Unlocks reading
  mode 4 (RAG agents).
- **Phase 3** — top-level curated `llms-full.txt`,
  supersession/deprecation metadata, private-corpus partitioning,
  build validation gates.

## Implementation status

State as of 2026-04-20:

- ✅ Per-page `.md` twins for the project pages (1context-project,
  agent-ux, albert-einstein-full)
- ✅ Frontmatter on every shipped `.md` with most required fields
  (title, slug, tier, tags, updated, source, alternate_formats);
  need to add `doc_id`, `section`, `last_updated` as ISO date,
  `access` as the tier name, `source_type`
- ✅ `<link rel="alternate" type="text/markdown">` + OG metadata in
  HTML head
- ✅ Reader / Agent toggle in header + informational note after lead
  paragraph (Layers E + G)
- ⏳ `llms.txt` at site root — planned, next
- ⏳ `docs-index.json` at site root — planned, next
- ⏳ Section `llms-full.txt` + top-level `llms-full.txt` — planned
- ⏳ Imported / authored partitioning under `/reference/` — planned
- ⏳ Build-time validation gates — planned
- ⏳ Sec-Fetch heuristic, HTTP `Link` response header (Layers D + A)
  — server-side, planned for Phase 8 BookStack production wiring
- ⏳ MCP server (Layer J) — planned, separate near-term project

## Open decisions

- **Should the toggle navigate to `/page.md`** instead of doing the
  in-place JS swap? Currently in-place (fast, marketing-friendly,
  URL stays HTML). The architecturally honest version navigates and
  makes the URL convention real. Deferred to Phase 8 when the `.md`
  endpoint can serve a styled-wrapper response for browsers vs raw
  markdown for agents via content negotiation.
- **Scope of `llms-full.txt`** — project-authored content only, or
  include imported reference articles? Current plan: project content
  only, to avoid drowning useful pages in archived references.
- **MCP server hosting** — bundled with the broker, separate sidecar,
  or a small standalone service? TBD when MCP work begins.
- **Agent-tier signaling** — should the
  `data-tier="public|shared|private"` on the visibility bar also be
  exposed to agents via response header (`X-Context-Tier`) so a
  credential-broker integration can refuse to handle private content
  inadvertently?

## See also

- [1Context](/1context-project.html) — the project this article is part
  of; its *Editorial model* section explains the Wikipedia-style
  flat-namespace + hatnote conventions used here.
- [Wikipedia hatnote](https://en.wikipedia.org/wiki/Wikipedia:Hatnote) —
  the editorial pattern that *Main article:* follows.
- [llms.txt proposal](https://llmstxt.org/) — the emerging community
  standard behind Layer I.
- [Model Context Protocol](https://modelcontextprotocol.io/) — the
  typed-tools interface behind the eventual Layer J.

## References

- [1Context project page](1context-project.html) — overall architecture
  and where AX fits.
- [`agent-ui.md`](agent-ui.md) — engineering notes backing this article
  (implementation status table, code snippets).
- [`THEME_PHASES.md`](THEME_PHASES.md) — the phase plan that schedules
  the unimplemented AX layers (D, H, I, J).
- [RFC 8288 — Web Linking](https://datatracker.ietf.org/doc/html/rfc8288)
  — the standard behind Layer A.
- [`llms.txt` proposal](https://llmstxt.org/) — the emerging convention
  behind Layer I.
- [Model Context Protocol](https://modelcontextprotocol.io/) — the
  typed-tools interface 1Context will expose for Layer J.
- [OpenAI Developers llms.txt](https://developers.openai.com/llms.txt)
  + [llms-full.txt](https://developers.openai.com/llms-full.txt) —
  concrete reference implementation of Layer I in the wild (~2.9 MB
  single-file dump of all OpenAI developer documentation).
