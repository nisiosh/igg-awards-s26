<script lang="ts">
    import { ArmorType, SkinViewer } from "$lib/packages/skinview3d/skinview3d.js";
    import generateTrim from "$lib/packages/skinview3d/utils/generateTrim.js";
    import { onMount } from "svelte";

    let { asset, assetType="image", name, creator, selected, onclick }: { 
        asset: string,
        assetType: "image" | "trim",
        name: string,
        creator?: string,
        selected: boolean,
        onclick?: () => {}
    } = $props();

    let canvas: HTMLCanvasElement | undefined = $state();
    let viewer: SkinViewer;

    onMount(() => {
        if (!canvas) return;
        const parent = canvas.parentElement!;
        viewer = new SkinViewer({
            canvas,
            width: parent.clientWidth,
            height: parent.clientHeight,
            skin: "/trims/skins/steve.png",
        });
        (async () => {
            let trimMain = await generateTrim("netherite", {
                armor: "helmet", trim: "bolt", material: "amethyst"
            });
            let trimLeggings = await generateTrim("netherite", {
                armor: "leggings", trim: "bolt", material: "amethyst"
            });
            const netheriteArmor = new ArmorType(trimMain, trimLeggings);
            viewer.loadArmor(netheriteArmor);
        })();

        const resizeObserver = new ResizeObserver(() => {
            viewer.width = parent.clientWidth;
            viewer.height = parent.clientHeight;
        });
        resizeObserver.observe(parent);

        return () => { resizeObserver.disconnect(); viewer?.dispose(); };
    });
</script>

<div class="card" class:selected={selected} data-asset-type={assetType}>
    <button class="option-button" title={`Vote ${name}`} onclick={onclick}>
        {#if assetType == "image"}
            <img src={asset} alt={asset} class="option-asset" />
        {:else if assetType == "trim"}
            <canvas bind:this={canvas}></canvas>
        {/if}
    </button>
    <p class="option-name">{name}</p>
    {#if creator !== undefined}
        <p class="creator">{creator}</p>
    {/if}
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
    }

    .option-button {
        border: 1px solid white;
        background-color: transparent;
        box-shadow: rgba(255, 255, 255, 10%) 0px 0px 15px 2px;
        color: var(--primary);
        text-align: start;
        cursor: pointer;
        transition: all 50ms linear;

        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: minmax(0, 1fr);
        overflow: hidden;
        gap: 0.2em;
        padding: 0;
    }
    .card.selected .option-button {
        border: 1px solid var(--selected-option-color);
        box-shadow: var(--selected-option-color-glow) 0px 0px 15px 4px;
        outline: 3px solid var(--selected-option-color);
    }
    .card:not(.selected):hover .option-button {
        box-shadow: rgba(255, 255, 255, 25%) 0px 0px 20px 4px;
    }

    .option-asset {
        height: 100%;
        width: 100%;
        min-height: 0;
        object-fit: cover;
    }

    .option-button canvas {
        height: 30rem;
        width: 100%;
        min-height: 0;
    }

    .option-name {
        margin: 0;
        margin-top: 0.5rem;
    }

    .creator {
        margin: 0;
        margin-top: 0.1rem;
        font-size: 0.8rem;
        color: var(--secondary);
    }

</style>