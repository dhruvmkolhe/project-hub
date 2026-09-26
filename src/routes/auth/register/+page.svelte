<script lang="ts">
    import { enhance } from "$app/forms";
    import RegisterScene from "$lib/components/visuals/RegisterScene.svelte";

    let { form, data } = $props();

    let isLoading = $state(false);
    let showPassword = $state(false);
    let showConfirmPassword = $state(false);
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
                    <div class="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            class="form-input"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            class="toggle-password-btn"
                            onclick={() => (showPassword = !showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {#if showPassword}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            {:else}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            {/if}
                        </button>
                    </div>
                    {#if form?.errors?.password}
                        <span class="form-error">{form.errors.password}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="confirmPassword" class="form-label"
                        >Confirm Password</label
                    >
                    <div class="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            class="form-input"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            class="toggle-password-btn"
                            onclick={() => (showConfirmPassword = !showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {#if showConfirmPassword}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            {:else}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            {/if}
                        </button>
                    </div>
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

    .password-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
    }

    .password-input-wrapper .form-input {
        width: 100%;
        padding-right: 2.75rem;
    }

    .toggle-password-btn {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        padding: 0.25rem;
        color: var(--color-text-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
    }

    .toggle-password-btn:hover {
        color: var(--color-text);
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
