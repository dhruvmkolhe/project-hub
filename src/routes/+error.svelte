<script lang="ts">
    import { page } from "$app/stores";
    import Navbar from "$lib/components/Navbar.svelte";

    let status = $derived($page.status);
    let message = $derived($page.error?.message || (status === 404 ? "Page Not Found" : "An error occurred"));

    // Track 404 errors in analytics if available
    $effect(() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: `Error ${status}: ${message} on ${window.location.pathname}`,
                fatal: false
            });
        }
    });
</script>

<svelte:head>
    <title>{status} - {status === 404 ? 'Page Not Found' : 'Error'} | ProjectHub</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="error-page">
    <Navbar user={$page.data?.user} />

    <main class="container error-container">
        <div class="error-card">
            <div class="error-badge">
                <span class="status-code">{status}</span>
            </div>
            
            <h1 class="error-title">
                {#if status === 404}
                    Page Missing in Action
                {:else}
                    Something Went Wrong
                {/if}
            </h1>
            
            <p class="error-desc">
                {#if status === 404}
                    The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
                {:else}
                    {message}
                {/if}
            </p>

            <div class="error-actions">
                <a href="/" class="btn btn-primary btn-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span>Back to Home</span>
                </a>
                <a href="/projects" class="btn btn-secondary btn-lg">
                    <span>Explore Projects</span>
                </a>
            </div>
        </div>
    </main>
</div>

<style>
    .error-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
    }

    .error-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem 1.5rem;
    }

    .error-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 24px;
        padding: 3.5rem 2.5rem;
        max-width: 560px;
        width: 100%;
        text-align: center;
        box-shadow: var(--shadow-xl);
    }

    .error-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 107, 107, 0.1);
        border: 1px solid rgba(255, 107, 107, 0.25);
        border-radius: 100px;
        padding: 0.5rem 1.5rem;
        margin-bottom: 1.5rem;
    }

    .status-code {
        font-family: var(--font-mono, monospace);
        font-size: 2rem;
        font-weight: 800;
        color: #ff6b6b;
    }

    .error-title {
        font-size: 2.25rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .error-desc {
        color: var(--color-text-secondary);
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2.5rem;
    }

    .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
</style>
