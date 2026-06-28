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
        onclick?: () => {};
    } = $props();
    let assetType: "img" | "trim" | undefined = $state();
    $effect(() => {
        if (asset.endsWith(".trim.json")) {
            assetType = "trim";
        } else {
            assetType = "img";
        }
    });

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
                width: parent.clientWidth,
                height: parent.clientHeight,
                skin: trimData.skin ? `/trims/skins/${trimData.skin}.png` : "/trims/skins/steve.png",
            });

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
            viewer.width = parent.clientWidth;
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
</script>

<div class="card" class:selected data-asset-type={assetType}>
    <button class="option-button" title={`Vote ${name}`} {onclick}>
        {#if assetType == "img"}
            <img src={asset} alt={asset} class="option-asset" />
        {:else if assetType == "trim"}
            <canvas bind:this={canvas}></canvas>
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
    }
</style>
