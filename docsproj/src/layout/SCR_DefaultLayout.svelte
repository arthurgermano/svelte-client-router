<script>
  import { fly } from "svelte/transition";
  import { appStore } from "../js/stores";
  import SCR_Menu from "./SCR_Menu.svelte";
  import SCR_Header from "./SCR_Header.svelte";
  import SCR_Footer from "./SCR_Footer.svelte";

  $: position = $appStore.menuOpened ? "relative" : "absolute";
</script>

<div class="scr-layout">
  <SCR_Header />
  <div class="scr-layout-page">
    <div
      class="scr-layout-menu"
      style="position: {position};"
      in:fly={{ delay: 201, x: 300, duration: 200, opacity: 0 }}
      out:fly={{ x: 300, duration: 200, opacity: 0 }}
    >
      <SCR_Menu />
    </div>

    <div
      id="scr-container"
      class="scr-layout-container"
      class:scr-layout-container__span={!$appStore.menuOpened}
    >
      <slot />
    </div>
  </div>
  <SCR_Footer />
</div>

<style>
  .scr-layout {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: start;
    height: 88vh;
    min-width: 350px;
  }

  .scr-layout-page {
    position: relative;
    display: grid;
    grid-template-columns: 25% 75%;
    justify-content: center;
    min-height: 78.5vh;
  }

  .scr-layout-menu {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scr-layout-container {
    position: relative;
    min-height: 100%;
    max-width: 100%;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    text-align: justify;
  }

  .scr-layout-container__span {
    grid-column: 2 span;
  }

  @media (max-width: 500px) {
    .scr-layout {
      height: 78vh;
    }

    .scr-layout-page {
      min-height: 67.6vh;
    }

    .scr-layout-container {
      word-break: break-all;
    }
  }
</style>
