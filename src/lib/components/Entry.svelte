<script lang="ts">
  import type { Entry } from "$lib/data/resume";
  import "./Entry.css";

  export let entry: Entry;
</script>

<div class="entry">
  <div class="meta">
    <span class="date">{entry.date}</span>
    {#if entry.location}
      <span class="location">{entry.location}</span>
    {/if}
  </div>
  <h3 class="title">
    {#if entry.link}
      <a href={entry.link} target="_blank" rel="noopener">{entry.title}</a>
    {:else}
      {entry.title}
    {/if}
  </h3>
  <p class="description">{entry.description}</p>
</div>
