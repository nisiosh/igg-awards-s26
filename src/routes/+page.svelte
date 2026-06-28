<script lang="ts">
    import VoteOptions from "$lib/components/VoteOptions.svelte";
    import type { Ballot } from "$lib/types/OptionTypes.js";

    let { data }: { data: { minecraftBallot: Ballot } } = $props();

    const ballot = $derived(data.minecraftBallot);
</script>



<div class="vote-options">
    {#each ballot.categories as category, i}
        <VoteOptions 
            options={category.options} 
            title={category.title}
            subtitle={category.subtitle}
            assetPath={ballot.assetPath}
            marginTop={i == 0 ? "" : "5rem"}
        />
    {/each}
</div>

<style>
    .vote-options {
        display: flex;
        flex-direction: column;
    }
</style>