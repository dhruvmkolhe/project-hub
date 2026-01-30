<script lang="ts">
    let { user } = $props<{ user: any }>();

    let isMenuOpen = $state(false);
    let theme = $state<"light" | "dark">("dark");

    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    $effect(() => {
        const savedTheme = localStorage.getItem("theme") as
            | "light"
            | "dark"
            | null;
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        theme = savedTheme || (prefersDark ? "dark" : "light");
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
            <a href="/projects" class="nav-link">Explore</a>
            {#if user}
                <a href="/projects/submit" class="nav-link">Submit</a>
                <a href="/dashboard" class="nav-link">Dashboard</a>
            {/if}
        </div>

        <div class="navbar-actions">
            <button
                class="theme-toggle"
                onclick={toggleTheme}
                aria-label="Toggle theme"
            >
                {#if theme === "light"}
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        />
                    </svg>
                {:else}
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path
                            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        />
                    </svg>
                {/if}
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

    [data-theme="light"] .navbar {
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

    .navbar-actions {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }

    .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .theme-toggle:hover {
        background: var(--color-surface-hover);
        color: var(--amber);
        border-color: var(--amber);
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
        .navbar-links {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--color-surface);
            border-bottom: 1px solid var(--color-border);
            padding: var(--space-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
        }

        .navbar-links.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .mobile-menu-btn {
            display: flex;
        }

        .navbar-actions .btn {
            display: none;
        }
    }
</style>
