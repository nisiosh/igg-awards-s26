<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import TrimVoteOptions from "$lib/components/TrimVoteOptions.svelte";
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
            assetPath={ballot.assetPath}
            marginTop={i == 0 ? "" : "5rem"}
        />
    {/each}
</div>

<TrimVoteOptions
    title={"Best Armour Trim"}
 />

<style>
    .vote-options {
        display: flex;
        flex-direction: column;
    }
</style>