<script lang="ts">
    import {
        ArmorType,
        SkinViewer,
    } from "$lib/packages/skinview3d/skinview3d.js";
    import generateTrim from "$lib/packages/skinview3d/utils/generateTrim.js";
    import type { ArmorTrim } from "$lib/packages/skinview3d/utils/types.js";
    import type { TrimData } from "$lib/types/OptionTypes.js";

    let {
        asset,
        name,
        creator,
        selected,
        onclick,
    }: {
        asset: string;
        name: string;
        creator?: string;
        selected: boolean;
        onclick?: () => void;
    } = $props();
    let assetType: "image" | "trim" | "video" | undefined = $state();
    $effect(() => {
        if (asset.endsWith(".trim.json")) {
            assetType = "trim";
        } else if (asset.endsWith(".mp4")) {
            assetType = "video";
        } else {
            assetType = "image";
        }
    });

    const VIEWER_GUTTER_SIZE = 25;
    let canvas: HTMLCanvasElement | undefined = $state();
    let viewer: SkinViewer | undefined;

    $effect(() => {
        if (!canvas || assetType !== "trim") return;

        const parent = canvas.parentElement!;
        let disposed = false;

        (async () => {
            const trimData: TrimData = await fetch(asset).then((response) => response.json());
            if (disposed) return;

            viewer = new SkinViewer({
                canvas,
                width: parent.clientWidth - (VIEWER_GUTTER_SIZE * 2),
                height: parent.clientHeight,
                skin: trimData.skin ? `/trims/skins/${trimData.skin}.png` : "/trims/skins/steve.png",
            });
            viewer.controls.enableZoom = false;

            if (!trimData.armor_material) return;

            let trimMain: HTMLCanvasElement | string;
            let trimLeggings: HTMLCanvasElement | string;

            const mainPieces: ArmorTrim[] = [];
            if (trimData.helmet) mainPieces.push({ ...trimData.helmet, armor: "helmet" });
            if (trimData.chestplate) mainPieces.push({ ...trimData.chestplate, armor: "chestplate" });
            if (trimData.boots) mainPieces.push({ ...trimData.boots, armor: "boots" });

            trimMain = mainPieces.length
                ? await generateTrim(trimData.armor_material, mainPieces)
                : `/trims/armor/${trimData.armor_material}_layer_1.png`;

            trimLeggings = trimData.leggings
                ? await generateTrim(trimData.armor_material, [{ ...trimData.leggings, armor: "leggings" }])
                : `/trims/armor/${trimData.armor_material}_layer_2.png`;

            const armor = new ArmorType(trimMain, trimLeggings);
            viewer.loadArmor(armor);
        })();

        const resizeObserver = new ResizeObserver(() => {
            if (!viewer) return;
            viewer.width = parent.clientWidth - (VIEWER_GUTTER_SIZE * 2);
            viewer.height = parent.clientHeight;
        });
        resizeObserver.observe(parent);

        return () => {
            disposed = true;
            resizeObserver.disconnect();
            viewer?.dispose();
            viewer = undefined;
        };
    });

    interface Pos2D { x: number, y: number }
    const SELECT_THRESHOLD = 10;
    let lastPos: Pos2D | undefined;
    let moveAmount = 0;

    function trimCanvasMouseDown(event: MouseEvent) {
        lastPos = { x: event.clientX, y: event.clientY };
        moveAmount = 0;
    }

    function trimCanvasMouseUp() {
        if (!onclick || lastPos === undefined) return;
        if (moveAmount < SELECT_THRESHOLD) onclick();
        lastPos = undefined;
    }

    function trimCanvasMouseLeave() {
        lastPos = undefined;
    }

    function mouseMove(event: MouseEvent) {
        if (moveAmount >= SELECT_THRESHOLD || lastPos === undefined) return;
        moveAmount += getDistance({ x: event.clientX, y: event.clientY }, lastPos);
    }

    function getDistance(pos1: Pos2D, pos2: Pos2D) {
        return Math.hypot(pos2.x - pos1.x, pos2.y - pos1.y);
    }

</script>

<svelte:document onmousemove={mouseMove}></svelte:document>

<div class="card" class:selected data-asset-type={assetType}>
    <button class="option-button" title={`Vote ${name}${assetType==="trim" ? ` (${creator})` : ""}`} onclick={assetType==="trim" ? null : onclick}>
        {#if assetType==="image"}
            <img src={asset} alt={asset} class="option-asset" />
        {:else if assetType==="video"}
            <video class="option-asset" preload="metadata" width={1920} height={1080}>
                <source src={asset} type="video/mp4">
            </video>
            <div class="card-video-play-button" title="Play">
                <img src="/site-assets/play-button.svg" alt="Play" />
            </div>
        {:else if assetType==="trim"}
            <canvas 
                onmousedown={trimCanvasMouseDown} 
                onmouseup={trimCanvasMouseUp}
                onmouseleave={trimCanvasMouseLeave}
                style:width={`calc(100% - ${VIEWER_GUTTER_SIZE * 2}px)`}
                bind:this={canvas}
                ></canvas>
        {/if}
    </button>
    <p class="option-name">{name}</p>
    {#if creator !== undefined}
        <small class="creator">{creator}</small>
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

        position: relative;
    }
    .card.selected .option-button {
        border: 1px solid var(--selected-option-color);
        box-shadow: var(--selected-option-color-glow) 0px 0px 15px 4px;
        outline: 5px solid var(--selected-option-color);
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

    .card[data-asset-type="trim"] .option-button {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .option-button canvas {
        height: 25rem;
        min-height: 0;
    }

    .option-name {
        margin: 0;
        margin-top: 0.5rem;
        transition: all 20ms linear;
    }

    .creator {
        margin: 0;
        margin-top: 0.1rem;
        transition: all 20ms linear;
    }

    .card.selected .option-name {
        color: var(--selected-option-text-color);
    }
    .card.selected .creator {
        color: var(--selected-option-text-secondary-color);
    }

    .card-video-play-button {
        background-color: rgba(45, 45, 45, 0.8);
        box-shadow: rgba(255, 255, 255, 5%) 0px 0px 15px 2px;
        height: 4rem;
        width: 4rem;
        border-radius: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .card-video-play-button img {
        width: 100%;
        height: 100%;
        margin-left: 0.8rem;
    }
</style>
