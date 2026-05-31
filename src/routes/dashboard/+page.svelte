<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import StarRating from "$lib/components/StarRating.svelte";

    let { data } = $props();

    let activeTab = $state<"projects" | "reviews">("projects");

    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    const statusColors: Record<string, string> = {
        approved: "badge-success",
        pending: "badge-warning",
        rejected: "badge-error",
    };
</script>

<div class="dashboard-page">
    <Navbar user={data.user} />

    <main class="container">
        <header class="page-header">
            <div class="welcome">
                <div class="avatar">
                    {#if data.user.avatarUrl}
                        <img
                            src={data.user.avatarUrl}
                            alt={data.user.username}
                        />
                    {:else}
                        <span>{data.user.username.charAt(0).toUpperCase()}</span
                        >
                    {/if}
                </div>
                <div>
                    <h1>
                        Welcome back, {data.user.displayName ||
                            data.user.username}!
                    </h1>
                    <p>@{data.user.username}</p>
                </div>
            </div>

            <a href="/projects/submit" class="btn btn-primary">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
                New Project
            </a>
        </header>

        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                        />
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-number">{data.stats.totalProjects}</span>
                    <span class="stat-label">Projects</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path d="M12 20h9" />
                        <path
                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        />
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-number">{data.stats.totalReviews}</span>
                    <span class="stat-label">Reviews Given</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        />
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-number">{data.stats.totalReceived}</span>
                    <span class="stat-label">Reviews Received</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-number">{data.stats.totalViews}</span>
                    <span class="stat-label">Total Views</span>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
            <div class="tabs">
                <button
                    class="tab"
                    class:active={activeTab === "projects"}
                    onclick={() => (activeTab = "projects")}
                >
                    My Projects ({data.projects.length})
                </button>
                <button
                    class="tab"
                    class:active={activeTab === "reviews"}
                    onclick={() => (activeTab = "reviews")}
                >
                    My Reviews ({data.reviews.length})
                </button>
            </div>

            <!-- Projects Tab -->
            {#if activeTab === "projects"}
                <div class="tab-content">
                    {#if data.projects.length > 0}
                        <div class="project-list">
                            {#each data.projects as project}
                                <a
                                    href="/projects/{project.id}"
                                    class="project-item"
                                >
                                    <div class="project-thumb">
                                        {#if project.thumbnailUrl}
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                            />
                                        {:else}
                                            <span>◆</span>
                                        {/if}
                                    </div>
                                    <div class="project-info">
                                        <div class="project-header">
                                            <h3>{project.title}</h3>
                                            <span
                                                class="badge {statusColors[
                                                    project.status || 'pending'
                                                ]}">{project.status}</span
                                            >
                                        </div>
                                        <p>
                                            {project.shortDescription ||
                                                "No description"}
                                        </p>
                                        <div class="project-meta">
                                            <span class="meta-item">
                                                <StarRating
                                                    rating={project.averageRating}
                                                    size="sm"
                                                />
                                                ({project.reviewCount})
                                            </span>
                                            <span class="meta-item"
                                                >{project.viewCount || 0} views</span
                                            >
                                            <span class="meta-item"
                                                >{formatDate(
                                                    project.createdAt,
                                                )}</span
                                            >
                                        </div>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <div class="empty-state">
                            <span class="empty-icon">◆</span>
                            <h3>No projects yet</h3>
                            <p>
                                Submit your first project to get feedback from
                                the community!
                            </p>
                            <a href="/projects/submit" class="btn btn-primary"
                                >Submit Project</a
                            >
                        </div>
                    {/if}
                </div>
            {/if}

            <!-- Reviews Tab -->
            {#if activeTab === "reviews"}
                <div class="tab-content">
                    {#if data.reviews.length > 0}
                        <div class="review-list">
                            {#each data.reviews as review}
                                <a
                                    href="/projects/{review.projectId}"
                                    class="review-item"
                                >
                                    <div class="review-header">
                                        <h3>
                                            {review.projectTitle ||
                                                "Unknown Project"}
                                        </h3>
                                        <StarRating
                                            rating={review.rating}
                                            size="sm"
                                        />
                                    </div>
                                    {#if review.title}
                                        <h4>{review.title}</h4>
                                    {/if}
                                    <p>
                                        {review.content.slice(0, 150)}{review
                                            .content.length > 150
                                            ? "..."
                                            : ""}
                                    </p>
                                    <span class="review-date"
                                        >{formatDate(review.createdAt)}</span
                                    >
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <div class="empty-state">
                            <span class="empty-icon">◆</span>
                            <h3>No reviews yet</h3>
                            <p>Explore projects and share your feedback!</p>
                            <a href="/projects" class="btn btn-primary"
                                >Explore Projects</a
                            >
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </main>
</div>

<style>
    .dashboard-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    main {
        padding: var(--space-2xl) var(--space-lg);
    }

    .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-2xl);
    }

    .welcome {
        display: flex;
        align-items: center;
        gap: var(--space-lg);
    }

    .avatar {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-md);
        background: var(--color-surface-hover);
        border: 2px solid var(--ember);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ember);
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        overflow: hidden;
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .welcome h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-xs);
    }

    .welcome p {
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    /* Stats */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-lg);
        margin-bottom: var(--space-2xl);
    }

    @media (max-width: 1024px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }

    .stat-card {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-lg);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-normal);
    }

    .stat-card:hover {
        border-color: var(--ember);
        box-shadow: 0 0 30px -10px var(--ember-glow);
    }

    .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: var(--ember-glow);
        border-radius: var(--radius-md);
        color: var(--ember);
    }

    .stat-content {
        display: flex;
        flex-direction: column;
    }

    .stat-number {
        font-family: var(--font-display);
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .stat-label {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Tabs */
    .tabs-container {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid var(--color-border);
    }

    .tab {
        flex: 1;
        padding: var(--space-md) var(--space-lg);
        background: transparent;
        border: none;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .tab:hover {
        background: var(--color-surface-hover);
    }

    .tab.active {
        color: var(--ember);
        box-shadow: inset 0 -2px 0 var(--ember);
    }

    .tab-content {
        padding: var(--space-lg);
    }

    /* Project List */
    .project-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .project-item {
        display: flex;
        gap: var(--space-lg);
        padding: var(--space-md);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        text-decoration: none;
        color: inherit;
        transition: all var(--transition-fast);
    }

    .project-item:hover {
        border-color: var(--ember);
        box-shadow: 0 0 20px -8px var(--ember-glow);
    }

    @media (max-width: 640px) {
        .project-item {
            flex-direction: column;
        }
    }

    .project-thumb {
        width: 120px;
        height: 80px;
        flex-shrink: 0;
        border-radius: var(--radius-sm);
        background: var(--color-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ember);
        font-size: 1.5rem;
        overflow: hidden;
    }

    .project-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .project-header {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .project-header h3 {
        font-size: 1rem;
    }

    .project-info p {
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .project-meta {
        display: flex;
        align-items: center;
        gap: var(--space-lg);
        margin-top: auto;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    /* Review List */
    .review-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .review-item {
        padding: var(--space-md);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        text-decoration: none;
        color: inherit;
        transition: all var(--transition-fast);
    }

    .review-item:hover {
        border-color: var(--ember);
        box-shadow: 0 0 20px -8px var(--ember-glow);
    }

    .review-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-sm);
    }

    .review-header h3 {
        font-size: 1rem;
    }

    .review-item h4 {
        font-size: 0.9rem;
        margin-bottom: var(--space-xs);
    }

    .review-item p {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-sm);
    }

    .review-date {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: var(--space-3xl);
    }

    .empty-icon {
        font-size: 3rem;
        color: var(--ember);
        opacity: 0.5;
        display: block;
        margin-bottom: var(--space-md);
    }

    .empty-state h3 {
        margin-bottom: var(--space-sm);
    }

    .empty-state p {
        color: var(--color-text-muted);
        margin-bottom: var(--space-lg);
    }

    @media (max-width: 768px) {
        .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-lg);
        }
    }

    @media (max-width: 640px) {
        main {
            padding: var(--space-lg) var(--space-sm);
        }

        .project-thumb {
            width: 100%;
            height: 140px;
        }

        .project-meta {
            flex-wrap: wrap;
            gap: var(--space-md);
        }
    }

    @media (max-width: 480px) {
        .welcome {
            gap: var(--space-md);
        }

        .avatar {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
        }

        .welcome h1 {
            font-size: 1.35rem;
        }

        .tab {
            padding: var(--space-sm) var(--space-xs);
            font-size: 0.75rem;
        }

        .tab-content {
            padding: var(--space-md);
        }
    }
</style>
