<script lang="ts">
  import { onMount } from 'svelte';

  interface Message {
    sender: 'you' | 'guardian';
    question?: string;
    intro?: string;
    pre?: string;
    outro?: string;
  }

  const messages: Message[] = [
    {
      sender: 'you',
      question: 'who matters to me?'
    },
    {
      sender: 'guardian',
      intro: 'Measured by voice, not contacts:',
      pre: `Paul     ████████  4 days  cofounder, night drives
Lindsay  ████████  4 days  who you pitch to at 11pm
Sita     ████░░░░  2 days  deep conversations
Tiffany  ██░░░░░░  2 days  the midnight barista
Benedict █░░░░░░░  1 day   stranger, orange-walled restaurant`
    },
    {
      sender: 'you',
      question: 'when am i happiest?'
    },
    {
      sender: 'guardian',
      intro: 'Late-night conversations with people you just met, explaining what you\u2019re building:',
      pre: `  mar 21  restaurant, 1am   ████████████
  mar 22  bar, 11pm         ████████████
  mar 23  cafe, 4am         ████████████`,
      outro: 'Also: driving alone with French music. Zero negative signals ever recorded during those drives.'
    }
  ];

  let visible: number[] = $state([]);
  let typing = $state(false);

  onMount(() => {
    let i = 0;
    const step = () => {
      if (i >= messages.length) return;

      const msg = messages[i];

      if (msg.sender === 'guardian') {
        typing = true;
        setTimeout(() => {
          typing = false;
          visible = [...visible, i];
          i++;
          setTimeout(step, 800);
        }, 900);
      } else {
        visible = [...visible, i];
        i++;
        setTimeout(step, 600);
      }
    };

    setTimeout(step, 700);
  });
</script>

<div class="surface-card" style="max-width: 600px;">
  <div class="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
    <span class="label-chip" style="color: var(--color-text)">guardian</span>
    <span class="label-chip" style="color: #999">19,300 memories · 17 days</span>
  </div>

  <div class="px-5" style="min-height: 120px;">
    {#each messages as msg, i}
      {#if visible.includes(i)}
        {#if msg.sender === 'you'}
          <div class="repo-divider py-4 chat-enter">
            <p class="label-chip m-0 mb-2" style="color: #999">you</p>
            <p class="m-0 text-[15px] font-[var(--font-serif)] italic" style="color: var(--color-text)">{msg.question}</p>
          </div>
        {:else}
          <div class="repo-divider py-4 chat-enter">
            <p class="label-chip m-0 mb-3" style="color: #999">guardian</p>
            {#if msg.intro}
              <p class="m-0 mb-3 text-[14px]" style="color: rgba(26,26,26,0.65)">{msg.intro}</p>
            {/if}
            {#if msg.pre}
              <pre class="m-0 mb-3 text-[12px] leading-relaxed" style="font-family: var(--font-mono); color: var(--color-text); overflow-x: auto;">{msg.pre}</pre>
            {/if}
            {#if msg.outro}
              <p class="m-0 text-[14px]" style="color: rgba(26,26,26,0.65)">{msg.outro}</p>
            {/if}
          </div>
        {/if}
      {/if}
    {/each}

    {#if typing}
      <div class="repo-divider py-4 chat-enter">
        <p class="label-chip m-0 mb-2" style="color: #999">guardian</p>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    {/if}
  </div>

  <div class="border-t border-[var(--color-border)] px-5 py-3 text-center text-[11px]" style="color: #999">
    4 sources · screen 44% · voice 35% · video 19% · metadata 2%
  </div>
</div>

<style>
  .chat-enter {
    animation: fadeUp 400ms ease both;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .typing-dots {
    display: flex;
    gap: 5px;
    align-items: center;
    height: 18px;
  }

  .typing-dot {
    width: 5px;
    height: 5px;
    background: #999;
    border-radius: 99px;
    animation: pulse 900ms infinite ease-in-out;
  }

  .typing-dot:nth-child(2) {
    animation-delay: 120ms;
  }

  .typing-dot:nth-child(3) {
    animation-delay: 240ms;
  }

  @keyframes pulse {
    0%, 80%, 100% {
      opacity: 0.25;
    }
    40% {
      opacity: 1;
    }
  }
</style>
