<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type { Option } from "$lib/types/OptionTypes.js";
    let selected = $state<number>();
    let { title, options, assetPath, marginTop }: { 
        title: string,
        options: Option[], 
        assetPath: string, 
        marginTop?: string } = $props();
</script>

<h1 class="award-title poppins" style:margin-top={marginTop}>{title}</h1>

<div class="cards">
    {#each options as option, i }
        <Card 
            asset={`nominee-assets/${assetPath}/${option.asset}`}
            name={option.name}
            creator={option.creator}
            selected={selected == i}
            onclick={() => selected = i}
        />
    {/each}

</div>

<style>
    .award-title {
        text-align: center;
        font-weight: 600;
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