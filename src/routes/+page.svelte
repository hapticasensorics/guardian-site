<script lang="ts">
  import WikiDemo from '$lib/components/WikiDemo.svelte';
  import ChatDemo from '$lib/components/ChatDemo.svelte';
  import { dayEntries, daySummary } from '$lib/day-entries';
</script>

<svelte:head>
  <title>Haptica 1Context</title>
  <meta
    name="description"
    content="Haptica 1Context is the cross-agent memory layer for your work. One install. Works with Claude, Cursor, and ChatGPT through MCP."
  />
</svelte:head>

<section class="mb-12 mt-4 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
  <div>
    <p class="label-chip mb-3 text-[12px]" style="color: #999; letter-spacing: 0.18em">
      HAPTICA 1CONTEXT
    </p>
    <h1 class="m-0 font-[var(--font-serif)] italic" style="font-weight: 300">
      Own your context.
    </h1>
    <p class="mb-6 mt-4 max-w-[48ch] text-base leading-6" style="color: var(--color-text)">
      The cross-agent memory layer for your work. One install. MCP-native, works with Claude,
      Cursor, and ChatGPT.
    </p>
    <a
      href="https://forms.gle/b1nX4idziZR7RegC9"
      target="_blank"
      rel="noreferrer"
      class="cta-link label-chip inline-flex items-center border border-[var(--color-text)] px-6 py-3 text-[15px] no-underline"
    >
      Join the waitlist
    </a>
  </div>

  <div>
    <WikiDemo />
  </div>
</section>

<section class="mb-12 grid gap-8 md:grid-cols-[1fr_1fr]">
  <div>
    <h2 class="section-rule mb-4 mt-0">Where we&rsquo;re going</h2>
    <p class="mb-4 text-[13px] italic" style="color: rgba(26,26,26,0.55)">
      Long-term: a desktop agent that captures your work in the background, so 1Context builds
      itself.
    </p>
    <ChatDemo />
  </div>

  <div>
    <h2 class="section-rule mb-4 mt-0">A sample work day</h2>
    <p class="mb-4 text-[13px] italic" style="color: rgba(26,26,26,0.55)">
      Wednesday. Captured in the background, queryable from any agent.
    </p>
    <div class="surface-card px-5">
      {#each dayEntries as entry}
        <div class="repo-divider py-3 first:pt-0">
          <div class="flex items-start gap-3">
            <span class="score-chip shrink-0 mt-0.5">{entry.time}</span>
            <p class="m-0 text-[13px] leading-5" style="color: var(--color-text)">
              {entry.body}
            </p>
          </div>
        </div>
      {/each}
      <div class="repo-divider py-4 last:pb-0">
        <p class="label-chip mb-2 mt-0 text-[11px]" style="color: #999">1context</p>
        <p class="m-0 text-[13px] italic leading-5" style="color: var(--color-text)">
          {daySummary}
        </p>
      </div>
    </div>
  </div>
</section>

<section id="contact" class="mb-8">
  <h2 class="section-rule mb-6 mt-0">Contact</h2>
  <div
    class="surface-card flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
  >
    <a
      href="https://forms.gle/b1nX4idziZR7RegC9"
      target="_blank"
      rel="noreferrer"
      class="cta-link label-chip inline-flex items-center border border-[var(--color-text)] px-6 py-3 no-underline"
    >
      Join the waitlist
    </a>
    <a
      href="mailto:contact@haptica.ai"
      class="label-chip inline-flex items-center border border-[var(--color-text)] px-4 py-3 no-underline"
      style="color: var(--color-text)"
    >
      contact@haptica.ai
    </a>
  </div>
</section>

<style>
  :global(.paper-column) {
    max-width: 1120px;
  }
</style>
