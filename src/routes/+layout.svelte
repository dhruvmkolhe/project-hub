<script lang="ts">
  import '../app.css';
  
  let { children, data } = $props();
</script>

<svelte:head>
  <title>ProjectHub - Student Project Reviews</title>
  <meta name="description" content="A community platform where students showcase their projects and receive peer feedback through structured reviews." />
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

{@render children()}
