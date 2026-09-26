<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    let { data } = $props();
</script>

<svelte:head>
    <title>Privacy Policy - ProjectHub</title>
    <meta name="description" content="ProjectHub Privacy Policy detailing how we collect, protect, and use user data." />
    <!-- TODO: Update domain URL -->
    <link rel="canonical" href="https://projecthub.com/privacy" />
</svelte:head>

<div class="legal-page">
    <Navbar user={data?.user} />

    <main class="container legal-container">
        <article class="legal-content">
            <h1>Privacy Policy</h1>
            <p class="last-updated">Last Updated: January 2026</p>

            <section>
                <h2>1. Information We Collect</h2>
                <p>When you create an account on ProjectHub, we collect basic account details including your username, email address, and hashed password. When you submit projects or post reviews, content submitted is associated with your account.</p>
            </section>

            <section>
                <h2>2. How We Use Your Information</h2>
                <p>We use your information strictly to maintain your user account, display your submitted projects, facilitate peer code reviews, and provide core platform services. We do not sell your personal data to third parties.</p>
            </section>

            <section>
                <h2>3. Cookies & Session Storage</h2>
                <p>ProjectHub uses essential HTTP-only cookies solely for secure user authentication and maintaining active sessions. We do not use non-essential tracking cookies or third-party advertising cookies.</p>
            </section>

            <section>
                <h2>4. Data Retention & Account Deletion</h2>
                <p>Your account information is stored securely for as long as your account remains active. You may request account or project data deletion at any time by contacting support.</p>
            </section>

            <section>
                <h2>5. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please reach out to us at <strong>privacy@projecthub.com</strong>.</p>
            </section>
        </article>
    </main>
</div>

<style>
    .legal-page {
        min-height: 100vh;
        background: var(--color-bg);
    }
    .legal-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 4rem 1.5rem;
    }
    .legal-content {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 24px;
        padding: 3rem;
        color: var(--color-text);
    }
    .last-updated {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: 2rem;
    }
    h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
    }
    h2 {
        font-size: 1.35rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
    }
    p {
        color: var(--color-text-secondary);
        line-height: 1.7;
    }
</style>
