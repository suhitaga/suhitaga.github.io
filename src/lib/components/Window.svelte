<script lang="ts">
  import { XIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import "./Window.css";

  interface Props {
    title?: string;
    isMinimized?: boolean;
    showClose?: boolean;
    zIndex?: number;
    onminimize?: () => void;
    onclose?: () => void;
    onfocus?: () => void;
    children?: Snippet;
  }

  let {
    title = "Window",
    isMinimized = false,
    showClose = false,
    zIndex = 1,
    onminimize,
    onclose,
    onfocus,
    children,
  }: Props = $props();
</script>

<div
  class="window"
  class:minimized={isMinimized}
  style:z-index={zIndex}
  onmousedown={onfocus}
  role="dialog"
  aria-label={title}
  tabindex="-1"
>
  <header class="title-bar">
    <span class="title">{title}</span>
    <div class="controls">
      {#if showClose}
        <button
          class="control close"
          onclick={onclose}
          aria-label="Close window"
        >
          <XIcon size={16} weight="bold" />
        </button>
      {/if}
      <button
        class="control minimize"
        onclick={onminimize}
        aria-label="Minimize window"
      ></button>
    </div>
  </header>
  <div class="window-content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .window {
    position: absolute;
    inset: 0;
    background: var(--bg-primary);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--screen-radius);
    box-shadow:
      0 4px 24px oklch(0% 0 0 / 0.3),
      0 1px 4px oklch(0% 0 0 / 0.15);
    transform-origin: var(--fold-target-x, 68px) var(--fold-target-y, 80px);
    transition:
      transform 0.35s ease-out,
      opacity 0.3s ease-out;
  }

  .window.minimized {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
  }
</style>
