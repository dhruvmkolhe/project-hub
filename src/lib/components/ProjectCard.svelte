<script lang="ts">
    import StarRating from "./StarRating.svelte";

    interface Project {
        id: string;
        title: string;
        shortDescription: string | null;
        description: string;
        thumbnailUrl: string | null;
        techStack: string[];
        category: string;
        liveUrl: string | null;
        githubUrl: string | null;
        viewCount: number;
        createdAt: Date;
        user: {
            username: string;
            avatarUrl: string | null;
        };
        averageRating: number;
        reviewCount: number;
    }

    let { project }: { project: Project } = $props();

    const categoryLabels: Record<string, string> = {
        "web-app": "Web App",
        "mobile-app": "Mobile App",
        api: "API",
        "cli-tool": "CLI Tool",
        game: "Game",
        "ai-ml": "AI/ML",
        blockchain: "Blockchain",
        other: "Other",
    };
</script>

<a href="/projects/{project.id}" class="project-card">
    <div class="card-thumbnail">
        {#if project.thumbnailUrl}
            <img src={project.thumbnailUrl} alt={project.title} />
        {:else}
            <div class="thumbnail-placeholder">
                <span class="placeholder-icon">◆</span>
            </div>
        {/if}
        <span class="category-badge"
            >{categoryLabels[project.category] || "Other"}</span
        >
    </div>

    <div class="card-content">
        <h3 class="card-title">{project.title}</h3>
        <p class="card-description">
            {project.shortDescription || project.description}
        </p>

        <div class="tech-stack">
            {#each project.techStack.slice(0, 3) as tech}
                <span class="tech-badge">{tech}</span>
            {/each}
            {#if project.techStack.length > 3}
                <span class="tech-badge more"
                    >+{project.techStack.length - 3}</span
                >
            {/if}
        </div>

        <div class="card-footer">
            <div class="author">
                <div class="author-avatar">
                    {#if project.user.avatarUrl}
                        <img
                            src={project.user.avatarUrl}
                            alt={project.user.username}
                        />
                    {:else}
                        <span
                            >{project.user.username
                                .charAt(0)
                                .toUpperCase()}</span
                        >
                    {/if}
                </div>
                <span class="author-name">{project.user.username}</span>
            </div>

            <div class="stats">
                <div class="rating">
                    <StarRating rating={project.averageRating} size="sm" />
                    <span>({project.reviewCount})</span>
                </div>
            </div>
        </div>
    </div>
</a>

<style>
    .project-card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: all var(--transition-normal);
    }

    .project-card:hover {
        transform: translateY(-4px);
        border-color: var(--ember);
        box-shadow: var(--shadow-lg), 0 0 40px -10px var(--ember-glow);
    }

    .card-thumbnail {
        position: relative;
        height: 180px;
        overflow: hidden;
        background: var(--color-bg-secondary);
    }

    .card-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
    }

    .project-card:hover .card-thumbnail img {
        transform: scale(1.05);
    }

    .thumbnail-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            var(--color-bg-secondary) 0%,
            var(--paper-elevated) 100%
        );
    }

    .placeholder-icon {
        font-size: 3rem;
        color: var(--ember);
        opacity: 0.6;
    }

    .category-badge {
        position: absolute;
        top: var(--space-sm);
        right: var(--space-sm);
        padding: var(--space-xs) var(--space-sm);
        background: rgba(0, 0, 0, 0.75);
        color: var(--chalk);
        font-family: var(--font-mono);
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: var(--radius-sm);
        backdrop-filter: blur(4px);
    }

    .card-content {
        padding: var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        flex: 1;
    }

    .card-title {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-description {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.6;
    }

    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
        margin-top: var(--space-xs);
    }

    .tech-badge {
        padding: 3px 8px;
        background: var(--color-bg-secondary);
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
    }

    .tech-badge.more {
        background: var(--ember-glow);
        color: var(--ember);
        border-color: transparent;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        padding-top: var(--space-md);
        border-top: 1px solid var(--color-border);
    }

    .author {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .author-avatar {
        width: 24px;
        height: 24px;
        border-radius: var(--radius-sm);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        font-size: 0.65rem;
        font-weight: 600;
        overflow: hidden;
    }

    .author-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .author-name {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .rating {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
    }

    .rating span {
        font-size: 0.7rem;
        color: var(--color-text-muted);
    }
</style>
