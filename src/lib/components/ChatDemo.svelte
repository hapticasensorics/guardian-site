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
      question: 'help me debug this'
    },
    {
      sender: 'guardian',
      intro: 'You\u2019ve been working on the cross-device alignment pipeline since Tuesday. Last night you decided to keep Whisper+Gemini reversible. The failing test is in scene_claims.py:142, same module you refactored yesterday.',
      pre: `  context    4.2h session  3 tools  2 decisions tracked
  last edit  scene_claims.py:142  11:47pm
  related    PR #38 merged Wed, broke timestamp parsing`,
      outro: 'The error matches the timestamp format change from PR #38. Want me to pull up the diff?'
    },
    {
      sender: 'you',
      question: 'what did I commit to this week?'
    },
    {
      sender: 'guardian',
      intro: 'Across Slack, meetings, and code reviews:',
      pre: `  Mon  told Alex: API docs done by Thursday
  Tue  standup: ship MCP auth before Friday
  Wed  PR review: promised to fix the race condition
  Thu  email to investor: deck update by Sunday`,
      outro: 'The API docs and MCP auth are both overdue. The race condition fix is still in draft.'
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
    <span class="label-chip" style="color: #999">40,936 memories · 34 days</span>
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
    screen capture · OCR · meetings · commits · served via MCP
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
