<script lang="ts">
  import Window from "$lib/components/Window.svelte";
  import Resume from "$lib/components/Resume.svelte";
  import Desktop from "$lib/components/Desktop.svelte";
  import MonitorFrame from "$lib/components/MonitorFrame.svelte";
  import { appState } from "$lib/stores/appState";

  function handleMinimize() {
    appState.goToDesktop();
  }
</script>

<svelte:head>
  <!-- Primary -->
  <title>Suhit Agarwal | Developer & Designer</title>
  <meta
    name="description"
    content="Suhit Agarwal is a developer and designer building delightful interfaces. Currently working on modular electronics, previously at Curio and USC."
  />
  <link rel="canonical" href="https://suhit.me" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://suhit.me" />
  <meta property="og:title" content="Suhit Agarwal — Developer & Designer" />
  <meta
    property="og:description"
    content="Suhit Agarwal is a developer and designer building delightful interfaces. Currently working on modular electronics, previously at Curio and USC."
  />
  <meta property="og:image" content="https://suhit.me/og.png" />
  <meta property="og:site_name" content="Suhit Agarwal" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@suhitdoingstuff" />
  <meta name="twitter:creator" content="@suhitdoingstuff" />
  <meta name="twitter:title" content="Suhit Agarwal — Developer & Designer" />
  <meta
    name="twitter:description"
    content="Suhit Agarwal is a developer and designer building delightful interfaces."
  />
  <meta name="twitter:image" content="https://suhit.me/og.png" />

  <!-- JSON-LD Structured Data -->
  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Suhit Agarwal",
    "alternateName": "Suhit",
    "url": "https://suhit.me",
    "image": "https://suhit.me/og.png",
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "trufflepig"
    },
    "sameAs": [
      "https://github.com/suhitaga",
      "https://linkedin.com/in/suhitaga",
      "https://twitter.com/suhitdoingstuff"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "University of Southern California"
    }
  }
  </script>`}
</svelte:head>

<main>
  <MonitorFrame>
    <Desktop />

    <Window
      title="resume"
      isMinimized={$appState.windows.resume.isMinimized}
      onminimize={handleMinimize}
    >
      <Resume />
    </Window>
  </MonitorFrame>
</main>
