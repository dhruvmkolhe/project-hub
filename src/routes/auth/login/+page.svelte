<script lang="ts">
    import { enhance } from "$app/forms";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from "svelte";

    let { form } = $props();

    let isLoading = $state(false);
    let showPassword = $state(false);

    // Dynamic Code Typing Effect
    const snippets = [
        `async function authenticate(user) {
  try {
    const session = await connect();
    if (session.isValid) {
      return "Welcome back, Dev!";
    }
  } catch (err) {
    console.error("404: Coffee not found");
  }
}`,
        `def login_system(credentials):
    """Secure Entry Point"""
    if credentials.verify():
        system.grant_access()
        print("Hack the planet!")
    else:
        return "Nice try, script kiddie"`,
        `impl Developer for Human {
    fn code(&self) -> Result<(), Bug> {
        loop {
            self.write_code();
            self.debug();
            if self.is_tired() {
                break;
            }
        }
        Ok(())
    }
}`,
    ];

    let typedCode = $state("");
    let currentSnippetIndex = $state(0);

    onMount(() => {
        // Pick random snippet
        currentSnippetIndex = Math.floor(Math.random() * snippets.length);
        const targetCode = snippets[currentSnippetIndex];
        let charIndex = 0;

        const interval = setInterval(() => {
            if (charIndex < targetCode.length) {
                typedCode += targetCode[charIndex];
                charIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Typing speed

        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>Log In - ProjectHub</title>
    <meta name="description" content="Sign in to your ProjectHub account to manage your projects and view peer feedback." />
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
                <h1>Welcome Back</h1>
                <p>Sign in to continue to your dashboard</p>
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
                </div>

                <button
                    type="submit"
                    class="btn btn-primary btn-lg submit-btn"
                    disabled={isLoading}
                >
                    {#if isLoading}
                        <span class="spinner"></span>
                        Signing in...
                    {:else}
                        Sign In
                    {/if}
                </button>
            </form>

            <div class="auth-footer">
                <p>
                    Don't have an account? <a href="/auth/register"
                        >Create one</a
                    >
                </p>
            </div>
        </div>

        <!-- Right Side: Visual (Code Terminal) -->
        <div class="auth-visual">
            <div class="visual-bg">
                <div class="grid-pattern"></div>
                <div class="glow-orb orb-1"></div>
            </div>

            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="dot red"></div>
                    <div class="dot yellow"></div>
                    <div class="dot green"></div>
                    <span class="terminal-title"
                        >auth_module.{currentSnippetIndex === 0
                            ? "js"
                            : currentSnippetIndex === 1
                              ? "py"
                              : "rs"}</span
                    >
                </div>
                <div class="terminal-body">
                    <pre><code>{typedCode}<span class="cursor">|</span></code
                        ></pre>
                </div>
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
        padding: var(--space-3xl);
    }

    .visual-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
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
        mask-image: radial-gradient(
            circle at center,
            black 30%,
            transparent 80%
        );
    }

    .glow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.3;
    }

    .orb-1 {
        width: 500px;
        height: 500px;
        background: var(--ember);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* Terminal Window */
    .terminal-window {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 500px;
        background: rgba(13, 13, 15, 0.9);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-2xl);
        backdrop-filter: blur(10px);
        overflow: hidden;
        transform: perspective(1000px) rotateY(-5deg);
        transition: transform 0.3s ease;
    }

    .terminal-window:hover {
        transform: perspective(1000px) rotateY(0deg);
    }

    .terminal-header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid var(--color-border);
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .red {
        background: #ff5f56;
    }
    .yellow {
        background: #ffbd2e;
    }
    .green {
        background: #27c93f;
    }

    .terminal-title {
        margin-left: auto;
        font-family: var(--font-mono);
        color: var(--color-text-muted);
        font-size: 0.75rem;
    }

    .terminal-body {
        padding: 24px;
        min-height: 200px;
    }

    code {
        font-family: "JetBrains Mono", monospace;
        color: var(--sage);
        font-size: 0.9rem;
        line-height: 1.6;
        white-space: pre-wrap;
    }

    .cursor {
        display: inline-block;
        width: 8px;
        height: 16px;
        background: var(--ember);
        margin-left: 2px;
        animation: blink 1s infinite;
        vertical-align: middle;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
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
