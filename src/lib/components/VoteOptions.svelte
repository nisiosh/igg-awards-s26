<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type { Option } from "$lib/types/OptionTypes.js";
    let selected = $state<number>();
    let { title, subtitle, options, assetPath, marginTop }: { 
        title: string,
        subtitle?: string,
        options: Option[], 
        assetPath: string, 
        marginTop?: string } = $props();
</script>

<div class="award-title-container">
    <h1 class="award-title poppins" style:margin-top={marginTop}>{title}</h1>
    {#if subtitle} <small class="award-subtitle">{subtitle}</small> {/if}
</div>

<div class="cards">
    {#each options as option, i }
        <Card 
            asset={`nominee-assets/${assetPath}/${option.asset}`}
            name={option.name}
            creator={option.creator}
            selected={selected===i}
            onclick={() => selected = i}
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
        flex: 0 1 calc(50% - 0.5rem);  /* 2 per row */
    }

    @media screen and (max-width: 500px) {
        .cards > :global(*) {
            flex-basis: 100%;
        }
    }
</style>