<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  
  let { children } = $props();

  let siteUrl = $derived($page.url.origin || 'https://projecthub.com');
  let canonicalUrl = $derived(`${siteUrl}${$page.url.pathname}`);

  const websiteSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ProjectHub',
    'url': siteUrl,
    'description': 'A community platform where students showcase their projects and receive peer feedback through structured reviews.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/projects?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });
</script>

<svelte:head>
  <title>ProjectHub - Student Project Reviews & Peer Feedback</title>
  <meta name="description" content="A community platform where students showcase their projects and receive peer feedback through structured reviews." />
  
  <!-- Canonical & Icons -->
  <link rel="canonical" href={canonicalUrl} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" href="/favicon.png" sizes="64x64" />
  <link rel="shortcut icon" href="/favicon.ico" />
  
  <!-- Open Graph / Social Sharing -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content="ProjectHub - Student Project Reviews" />
  <meta property="og:description" content="A community platform where students showcase their projects and receive peer feedback through structured reviews." />
  <meta property="og:image" content={`${siteUrl}/images/og-image.svg`} />
  <meta property="og:image:alt" content="ProjectHub - Student Project Reviews & Peer Feedback Platform" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ProjectHub - Student Project Reviews" />
  <meta name="twitter:description" content="A community platform where students showcase their projects and receive peer feedback through structured reviews." />
  <meta name="twitter:image" content={`${siteUrl}/images/og-image.svg`} />

  <!-- Structured Data: WebSite Schema -->
  {@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}

  <!-- TODO: Privacy-Friendly Analytics Integration (e.g. Plausible / GA4) -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOURANALYTICSID"></script> -->
</svelte:head>

<div class="layout-root">
  <div class="layout-body">
    {@render children()}
  </div>

  <footer class="site-footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <a href="/" class="brand-link">
          <span class="brand-icon">◆</span>
          <span class="brand-name">ProjectHub</span>
        </a>
        <p class="brand-tagline">Building a supportive community for developer growth.</p>
      </div>

      <div class="footer-links">
        <div class="link-column">
          <span class="column-title">Platform</span>
          <a href="/projects">Explore Projects</a>
          <a href="/projects/submit">Submit Project</a>
          <a href="/auth/register">Join Community</a>
        </div>

        <div class="link-column">
          <span class="column-title">Legal & Trust</span>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>

        <div class="link-column">
          <span class="column-title">Contact & Support</span>
          <!-- TODO: Update support email address -->
          <a href="mailto:support@projecthub.com" class="contact-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>support@projecthub.com</span>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom container">
      <p>© {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
    </div>
  </footer>
</div>

<style>
  .layout-root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .layout-body {
    flex: 1;
  }
  .site-footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 4rem 0 2rem;
    margin-top: 4rem;
  }
  .footer-container {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
  }
  .footer-brand {
    max-width: 320px;
  }
  .brand-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
    margin-bottom: 0.75rem;
  }
  .brand-icon {
    color: var(--amber, #f59e0b);
  }
  .brand-tagline {
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .footer-links {
    display: flex;
    gap: 4rem;
    flex-wrap: wrap;
  }
  .link-column {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .column-title {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
  }
  .link-column a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }
  .link-column a:hover {
    color: var(--color-text);
  }
  .contact-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .footer-bottom {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: 0.875rem;
    text-align: center;
  }
</style>
