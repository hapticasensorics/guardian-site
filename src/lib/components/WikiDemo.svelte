<script lang="ts">
  import { onMount } from 'svelte';

  let { autoCycle = true, showUrl = true }: { autoCycle?: boolean; showUrl?: boolean } = $props();

  let view: 'reader' | 'agent' = $state('reader');
  let userInteracted = $state(false);

  onMount(() => {
    if (!autoCycle) return;
    const id = setInterval(() => {
      if (!userInteracted) view = view === 'reader' ? 'agent' : 'reader';
    }, 3500);
    return () => clearInterval(id);
  });

  function pick(v: 'reader' | 'agent') {
    userInteracted = true;
    view = v;
  }
</script>

<div class="surface-card overflow-hidden p-0">
  <div class="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
    <button
      type="button"
      class="label-chip border px-3 py-1.5 text-[12px] transition-colors"
      style="border-color: {view === 'reader' ? 'var(--color-text)' : 'var(--color-border)'}; color: {view === 'reader' ? 'var(--color-text)' : '#999'}; background: {view === 'reader' ? 'rgba(0,0,0,0.04)' : 'transparent'}"
      onclick={() => pick('reader')}
    >
      Reader view
    </button>
    <button
      type="button"
      class="label-chip border px-3 py-1.5 text-[12px] transition-colors"
      style="border-color: {view === 'agent' ? 'var(--color-text)' : 'var(--color-border)'}; color: {view === 'agent' ? 'var(--color-text)' : '#999'}; background: {view === 'agent' ? 'rgba(0,0,0,0.04)' : 'transparent'}"
      onclick={() => pick('agent')}
    >
      Agent view
    </button>
    {#if showUrl}
      <span class="label-chip ml-auto text-[11px]" style="color: #999">haptica.ai/p/demo</span>
    {/if}
  </div>

  <div class="relative" style="aspect-ratio: 1814 / 1416; background: #fafafa">
    <img
      src="/wiki-reader-view.png"
      alt="Reader view of a project wiki"
      class="absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-out"
      style="opacity: {view === 'reader' ? 1 : 0}"
    />
    <img
      src="/wiki-agent-view.png"
      alt="Agent view of the same wiki in raw markdown"
      class="absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-out"
      style="opacity: {view === 'agent' ? 1 : 0}"
    />
  </div>
</div>
