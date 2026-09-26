<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import StarRating from "$lib/components/StarRating.svelte";
    import { fade } from "svelte/transition";

    let { data } = $props();
    let profile = $derived(data.profile);
    let projects = $derived(data.projects);
    let stats = $derived(data.stats);

    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }
</script>

<svelte:head>
    <title>{profile.displayName || profile.username} - Developer Profile | ProjectHub</title>
    <meta name="description" content={`View projects, code reviews, and developer contributions by ${profile.displayName || profile.username} on ProjectHub.`} />
    <meta property="og:title" content={`${profile.displayName || profile.username} - Developer Profile | ProjectHub`} />
    <meta property="og:description" content={`View projects, code reviews, and developer contributions by ${profile.displayName || profile.username} on ProjectHub.`} />
    {#if profile.avatarUrl}
        <meta property="og:image" content={profile.avatarUrl} />
    {/if}
</svelte:head>

<div class="profile-page">
    <Navbar user={data.user} />
    <div class="profile-container" in:fade={{ duration: 300 }}>
    <!-- Profile Header -->
    <header class="profile-header">
        <div class="header-content">
            <div class="avatar-container">
                <div class="avatar">
                    {#if profile.avatarUrl}
                        <img src={profile.avatarUrl} alt={profile.username} />
                    {:else}
                        <span>{profile.username.charAt(0).toUpperCase()}</span>
                    {/if}
                </div>
            </div>

            <div class="profile-info">
                <div class="name-section">
                    <h1>{profile.displayName || profile.username}</h1>
                    <span class="username">@{profile.username}</span>
                </div>

                {#if profile.bio}
                    <p class="bio">{profile.bio}</p>
                {/if}

                <div class="meta-row">
                    <span class="join-date">
                        🗓️ Joined {formatDate(profile.createdAt)}
                    </span>
                    {#if profile.githubUsername}
                        <a
                            href="https://github.com/{profile.githubUsername}"
                            target="_blank"
                            rel="noreferrer"
                            class="social-link"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            {profile.githubUsername}
                        </a>
                    {/if}
                </div>
            </div>

            <!-- Profile Stats Cards -->
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-value">{stats.totalProjects}</span>
                    <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{stats.totalReviewsReceived}</span>
                    <span class="stat-label">Reviews</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">
                        {stats.overallAverageRating > 0
                            ? stats.overallAverageRating.toFixed(1)
                            : "-"}
                    </span>
                    <span class="stat-label">Avg Rating</span>
                </div>
            </div>
        </div>
    </header>

    <main class="profile-content">
        <h2 class="section-title">Projects</h2>

        {#if projects.length > 0}
            <div class="projects-grid">
                {#each projects as project}
                    <a href="/projects/{project.id}" class="project-card">
                        <div class="card-thumb">
                            {#if project.thumbnailUrl}
                                <img
                                    src={project.thumbnailUrl}
                                    alt={project.title}
                                />
                            {:else}
                                <div class="placeholder-thumb">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-muted);">
                                        <polyline points="16 18 22 12 16 6" />
                                        <polyline points="8 6 2 12 8 18" />
                                    </svg>
                                </div>
                            {/if}
                        </div>
                        <div class="card-content">
                            <h3 class="project-title">{project.title}</h3>
                            <p class="project-desc">
                                {project.shortDescription ||
                                    "No description available."}
                            </p>

                            <div class="project-footer">
                                <div class="rating-badge" style="display: inline-flex; align-items: center;">
                                    <span class="star" style="display: inline-flex; align-items: center; justify-content: center; margin-right: 4px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="color: var(--amber);">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </span>
                                    <span
                                        >{project.averageRating > 0
                                            ? project.averageRating.toFixed(1)
                                            : "New"}</span
                                    >
                                    <span class="count"
                                        >({project.reviewCount})</span
                                    >
                                </div>
                                <div class="tech-stack">
                                    {#each (project.techStack || []).slice(0, 3) as tech}
                                        <span class="tech-tag">{tech}</span>
                                    {/each}
                                    {#if (project.techStack?.length || 0) > 3}
                                        <span class="tech-tag"
                                            >+{(project.techStack?.length ||
                                                0) - 3}</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {:else}
            <div class="empty-state">
                <span class="empty-emoji">📦</span>
                <h3>No projects yet</h3>
                <p>This user hasn't showcased any projects yet.</p>
            </div>
        {/if}
    </main>
    </div>
</div>

<style>
    .profile-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    .profile-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: var(--space-2xl) var(--space-lg);
    }

    /* Header Styles */
    .profile-header {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: var(--space-2xl);
        margin-bottom: var(--space-3xl);
    }

    .header-content {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: var(--space-2xl);
        align-items: center;
    }

    @media (max-width: 768px) {
        .profile-container {
            padding: var(--space-lg) var(--space-sm);
        }

        .profile-header {
            padding: var(--space-lg);
            margin-bottom: var(--space-xl);
        }

        .header-content {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
        }

        .meta-row {
            justify-content: center;
        }

        .profile-stats {
            width: 100%;
            justify-content: space-around;
        }
    }

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: var(--radius-full);
        background: linear-gradient(
            135deg,
            var(--color-primary),
            var(--color-secondary)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 700;
        color: white;
        overflow: hidden;
        border: 4px solid var(--color-bg);
        box-shadow: 0 0 0 2px var(--color-border);
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .name-section h1 {
        font-size: 2rem;
        margin: 0;
        line-height: 1.2;
    }

    .username {
        font-size: 1.125rem;
        color: var(--color-text-muted);
    }

    .bio {
        font-size: 1rem;
        color: var(--color-text-secondary);
        max-width: 600px;
        line-height: 1.6;
    }

    .meta-row {
        display: flex;
        gap: var(--space-lg);
        font-size: 0.875rem;
        color: var(--color-text-muted);
    }

    .social-link {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .social-link:hover {
        color: var(--color-primary);
    }

    /* Stats */
    .profile-stats {
        display: flex;
        gap: var(--space-xl);
        padding: var(--space-lg);
        background: var(--color-bg);
        border-radius: var(--radius-lg);
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .stat-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin-top: 4px;
    }

    /* Projects Grid */
    .section-title {
        font-size: 1.5rem;
        margin-bottom: var(--space-xl);
        padding-bottom: var(--space-md);
        border-bottom: 1px solid var(--color-border);
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-lg);
    }

    .project-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: all var(--transition-fast);
        display: flex;
        flex-direction: column;
    }

    .project-card:hover {
        transform: translateY(-4px);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-lg);
    }

    .card-thumb {
        height: 160px;
        background: var(--color-bg);
        overflow: hidden;
    }

    .card-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder-thumb {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        background: linear-gradient(
            135deg,
            var(--color-surface-hover),
            var(--color-border)
        );
    }

    .card-content {
        padding: var(--space-lg);
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .project-title {
        font-size: 1.125rem;
        margin-bottom: var(--space-xs);
        color: var(--color-text);
    }

    .project-desc {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        margin-bottom: var(--space-lg);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
    }

    .project-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    .rating-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .star {
        color: #fbbf24;
    }

    .count {
        color: var(--color-text-muted);
        font-weight: 400;
        font-size: 0.75rem;
    }

    .tech-stack {
        display: flex;
        gap: 4px;
    }

    .tech-tag {
        font-size: 0.7rem;
        padding: 2px 6px;
        background: var(--color-bg);
        border-radius: var(--radius-sm);
        color: var(--color-text-secondary);
    }

    .empty-state {
        text-align: center;
        padding: var(--space-3xl);
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        border: 1px dashed var(--color-border);
    }

    .empty-emoji {
        font-size: 3rem;
        margin-bottom: var(--space-md);
        display: block;
    }
</style>
