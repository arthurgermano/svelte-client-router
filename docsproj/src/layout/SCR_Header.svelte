<script>
  import { appStore } from "../js/stores";
  import { SCR_RouterLink } from "../../../src/index.js";
  async function changeTheme() {
    await appStore.setThemeDark(!$appStore.themeDark);
  }

  function toggleMenu() {
    appStore.setMenuOpened(!$appStore.menuOpened);
  }
</script>

<div>
  <div class="scr-header">
    <div class="scr-menu">
      <span on:click={toggleMenu}>
        {#if $appStore.menuOpened}
          <span>
            <i class="fas fa-bars" />
          </span>
        {:else}
          <span class="scr-close-menu">
            <i class="fas fa-ellipsis-v" />
          </span>
        {/if}
      </span>
    </div>
    <SCR_RouterLink params={{ name: "rootRoute" }}>
      <b>Svelte Client Router</b>
    </SCR_RouterLink>
    <div class="scr-theme">
      <span on:click={changeTheme}>
        {#if $appStore.themeDark}
          <span>
            <i class="fas fa-sun" />
          </span>
        {:else}
          <span>
            <i class="fas fa-moon" />
          </span>
        {/if}
      </span>
    </div>
  </div>
</div>

<style>
  b {
    cursor: pointer;
  }

  .scr-header {
    position: relative;
    display: grid;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    font-size: 2rem;
    text-align: center;
    color: var(--main-color);
    border-bottom: 1px solid var(--main-color);
  }

  .scr-menu {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem;
    cursor: pointer;
    will-change: filter;
    transition: all 0.3s ease-in-out;
  }

  .scr-theme {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2rem;
    cursor: pointer;
    will-change: filter;
    transition: all 0.3s ease-in-out;
  }

  .scr-theme:hover,
  .scr-menu:hover {
    filter: drop-shadow(0 0 2rem #ff3e00aa);
  }

  .scr-close-menu {
    display: inline-block;
    min-width: 2rem;
  }

  @media (max-width: 500px) {
    .scr-header {
      font-size: 1.5rem;
    }
  }
</style>
