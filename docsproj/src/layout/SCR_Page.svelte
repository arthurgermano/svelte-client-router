<script>
  import { fly } from "svelte/transition";
  import { SCR_RouterLink } from "../../../src/index.js";
  export let back = {};
  export let forward = {};
</script>

<div
  in:fly={{ delay: 301, x: 300, duration: 300, opacity: 0 }}
  out:fly={{ x: 300, duration: 300, opacity: 0 }}
>
  <slot />
  {#if back.name || forward.name}
    <hr />
  {/if}
  <div class="scr-page-actions">
    {#if back.name}
      <SCR_RouterLink params={{ name: back.name }}>
        <button class="scr-page-btn" type="button">{back.text}</button>
      </SCR_RouterLink>
    {/if}
    {#if forward.name}
      <SCR_RouterLink params={{ name: forward.name }}>
        <button class="scr-page-btn" type="button">{forward.text}</button>
      </SCR_RouterLink>
    {/if}
  </div>
</div>

<style>
  .scr-page-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-content: center;
    text-align: center;
    padding: 1rem 0;
  }

  .scr-page-btn {
    cursor: pointer;
    padding: 1rem 1.5rem;
    border: 1px solid;
    border-radius: 0.5rem;
    background-color: transparent;
    color: orangered;
    transition: all 0.3s ease-in-out;
    min-width: 10rem;
    font-size: 1rem;
  }

  .scr-page-btn:hover {
    box-shadow: 0 20px 20px rgb(255 69 0 /10%);
    background-color: rgba(255, 69, 0, 0.329);
    font-weight: bold;
  }

  @media (max-width: 500px) {
    .scr-page-actions {
      grid-template-columns: 1fr;
      row-gap: 1rem;
    }
  }
</style>
