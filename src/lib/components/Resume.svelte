<script lang="ts">
  import { resumeData } from "$lib/data/resume";
  import ScatteredHeader from "./ScatteredHeader.svelte";
  import Entry from "./Entry.svelte";
  import {
    LinkedinLogoIcon,
    GithubLogoIcon,
    EnvelopeIcon,
    XLogoIcon,
  } from "phosphor-svelte";
  import "./Resume.css";

  const accentColors = [
    "oklch(87% 0.17 85)", // yellow
    "oklch(68% 0.16 165)", // green
    "oklch(62% 0.18 255)", // blue
    "oklch(72% 0.15 300)", // purple
    "oklch(65% 0.22 25)", // red
  ];

  // Main palette index (controlled by Suhit)
  let mainPalette = Math.floor(Math.random() * 5);

  // Section palette overrides keyed by title
  let sectionPalettes: Record<string, number> = {};

  // Merged projects
  const allProjects = [...resumeData.projects, ...resumeData.sideProjects];

  function handleMainPaletteChange(newPalette: number) {
    mainPalette = newPalette;
    sectionPalettes = {};
  }

  function handleSectionPaletteChange(title: string, newPalette: number) {
    sectionPalettes[title] = newPalette;
    sectionPalettes = sectionPalettes;
  }

  $: mainColor = accentColors[mainPalette];
  $: if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--accent", mainColor);
  }
</script>

<div class="resume" style:--accent={mainColor}>
  <div class="bento">
    <!-- Header: Name + Contact -->
    <header class="cell header">
      <div class="name-section">
        <ScatteredHeader
          text="Suhit"
          isName={true}
          palette={mainPalette}
          onpalettechange={handleMainPaletteChange}
        />
        <p class="tagline">developer + designer</p>
      </div>
      <nav class="contact-icons">
        <a
          class="social-link social-linkedin"
          href="https://linkedin.com/in/suhitaga"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
        >
          <LinkedinLogoIcon size={24} weight="duotone" />
        </a>
        <a
          class="social-link social-github"
          href="https://github.com/suhitaga"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
        >
          <GithubLogoIcon size={24} weight="duotone" />
        </a>
        <a
          class="social-link social-email"
          href="mailto:suhit@suhit.me"
          aria-label="Email"
        >
          <EnvelopeIcon size={24} weight="duotone" />
        </a>
        <a
          class="social-link social-twitter"
          href="https://x.com/suhitaga"
          target="_blank"
          rel="noopener"
          aria-label="Twitter"
        >
          <XLogoIcon size={24} weight="duotone" />
        </a>
      </nav>
    </header>

    <!-- Work -->
    <section
      class="cell work"
      style:--accent={accentColors[sectionPalettes["Work"] ?? mainPalette]}
    >
      <div class="section-header">
        <ScatteredHeader
          text="Work"
          palette={sectionPalettes["Work"] ?? mainPalette}
          onpalettechange={(p) => handleSectionPaletteChange("Work", p)}
        />
      </div>
      {#each resumeData.work as entry}
        <Entry {entry} />
      {/each}
    </section>

    <!-- Projects (merged) -->
    <section
      class="cell projects"
      style:--accent={accentColors[sectionPalettes["Projects"] ?? mainPalette]}
    >
      <div class="section-header">
        <ScatteredHeader
          text="Projects"
          palette={sectionPalettes["Projects"] ?? mainPalette}
          onpalettechange={(p) => handleSectionPaletteChange("Projects", p)}
        />
      </div>
      {#each allProjects as entry}
        <Entry {entry} />
      {/each}
    </section>

    <!-- Features -->
    <section
      class="cell features"
      style:--accent={accentColors[sectionPalettes["Features"] ?? mainPalette]}
    >
      <div class="section-header">
        <ScatteredHeader
          text="Features"
          palette={sectionPalettes["Features"] ?? mainPalette}
          onpalettechange={(p) => handleSectionPaletteChange("Features", p)}
        />
      </div>
      {#each resumeData.features as entry}
        <Entry {entry} />
      {/each}
    </section>

    <!-- Education -->
    <section
      class="cell education"
      style:--accent={accentColors[sectionPalettes["Education"] ?? mainPalette]}
    >
      <div class="section-header">
        <ScatteredHeader
          text="Education"
          palette={sectionPalettes["Education"] ?? mainPalette}
          onpalettechange={(p) => handleSectionPaletteChange("Education", p)}
        />
      </div>
      {#each resumeData.education as entry}
        <Entry {entry} />
      {/each}
    </section>

    <!-- Quote -->
    <footer class="cell quote">
      <p>{resumeData.quote}</p>
    </footer>
  </div>
</div>
