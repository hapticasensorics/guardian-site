<script lang="ts">
  import ChatDemo from '$lib/components/ChatDemo.svelte';
</script>

<svelte:head>
  <title>Guardian</title>
  <meta
    name="description"
    content="Guardian memorizes your screen, your conversations, and the world around you, then acts on it before you have to ask."
  />
</svelte:head>

<section class="mb-16 mt-4">
  <div>
    <h1 class="m-0 font-[var(--font-serif)] italic" style="font-weight: 300">
      The assistant that understands you.
    </h1>
    <p class="mb-8 mt-4 max-w-[56ch] text-base leading-6" style="color: var(--color-text)">
      Guardian memorizes your screen, your conversations, and the world around you, then acts on
      it before you have to ask.
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
  <h2 class="section-rule mb-6 mt-0">A sample day</h2>

  <p class="mt-0 mb-6 text-[15px] leading-7" style="color: rgba(26, 26, 26, 0.65)">
    Sunday. A late night rolls into a slow morning, an airport pickup, a long drive with good
    conversation, and an honest evening with a friend. No agenda. Guardian captured all of it.
  </p>

  <div class="surface-card px-5">
    <div class="repo-divider py-5 first:pt-0">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">00:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Still at a 24-hour cafe from the night before. A conversation about Proust turns
            into a debate about whether recording your life changes how you live it. Someone
            asks about the app. Jackie says the data is thin but imagine a super intelligent
            AI analyzing every interaction you have.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Corgi Cafe, San Francisco
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">09:00</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Morning at home. Beatles White Album playing. Casual exchanges about the neighbor,
            an ice machine, and whether anyone wants to drive to San Jose. Guardian identifies
            the music as media, not conversation.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            347 Dolores St, San Francisco
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">13:00</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Airport pickup at SFO Terminal 3. Kendrick Lamar playing on the drive over.
            Jackie calls from the ground floor: &ldquo;Hi, I&rsquo;m at terminal three,
            door one.&rdquo; The drive back becomes two hours of conversation about movies,
            memory, and what Proust actually meant.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            SFO &rarr; San Francisco
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">16:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            An honest conversation with Paul. Velvet Underground playing. Jackie says
            &ldquo;I can&rsquo;t do the cheering. I&rsquo;m just not a cheering person.
            This is not who I am.&rdquo; Paul pushes back. Neither of them drops it.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            San Francisco
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span class="score-chip shrink-0 sm:mt-0.5">18:30</span>
        <div>
          <p class="m-0 text-[15px] leading-6" style="color: var(--color-text)">
            Taco Bell run in Hayes Valley. The conversation is lighter now. They talk about
            people they know, who&rsquo;s cute, who&rsquo;s serious, what to do this week.
          </p>
          <p class="label-chip mb-0 mt-2 text-[12px]" style="color: #999">
            Hayes Valley, SF
          </p>
        </div>
      </div>
    </div>

    <div class="repo-divider py-5 last:pb-0">
      <p class="label-chip mb-2 mt-0" style="color: #999">Guardian</p>
      <p class="m-0 text-[15px] italic leading-7" style="color: var(--color-text)">
        At 1 AM you told someone that recording your life might change how you live it.
        At 4:30 PM you told Paul you can&rsquo;t be someone you&rsquo;re not. You said
        both things like they were separate thoughts. They aren&rsquo;t.
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
