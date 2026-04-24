<script lang="ts">
  import DesktopIcon from "./DesktopIcon.svelte";
  import DesktopTray from "./DesktopTray.svelte";
  import MusicPlayer from "./MusicPlayer.svelte";
  import { appState, monitorRevealed } from "$lib/stores/appState";
  import { ReadCvLogoIcon } from "phosphor-svelte";
  import { playlistIds } from "$lib/data/playlist";

  let resumeIconEl: HTMLElement | null = $state(null);
  let desktopEl: HTMLElement | null = $state(null);

  function updateIconPosition() {
    if (resumeIconEl && desktopEl) {
      const iconRect = resumeIconEl.getBoundingClientRect();
      const containerRect = desktopEl.getBoundingClientRect();
      const centerX = iconRect.left + iconRect.width / 2 - containerRect.left;
      const centerY = iconRect.top + iconRect.height / 2 - containerRect.top;
      document.documentElement.style.setProperty(
        "--fold-target-x",
        `${centerX}px`,
      );
      document.documentElement.style.setProperty(
        "--fold-target-y",
        `${centerY}px`,
      );
    }
  }

  $effect(() => {
    if (resumeIconEl && desktopEl) {
      updateIconPosition();
      window.addEventListener("resize", updateIconPosition);
      return () => window.removeEventListener("resize", updateIconPosition);
    }
  });

  $effect(() => {
    if ($monitorRevealed && resumeIconEl && desktopEl) {
      const timer = setTimeout(updateIconPosition, 400);
      return () => clearTimeout(timer);
    }
  });

  function openResume() {
    appState.goToResume();
  }
</script>

<div class="desktop" bind:this={desktopEl}>
  <div class="top-area">
    <MusicPlayer videoIds={playlistIds} />
  </div>

  <div class="bottom-area">
    <DesktopTray>
      <DesktopIcon
        label="resume"
        icon={ReadCvLogoIcon}
        onclick={openResume}
        bind={(el) => (resumeIconEl = el)}
      />
    </DesktopTray>
  </div>
</div>

<style>
  .desktop {
    position: absolute;
    inset: 0;
    background: var(--bg-primary);
    padding: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .top-area {
    flex-shrink: 0;
  }

  .bottom-area {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
  }

  @media (max-width: 500px) {
    .desktop {
      padding: 10px;
      flex-direction: column-reverse;
    }

    .bottom-area {
      align-items: flex-start;
    }
  }
</style>
