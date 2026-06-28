<script lang="ts">
    import "$lib/styles/modern-normalize.css"

    let { children } = $props();
</script>

<svelte:head>
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <title>Svelte Todo List</title>
</svelte:head>

{@render children()}

<style>
    :root {
        font-family: Inter, sans-serif;
        font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */

        --accent: #f05030;
        --selection: #f66244;
        --secondary-color: #999999;
        --secondary-color-selected: #d4d4d4;
        --remove-button-color: #999999;
    }
    @supports (font-variation-settings: normal) {
        :root { font-family: InterVariable, sans-serif; }
    }

    :global(body) {
        max-width: 50rem;
        padding: 0 2rem;
        margin: auto;
        caret-color: var(--accent);
    }

    :global(::selection) {
        background-color: var(--selection);
    }
</style>