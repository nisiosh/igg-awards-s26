<script lang="ts">
    import "$lib/styles/modern-normalize.css"

    let { children } = $props();
</script>

<svelte:head>
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <title>IGG Awards Summer 2026</title>
</svelte:head>

{@render children()}

<style>
    :root {
        box-sizing: border-box;
        font-family: "Poppins", Inter, sans-serif;
        font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */
        scrollbar-color: rgb(191, 191, 191) transparent;
        --primary: rgb(250, 250, 250);
        --primary-dark: rgb(10, 10, 10);
        --secondary: rgb(100, 100, 100);
        --bg: rgb(5, 5, 5);
        --selected-option-color: rgb(255, 187, 69);
        --selected-option-color-glow: rgba(255, 221, 69, 0.422);
        --selected-option-text-color: rgb(255, 197, 97);
        --selected-option-text-secondary-color: rgb(110, 106, 100);
    }
    @supports (font-variation-settings: normal) {
        :root { font-family: InterVariable, sans-serif; }
    }

    :global(body) {
        max-width: 50rem;
        padding: 0 2rem;
        margin: auto;
        background-color: var(--bg);
        color: var(--primary);
        margin-bottom: 1rem;
    }

    :global(h1, h2, h3, h4, h5, h6, .poppins) {
        font-family: "Poppins";
        font-weight: 600;
    }

    :global(small) {
        font-size: 0.8rem;
        color: var(--secondary);
    }

    :global(button, .button) {
        border-radius: 0;
        border: none;
        background-color: var(--primary);
        color: var(--primary-dark);
        padding: 0.6rem 0.8rem;
        cursor: pointer;
        font-weight: 500;
        box-shadow: rgba(255, 255, 255, 1%) 0px 0px 15px 2px;
        text-decoration: none;
    }

    :global(button:hover, .button:hover) {
        box-shadow: rgba(255, 255, 255, 20%) 0px 0px 15px 2px;
        transition: box-shadow 100ms linear;
    }

    :global(button.secondary, .button.secondary) {
        border: 1px solid var(--primary);
        background-color: transparent;
        color: var(--primary);
        padding: calc(0.6rem - 1px) calc(0.8rem - 1px);
        font-weight: 400;
    }

</style>