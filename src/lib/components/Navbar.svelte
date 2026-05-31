<script lang="ts">
    let { user } = $props<{ user: any }>();

    let isMenuOpen = $state(false);
    // Initialize from the data-theme already set by the inline script in app.html
    // This avoids any flash or mismatch between server-rendered and client state
    let theme = $state<"light" | "dark">("dark");

    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    $effect(() => {
        // Read the theme that was already applied by the inline script in app.html
        const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        theme = current || savedTheme || (prefersDark ? "dark" : "light");
        // Ensure the attribute is always set correctly
        document.documentElement.setAttribute("data-theme", theme);
    });
</script>

<nav class="navbar">
    <div class="navbar-container">
        <a href="/" class="navbar-brand">
            <span class="brand-icon">◆</span>
            <span class="brand-text">ProjectHub</span>
        </a>

        <div class="navbar-links" class:open={isMenuOpen}>
            <a href="/projects" class="nav-link" onclick={() => (isMenuOpen = false)}>Explore</a>
            {#if user}
                <a href="/projects/submit" class="nav-link" onclick={() => (isMenuOpen = false)}>Submit</a>
                <a href="/dashboard" class="nav-link" onclick={() => (isMenuOpen = false)}>Dashboard</a>
                <div class="mobile-auth-divider"></div>
                <form action="/api/auth/logout" method="POST" class="mobile-logout">
                    <button type="submit" class="nav-link nav-link-danger">Logout</button>
                </form>
            {:else}
                <div class="mobile-auth-divider"></div>
                <a href="/auth/login" class="nav-link mobile-login" onclick={() => (isMenuOpen = false)}>Login</a>
                <a href="/auth/register" class="btn btn-primary mobile-signup" onclick={() => (isMenuOpen = false)}>Sign Up Free</a>
            {/if}
        </div>

        <div class="navbar-actions">
            <button
                class="theme-toggle"
                onclick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
                <span class="toggle-track" class:dark={theme === "dark"}>
                    <span class="toggle-thumb">
                        <!-- Sun icon -->
                        <svg class="icon-sun" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                        <!-- Moon icon -->
                        <svg class="icon-moon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </span>
                </span>
            </button>

            {#if user}
                <div class="user-menu">
                    <button class="user-button">
                        <div class="avatar">
                            {#if user.avatarUrl}
                                <img src={user.avatarUrl} alt={user.username} />
                            {:else}
                                <span
                                    >{user.username
                                        .charAt(0)
                                        .toUpperCase()}</span
                                >
                            {/if}
                        </div>
                    </button>
                    <div class="dropdown">
                        <a href="/dashboard" class="dropdown-item">Dashboard</a>
                        <a href="/profile" class="dropdown-item">Profile</a>
                        <hr />
                        <form action="/api/auth/logout" method="POST">
                            <button type="submit" class="dropdown-item logout"
                                >Logout</button
                            >
                        </form>
                    </div>
                </div>
            {:else}
                <a href="/auth/login" class="btn btn-ghost">Login</a>
                <a href="/auth/register" class="btn btn-primary">Sign Up</a>
            {/if}

            <button
                class="mobile-menu-btn"
                onclick={() => (isMenuOpen = !isMenuOpen)}
                aria-label="Toggle menu"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    {#if isMenuOpen}
                        <path d="M18 6L6 18M6 6l12 12" />
                    {:else}
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    {/if}
                </svg>
            </button>
        </div>
    </div>
</nav>

<style>
    .navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(13, 13, 15, 0.85);
        border-bottom: 1px solid var(--color-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    :global([data-theme="light"]) .navbar {
        background: rgba(250, 249, 247, 0.85);
    }

    .navbar-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 var(--space-lg);
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-lg);
    }

    .navbar-brand {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        text-decoration: none;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.35rem;
        color: var(--color-text);
        letter-spacing: -0.02em;
    }

    .brand-icon {
        color: var(--ember);
        font-size: 1.1rem;
    }

    .brand-text {
        color: var(--color-text);
    }

    .navbar-links {
        display: flex;
        align-items: center;
        gap: var(--space-xl);
    }

    .nav-link {
        position: relative;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: var(--color-text-muted);
        text-transform: uppercase;
        transition: color var(--transition-fast);
    }

    .nav-link:hover {
        color: var(--color-text);
    }

    .nav-link::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--ember);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform var(--transition-fast);
    }

    .nav-link:hover::after {
        transform: scaleX(1);
        transform-origin: left;
    }

    .nav-link-danger {
        color: var(--crimson) !important;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        width: 100%;
    }

    .mobile-auth-divider {
        display: none;
        width: 100%;
        height: 1px;
        background: var(--color-border);
    }

    .mobile-logout {
        display: none;
        width: 100%;
    }

    .mobile-signup {
        display: none;
    }

    .mobile-login {
        display: none;
    }

    .navbar-actions {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }

    /* ── Theme Toggle Pill ─────────────────────────────── */
    .theme-toggle {
        display: flex;
        align-items: center;
        background: transparent;
        border: none;
        padding: 2px;
        cursor: pointer;
        border-radius: var(--radius-full);
    }

    .toggle-track {
        position: relative;
        display: flex;
        align-items: center;
        width: 52px;
        height: 26px;
        background: #3a3a4a;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-border);
        transition: background var(--transition-normal), border-color var(--transition-normal);
        padding: 3px;
    }

    .toggle-track.dark {
        background: #2a2040;
        border-color: var(--amber);
    }

    :global([data-theme="light"]) .toggle-track {
        background: #dde8f5;
        border-color: #90b4d8;
    }

    :global([data-theme="light"]) .toggle-track.dark {
        background: #2a2040;
        border-color: var(--amber);
    }

    .toggle-thumb {
        position: absolute;
        left: 3px;
        width: 18px;
        height: 18px;
        background: var(--amber);
        border-radius: var(--radius-full);
        transition: left var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }

    .toggle-track.dark .toggle-thumb {
        left: calc(100% - 21px);
        background: #7c6dab;
        box-shadow: 0 0 8px rgba(124, 109, 171, 0.5);
    }

    :global([data-theme="light"]) .toggle-track .toggle-thumb {
        left: 3px;
        background: #f0a500;
    }

    :global([data-theme="light"]) .toggle-track.dark .toggle-thumb {
        left: calc(100% - 21px);
        background: #7c6dab;
    }

    .icon-sun, .icon-moon {
        position: absolute;
        transition: opacity var(--transition-fast), transform var(--transition-normal);
    }

    /* In dark mode: thumb is on the right, moon visible */
    .toggle-track.dark .icon-sun {
        opacity: 0;
        transform: rotate(-90deg) scale(0.7);
    }
    .toggle-track.dark .icon-moon {
        opacity: 1;
        color: #e0d4ff;
    }

    /* In light mode: thumb is on the left, sun visible */
    .toggle-track:not(.dark) .icon-sun {
        opacity: 1;
        color: #fff;
    }
    .toggle-track:not(.dark) .icon-moon {
        opacity: 0;
        transform: rotate(90deg) scale(0.7);
    }

    .theme-toggle:hover .toggle-track:not(.dark) {
        border-color: var(--amber);
        box-shadow: 0 0 8px rgba(244, 166, 35, 0.25);
    }
    .theme-toggle:hover .toggle-track.dark {
        box-shadow: 0 0 8px rgba(124, 109, 171, 0.3);
    }

    .user-menu {
        position: relative;
    }

    .user-button {
        display: flex;
        align-items: center;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        background: var(--color-surface-hover);
        border: 2px solid var(--ember);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ember);
        font-family: var(--font-display);
        font-weight: 600;
        overflow: hidden;
        transition: all var(--transition-fast);
    }

    .avatar:hover {
        box-shadow: 0 0 15px -3px var(--ember-glow);
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: var(--space-sm);
        min-width: 180px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: all var(--transition-fast);
    }

    .user-menu:hover .dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--color-text-secondary);
        text-align: left;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .dropdown-item:hover {
        background: var(--color-surface-hover);
        color: var(--color-text);
    }

    .dropdown-item.logout {
        color: var(--crimson);
    }

    .dropdown hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: var(--space-xs) 0;
    }

    .mobile-menu-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .navbar-container {
            height: 56px;
            padding: 0 var(--space-md);
        }

        .navbar-brand {
            font-size: 1.15rem;
        }

        .navbar-links {
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: flex-start;
            background: var(--color-surface);
            border-bottom: 1px solid var(--color-border);
            padding: var(--space-lg) var(--space-md);
            gap: var(--space-lg);
            transform: translateY(-110%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
            z-index: 99;
            box-shadow: var(--shadow-lg);
        }

        .navbar-links.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .nav-link {
            font-size: 0.9rem;
        }

        .mobile-menu-btn {
            display: flex;
        }

        /* Keep login visible but hide sign up to save space */
        .navbar-actions .btn-ghost {
            display: none;
        }

        .navbar-actions .btn-primary {
            display: none;
        }

        /* Show auth links inside mobile drawer */
        .mobile-auth-divider {
            display: block;
        }

        .mobile-logout {
            display: block;
        }

        .mobile-login {
            display: block;
        }

        .mobile-signup {
            display: inline-flex;
        }
    }

    @media (max-width: 480px) {
        .navbar-container {
            height: 52px;
        }

        .toggle-track {
            width: 44px;
            height: 22px;
        }

        .toggle-thumb {
            width: 15px;
            height: 15px;
        }

        .toggle-track.dark .toggle-thumb {
            left: calc(100% - 18px);
        }
    }
</style>
