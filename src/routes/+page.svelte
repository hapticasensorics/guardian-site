<svelte:head>
  <title>Guardian</title>
  <meta
    name="description"
    content="Guardian captures your day, turns it into structured memory, and becomes an AI advisor grounded in what actually happened."
  />
</svelte:head>

<section class="mb-16 mt-4">
  <div>
    <p class="label-chip m-0" style="color: #999">Personal memory for AI</p>
    <h1 class="m-0 mt-4 font-[var(--font-serif)] italic" style="font-weight: 300">
      What if your AI actually knew you?
    </h1>
    <p class="mb-0 mt-4 max-w-[56ch] text-base leading-6" style="color: var(--color-text)">
      Every assistant today starts from zero. You repeat context, lose continuity between sessions,
      and ask advice from a system that never saw the meeting, the work, or the tradeoff that led
      to it. Guardian turns the texture of your day into memory an advisor can actually use.
    </p>
  </div>
</section>

<section id="how" class="mb-16">
  <h2 class="section-rule mb-8 mt-0">How it works</h2>

  <div class="grid gap-8 md:grid-cols-3">
    <div class="text-center">
      <p class="label-chip mb-2 mt-0">Capture</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Wearables, desktop, and phone activity create a continuous record of what you saw, said,
        and worked on.
      </p>
    </div>
    <div class="text-center">
      <p class="label-chip mb-2 mt-0">Understand</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Raw streams become structured memory: people, commitments, locations, documents, and the
        decisions hidden inside them.
      </p>
    </div>
    <div class="text-center">
      <p class="label-chip mb-2 mt-0">Advise</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Instead of waiting for a query, Guardian notices patterns, flags risks, and reminds you
        about what matters before it slips.
      </p>
    </div>
  </div>
</section>

<section class="mb-16">
  <h2 class="section-rule mb-6 mt-0">A sample day</h2>

  <div class="surface-card px-5">
    <div class="repo-divider py-5 first:pt-0">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">09:14</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Deep work on the pitch deck, with Figma, notes, and investor prep docs open across the
            desktop.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Desktop capture · 2h 14m
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">11:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Coffee with Sarah covered the Series A timeline, burn concerns, and an introduction to
            David at Lux.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Wearable audio + video · 48m · Hayes Valley
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">13:45</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Team standup surfaced a firmware blocker and moved the demo from Wednesday to Thursday.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Desktop audio + screen · 22m
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">16:20</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Reading session on diffusion policy for manipulation, annotated across three papers and
            one draft memo.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Desktop capture · 1h 40m
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5 last:pb-0">
      <p class="label-chip mb-2 mt-0" style="color: #999">System note</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        Sarah promised an investor introduction, but her burn-rate concern never made it into your
        follow-up notes. Guardian would connect both before the intro happens.
      </p>
    </div>
  </div>
</section>

<section class="mb-16">
  <h2 class="section-rule mb-6 mt-0">Proactive advisor</h2>

  <div class="flex flex-col gap-4">
    <div class="surface-card px-6 py-5">
      <p class="label-chip mb-3 mt-0" style="color: #999">Example 01</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        &ldquo;You have described the same hiring problem to three different people this week. None
        of them knows about the others&rsquo; suggestions.&rdquo;
      </p>
    </div>

    <div class="surface-card px-6 py-5">
      <p class="label-chip mb-3 mt-0" style="color: #999">Example 02</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        &ldquo;Last Tuesday you decided to cut the hardware timeline by two weeks, but the firmware
        team still has the old date in their notes.&rdquo;
      </p>
    </div>

    <div class="surface-card px-6 py-5">
      <p class="label-chip mb-3 mt-0" style="color: #999">Example 03</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        &ldquo;You have been in uninterrupted focus for five hours. The last time that happened, you
        nearly missed the investor call on your calendar.&rdquo;
      </p>
    </div>
  </div>
</section>

<section id="why" class="mb-16">
  <h2 class="section-rule mb-6 mt-0">Why this matters</h2>

  <div class="max-w-[58ch]">
    <p class="mt-0 text-base leading-7" style="color: rgba(26, 26, 26, 0.7)">
      Today&rsquo;s assistants are fluent, but they are fundamentally amnesiac. They do not know who
      you met on Tuesday, what you committed to on Thursday, or which decision quietly changed the
      shape of the next month.
    </p>
    <p class="text-base leading-7" style="color: rgba(26, 26, 26, 0.7)">
      Guardian captures experience across devices, reconciles it into evidence-backed memory, and
      lets an advisor reason from what actually happened instead of whatever you happened to type
      into a prompt.
    </p>
    <p class="mb-0 text-base leading-7" style="color: var(--color-text)">
      The result is not better chat. It is continuity, judgment, and context that compounds over
      time.
    </p>
  </div>
</section>

<section class="mb-16">
  <h2 class="section-rule mb-6 mt-0">The moat</h2>

  <div class="grid gap-px border border-[var(--color-border)] md:grid-cols-2">
    <div class="bg-[var(--color-surface)] p-6">
      <p class="label-chip mb-2 mt-0">Data that cannot be backfilled</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Six months of lived context does not exist anywhere else. Every additional day makes the
        system harder to replace.
      </p>
    </div>

    <div class="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:border-l md:border-t-0">
      <p class="label-chip mb-2 mt-0">Personalization that compounds</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Guardian learns your patterns, preferences, and tradeoffs from repeated evidence, not one
        onboarding questionnaire.
      </p>
    </div>

    <div class="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p class="label-chip mb-2 mt-0">Multi-device corroboration</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        Desktop, wearable, and phone inputs reinforce each other so memory is grounded in multiple
        sources instead of one noisy stream.
      </p>
    </div>

    <div class="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:border-l">
      <p class="label-chip mb-2 mt-0">Privacy by architecture</p>
      <p class="m-0 text-[15px] leading-6" style="color: rgba(26, 26, 26, 0.65)">
        The durable asset is structured meaning, not raw recordings. What compounds is memory, not
        a permanent archive of your life.
      </p>
    </div>
  </div>
</section>

<section id="contact" class="mb-8">
  <h2 class="section-rule mb-6 mt-0">Contact</h2>

  <div class="surface-card text-center">
    <p class="mx-auto mt-0 max-w-[48ch] text-base leading-7" style="color: rgba(26, 26, 26, 0.7)">
      Guardian is being built for people who want an advisor with memory, continuity, and real
      context. If you want to see it early, get in touch.
    </p>
    <p class="mb-0 mt-8">
      <a
        href="mailto:jackie@haptica.ai"
        class="label-chip inline-flex items-center border border-[var(--color-text)] px-4 py-3 no-underline"
        style="color: var(--color-text)"
      >
        jackie@haptica.ai
      </a>
    </p>
  </div>
</section>
