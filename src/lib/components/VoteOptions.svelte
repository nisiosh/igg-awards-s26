<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type { Option } from "$lib/types/OptionTypes.js";
    import { cubicOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    let selected = $state<number>();
    let {
        title,
        subtitle,
        options,
        assetPath,
        marginTop,
    }: {
        title: string;
        subtitle?: string;
        options: Option[];
        assetPath: string;
        marginTop?: string;
    } = $props();

    let videoOption: Option | undefined = $state();
    let videoOptionIndex = $state<number>();

    $effect(() => {
        if (videoOption !== undefined) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    });
</script>

{#if videoOption !== undefined}
    <div
        class="video-view"
        class:selected={selected == videoOptionIndex}
        transition:fade={{ duration: 100, easing: cubicOut }}
    >
        <div class="video-row">
            <div class="video-stack">
                <div class="video-frame">
                    <button 
                        class="nav-button nav-prev" 
                        aria-label="Previous"
                        onclick={() => {
                            if (videoOptionIndex !== undefined && options[videoOptionIndex - 1]) {
                                videoOptionIndex--;
                                videoOption = options[videoOptionIndex];
                            }
                        }}
                        class:disabled={videoOptionIndex === undefined || options[videoOptionIndex - 1] === undefined}
                    ><span>‹</span></button>

                    {#key videoOption.asset}
                        <video
                            preload="metadata"
                            width={1920}
                            height={1080}
                            controls
                            controlsList="nofullscreen"
                            autoplay
                        >
                            <source
                                src={`/nominee-assets/${assetPath}/${videoOption.asset}`}
                                type="video/mp4"
                            />
                        </video>
                    {/key}

                    <button 
                        class="nav-button nav-next" 
                        aria-label="Next"
                        class:disabled={videoOptionIndex === undefined || options[videoOptionIndex + 1] === undefined}
                        onclick={() => {
                            if (videoOptionIndex !== undefined && options[videoOptionIndex + 1]) {
                                videoOptionIndex++;
                                videoOption = options[videoOptionIndex];
                            }
                        }}
                    ><span>›</span></button>
                </div>

                <div class="video-data">
                    <div class="video-info">
                        <p class="video-view-name">{videoOption.name}</p>
                        <small class="video-view-creator"
                            >{videoOption.creator}</small
                        >
                    </div>
                    <button
                        class="vote-button"
                        style:display={selected == videoOptionIndex
                            ? "none"
                            : ""}
                        onclick={() => {
                            if (videoOption) selected = videoOptionIndex;
                        }}>Vote</button
                    >
                </div>
            </div>
        </div>
    </div>
    <div
        class="video-view-background"
        onclick={() => (videoOption = undefined)}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                videoOption = undefined;
                videoOptionIndex = undefined;
            }
        }}
        role="button"
        tabindex="0"
        aria-label="Close video"
    ></div>
{/if}

<div class="award-title-container">
    <h1 class="award-title poppins" style:margin-top={marginTop}>{title}</h1>
    {#if subtitle}
        <small class="award-subtitle">{subtitle}</small>
    {/if}
</div>

<div class="cards">
    {#each options as option, i}
        <Card
            asset={`/nominee-assets/${assetPath}/${option.asset}`}
            name={option.name}
            creator={option.creator}
            selected={selected === i}
            onclick={() => {
                if (option.asset.endsWith(".mp4")) {
                    videoOption = option;
                    videoOptionIndex = i;
                } else {
                    selected = i;
                }
            }}
        />
    {/each}
</div>

<style>
    .award-title {
        text-align: center;
        margin: 0;
    }

    .award-subtitle {
        text-align: center;
        width: 100%;
    }

    .award-title-container {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .cards > :global(*) {
        flex: 0 1 calc(50% - 0.5rem); /* 2 per row */
    }

    @media screen and (max-width: 500px) {
        .cards > :global(*) {
            flex-basis: 100%;
        }
    }

    .video-view {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;

        display: flex;
        flex-direction: column;
        align-items: center;

        --nav-size: 3rem;
        --nav-gap: 0.5rem;
    }

    .video-view video {
        display: block;
        width: auto;
        height: auto;
        max-width: min(90vw - 2 * (var(--nav-size) + var(--nav-gap)), 1280px);
        max-height: 85vh;
        border: 1px solid var(--primary);
        box-shadow: rgba(255, 255, 255, 10%) 0px 0px 15px 2px;
        outline: none;
        transition: all 50ms linear;
    }
    
    .video-view.selected video {
        border: 1px solid var(--selected-option-color);
        box-shadow: var(--selected-option-color-glow) 0px 0px 15px 4px;
        outline: 5px solid var(--selected-option-color);
    }

    .video-stack {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .video-frame {
        position: relative;
        flex: 0 0 auto;
        display: flex;
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: var(--nav-size);
        height: var(--nav-size);
        z-index: 1;
        background-color: rgba(46, 46, 46, 0.9);
        font-size: 3rem;
        color: var(--primary);
    }

    .nav-button.disabled {
        pointer-events: none;
        opacity: 0;
    }

    .nav-button span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -55%);
    }

    .nav-button:hover {
        box-shadow: none;
    }

    .nav-prev {
        right: 100%;
        margin-right: var(--nav-gap);
    }

    .nav-next {
        left: 100%;
        margin-left: var(--nav-gap);
    }

    .video-data {
        margin-top: 0.5rem;
    }

    .video-view-name {
        font-size: 1.8rem;
        font-weight: 600;
        margin: 0;
    }

    .video-view.selected .video-view-name {
        color: var(--selected-option-text-color);
    }

    .video-view-creator {
        font-size: 1rem;
        margin: 0;
    }

    .video-view.selected .video-view-creator {
        color: var(--selected-option-text-secondary-color);
    }

    .video-view-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.9);
        overflow: hidden;
        z-index: 2;
    }

    .video-data {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0.1rem;
        gap: 2rem;
    }

    .video-data .vote-button {
        width: max(15rem, 10%);
        height: 3rem;
    }

    @media screen and (max-width: 500px) {
        .video-data {
            flex-direction: column;
            justify-content: start;
            align-items: start;
            grid-area: 1rem;
        }
    }
</style>
