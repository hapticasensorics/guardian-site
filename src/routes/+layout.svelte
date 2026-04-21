<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="paper-column">
  <header class="mb-14 flex items-center justify-between border-b border-[var(--color-border)] pb-4 pt-2">
    <a
      href="/"
      class="flex items-center gap-2.5 border-none font-[var(--font-serif)] text-[22px] italic leading-tight"
      style="font-weight: 300; color: var(--color-text)"
    >
      <img src="/fish-logo.png" alt="Haptica fish" class="h-10 w-10" />
      Haptica
    </a>

    <nav class="label-chip flex items-center gap-5" style="color: #999">
      <a class="border-none hover:opacity-100" style="color: inherit" href="/#contact">Contact</a>
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  <footer
    class="mt-20 border-t border-[var(--color-border)] pb-8 pt-5 text-[13px]"
    style="color: #999; font-family: var(--font-sans)"
  >
    <span>Built by <a href="https://haptica.ai" class="border-none" style="color: inherit">Haptica</a></span>
  </footer>
</div>

