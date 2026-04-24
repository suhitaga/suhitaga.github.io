<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    PlayIcon,
    PauseIcon,
    SkipForwardIcon,
    SkipBackIcon,
    SpeakerHighIcon,
    SpeakerSlashIcon,
    VinylRecordIcon,
  } from "phosphor-svelte";

  import { fetchPlaylist, type Track } from "$lib/data/playlist";

  let { videoIds = [] as string[] }: { videoIds?: string[] } = $props();

  let tracks: Track[] = $state([]);
  let player: YT.Player | null = $state(null);
  let isReady = $state(false);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let currentIndex = $state(0);
  let progress = $state(0);
  let duration = $state(0);
  let currentTime = $state(0);
  let progressInterval: ReturnType<typeof setInterval> | null = null;
  let isSeeking = $state(false);

  const accentColors = [
    "var(--accent-yellow)",
    "var(--accent-orange)",
    "var(--accent-purple)",
    "var(--accent-blue)",
    "var(--accent-green)",
    "var(--accent-amber)",
  ];
  let discColor = $derived(accentColors[currentIndex % accentColors.length]);
  let currentTrack = $derived(tracks[currentIndex]);
  let titleEl: HTMLElement | null = $state(null);
  let artistEl: HTMLElement | null = $state(null);
  let progressBarEl: HTMLElement | null = $state(null);
  let discEl: HTMLElement | null = $state(null);
  let barWidth = $state(200);

  // Scratch state
  let isScratching = $state(false);
  let scratchRotation = $state(0);
  let wasPlayingBeforeScratch = false;
  let scratchTime = 0;

  function getAngle(el: HTMLElement, clientX: number, clientY: number): number {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx);
  }

  function handleScratchStart(e: MouseEvent | TouchEvent) {
    if (!player || !isReady || !discEl) return;
    e.preventDefault();
    isScratching = true;
    wasPlayingBeforeScratch = isPlaying;
    scratchTime = player.getCurrentTime?.() ?? 0;
    if (isPlaying) player.pauseVideo();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    let lastAngle = getAngle(discEl, clientX, clientY);

    const move = (ev: MouseEvent | TouchEvent) => {
      if (!discEl || !player) return;
      const cx = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const cy = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      const angle = getAngle(discEl, cx, cy);

      let delta = angle - lastAngle;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      lastAngle = angle;
      scratchRotation += delta * (180 / Math.PI);

      // Map rotation to time: one full rotation = 10 seconds of audio
      const timeDelta = (delta / (2 * Math.PI)) * 10;
      scratchTime = Math.max(0, Math.min(duration, scratchTime + timeDelta));
      currentTime = scratchTime;
      progress = duration > 0 ? (scratchTime / duration) * 100 : 0;
    };

    const up = () => {
      isScratching = false;
      if (player) {
        player.seekTo(scratchTime, true);
        if (wasPlayingBeforeScratch) player.playVideo();
      }
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", up);
  }

  let squigglePath = $derived.by(() => {
    const playedWidth = (progress / 100) * barWidth;
    if (playedWidth < 1) return "";

    const amp = 3;
    const freq = (2 * Math.PI) / 16; // one full wave every 16px
    const mid = 6;

    let d = `M 0 ${mid}`;
    for (let x = 1; x <= playedWidth; x++) {
      const y = mid + Math.sin(x * freq) * amp;
      d += ` L ${x} ${y.toFixed(2)}`;
    }
    return d;
  });

  let playerInitialized = false;

  function loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (window.YT?.Player) {
        resolve();
        return;
      }
      // Check if script is already loading
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const check = setInterval(() => {
          if (window.YT?.Player) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => resolve();
    });
  }

  function initPlayer() {
    if (!videoIds.length || playerInitialized) return;
    playerInitialized = true;

    const container = document.getElementById("yt-player");
    if (!container) return;

    player = new YT.Player(container, {
      height: "200",
      width: "200",
      videoId: videoIds[0],
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          isReady = true;
        },
        onStateChange: (e: YT.OnStateChangeEvent) => {
          isPlaying = e.data === YT.PlayerState.PLAYING;
          if (isPlaying) {
            skipCount = 0;
            startProgressTracking();
          } else {
            stopProgressTracking();
          }
          if (e.data === YT.PlayerState.ENDED) {
            nextTrack();
          }
        },
        onError: (e: { data: number }) => {
          if (
            (e.data === 150 || e.data === 101) &&
            skipCount < videoIds.length
          ) {
            skipCount++;
            setTimeout(() => nextTrack(), 500);
          }
        },
      },
    });
  }

  const IFRAME_ALLOW =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share";

  function patchIframe(el: Element) {
    // Include all permissions YouTube expects, but omit picture-in-picture
    el.setAttribute("allow", IFRAME_ALLOW);
    (el as HTMLIFrameElement).allow = IFRAME_ALLOW;
  }

  function disablePiP() {
    const wrap = document.getElementById("yt-player-wrap");
    if (!wrap) return;

    // Patch any existing iframe
    wrap.querySelectorAll("iframe").forEach(patchIframe);

    // Watch for YouTube recreating/modifying the iframe
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // New iframes added
        for (const node of m.addedNodes) {
          if (node instanceof HTMLIFrameElement) patchIframe(node);
          if (node instanceof HTMLElement) {
            node.querySelectorAll("iframe").forEach(patchIframe);
          }
        }
        // YouTube re-setting the allow attribute on existing iframe
        if (m.type === "attributes" && m.target instanceof HTMLIFrameElement) {
          const allow = m.target.getAttribute("allow") ?? "";
          if (allow.includes("picture-in-picture")) {
            patchIframe(m.target);
          }
        }
      }
    });

    observer.observe(wrap, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["allow"],
    });
  }

  function startProgressTracking() {
    stopProgressTracking();
    progressInterval = setInterval(() => {
      if (player && !isSeeking) {
        // Detect ads: getVideoUrl() contains the video ID, during ads it differs
        try {
          const data = (player as any).getVideoData?.();
          isAdPlaying = data?.isAd ?? false;
        } catch {
          isAdPlaying = false;
        }
        currentTime = player.getCurrentTime?.() ?? 0;
        duration = player.getDuration?.() ?? 0;
        progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      }
    }, 250);
  }

  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function togglePlay() {
    if (!player || !isReady) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      shouldAutoplay = true;
      player.playVideo();
    }
  }

  function nextTrack() {
    if (!tracks.length) return;
    currentIndex = (currentIndex + 1) % tracks.length;
    loadTrack();
  }

  function prevTrack() {
    if (!player || !isReady) return;
    // If past 3 seconds, restart; otherwise go to previous
    if (player.getCurrentTime?.() > 3) {
      player.seekTo(0, true);
      return;
    }
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack();
  }

  let shouldAutoplay = false;
  let skipCount = 0;
  let isAdPlaying = $state(false);

  function loadTrack() {
    if (!player || !isReady || !tracks.length) return;
    progress = 0;
    currentTime = 0;
    duration = 0;
    if (shouldAutoplay) {
      player.loadVideoById(tracks[currentIndex].id);
    } else {
      player.cueVideoById(tracks[currentIndex].id);
    }
  }

  function toggleMute() {
    if (!player || !isReady) return;
    if (isMuted) {
      player.unMute();
      isMuted = false;
    } else {
      player.mute();
      isMuted = true;
    }
  }

  function seek(e: MouseEvent | TouchEvent) {
    if (!player || !isReady || !duration) return;
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    player.seekTo(pct * duration, true);
    progress = pct * 100;
    currentTime = pct * duration;
  }

  function handleSeekStart(e: MouseEvent | TouchEvent) {
    isSeeking = true;
    seek(e);

    const move = (ev: MouseEvent | TouchEvent) => seek(ev);
    const up = () => {
      isSeeking = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", up);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function updateMarquee() {
    for (const el of [titleEl, artistEl]) {
      if (!el) continue;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) continue;

      // Reset: remove animation, snap to start
      inner.style.animation = "none";
      inner.style.transform = "translateX(0)";

      // Force reflow so the reset takes effect
      void inner.offsetWidth;

      const overflow = inner.scrollWidth - el.clientWidth;
      if (overflow > 0) {
        inner.style.setProperty("--marquee-offset", `-${overflow}px`);
        inner.style.animation = "";
        inner.style.animationPlayState = "running";
      }
    }
  }

  $effect(() => {
    // Re-check marquee whenever track changes
    currentTrack;
    requestAnimationFrame(updateMarquee);
  });

  $effect(() => {
    if (!progressBarEl) return;
    const ro = new ResizeObserver(([entry]) => {
      barWidth = entry.contentRect.width;
    });
    ro.observe(progressBarEl);
    return () => ro.disconnect();
  });

  onMount(async () => {
    if (!videoIds.length) return;
    // Fetch metadata and init player in parallel
    const [fetched] = await Promise.all([
      fetchPlaylist(videoIds),
      loadYouTubeAPI(),
    ]);
    tracks = fetched;
    initPlayer();
  });

  onDestroy(() => {
    stopProgressTracking();
    if (player) {
      player.destroy();
      player = null;
    }
  });
</script>

<!-- Hidden YouTube player -->
<div class="yt-hidden" id="yt-player-wrap">
  <div id="yt-player"></div>
</div>

<div class="music-player">
  <div class="player-inner" style:--disc-color={discColor}>
    <!-- Album art / vinyl area + counter -->
    <div class="disc-col">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="disc-area"
        class:spinning={isPlaying && !isScratching}
        class:scratching={isScratching}
        style:--scratch-rotation="{scratchRotation}deg"
        bind:this={discEl}
        onmousedown={handleScratchStart}
        ontouchstart={handleScratchStart}
      >
        <VinylRecordIcon size={28} weight="fill" />
      </div>
      <span class="track-counter">{currentIndex + 1}/{videoIds.length}</span>
    </div>

    <!-- Track info + controls -->
    <div class="player-body">
      <div class="track-info">
        {#if isAdPlaying}
          <span class="ad-label">ad</span>
        {:else}
          <span class="track-title" bind:this={titleEl}
            ><span class="track-title-inner">{currentTrack?.title ?? "—"}</span
            ></span
          >
          <span class="track-artist" bind:this={artistEl}
            ><span class="track-artist-inner">{currentTrack?.artist ?? ""}</span
            ></span
          >
        {/if}
      </div>

      <!-- Transport controls -->
      <div class="transport">
        <button
          class="transport-btn"
          onclick={prevTrack}
          aria-label="Previous track"
          disabled={!isReady}
        >
          <SkipBackIcon size={14} weight="fill" />
        </button>
        <button
          class="transport-btn play-btn"
          onclick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          disabled={!isReady}
        >
          {#if isPlaying}
            <PauseIcon size={16} weight="fill" />
          {:else}
            <PlayIcon size={16} weight="fill" />
          {/if}
        </button>
        <button
          class="transport-btn"
          onclick={nextTrack}
          aria-label="Next track"
          disabled={!isReady}
        >
          <SkipForwardIcon size={14} weight="fill" />
        </button>
        <button
          class="transport-btn mute-btn"
          onclick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          disabled={!isReady}
        >
          {#if isMuted}
            <SpeakerSlashIcon size={13} weight="fill" />
          {:else}
            <SpeakerHighIcon size={13} weight="fill" />
          {/if}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="progress-row">
        <span class="time">{formatTime(currentTime)}</span>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="progress-bar"
          onmousedown={handleSeekStart}
          ontouchstart={handleSeekStart}
          bind:this={progressBarEl}
        >
          <svg
            class="squiggle-svg"
            viewBox="0 0 {barWidth} 12"
            preserveAspectRatio="none"
          >
            <!-- Track line (unplayed) — starts where squiggle ends -->
            <line
              x1={(progress / 100) * barWidth}
              y1="6"
              x2={barWidth}
              y2="6"
              class="squiggle-track"
            />
            <!-- Squiggle (played) -->
            <path d={squigglePath} class="squiggle-fill" />
          </svg>
          <div class="progress-knob" style:left="{progress}%"></div>
        </div>
        <span class="time">{formatTime(duration)}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .yt-hidden {
    position: fixed;
    width: 10px;
    height: 10px;
    opacity: 0;
    pointer-events: none;
    bottom: 0;
    right: 0;
    z-index: -1;
  }

  .music-player {
    width: 260px;
    margin-left: auto;
  }

  @media (max-width: 500px) {
    .music-player {
      width: 100%;
    }
  }

  .player-inner {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
  }

  .disc-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
    flex-shrink: 0;
  }

  .track-counter {
    font-size: 8px;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin-bottom: 2px;
  }

  /* Vinyl disc */
  .disc-area {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: oklch(18% 0.01 70);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--disc-color, var(--text-muted));
    transition: color 0.3s ease;
    box-shadow:
      inset 0 1px 3px oklch(0% 0 0 / 0.3),
      0 1px 0 oklch(100% 0 0 / 0.05);
    animation: spin 3s linear infinite;
    animation-play-state: paused;
    cursor: pointer;
    touch-action: none;
  }

  .disc-area.spinning {
    animation-play-state: running;
  }

  .disc-area.scratching {
    animation: none;
    transform: rotate(var(--scratch-rotation, 0deg));
    cursor: pointer;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Track info */
  .player-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .ad-label {
    font-size: 9px;
    color: var(--text-muted);
    font-style: italic;
    line-height: 1.2;
  }

  .track-title,
  .track-artist {
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.2;
  }

  .track-title {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .track-artist {
    font-size: 9px;
    color: var(--text-muted);
  }

  .track-title-inner,
  .track-artist-inner {
    display: inline-block;
    animation: marquee 6s ease-in-out infinite alternate;
    animation-play-state: paused;
  }

  /* Only animate when text overflows its container */
  .track-title:has(.track-title-inner),
  .track-artist:has(.track-artist-inner) {
    position: relative;
  }

  @keyframes marquee {
    0%,
    15% {
      transform: translateX(0);
    }
    85%,
    100% {
      transform: translateX(var(--marquee-offset));
    }
  }

  /* Transport */
  .transport {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .transport-btn {
    width: 26px;
    height: 22px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition:
      background 0.12s ease,
      color 0.12s ease;
  }

  .transport-btn:hover:not(:disabled) {
    background: var(--control-hover);
  }

  .transport-btn:active:not(:disabled) {
    transform: scale(0.94);
  }

  .transport-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .play-btn {
    width: 30px;
    height: 24px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    box-shadow: 0 1px 2px oklch(0% 0 0 / 0.15);
  }

  .play-btn:hover:not(:disabled) {
    background: var(--control-hover);
  }

  .mute-btn {
    margin-left: auto;
  }

  /* Progress bar */
  .progress-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .time {
    font-size: 8px;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    min-width: 24px;
    line-height: 1;
  }

  .time:last-child {
    text-align: right;
  }

  .progress-bar {
    flex: 1;
    height: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    touch-action: none;
  }

  .squiggle-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .squiggle-track {
    stroke: oklch(30% 0.01 70);
    stroke-width: 2;
    stroke-linecap: round;
  }

  .squiggle-fill {
    fill: none;
    stroke: var(--disc-color, var(--accent-green));
    stroke-width: 2;
    stroke-linecap: round;
    filter: drop-shadow(0 0 2px var(--disc-color, var(--accent-green)));
    transition:
      stroke 0.3s ease,
      filter 0.3s ease;
  }

  .progress-knob {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-primary);
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.15s ease;
    box-shadow: 0 1px 3px oklch(0% 0 0 / 0.3);
    pointer-events: none;
  }

  .progress-bar:hover .progress-knob {
    opacity: 1;
  }

  /* Light mode adjustments */
  @media (prefers-color-scheme: light) {
    .disc-area {
      background: oklch(88% 0.02 75);
      box-shadow:
        inset 0 1px 3px oklch(0% 0 0 / 0.1),
        0 1px 0 oklch(100% 0 0 / 0.5);
    }

    .squiggle-track {
      stroke: oklch(85% 0.02 75);
    }

    .squiggle-fill {
      stroke: var(--disc-color, var(--accent-orange));
      filter: drop-shadow(0 0 2px var(--disc-color, var(--accent-orange)));
    }

    .player-inner {
      box-shadow: none;
    }
  }

  /* Responsive: tighter on small screens */
  @media (max-width: 400px) {
    .player-inner {
      padding: 8px;
      gap: 8px;
    }

    .disc-area {
      width: 34px;
      height: 34px;
    }
  }
</style>
