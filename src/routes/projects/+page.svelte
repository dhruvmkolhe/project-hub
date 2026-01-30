<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";

    let { data } = $props();

    const categories = [
        { value: "", label: "All Categories" },
        { value: "web-app", label: "Web App" },
        { value: "mobile-app", label: "Mobile App" },
        { value: "api", label: "API" },
        { value: "cli-tool", label: "CLI Tool" },
        { value: "game", label: "Game" },
        { value: "ai-ml", label: "AI/ML" },
        { value: "blockchain", label: "Blockchain" },
        { value: "other", label: "Other" },
    ];

    let searchQuery = $state(data.filters.search);
    let selectedCategory = $state(data.filters.category);
</script>

<div class="projects-page">
    <Navbar user={data.user} />

    <main class="container">
        <header class="page-header animate-slide-up">
            <h1>Explore Projects</h1>
            <p>Discover amazing projects built by fellow developers</p>
        </header>

        <div class="filters">
            <div class="search-box">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    placeholder="Search projects..."
                    class="form-input"
                    bind:value={searchQuery}
                />
            </div>

            <select
                class="form-input category-select"
                bind:value={selectedCategory}
            >
                {#each categories as cat}
                    <option value={cat.value}>{cat.label}</option>
                {/each}
            </select>

            {#if data.user}
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
                    Submit
                </a>
            {/if}
        </div>

        {#if data.projects.length > 0}
            <div class="projects-grid">
                {#each data.projects as project}
                    <ProjectCard {project} />
                {/each}
            </div>

            {#if data.pagination.totalPages > 1}
                <div class="pagination">
                    {#if data.pagination.page > 1}
                        <a
                            href="?page={data.pagination.page - 1}"
                            class="btn btn-secondary"
                        >
                            ← Previous
                        </a>
                    {/if}

                    <span class="page-info">
                        Page {data.pagination.page} of {data.pagination
                            .totalPages}
                    </span>

                    {#if data.pagination.page < data.pagination.totalPages}
                        <a
                            href="?page={data.pagination.page + 1}"
                            class="btn btn-secondary"
                        >
                            Next →
                        </a>
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="empty-state">
                <span class="empty-icon">◆</span>
                <h2>No projects yet</h2>
                <p>Be the first to submit a project!</p>
                {#if data.user}
                    <a href="/projects/submit" class="btn btn-primary btn-lg"
                        >Submit Project</a
                    >
                {:else}
                    <a href="/auth/register" class="btn btn-primary btn-lg"
                        >Sign Up to Submit</a
                    >
                {/if}
            </div>
        {/if}
    </main>
</div>

<style>
    .projects-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    main {
        padding: var(--space-2xl) var(--space-lg);
    }

    .page-header {
        text-align: center;
        margin-bottom: var(--space-2xl);
        opacity: 0;
    }

    .page-header h1 {
        font-size: 2.5rem;
        margin-bottom: var(--space-sm);
    }

    .page-header p {
        color: var(--color-text-muted);
    }

    .filters {
        display: flex;
        gap: var(--space-md);
        margin-bottom: var(--space-xl);
        flex-wrap: wrap;
    }

    .search-box {
        flex: 1;
        min-width: 250px;
        position: relative;
    }

    .search-box svg {
        position: absolute;
        left: var(--space-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
    }

    .search-box .form-input {
        padding-left: 44px;
    }

    .category-select {
        width: 180px;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-lg);
    }

    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-lg);
        margin-top: var(--space-2xl);
        padding-top: var(--space-xl);
        border-top: 1px solid var(--color-border);
    }

    .page-info {
        color: var(--color-text-muted);
        font-size: 0.85rem;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-3xl);
        text-align: center;
    }

    .empty-icon {
        font-size: 4rem;
        color: var(--ember);
        opacity: 0.5;
        margin-bottom: var(--space-lg);
    }

    .empty-state h2 {
        margin-bottom: var(--space-sm);
    }

    .empty-state p {
        color: var(--color-text-muted);
        margin-bottom: var(--space-xl);
    }

    @media (max-width: 640px) {
        .filters {
            flex-direction: column;
        }

        .search-box,
        .category-select {
            width: 100%;
        }
    }
</style>
