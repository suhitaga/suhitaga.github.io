<script lang="ts">
  import type { Component } from "svelte";

  interface Props {
    label: string;
    icon: Component;
    onclick?: () => void;
    bind?: (el: HTMLElement | null) => void;
  }

  let { label, icon: Icon, onclick, bind }: Props = $props();

  let buttonEl: HTMLButtonElement | null = $state(null);

  $effect(() => {
    bind?.(buttonEl);
  });
</script>

<button class="desktop-icon" {onclick} bind:this={buttonEl}>
  <div class="icon-wrapper">
    <Icon size={48} weight="fill" />
  </div>
  <span class="label">{label}</span>
</button>

<style>
  .desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px;
    background: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    width: 88px;
    font-family: inherit;
  }

  .desktop-icon:active {
    transform: scale(0.96);
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    border-radius: 8px;
    transition: background 0.15s ease;
  }

  .desktop-icon:hover .icon-wrapper {
    background: var(--bg-elevated);
  }

  .label {
    font-size: 11px;
    color: var(--text-primary);
    text-align: center;
    word-break: break-word;
    line-height: 1.3;
    max-width: 80px;
    padding: 1px 4px;
    border-radius: 3px;
    transition: background 0.15s ease;
  }

  .desktop-icon:hover .label {
    background: var(--bg-elevated);
  }
</style>
