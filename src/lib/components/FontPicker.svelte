<script lang="ts">
  const fonts = [
    { name: 'Merriweather', value: '"Merriweather", Georgia, serif' },
    { name: 'Newsreader', value: '"Newsreader", Georgia, serif' },
    { name: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
    { name: 'Libre Baskerville', value: '"Libre Baskerville", Georgia, serif' },
    { name: 'Source Serif 4', value: '"Source Serif 4", Georgia, serif' },
    { name: 'Cormorant Garamond', value: '"Cormorant Garamond", Georgia, serif' },
    { name: 'Lora', value: '"Lora", Georgia, serif' },
  ];

  const sansFonts = [
    { name: 'Merriweather Sans', value: '"Merriweather Sans", system-ui, sans-serif' },
    { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
    { name: 'DM Sans', value: '"DM Sans", system-ui, sans-serif' },
  ];

  let selectedSerif = $state(fonts[0].value);
  let selectedSans = $state(sansFonts[0].value);
  let collapsed = $state(false);

  function applySerif(value: string) {
    selectedSerif = value;
    document.documentElement.style.setProperty('--font-serif', value);
  }

  function applySans(value: string) {
    selectedSans = value;
    document.documentElement.style.setProperty('--font-sans', value);
    document.documentElement.style.setProperty('--font-label', value);
  }
</script>

{#if collapsed}
  <button
    onclick={() => collapsed = false}
    class="fixed bottom-4 right-4 z-50 border px-3 py-2 text-[12px] font-semibold uppercase tracking-wide cursor-pointer"
    style="background: #fff; border-color: #e0e0e0; color: #000; font-family: var(--font-sans);"
  >
    Fonts
  </button>
{:else}
  <div
    class="fixed bottom-4 right-4 z-50 border p-4"
    style="background: #fff; border-color: #e0e0e0; width: 220px; font-family: var(--font-sans);"
  >
    <div class="flex items-center justify-between mb-3">
      <p class="m-0 text-[11px] font-semibold uppercase tracking-[0.08em]" style="color: #999">
        Font picker
      </p>
      <button
        onclick={() => collapsed = true}
        class="border-0 bg-transparent cursor-pointer text-[14px]"
        style="color: #999"
      >
        &times;
      </button>
    </div>

    <p class="m-0 mb-1 text-[11px] font-semibold uppercase tracking-[0.06em]" style="color: #666">Headings</p>
    <div class="flex flex-col gap-1 mb-3">
      {#each fonts as font}
        <button
          onclick={() => applySerif(font.value)}
          class="border px-2 py-1.5 text-left text-[13px] cursor-pointer"
          style="font-family: {font.value}; background: {selectedSerif === font.value ? '#f2f2f2' : '#fff'}; border-color: {selectedSerif === font.value ? '#000' : '#e0e0e0'}; color: #000;"
        >
          {font.name}
        </button>
      {/each}
    </div>

    <p class="m-0 mb-1 text-[11px] font-semibold uppercase tracking-[0.06em]" style="color: #666">Body</p>
    <div class="flex flex-col gap-1">
      {#each sansFonts as font}
        <button
          onclick={() => applySans(font.value)}
          class="border px-2 py-1.5 text-left text-[13px] cursor-pointer"
          style="font-family: {font.value}; background: {selectedSans === font.value ? '#f2f2f2' : '#fff'}; border-color: {selectedSans === font.value ? '#000' : '#e0e0e0'}; color: #000;"
        >
          {font.name}
        </button>
      {/each}
    </div>
  </div>
{/if}
