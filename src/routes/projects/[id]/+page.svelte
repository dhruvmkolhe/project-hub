<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import StarRating from "$lib/components/StarRating.svelte";
    import { enhance } from "$app/forms";

    let { data } = $props();

    let newReview = $state({
        rating: 0,
        functionalityScore: 0,
        uiScore: 0,
        codeQualityScore: 0,
        title: "",
        content: "",
        pros: "",
        cons: "",
    });

    let isSubmitting = $state(false);
    let showReviewForm = $state(false);

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

    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    const isOwner = data.user?.id === data.project.user.id;
    const hasReviewed = data.reviews.some(
        (r) => r.reviewer.id === data.user?.id,
    );
</script>

<div class="project-page">
    <Navbar user={data.user} />

    <main class="container">
        <div class="project-layout">
            <!-- Main Content -->
            <div class="main-content">
                <!-- Header -->
                <header class="project-header">
                    {#if data.project.thumbnailUrl}
                        <img
                            src={data.project.thumbnailUrl}
                            alt={data.project.title}
                            class="project-thumbnail"
                        />
                    {:else}
                        <div class="thumbnail-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-muted);">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                        </div>
                    {/if}

                    <div class="header-content">
                        <div class="header-top">
                            <span class="badge badge-primary"
                                >{categoryLabels[data.project.category]}</span
                            >
                            <span class="view-count">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                    />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                {data.project.viewCount} views
                            </span>
                        </div>

                        <h1>{data.project.title}</h1>

                        <p class="short-desc">
                            {data.project.shortDescription ||
                                data.project.description.slice(0, 150)}
                        </p>

                        <div class="tech-stack">
                            {#each data.project.techStack as tech}
                                <span class="tech-badge">{tech}</span>
                            {/each}
                        </div>

                        <div class="project-links">
                            {#if data.project.liveUrl}
                                <a
                                    href={data.project.liveUrl}
                                    target="_blank"
                                    rel="noopener"
                                    class="btn btn-primary"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                        />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    Live Demo
                                </a>
                            {/if}
                            {#if data.project.githubUrl}
                                <a
                                    href={data.project.githubUrl}
                                    target="_blank"
                                    rel="noopener"
                                    class="btn btn-secondary"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                        />
                                    </svg>
                                    GitHub
                                </a>
                            {/if}
                        </div>
                    </div>
                </header>

                <!-- Description -->
                <section class="section">
                    <h2>About this project</h2>
                    <div class="description">
                        {data.project.description}
                    </div>
                </section>

                <!-- Reviews Section -->
                <section class="section">
                    <div class="section-header">
                        <h2>Reviews ({data.stats.reviewCount})</h2>
                        {#if data.user && !isOwner && !hasReviewed}
                            <button
                                class="btn btn-primary"
                                onclick={() =>
                                    (showReviewForm = !showReviewForm)}
                            >
                                {showReviewForm ? "Cancel" : "Write a Review"}
                            </button>
                        {/if}
                    </div>

                    <!-- Review Form -->
                    {#if showReviewForm && data.user}
                        <form
                            class="review-form card"
                            method="POST"
                            action="?/submitReview"
                            use:enhance={() => {
                                isSubmitting = true;
                                return async ({ update }) => {
                                    isSubmitting = false;
                                    showReviewForm = false;
                                    await update();
                                };
                            }}
                        >
                            <h3>Write your review</h3>

                            <div class="rating-row">
                                <label>Overall Rating</label>
                                <StarRating
                                    rating={newReview.rating}
                                    interactive
                                    size="lg"
                                    onChange={(r) => (newReview.rating = r)}
                                />
                                <input
                                    type="hidden"
                                    name="rating"
                                    value={newReview.rating}
                                />
                            </div>

                            <div class="scores-grid">
                                <div class="score-item">
                                    <label>Functionality</label>
                                    <StarRating
                                        rating={newReview.functionalityScore}
                                        interactive
                                        onChange={(r) =>
                                            (newReview.functionalityScore = r)}
                                    />
                                    <input
                                        type="hidden"
                                        name="functionalityScore"
                                        value={newReview.functionalityScore}
                                    />
                                </div>
                                <div class="score-item">
                                    <label>UI/UX</label>
                                    <StarRating
                                        rating={newReview.uiScore}
                                        interactive
                                        onChange={(r) =>
                                            (newReview.uiScore = r)}
                                    />
                                    <input
                                        type="hidden"
                                        name="uiScore"
                                        value={newReview.uiScore}
                                    />
                                </div>
                                <div class="score-item">
                                    <label>Code Quality</label>
                                    <StarRating
                                        rating={newReview.codeQualityScore}
                                        interactive
                                        onChange={(r) =>
                                            (newReview.codeQualityScore = r)}
                                    />
                                    <input
                                        type="hidden"
                                        name="codeQualityScore"
                                        value={newReview.codeQualityScore}
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label"
                                    >Review Title (optional)</label
                                >
                                <input
                                    type="text"
                                    name="title"
                                    class="form-input"
                                    placeholder="Summarize your review"
                                    bind:value={newReview.title}
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Your Review</label>
                                <textarea
                                    name="content"
                                    class="form-input"
                                    rows="4"
                                    placeholder="Share your experience testing this project..."
                                    bind:value={newReview.content}
                                    required
                                ></textarea>
                            </div>

                            <div class="pros-cons">
                                <div class="form-group">
                                    <label class="form-label">Pros</label>
                                    <textarea
                                        name="pros"
                                        class="form-input"
                                        rows="2"
                                        placeholder="What did you like?"
                                        bind:value={newReview.pros}
                                    ></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Cons</label>
                                    <textarea
                                        name="cons"
                                        class="form-input"
                                        rows="2"
                                        placeholder="What could be improved?"
                                        bind:value={newReview.cons}
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="btn btn-primary btn-lg"
                                disabled={isSubmitting ||
                                    newReview.rating === 0}
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>
                        </form>
                    {/if}

                    <!-- Reviews List -->
                    {#if data.reviews.length > 0}
                        <div class="reviews-list">
                            {#each data.reviews as review}
                                <div class="review-card card">
                                    <div class="review-header">
                                        <div class="reviewer">
                                            <div class="reviewer-avatar">
                                                {#if review.reviewer.avatarUrl}
                                                    <img
                                                        src={review.reviewer
                                                            .avatarUrl}
                                                        alt={review.reviewer
                                                            .username}
                                                    />
                                                {:else}
                                                    <span
                                                        >{review.reviewer.username
                                                            .charAt(0)
                                                            .toUpperCase()}</span
                                                    >
                                                {/if}
                                            </div>
                                            <div>
                                                <span class="reviewer-name"
                                                    >{review.reviewer
                                                        .username}</span
                                                >
                                                <span class="review-date"
                                                    >{formatDate(
                                                        review.createdAt,
                                                    )}</span
                                                >
                                            </div>
                                        </div>
                                        <StarRating
                                            rating={review.rating}
                                            size="sm"
                                        />
                                    </div>

                                    {#if review.title}
                                        <h4 class="review-title">
                                            {review.title}
                                        </h4>
                                    {/if}

                                    <p class="review-content">
                                        {review.content}
                                    </p>

                                    {#if review.pros || review.cons}
                                        <div class="review-pros-cons">
                                            {#if review.pros}
                                                <div class="pros">
                                                    <span class="label"
                                                        >👍 Pros:</span
                                                    >
                                                    <span>{review.pros}</span>
                                                </div>
                                            {/if}
                                            {#if review.cons}
                                                <div class="cons">
                                                    <span class="label"
                                                        >👎 Cons:</span
                                                    >
                                                    <span>{review.cons}</span>
                                                </div>
                                            {/if}
                                        </div>
                                    {/if}

                                    {#if review.functionalityScore || review.uiScore || review.codeQualityScore}
                                        <div class="detailed-scores">
                                            {#if review.functionalityScore}
                                                <div class="score">
                                                    <span>Functionality</span>
                                                    <StarRating
                                                        rating={review.functionalityScore}
                                                        size="sm"
                                                    />
                                                </div>
                                            {/if}
                                            {#if review.uiScore}
                                                <div class="score">
                                                    <span>UI/UX</span>
                                                    <StarRating
                                                        rating={review.uiScore}
                                                        size="sm"
                                                    />
                                                </div>
                                            {/if}
                                            {#if review.codeQualityScore}
                                                <div class="score">
                                                    <span>Code Quality</span>
                                                    <StarRating
                                                        rating={review.codeQualityScore}
                                                        size="sm"
                                                    />
                                                </div>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="no-reviews">
                            <p>
                                No reviews yet. Be the first to review this
                                project!
                            </p>
                        </div>
                    {/if}
                </section>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
                <!-- Stats Card -->
                <div class="card stats-card">
                    <h3>Project Stats</h3>
                    <div class="stat-row">
                        <span>Overall Rating</span>
                        <div class="stat-value">
                            <StarRating
                                rating={data.stats.averageRating}
                                size="sm"
                            />
                            <span>{data.stats.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    {#if data.stats.reviewCount > 0}
                        <div class="stat-row">
                            <span>Functionality</span>
                            <div class="stat-value">
                                <StarRating
                                    rating={data.stats.avgFunctionality}
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div class="stat-row">
                            <span>UI/UX</span>
                            <div class="stat-value">
                                <StarRating
                                    rating={data.stats.avgUi}
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div class="stat-row">
                            <span>Code Quality</span>
                            <div class="stat-value">
                                <StarRating
                                    rating={data.stats.avgCodeQuality}
                                    size="sm"
                                />
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Author Card -->
                <div class="card author-card">
                    <h3>Project Author</h3>
                    <div class="author-info">
                        <div class="author-avatar">
                            {#if data.project.user.avatarUrl}
                                <img
                                    src={data.project.user.avatarUrl}
                                    alt={data.project.user.username}
                                />
                            {:else}
                                <span
                                    >{data.project.user.username
                                        .charAt(0)
                                        .toUpperCase()}</span
                                >
                            {/if}
                        </div>
                        <div>
                            <span class="author-name"
                                >{data.project.user.displayName ||
                                    data.project.user.username}</span
                            >
                            <span class="author-username"
                                >@{data.project.user.username}</span
                            >
                        </div>
                    </div>
                    {#if data.project.user.bio}
                        <p class="author-bio">{data.project.user.bio}</p>
                    {/if}
                    {#if data.project.user.githubUsername}
                        <a
                            href="https://github.com/{data.project.user
                                .githubUsername}"
                            target="_blank"
                            rel="noopener"
                            class="btn btn-secondary btn-sm"
                        >
                            View GitHub Profile
                        </a>
                    {/if}
                </div>

                <!-- Project Info -->
                <div class="card info-card">
                    <h3>Info</h3>
                    <div class="info-row">
                        <span>Created</span>
                        <span>{formatDate(data.project.createdAt)}</span>
                    </div>
                    <div class="info-row">
                        <span>Last Updated</span>
                        <span>{formatDate(data.project.updatedAt)}</span>
                    </div>
                    <div class="info-row">
                        <span>Reviews</span>
                        <span>{data.stats.reviewCount}</span>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</div>

<style>
    .project-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    main {
        padding: var(--space-2xl) var(--space-lg);
    }

    .project-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: var(--space-xl);
    }

    @media (max-width: 1024px) {
        .project-layout {
            grid-template-columns: 1fr;
        }

        .sidebar {
            order: -1;
        }
    }

    /* Header */
    .project-header {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--space-xl);
        margin-bottom: var(--space-2xl);
    }

    @media (max-width: 768px) {
        .project-header {
            grid-template-columns: 1fr;
        }
    }

    .project-thumbnail {
        width: 100%;
        aspect-ratio: 16/10;
        object-fit: cover;
        border-radius: var(--radius-lg);
    }

    .thumbnail-placeholder {
        width: 100%;
        aspect-ratio: 16/10;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            var(--color-primary),
            var(--color-secondary)
        );
        border-radius: var(--radius-lg);
        font-size: 4rem;
    }

    .header-top {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        margin-bottom: var(--space-md);
    }

    .view-count {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        color: var(--color-text-muted);
        font-size: 0.875rem;
    }

    .header-content h1 {
        margin-bottom: var(--space-sm);
    }

    .short-desc {
        font-size: 1.1rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-md);
    }

    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-sm);
        margin-bottom: var(--space-lg);
    }

    .tech-badge {
        padding: var(--space-xs) var(--space-md);
        background: var(--color-bg-secondary);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: var(--radius-full);
    }

    .project-links {
        display: flex;
        gap: var(--space-md);
    }

    /* Sections */
    .section {
        margin-bottom: var(--space-2xl);
    }

    .section h2 {
        margin-bottom: var(--space-lg);
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
    }

    .description {
        color: var(--color-text-secondary);
        line-height: 1.8;
        white-space: pre-wrap;
    }

    /* Review Form */
    .review-form {
        margin-bottom: var(--space-xl);
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
    }

    .review-form h3 {
        margin-bottom: var(--space-sm);
    }

    .rating-row {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }

    .scores-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-md);
    }

    @media (max-width: 640px) {
        .scores-grid {
            grid-template-columns: 1fr;
        }
    }

    .score-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .score-item label {
        font-size: 0.875rem;
        color: var(--color-text-muted);
    }

    .pros-cons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-md);
    }

    @media (max-width: 640px) {
        .pros-cons {
            grid-template-columns: 1fr;
        }
    }

    /* Reviews List */
    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
    }

    .review-card {
        padding: var(--space-lg);
    }

    .review-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-md);
    }

    .reviewer {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .reviewer-avatar {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-full);
        background: linear-gradient(
            135deg,
            var(--color-primary),
            var(--color-secondary)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        overflow: hidden;
    }

    .reviewer-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .reviewer-name {
        display: block;
        font-weight: 500;
    }

    .review-date {
        display: block;
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .review-title {
        margin-bottom: var(--space-sm);
    }

    .review-content {
        margin-bottom: var(--space-md);
        line-height: 1.6;
    }

    .review-pros-cons {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
        padding: var(--space-md);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
    }

    .review-pros-cons .label {
        font-weight: 500;
        margin-right: var(--space-xs);
    }

    .detailed-scores {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-md);
        padding-top: var(--space-md);
        border-top: 1px solid var(--color-border);
    }

    .detailed-scores .score {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }

    .no-reviews {
        text-align: center;
        padding: var(--space-2xl);
        color: var(--color-text-muted);
    }

    /* Sidebar */
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
    }

    .sidebar .card {
        padding: var(--space-lg);
    }

    .sidebar h3 {
        margin-bottom: var(--space-md);
        font-size: 1rem;
    }

    /* Stats Card */
    .stats-card .stat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-sm) 0;
        border-bottom: 1px solid var(--color-border);
    }

    .stats-card .stat-row:last-child {
        border-bottom: none;
    }

    .stat-value {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .stat-value span {
        font-weight: 600;
        color: var(--color-text);
    }

    /* Author Card */
    .author-info {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        margin-bottom: var(--space-md);
    }

    .author-avatar {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-full);
        background: linear-gradient(
            135deg,
            var(--color-primary),
            var(--color-secondary)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.25rem;
        overflow: hidden;
    }

    .author-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .author-name {
        display: block;
        font-weight: 600;
    }

    .author-username {
        display: block;
        font-size: 0.875rem;
        color: var(--color-text-muted);
    }

    .author-bio {
        font-size: 0.875rem;
        margin-bottom: var(--space-md);
    }

    /* Info Card */
    .info-card .info-row {
        display: flex;
        justify-content: space-between;
        padding: var(--space-sm) 0;
        border-bottom: 1px solid var(--color-border);
        font-size: 0.875rem;
    }

    .info-card .info-row:last-child {
        border-bottom: none;
    }

    .info-card .info-row span:first-child {
        color: var(--color-text-muted);
    }

    @media (max-width: 640px) {
        main {
            padding: var(--space-lg) var(--space-sm);
        }
    }

    @media (max-width: 480px) {
        .project-links {
            flex-direction: column;
        }

        .project-links .btn {
            width: 100%;
        }
    }
</style>
