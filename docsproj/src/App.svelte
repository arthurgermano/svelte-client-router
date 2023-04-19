<script>
  import { loadStores, appStore } from "./js/stores/index.js";
  import { SCR_Router, configStore } from "../../src/index.js";
  import SCR_Loading from "./components/SCR_Loading.svelte";
  import SCR_DefaultLayout from "./layout/SCR_DefaultLayout.svelte";
  import SCR_NotFound from "./components/SCR_NotFound.svelte";
  import routes from "./js/routes/index.js";

  configStore.setBeforeEnter(({ resolve, routeTo }) => {
    console.log(routeTo);
    appStore.setVersion(0);
    resolve(true);
  });

  configStore.setConsoleLogStores(false);
  configStore.setHashMode(true);
  configStore.setMaxRedirectBeforeEnter(5);
  configStore.setNotFoundRoute("/svelte-client-router/notFound");
  configStore.setUseScroll(true);
  configStore.setScrollProps({
    target: "scr-container",
  });
  configStore.setConsiderTrailingSlashOnMatchingRoute(true);

  $: classThemeMode = $appStore.themeDark
    ? "scr-theme-dark"
    : "scr-theme-light";
</script>

<div class="scr-app {classThemeMode}">
  {#await loadStores()}
    <div class="scr-loading">loading...</div>
  {:then data}
    <SCR_DefaultLayout>
      <SCR_Router
        {routes}
        defaultLoadingComponent={SCR_Loading}
        defaultLoadingParams={{ subLoadingText: "SubLoading Text Via Param" }}
      />
    </SCR_DefaultLayout>
  {/await}
</div>

<style>
  .scr-app {
    position: relative;
    min-height: 100vh;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }

  .scr-loading {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
    text-align: center;
    padding: 1rem;
  }
</style>
