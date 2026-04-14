<script lang="ts">
  import ChatDemo from '$lib/components/ChatDemo.svelte';
</script>

<svelte:head>
  <title>Guardian</title>
  <meta
    name="description"
    content="Guardian captures your screen continuously and gives every AI tool persistent memory of your work through MCP."
  />
</svelte:head>

<section class="mb-16 mt-4">
  <div>
    <h1 class="m-0 font-[var(--font-serif)] italic" style="font-weight: 300">
      Your AI tools forget everything. Guardian doesn't.
    </h1>
    <p class="mb-8 mt-4 max-w-[56ch] text-base leading-6" style="color: var(--color-text)">
      A Mac app that captures your screen in the background, builds structured memory of your
      work, and serves it to Claude, Cursor, and ChatGPT through MCP.
    </p>

    <div class="mb-10 text-center">
      <a
        href="https://forms.gle/b1nX4idziZR7RegC9"
        target="_blank"
        rel="noreferrer"
        class="cta-link label-chip inline-flex items-center border border-[var(--color-text)] px-6 py-3 text-[15px] no-underline"
      >
        Join the waitlist
      </a>
    </div>

    <ChatDemo />
  </div>
</section>

<section class="mb-16">
  <h2 class="section-rule mb-6 mt-0">A sample work day</h2>

  <p class="mt-0 mb-6 text-[15px] leading-7" style="color: rgba(26, 26, 26, 0.65)">
    Wednesday. Deep coding in the morning, a standup, context switching between three projects, a design review, and a late-night fix. Guardian captured all of it.
  </p>

  <div class="surface-card px-5">
    <div class="repo-divider py-5 first:pt-0">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">09:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Deep work on the ingestion pipeline. VS Code open, three terminal tabs, Claude Code running. Refactored the timestamp parser in scene_claims.py. Decided to keep the Whisper+Gemini path reversible instead of committing to one.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            VS Code &middot; Claude Code &middot; 2.1h focus block
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">11:45</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Standup with Paul. Committed to shipping MCP auth by Friday. Alex asked about the API docs, said they&rsquo;d be done by Thursday. Mentioned the race condition in PR #38 needs a fix before merge.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Google Meet &middot; 12 min &middot; 3 commitments tracked
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">14:00</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Context switch to the landing page redesign. Figma open alongside the codebase. Reviewed three layout options, picked the editorial direction. Sent a Slack message to the team with the decision and reasoning.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Figma &middot; Slack &middot; 1 decision logged
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">16:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Back to code. PR review on the MCP server changes. Found a bug in the auth flow, left a comment. Switched to Cursor for the race condition fix. Got halfway through before getting pulled into an investor email.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            GitHub &middot; Cursor &middot; Gmail &middot; 3 context switches
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">23:00</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Late-night session. Finally fixed the race condition. Pushed the commit, closed the PR. Opened Claude Code to draft the API docs but got sidetracked reading a thread about MCP auth patterns.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            VS Code &middot; GitHub &middot; Claude Code &middot; 1.8h focus block
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5 last:pb-0">
      <p class="label-chip mb-2 mt-0" style="color: #999">Guardian</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        You committed to API docs by Thursday and MCP auth by Friday. The docs haven&rsquo;t been started. The race condition is fixed but you never went back to the auth work. Tomorrow&rsquo;s standup is in 10 hours.
      </p>
    </div>
  </div>
</section>

<section id="contact" class="mb-8">
  <h2 class="section-rule mb-6 mt-0">Contact</h2>

  <div class="surface-card text-center">
    <p class="mb-4 mt-0">
      <a
        href="https://forms.gle/b1nX4idziZR7RegC9"
        target="_blank"
        rel="noreferrer"
        class="cta-link label-chip inline-flex items-center border border-[var(--color-text)] px-6 py-3 no-underline"
      >
        Join the waitlist
      </a>
    </p>
    <p class="mb-0 mt-4">
      <a
        href="mailto:contact@haptica.ai"
        class="label-chip inline-flex items-center border border-[var(--color-text)] px-4 py-3 no-underline"
        style="color: var(--color-text)"
      >
        contact@haptica.ai
      </a>
    </p>
  </div>
</section>
