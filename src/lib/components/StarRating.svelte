<script lang="ts">
    interface Props {
        rating: number;
        maxRating?: number;
        size?: "sm" | "md" | "lg";
        interactive?: boolean;
        onChange?: (rating: number) => void;
    }

    let {
        rating,
        maxRating = 5,
        size = "md",
        interactive = false,
        onChange,
    }: Props = $props();

    let hoveredRating = $state(0);

    function handleClick(value: number) {
        if (interactive && onChange) {
            onChange(value);
        }
    }
</script>

<div class="stars stars-{size}">
    {#each Array(maxRating) as _, i}
        {@const value = i + 1}
        {@const isFilled = hoveredRating
            ? value <= hoveredRating
            : value <= rating}
        <button
            type="button"
            class="star"
            class:filled={isFilled}
            class:interactive
            onmouseenter={() => interactive && (hoveredRating = value)}
            onmouseleave={() => (hoveredRating = 0)}
            onclick={() => handleClick(value)}
            disabled={!interactive}
            aria-label="Rate {value} stars"
        >
            <svg
                viewBox="0 0 24 24"
                fill={isFilled ? "currentColor" : "none"}
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
            </svg>
        </button>
    {/each}
</div>

<style>
    .stars {
        display: inline-flex;
        gap: 2px;
    }

    .star {
        background: none;
        border: none;
        padding: 0;
        color: var(--color-border);
        cursor: default;
        transition:
            color var(--transition-fast),
            transform var(--transition-fast);
    }

    .star.filled {
        color: var(--color-accent);
    }

    .star.interactive {
        cursor: pointer;
    }

    .star.interactive:hover {
        transform: scale(1.15);
    }

    .stars-sm .star svg {
        width: 14px;
        height: 14px;
    }

    .stars-md .star svg {
        width: 20px;
        height: 20px;
    }

    .stars-lg .star svg {
        width: 28px;
        height: 28px;
    }
</style>
