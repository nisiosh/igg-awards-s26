<script lang="ts">
    import VoteOptions from "$lib/components/VoteOptions.svelte";

    let { data } = $props();

    const ballot = $derived(data.ballot);
</script>

<div class="vote-options">
    {#each ballot.categories as category, i}
        <VoteOptions 
            options={category.options} 
            title={category.title}
            subtitle={category.subtitle}
            assetPath={ballot.assetPath}
            marginTop={i===0 ? "" : "5rem"}
        />
    {/each}
</div>

<div class="ballot-navigation">
    <a class="button secondary" data-enabled={data.previous !== null} href={`/${data.previous}`}>Back</a>
    <a class="button" href={data.next !== null ? `/${data.next}` : `/submit`}>
        {data.next !== null ? "Next" : "Complete"}
    </a>
</div>

<style>
    .vote-options {
        display: flex;
        flex-direction: column;
    }

    .ballot-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10rem;
        gap: 0.3rem;
    }

    .button[data-enabled=false] {
        opacity: 0;
        pointer-events: none;
    }
</style>