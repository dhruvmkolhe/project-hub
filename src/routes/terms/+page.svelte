<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    let { data } = $props();
</script>

<svelte:head>
    <title>Terms of Service - ProjectHub</title>
    <meta name="description" content="ProjectHub Terms of Service governing platform usage, community standards, and user-generated content." />
    <!-- TODO: Update domain URL -->
    <link rel="canonical" href="https://projecthub.com/terms" />
</svelte:head>

<div class="legal-page">
    <Navbar user={data?.user} />

    <main class="container legal-container">
        <article class="legal-content">
            <h1>Terms of Service</h1>
            <p class="last-updated">Last Updated: January 2026</p>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>By registering for or using ProjectHub, you agree to abide by these Terms of Service and our community guidelines. If you do not agree, please do not use the platform.</p>
            </section>

            <section>
                <h2>2. Community Conduct & Code Reviews</h2>
                <p>ProjectHub is built on constructive, respectful peer reviews. Harassment, hateful speech, toxic criticism, spam, or abusive behavior will result in immediate account suspension.</p>
            </section>

            <section>
                <h2>3. User Content & Intellectual Property</h2>
                <p>You retain full ownership of all code, projects, and review content you upload to ProjectHub. By posting, you grant ProjectHub a non-exclusive license to display your content publicly on the platform.</p>
            </section>

            <section>
                <h2>4. Limitation of Liability</h2>
                <p>ProjectHub is provided "as is" without warranties of any kind. We are not responsible for any issues arising from project code or third-party links shared on the platform.</p>
            </section>

            <section>
                <h2>5. Contact</h2>
                <p>For inquiries regarding terms or account issues, contact <strong>support@projecthub.com</strong>.</p>
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
