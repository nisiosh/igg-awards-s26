<script lang="ts">
    import VoteOptions from "$lib/components/VoteOptions.svelte";

    let { data } = $props();

    const ballot = $derived(data.ballot);
</script>

<h1 class="category-name">{ballot.name}</h1>
<small class="category-subtitle">Hosted by Kreekcraft</small>

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
        {data.next !== null ? "Next" : "Submit"}
    </a>
</div>

<style>
    .category-name {
        text-align: center;
        font-size: 2.2rem;
        margin-bottom: 0;
    }

    .category-subtitle {
        display: inline-block;
        text-align: center;
        width: 100%;
        margin: 0;
        margin-top: 0.5rem;
        margin-bottom: 3rem;
    }

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