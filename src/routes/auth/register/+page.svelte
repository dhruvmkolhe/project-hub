<script lang="ts">
    import { enhance } from "$app/forms";
    import RegisterScene from "$lib/components/visuals/RegisterScene.svelte";

    let { form, data } = $props();

    let isLoading = $state(false);
</script>

<svelte:head>
    <title>Create Account - ProjectHub</title>
    <meta name="description" content="Join the ProjectHub developer community. Share projects, get peer reviews, and grow your coding skills." />
</svelte:head>

<div class="auth-page">
    <div class="auth-split">
        <!-- Left Side: Form -->
        <div class="auth-content">
            <div class="auth-header">
                <a href="/" class="brand-link">
                    <span class="auth-icon">◆</span>
                    <span class="brand-text">ProjectHub</span>
                </a>
                <h1>Create Account</h1>
                <p>Join the community and start sharing your projects</p>
            </div>

            {#if form?.error}
                <div class="alert alert-error">
                    {form.error}
                </div>
            {/if}

            <form
                method="POST"
                use:enhance={() => {
                    isLoading = true;
                    return async ({ update }) => {
                        isLoading = false;
                        await update();
                    };
                }}
            >
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-input"
                        placeholder="you@example.com"
                        value={form?.email ?? ""}
                        required
                    />
                    {#if form?.errors?.email}
                        <span class="form-error">{form.errors.email}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        class="form-input"
                        placeholder="cooldev123"
                        value={form?.username ?? ""}
                        required
                    />
                    {#if form?.errors?.username}
                        <span class="form-error">{form.errors.username}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-input"
                        placeholder="••••••••"
                        required
                    />
                    {#if form?.errors?.password}
                        <span class="form-error">{form.errors.password}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="confirmPassword" class="form-label"
                        >Confirm Password</label
                    >
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        class="form-input"
                        placeholder="••••••••"
                        required
                    />
                    {#if form?.errors?.confirmPassword}
                        <span class="form-error"
                            >{form.errors.confirmPassword}</span
                        >
                    {/if}
                </div>

                <button
                    type="submit"
                    class="btn btn-primary btn-lg submit-btn"
                    disabled={isLoading}
                >
                    {#if isLoading}
                        <span class="spinner"></span>
                        Creating account...
                    {:else}
                        Create Account
                    {/if}
                </button>
            </form>

            <div class="auth-footer">
                <p>
                    Already have an account? <a href="/auth/login">Sign in</a>
                </p>
            </div>
        </div>

        <!-- Right Side: Visual (Three.js Scene) -->
        <div class="auth-visual">
            <div class="visual-bg">
                <div class="grid-pattern"></div>
                <div class="glow-spot"></div>
            </div>

            <div class="scene-container">
                <RegisterScene />
            </div>
        </div>
    </div>
</div>

<style>
    .auth-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    .auth-split {
        display: flex;
        min-height: 100vh;
    }

    /* Content Side */
    .auth-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: var(--space-2xl) var(--space-3xl);
        background: var(--color-surface);
        position: relative;
        z-index: 10;
        max-width: 600px;
        border-right: 1px solid var(--color-border);
    }

    .brand-link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-2xl);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.5rem;
        color: var(--color-text);
        text-decoration: none;
    }

    .brand-link:hover {
        color: var(--ember);
    }

    .auth-header {
        margin-bottom: var(--space-xl);
    }

    .auth-icon {
        color: var(--ember);
    }

    .auth-header h1 {
        font-size: 2.5rem;
        margin-bottom: var(--space-sm);
    }

    .alert {
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-lg);
        font-size: 0.85rem;
    }

    .alert-error {
        background: var(--crimson-glow);
        color: var(--crimson);
        border: 1px solid var(--crimson);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
    }

    .submit-btn {
        width: 100%;
        margin-top: var(--space-sm);
    }

    .auth-footer {
        margin-top: var(--space-2xl);
        text-align: center;
        font-size: 0.9rem;
    }

    .auth-footer a {
        color: var(--ember);
        font-weight: 500;
    }

    /* Visual Side */
    .auth-visual {
        flex: 1.5;
        position: relative;
        background: var(--ink);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .visual-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
    }

    .grid-pattern {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                to right,
                var(--color-border) 1px,
                transparent 1px
            ),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
        background-size: 60px 60px;
        opacity: 0.2;
    }

    .glow-spot {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: var(--sage-glow);
        filter: blur(120px);
        opacity: 0.4;
        border-radius: 50%;
    }

    .scene-container {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 900px) {
        .auth-split {
            flex-direction: column;
        }

        .auth-content {
            flex: none;
            min-height: 100vh;
            max-width: none;
            border-right: none;
        }

        .auth-visual {
            display: none;
        }
    }
</style>
