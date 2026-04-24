<script lang="ts">
  import { TrayIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div class="tray">
  <div class="tray-icons">
    {#if children}
      {@render children()}
    {/if}
  </div>
  <div class="tray-shape">
    <TrayIcon size="100%" weight="fill" />
  </div>
</div>

<style>
  .tray {
    position: relative;
    width: 200px;
  }

  .tray-icons {
    position: absolute;
    z-index: 1;
    bottom: 35%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .tray-shape {
    color: var(--bg-secondary);
  }
</style>
