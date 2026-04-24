<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import "./ScatteredHeader.css";

  interface Props {
    text: string;
    isName?: boolean;
    palette?: number;
    onpalettechange?: (palette: number) => void;
  }

  let { text, isName = false, palette = 0, onpalettechange }: Props = $props();

  // Palette names matching CSS @font-palette-values
  const paletteNames = ["yellow", "green", "blue", "purple", "warm"];

  // Accent colors for Safari fallback (OKLCH)
  const accentColors = [
    "oklch(87% 0.17 85)", // yellow
    "oklch(68% 0.16 165)", // green
    "oklch(62% 0.18 255)", // blue
    "oklch(72% 0.15 300)", // purple
    "oklch(65% 0.22 25)", // red
  ];

  interface LetterPosition {
    char: string;
    left: number;
    top: number;
    rotation: number;
  }

  let letters: LetterPosition[] = $state([]);
  let isSafari = $state(false);
  let containerEl: HTMLDivElement;

  function generatePositions() {
    const chars = text.split("");
    const step = 80 / (chars.length + 1);
    letters = chars.map((char, i) => ({
      char,
      left: 10 + step * (i + 1),
      top: 20 + Math.random() * 30,
      rotation: (Math.random() - 0.5) * 30,
    }));
  }

  function randomizeLetters() {
    letters = letters.map((letter) => ({
      ...letter,
      rotation: (Math.random() - 0.5) * 30,
    }));
  }

  function nextPalette() {
    const next = (palette + 1) % paletteNames.length;
    onpalettechange?.(next);
  }

  function handleInteractionStart() {
    randomizeLetters();
    nextPalette();
  }

  function handleInteractionEnd() {
    randomizeLetters();
  }

  onMount(() => {
    if (browser) {
      isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    generatePositions();
  });

  let fontPalette = $derived(`--palette-${paletteNames[palette]}`);
  let currentColor = $derived(accentColors[palette]);
</script>

<div
  class="scattered-header"
  class:is-name={isName}
  class:is-safari={isSafari}
  bind:this={containerEl}
  style:font-palette={isSafari ? "normal" : fontPalette}
  style:color={isSafari ? currentColor : null}
  onmouseenter={handleInteractionStart}
  onmouseleave={handleInteractionEnd}
  ontouchstart={handleInteractionStart}
  ontouchend={handleInteractionEnd}
  role="heading"
  aria-level={isName ? 1 : 2}
>
  {#each letters as letter}
    <span
      style="left: {letter.left}%; top: {letter.top}%; transform: rotate({letter.rotation}deg)"
    >
      {letter.char}
    </span>
  {/each}
</div>
