<script lang="ts">
  import { PowerIcon } from "phosphor-svelte";
  import { monitorRevealed } from "$lib/stores/appState";

  let { children } = $props();
</script>

<div class="monitor" class:revealed={$monitorRevealed}>
  <div class="bezel-inner">
    <div class="screen">
      {@render children()}
    </div>
  </div>
  <div class="power-well" class:visible={$monitorRevealed}>
    <button class="power-button" aria-label="Power">
      <span class="power-icon-shadow" aria-hidden="true">
        <PowerIcon size={25} weight="bold" />
      </span>
      <span class="power-icon">
        <PowerIcon size={25} weight="bold" />
      </span>
    </button>
  </div>
</div>

<style>
  .monitor {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--bezel-color);
  }

  .bezel-inner {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0;
    transition: padding 0.35s ease-out;
  }

  .monitor.revealed .bezel-inner {
    padding-left: var(--bezel-x);
    padding-right: var(--bezel-x);
    padding-top: var(--bezel-x);
  }

  .screen {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 0;
    transition: border-radius 0.35s ease-out;
  }

  .monitor.revealed .screen {
    border-radius: var(--screen-radius);
  }

  /* Bottom bezel area */
  .monitor::after {
    content: "";
    width: 100%;
    height: 0;
    flex-shrink: 0;
    transition: height 0.35s ease-out;
  }

  .monitor.revealed::after {
    height: var(--bezel-bottom);
  }

  /* Power well — gradient ring behind button */
  .power-well {
    position: absolute;
    bottom: calc(var(--bezel-bottom) / 2);
    right: calc(var(--bezel-x) + 8px);
    transform: translateY(50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center in oklch,
      var(--power-button-bg) 20%,
      var(--bezel-color) 75%
    );

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease-out 0.15s;
  }

  .power-well.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* Power button — sits inside the well */
  .power-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: var(--power-button-bg);
    box-shadow:
      inset 1px 2px 3px oklch(0% 0 0 / 0.25),
      inset -1px -1px 2px oklch(100% 0 0 / 0.05);
    transition: box-shadow 0.15s ease;
  }

  .power-button:hover {
    box-shadow:
      inset 1px 2px 3px oklch(0% 0 0 / 0.25),
      inset -1px -1px 2px oklch(100% 0 0 / 0.05),
      0 0 6px var(--power-glow);
  }

  .power-button:active {
    box-shadow:
      inset 2px 3px 4px oklch(0% 0 0 / 0.35),
      inset -1px -1px 2px oklch(100% 0 0 / 0.04);
  }

  .power-icon,
  .power-icon-shadow {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .power-icon-shadow {
    color: oklch(100% 0 0 / 0.35);
    transform: translate(1px, 1px);
  }

  .power-icon {
    color: var(--power-color);
  }
</style>
