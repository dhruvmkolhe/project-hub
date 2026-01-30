<script lang="ts">
    import { enhance } from "$app/forms";
    import Navbar from "$lib/components/Navbar.svelte";

    let { data, form } = $props();

    let isSubmitting = $state(false);
    let techInput = $state("");
    // Use form prop as initial value, but be aware of reactivity rules
    let techStack = $state<string[]>(form?.techStack || []);

    const categories = [
        { value: "web-app", label: "Web App" },
        { value: "mobile-app", label: "Mobile App" },
        { value: "api", label: "API" },
        { value: "cli-tool", label: "CLI Tool" },
        { value: "game", label: "Game" },
        { value: "ai-ml", label: "AI/ML" },
        { value: "blockchain", label: "Blockchain" },
        { value: "other", label: "Other" },
    ];

    const popularTech = [
        "React",
        "Vue",
        "Svelte",
        "Angular",
        "Next.js",
        "Nuxt",
        "SvelteKit",
        "Node.js",
        "Express",
        "Python",
        "Django",
        "Flask",
        "FastAPI",
        "TypeScript",
        "JavaScript",
        "Go",
        "Rust",
        "Java",
        "Kotlin",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "MySQL",
        "Firebase",
        "Docker",
        "Kubernetes",
        "AWS",
        "Vercel",
        "Netlify",
        "TailwindCSS",
        "Sass",
        "Bootstrap",
        "Material UI",
    ];

    function addTech(tech: string) {
        if (tech && !techStack.includes(tech)) {
            techStack = [...techStack, tech];
            techInput = "";
        }
    }

    function removeTech(tech: string) {
        techStack = techStack.filter((t) => t !== tech);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTech(techInput.trim());
        }
    }
</script>

<div class="submit-page">
    <Navbar user={data.user} />

    <main class="container">
        <div class="submit-container">
            <header class="page-header">
                <h1>Submit Your Project</h1>
                <p>
                    Share your work with the community and get valuable feedback
                </p>
            </header>

            {#if form?.error}
                <div class="alert alert-error">
                    {form.error}
                </div>
            {/if}

            <form
                method="POST"
                class="submit-form card"
                enctype="multipart/form-data"
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        isSubmitting = false;
                        await update();
                    };
                }}
            >
                <div class="form-section">
                    <h2>Basic Information</h2>

                    <div class="form-group">
                        <label for="title" class="form-label"
                            >Project Title *</label
                        >
                        <input
                            type="text"
                            id="title"
                            name="title"
                            class="form-input"
                            placeholder="My Awesome Project"
                            value={form?.title ?? ""}
                            required
                        />
                        {#if form?.errors?.title}
                            <span class="form-error">{form.errors.title}</span>
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="shortDescription" class="form-label"
                            >Short Description</label
                        >
                        <input
                            type="text"
                            id="shortDescription"
                            name="shortDescription"
                            class="form-input"
                            placeholder="A brief one-liner about your project"
                            value={form?.shortDescription ?? ""}
                            maxlength="200"
                        />
                        <span class="form-hint"
                            >Max 200 characters. Displayed in project cards.</span
                        >
                    </div>

                    <div class="form-group">
                        <label for="description" class="form-label"
                            >Full Description *</label
                        >
                        <textarea
                            id="description"
                            name="description"
                            class="form-input"
                            rows="6"
                            placeholder="Tell us about your project. What problem does it solve? How did you build it? What did you learn?"
                            required>{form?.description ?? ""}</textarea
                        >
                        {#if form?.errors?.description}
                            <span class="form-error"
                                >{form.errors.description}</span
                            >
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="category" class="form-label"
                            >Category *</label
                        >
                        <select
                            id="category"
                            name="category"
                            class="form-input"
                            required
                        >
                            <option value="">Select a category</option>
                            {#each categories as cat}
                                <option
                                    value={cat.value}
                                    selected={form?.category === cat.value}
                                >
                                    {cat.label}
                                </option>
                            {/each}
                        </select>
                        {#if form?.errors?.category}
                            <span class="form-error"
                                >{form.errors.category}</span
                            >
                        {/if}
                    </div>
                </div>

                <div class="form-section">
                    <h2>Links & Media</h2>

                    <div class="form-group">
                        <label for="githubUrl" class="form-label">
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
                            GitHub Repository
                        </label>
                        <input
                            type="url"
                            id="githubUrl"
                            name="githubUrl"
                            class="form-input"
                            placeholder="https://github.com/username/repo"
                            value={form?.githubUrl ?? ""}
                        />
                        {#if form?.errors?.githubUrl}
                            <span class="form-error"
                                >{form.errors.githubUrl}</span
                            >
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="liveUrl" class="form-label">
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
                            Live Demo URL
                        </label>
                        <input
                            type="url"
                            id="liveUrl"
                            name="liveUrl"
                            class="form-input"
                            placeholder="https://myproject.vercel.app"
                            value={form?.liveUrl ?? ""}
                        />
                        <span class="form-hint"
                            >Vercel, Netlify, or any hosted URL</span
                        >
                        {#if form?.errors?.liveUrl}
                            <span class="form-error">{form.errors.liveUrl}</span
                            >
                        {/if}
                    </div>

                    <div class="form-group form-group-thumbnail">
                        <label for="thumbnail" class="form-label">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            Key Visual / Thumbnail (Optional)
                        </label>

                        <div class="file-area">
                            <input
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                accept="image/png, image/jpeg, image/webp"
                                class="file-input"
                                onchange={(e) => {
                                    const file = e.currentTarget.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            const img =
                                                document.getElementById(
                                                    "preview-img",
                                                );
                                            img.src = ev.target.result;
                                            document.getElementById(
                                                "preview-container",
                                            ).style.display = "block";
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <div class="file-custom-btn">
                                <span>Choose Image</span>
                            </div>
                        </div>
                        <div
                            id="preview-container"
                            style="display: none; margin-top: 15px;"
                        >
                            <img
                                id="preview-img"
                                src=""
                                alt="Thumbnail Preview"
                                style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid var(--color-border);"
                            />
                        </div>
                        <span class="form-hint"
                            >Max 5MB. Formats: JPG, PNG, WebP.</span
                        >
                    </div>
                </div>

                <div class="form-section">
                    <h2>Tech Stack</h2>

                    <div class="form-group">
                        <label for="techInput" class="form-label"
                            >Technologies Used *</label
                        >
                        <div class="tech-input-wrapper">
                            <input
                                type="text"
                                id="techInput"
                                class="form-input"
                                placeholder="Type and press Enter to add"
                                bind:value={techInput}
                                onkeydown={handleKeyDown}
                            />
                            <button
                                type="button"
                                class="btn btn-secondary"
                                onclick={() => addTech(techInput.trim())}
                            >
                                Add
                            </button>
                        </div>
                        <input
                            type="hidden"
                            name="techStack"
                            value={techStack.join(",")}
                        />

                        {#if techStack.length > 0}
                            <div class="selected-tech">
                                {#each techStack as tech}
                                    <span class="tech-tag">
                                        {tech}
                                        <button
                                            type="button"
                                            onclick={() => removeTech(tech)}
                                            >×</button
                                        >
                                    </span>
                                {/each}
                            </div>
                        {/if}

                        <div class="popular-tech">
                            <span class="label">Popular:</span>
                            {#each popularTech.slice(0, 10) as tech}
                                <button
                                    type="button"
                                    class="quick-add"
                                    class:selected={techStack.includes(tech)}
                                    onclick={() =>
                                        techStack.includes(tech)
                                            ? removeTech(tech)
                                            : addTech(tech)}
                                >
                                    {tech}
                                </button>
                            {/each}
                        </div>

                        {#if form?.errors?.techStack}
                            <span class="form-error"
                                >{form.errors.techStack}</span
                            >
                        {/if}
                    </div>
                </div>

                <div class="form-actions">
                    <a href="/projects" class="btn btn-secondary">Cancel</a>
                    <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        disabled={isSubmitting || techStack.length === 0}
                    >
                        {#if isSubmitting}
                            <span class="spinner"></span>
                            Submitting...
                        {:else}
                            Submit Project
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </main>
</div>

<style>
    .submit-page {
        min-height: 100vh;
        background: var(--color-bg);
    }

    main {
        padding: var(--space-2xl) var(--space-lg);
    }

    .submit-container {
        max-width: 720px;
        margin: 0 auto;
    }

    .page-header {
        text-align: center;
        margin-bottom: var(--space-2xl);
    }

    .page-header p {
        color: var(--color-text-muted);
    }

    .alert {
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-lg);
    }

    .alert-error {
        background: rgb(239 68 68 / 0.1);
        color: var(--color-error);
        border: 1px solid rgb(239 68 68 / 0.2);
    }

    .submit-form {
        padding: var(--space-xl);
    }

    .form-section {
        padding-bottom: var(--space-xl);
        margin-bottom: var(--space-xl);
        border-bottom: 1px solid var(--color-border);
    }

    .form-section:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .form-section h2 {
        font-size: 1.1rem;
        margin-bottom: var(--space-lg);
        color: var(--color-text);
    }

    .form-group {
        margin-bottom: var(--space-lg);
    }

    .form-group:last-child {
        margin-bottom: 0;
    }

    .form-label {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .form-hint {
        display: block;
        margin-top: var(--space-xs);
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    /* Tech Input */
    .tech-input-wrapper {
        display: flex;
        gap: var(--space-sm);
    }

    .tech-input-wrapper .form-input {
        flex: 1;
    }

    .selected-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-sm);
        margin-top: var(--space-md);
    }

    .tech-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-md);
        background: var(--color-primary);
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: var(--radius-full);
    }

    .tech-tag button {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.1rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity var(--transition-fast);
    }

    .tech-tag button:hover {
        opacity: 1;
    }

    .popular-tech {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-sm);
        margin-top: var(--space-md);
    }

    .popular-tech .label {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .quick-add {
        padding: 2px 10px;
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .quick-add:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .quick-add.selected {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-md);
        padding-top: var(--space-xl);
        border-top: 1px solid var(--color-border);
        margin-top: var(--space-xl);
    }

    .spinner {
        width: 18px;
        height: 18px;
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

    /* File Input Styling */
    .file-area {
        position: relative;
        overflow: hidden;
        display: inline-block;
    }

    .file-input {
        /* opacity: 0; */
        /* position: absolute; */
        /* top: 0; left: 0; */
        /* width: 100%; height: 100%; */
        /* cursor: pointer; */
        /* z-index: 2; */
        display: block;
        margin-bottom: 0.5rem;
        border: 1px solid var(--color-border);
        padding: 0.5rem;
        border-radius: 6px;
        background: var(--color-bg-secondary);
        color: var(--text-primary);
    }
</style>
