<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import HomeScene from "$lib/components/visuals/HomeScene.svelte";

    let { data } = $props();
</script>

<div class="home-page">
    <!-- Warm gradient background -->
    <div class="hero-bg">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
    </div>

    <Navbar user={data.user} />

    <!-- HERO SECTION -->
    <section class="hero-content container">
        <div class="hero-left">
            <div class="welcome-badge">
                <svg class="badge-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--amber); margin-right: 4px; display: inline-block; vertical-align: middle;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Welcome to ProjectHub</span>
            </div>
            <h1 class="hero-title">
                Build Together,<br />
                <span class="text-gradient">Grow Together</span>
            </h1>
            <p class="hero-subtitle">
                A warm community where developers help each other craft better
                code. Share your projects, get thoughtful feedback, and learn
                from peers who genuinely care.
            </p>
            <div class="hero-actions">
                <a href="/auth/register" class="btn btn-primary btn-lg">
                    <span>Join Our Community</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg
                    >
                </a>
                <a href="/projects" class="btn btn-secondary btn-lg">
                    <span>Explore Projects</span>
                </a>
            </div>
            <div class="hero-stats">
                <div class="stat-item">
                    <span class="active-pulse"></span>
                    <span class="stat-text"
                        ><strong>24</strong> developers online</span
                    >
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-text"
                        ><strong>1.2k+</strong> reviews this week</span
                    >
                </div>
            </div>
        </div>

        <div class="hero-visual">
            <div class="scene-container">
                <HomeScene />
                <div class="scene-caption">
                    <svg class="caption-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--amber); margin-right: 6px; display: inline-block; vertical-align: middle;">
                        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                    </svg>
                    <span>Your friendly coding companion</span>
                </div>
            </div>
        </div>
    </section>

    <!-- VALUE PROPS -->
    <section class="section-values container">
        <div class="values-grid">
            <div class="value-card">
                <div
                    class="value-icon"
                    style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);"
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                </div>
                <h3>Supportive Community</h3>
                <p>
                    No harsh critics here. Get constructive feedback from
                    developers who remember what it's like to learn.
                </p>
            </div>
            <div class="value-card">
                <div
                    class="value-icon"
                    style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);"
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>
                <h3>Real-Time Collaboration</h3>
                <p>
                    Connect with peers instantly. Discuss code, share insights,
                    and solve problems together.
                </p>
            </div>
            <div class="value-card">
                <div
                    class="value-icon"
                    style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <h3>Grow Your Skills</h3>
                <p>
                    Learn by reviewing others' code. Every review makes you a
                    better developer.
                </p>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section-works container">
        <div class="section-header">
            <h2 class="section-title">How It Works</h2>
            <p class="section-subtitle">Getting started is easy and fun!</p>
        </div>
        <div class="steps-grid">
            <div class="step-card">
                <div class="step-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M9 11l3 3L22 4" />
                        <path
                            d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                        />
                    </svg>
                </div>
                <div class="step-number">Step 1</div>
                <h3>Share Your Project</h3>
                <p>
                    Link your GitHub repo or upload your code. Tell us what
                    you're working on and what feedback you need.
                </p>
            </div>
            <div class="step-card">
                <div class="step-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <div class="step-number">Step 2</div>
                <h3>Help Others</h3>
                <p>
                    Review projects from fellow developers. Share your knowledge
                    and learn from different coding styles.
                </p>
            </div>
            <div class="step-card">
                <div class="step-icon">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        />
                    </svg>
                </div>
                <div class="step-number">Step 3</div>
                <h3>Get Feedback</h3>
                <p>
                    Receive thoughtful, actionable reviews. Improve your code
                    and build confidence in your skills.
                </p>
            </div>
        </div>
    </section>

    <!-- COMMUNITY VOICES -->
    <section class="section-voices container">
        <div class="section-header">
            <h2 class="section-title">What Developers Say</h2>
            <p class="section-subtitle">Real stories from our community</p>
        </div>
        <div class="voice-grid">
            <div class="voice-card">
                <div class="quote-mark">"</div>
                <p class="voice-text">
                    I was stuck on a React performance issue for days. Someone
                    here spotted it in minutes and explained it so clearly. This
                    community is amazing!
                </p>
                <div class="voice-author">
                    <div class="author-avatar">
                        <span>A</span>
                    </div>
                    <div class="author-info">
                        <span class="author-name">Alex Chen</span>
                        <span class="author-role">Frontend Developer</span>
                    </div>
                </div>
            </div>
            <div class="voice-card">
                <div class="quote-mark">"</div>
                <p class="voice-text">
                    Reviewing code here has taught me more than any tutorial.
                    You see real-world problems and solutions. Plus, everyone is
                    so supportive!
                </p>
                <div class="voice-author">
                    <div class="author-avatar">
                        <span>M</span>
                    </div>
                    <div class="author-info">
                        <span class="author-name">Maria Santos</span>
                        <span class="author-role">Full-Stack Engineer</span>
                    </div>
                </div>
            </div>
            <div class="voice-card">
                <div class="quote-mark">"</div>
                <p class="voice-text">
                    As a junior dev, I was nervous to share my code. But the
                    feedback I got was so kind and helpful. I've grown so much
                    in just a few months!
                </p>
                <div class="voice-author">
                    <div class="author-avatar">
                        <span>J</span>
                    </div>
                    <div class="author-info">
                        <span class="author-name">Jordan Lee</span>
                        <span class="author-role">Junior Developer</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section class="footer-cta container">
        <div class="cta-content">
            <div class="cta-icon-wrapper" style="margin-bottom: var(--space-md); display: inline-flex; padding: var(--space-sm); background: var(--color-surface-hover); border-radius: var(--radius-md); border: 1px solid var(--color-border); justify-content: center; align-items: center; align-self: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--amber); filter: drop-shadow(0 0 8px var(--amber-glow));">
                    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                </svg>
            </div>
            <h2>Ready to Join Us?</h2>
            <p class="cta-text">
                Become part of a community that believes in growing together.
                Your next breakthrough is just one review away.
            </p>
            <div class="cta-group">
                <a href="/auth/register" class="btn btn-primary btn-xl">
                    <span>Start Your Journey</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
                <a href="/projects" class="btn btn-secondary btn-xl">
                    <span>Browse Projects</span>
                </a>
            </div>
            <p class="cta-note">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Free forever • No credit card required
            </p>
        </div>
    </section>
</div>

<style>
    /* Use design-system tokens — no local overrides needed */

    .home-page {
        position: relative;
        overflow-x: hidden;
        min-height: 100vh;
        --accent-warm: #ff6b6b;
        --glow-warm: rgba(255, 107, 107, 0.15);
        --accent-green: #34d399;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    /* GRADIENT BACKGROUND — absolute so it doesn't bleed onto other pages */
    .hero-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--color-bg);
        pointer-events: none;
        overflow: hidden;
    }

    :global([data-theme="dark"]) .hero-bg {
        background: radial-gradient(
            ellipse at top,
            #1a1a2e 0%,
            #0a0a0f 50%,
            #000000 100%
        );
    }

    :global([data-theme="light"]) .hero-bg {
        background: radial-gradient(
            ellipse at top,
            #f0f4ff 0%,
            #faf9f7 50%,
            #ffffff 100%
        );
    }

    .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.2;
        animation: float-slow 20s ease-in-out infinite;
    }

    .orb-1 {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, #ff6b6b, transparent 70%);
        top: -10%;
        left: -10%;
        animation-delay: 0s;
    }

    .orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #34d399, transparent 70%);
        bottom: -10%;
        right: -5%;
        animation-delay: 7s;
    }

    .orb-3 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #a78bfa, transparent 70%);
        top: 40%;
        right: 10%;
        animation-delay: 14s;
    }

    @keyframes float-slow {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -30px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
    }

    /* HERO */
    .hero-content {
        display: flex;
        align-items: center;
        padding-top: 8rem;
        padding-bottom: 6rem;
        min-height: 85vh;
        gap: 4rem;
        position: relative;
        z-index: 1;
    }

    .hero-left {
        flex: 1;
        max-width: 600px;
    }

    .welcome-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-surface);
        padding: 0.5rem 1.25rem;
        border-radius: 100px;
        box-shadow: var(--shadow-md);
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text);
        animation: bounce-in 0.6s ease-out;
        border: 1px solid var(--color-border);
    }

    .wave-emoji {
        font-size: 1.25rem;
        display: inline-block;
        animation: wave 2.5s ease-in-out infinite;
    }

    @keyframes wave {
        0%,
        100% {
            transform: rotate(0deg);
        }
        10%,
        30% {
            transform: rotate(14deg);
        }
        20%,
        40% {
            transform: rotate(-8deg);
        }
        50% {
            transform: rotate(0deg);
        }
    }

    @keyframes bounce-in {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-title {
        font-size: 4rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        letter-spacing: -0.02em;
        color: var(--color-text);
    }

    .text-gradient {
        background: linear-gradient(
            135deg,
            #ff6b6b 0%,
            #ff8e53 50%,
            #ffa726 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.3));
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
        margin-bottom: 2.5rem;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .hero-stats {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1.25rem;
        background: var(--color-surface);
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        width: fit-content;
        border: 1px solid var(--color-border);
        flex-wrap: wrap;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--color-text-secondary);
    }

    .stat-text strong {
        color: var(--color-text);
        font-weight: 700;
    }

    .stat-divider {
        width: 1px;
        height: 24px;
        background: var(--color-border);
    }

    .active-pulse {
        width: 10px;
        height: 10px;
        background: var(--accent-green);
        border-radius: 50%;
        position: relative;
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
        }
        50% {
            box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
        }
    }

    /* HERO VISUAL */
    .hero-visual {
        flex: 1;
        display: flex;
        justify-content: center;
        position: relative;
    }

    .scene-container {
        width: 100%;
        max-width: 500px;
        height: 500px;
        background: var(--color-surface);
        border-radius: 32px;
        box-shadow: var(--shadow-xl);
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
        border: 1px solid var(--color-border);
    }

    .scene-caption {
        position: absolute;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-surface-elevated);
        backdrop-filter: blur(10px);
        padding: 0.5rem 1.25rem;
        border-radius: 100px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-text);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--color-border);
        white-space: nowrap;
    }

    .caption-emoji {
        font-size: 1.1rem;
    }

    /* VALUE PROPS */
    .section-values {
        padding: 6rem 0;
        position: relative;
        z-index: 1;
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    .value-card {
        background: var(--color-surface);
        padding: 2.5rem;
        border-radius: 24px;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;
        text-align: center;
        border: 1px solid var(--color-border);
    }

    .value-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
        border-color: var(--ember);
    }

    .value-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: white;
        position: relative;
    }

    .value-icon::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: 20px;
        padding: 2px;
        background: inherit;
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.5;
    }

    .value-card h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .value-card p {
        color: var(--color-text-secondary);
        line-height: 1.6;
        font-size: 1rem;
    }

    .section-works {
        padding: 6rem 0;
        background: var(--color-surface);
        border-radius: 48px;
        margin: 0 auto;
        width: calc(100% - 3rem);
        max-width: 1200px;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        position: relative;
        z-index: 1;
    }

    .section-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .section-title {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .section-subtitle {
        font-size: 1.25rem;
        color: var(--color-text-secondary);
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2.5rem;
        margin-top: 3rem;
        padding: 0 2rem;
    }

    .step-card {
        text-align: center;
        position: relative;
    }

    .step-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: var(--accent-warm);
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 107, 107, 0.2);
        box-shadow: 0 0 20px var(--glow-warm);
    }

    .step-card:hover .step-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow:
            0 8px 24px rgba(255, 107, 107, 0.3),
            0 0 30px var(--glow-warm);
        border-color: rgba(255, 107, 107, 0.4);
    }

    .step-number {
        display: inline-block;
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        color: white;
        padding: 0.25rem 1rem;
        border-radius: 100px;
        font-size: 0.85rem;
        font-weight: 700;
        margin-bottom: 1rem;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }

    .step-card h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .step-card p {
        color: var(--color-text-secondary);
        line-height: 1.6;
    }

    /* COMMUNITY VOICES */
    .section-voices {
        padding: 6rem 0;
        position: relative;
        z-index: 1;
    }

    .voice-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    .voice-card {
        background: var(--color-surface);
        padding: 2rem;
        border-radius: 24px;
        box-shadow: var(--shadow-md);
        position: relative;
        transition: all 0.3s ease;
        border: 1px solid var(--color-border);
    }

    .voice-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
        border-color: var(--ember);
    }

    .quote-mark {
        font-size: 4rem;
        font-weight: 900;
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        margin-bottom: -1rem;
        font-family: Georgia, serif;
        opacity: 0.6;
    }

    .voice-text {
        font-size: 1rem;
        color: var(--color-text);
        line-height: 1.7;
        margin-bottom: 1.5rem;
    }

    .voice-author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .author-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }

    .author-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .author-name {
        font-weight: 700;
        color: var(--color-text);
        font-size: 0.95rem;
    }

    .author-role {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
    }

    /* FINAL CTA */
    .footer-cta {
        padding: 8rem 0;
        position: relative;
        z-index: 1;
    }

    .cta-content {
        text-align: center;
        background: linear-gradient(
            135deg,
            #ff6b6b 0%,
            #ff8e53 50%,
            #ffa726 100%
        );
        padding: 5rem 3rem;
        border-radius: 48px;
        color: white;
        box-shadow:
            0 20px 60px rgba(255, 107, 107, 0.4),
            0 0 80px rgba(255, 107, 107, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cta-emoji {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        animation: float-gentle 3s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    @keyframes float-gentle {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .cta-content h2 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
    }

    .cta-text {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0.95;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .cta-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .cta-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    /* BUTTONS */
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
        font-size: 1rem;
    }

    .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border-radius: 14px;
    }

    .btn-xl {
        padding: 1.25rem 3rem;
        font-size: 1.15rem;
        border-radius: 16px;
    }

    .btn-primary {
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        color: white;
        box-shadow:
            0 4px 16px rgba(255, 107, 107, 0.4),
            0 0 20px rgba(255, 107, 107, 0.2);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow:
            0 8px 24px rgba(255, 107, 107, 0.5),
            0 0 30px rgba(255, 107, 107, 0.3);
    }

    .btn-secondary {
        background: var(--color-surface);
        color: var(--color-text);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--graphite);
        background: var(--color-surface-hover);
    }

    .cta-content .btn-secondary {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .cta-content .btn-primary {
        background: white;
        color: var(--accent-warm);
        box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
    }

    .cta-content .btn-primary:hover {
        box-shadow: 0 8px 24px rgba(255, 255, 255, 0.4);
    }

    .cta-content .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
    }

    /* RESPONSIVE */
    /* Large tablet / small desktop */
    @media (max-width: 1100px) {
        .hero-content {
            gap: 2.5rem;
        }
        .scene-container {
            max-width: 420px;
            height: 420px;
        }
    }

    /* Tablet */
    @media (max-width: 960px) {
        .hero-content {
            flex-direction: column;
            text-align: center;
            padding-top: 5rem;
            padding-bottom: 4rem;
            min-height: unset;
            gap: 3rem;
        }

        .hero-left {
            max-width: 100%;
        }

        .hero-title {
            font-size: 2.75rem;
        }

        .hero-actions {
            justify-content: center;
        }

        .hero-stats {
            margin: 0 auto;
        }

        .scene-container {
            max-width: 380px;
            height: 380px;
        }

        /* 2-col on tablet before going 1-col on mobile */
        .values-grid,
        .voice-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .steps-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .section-works {
            margin: 0;
            border-radius: 0;
        }

        .section-values,
        .section-voices {
            padding: 4rem 0;
        }

        .section-works {
            padding: 4rem 0;
        }

        .footer-cta {
            padding: 5rem 0;
        }

        .section-title {
            font-size: 2.25rem;
        }
    }

    /* Mobile */
    @media (max-width: 640px) {
        .hero-title {
            font-size: 2.25rem;
        }

        .hero-subtitle {
            font-size: 1.1rem;
        }

        .scene-container {
            max-width: 100%;
            height: 300px;
        }

        .values-grid,
        .steps-grid,
        .voice-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }

        .section-values,
        .section-voices {
            padding: 3rem 0;
        }

        .section-works {
            padding: 3rem 0;
        }

        .footer-cta {
            padding: 3rem 0;
        }
    }

    /* Small mobile */
    @media (max-width: 480px) {
        .hero-content {
            padding-top: 4rem;
            padding-bottom: 2.5rem;
        }

        .hero-title {
            font-size: 1.9rem;
        }

        .section-title {
            font-size: 1.75rem;
        }

        .hero-actions {
            flex-direction: column;
            align-items: center;
        }

        .hero-actions .btn {
            width: 100%;
            max-width: 280px;
        }

        .cta-group {
            flex-direction: column;
            align-items: center;
        }

        .cta-group .btn {
            width: 100%;
            max-width: 280px;
        }

        .cta-content {
            padding: 3rem 1.25rem;
            border-radius: 24px;
        }

        .cta-content h2 {
            font-size: 1.75rem;
        }

        .cta-text {
            font-size: 1rem;
        }

        .hero-stats {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
        }

        .welcome-badge {
            font-size: 0.85rem;
            padding: 0.4rem 1rem;
        }
    }
</style>
