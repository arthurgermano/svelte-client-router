<script>
  import { onMount } from "svelte";
  import {
    routesStore,
    configStore,
    coreStore,
    navigateStore,
  } from "../stores/index.js";
  import {
    onMountComponent,
    getRouteObjectFromName,
    getRouteObjectFromPath,
    loadRoute,
    throwError,
  } from "../core/routerFunctions.js";

  // ----------------------------------------------------------------------------------------------
  // ---------------------------  Export Variables  -----------------------------------------------

  // all the routes object
  export let routes;

  // default components
  export let defaultLoadingComponent;
  export let defaultLoadingParams;

  // ----------------------------------------------------------------------------------------------
  // ---------------------------  Local Variables  ------------------------------------------------

  // behavior
  let loading;
  let isConsumingActivated = false;

  // components
  let loadingComponent = null;
  let currentComponent = null;

  // ----------------------------------------------------------------------------------------------
  // -------------------------  Functions  --------------------------------------------------------

  // -------------------------  consumeRoute Function  --------------------------------------------

  // when some route is pushed using navigation it uses this function
  async function consumeRoute() {
    try {
      // protecting from several pushes at the same time - just ignore other until resolve this request
      if (isConsumingActivated) {
        return;
      }

      let routeObj;
      if ($navigateStore.isConsuming == "PATH") {
        routeObj = getRouteObjectFromPath($navigateStore.path);
      } else if ($navigateStore.isConsuming == "NAME") {
        routeObj = getRouteObjectFromName({ name: $navigateStore.name });
      }
      if ($navigateStore.params) {
        routeObj.params = {
          ...routeObj.params,
          ...navigateStore.getParams(),
        };
      }

      await loadRoute(routeObj);
      navigateStore.setIsConsuming(false);
      isConsumingActivated = false;
    } catch (error) {
      isConsumingActivated = false;
      navigateStore.setIsConsuming(false);

      // if navigateStore has a defined onError for this request
      try {
        if (navigateStore.getOnError) {
          return await navigateStore.getOnError()(error);
        }
        throw error;
      } catch (finalError) {
        throwError(finalError);
      }
    }
  }

  // ----------------------------------------------------------------------------------------------

  function logError(error) {
    if ($configStore.consoleLogErrorMessages) {
      console.log(error);
    }
    return "";
  }
  // ----------------------------------------------------------------------------------------------
  // -------------------------  Execution  --------------------------------------------------------

  onMount(
    onMountComponent.bind(undefined, {
      routes,
      defaultLoadingComponent,
      defaultLoadingParams,
    })
  );

  // -------------------------  svelte_reactive - $coreStore  -------------------------------------

  // controlling the loading screen by reacting to coreStore - isLoading
  $: if ($coreStore.isLoading) {
    loading = coreStore.getWaiting();
    loadingComponent = coreStore.getLoadingComponent();
  } else {
    loadingComponent = false;
    currentComponent = coreStore.getCurrentComponent();
    loading = false;
  }

  // -------------------------  svelte_reactive - $configStore.consoleLogStores  ------------------

  $: if ($configStore.consoleLogStores && $routesStore) {
    console.log(" ----- SCR - Router Store ------------ ");
    console.log($routesStore);
    console.log(" ------------------------------------- ");
  }

  $: if ($configStore.consoleLogStores && $configStore) {
    console.log(" ----- SCR - Configuration Store ----- ");
    console.log($configStore);
    console.log(" ------------------------------------- ");
  }

  // -------------------------  svelte_reactive - $naviagateStore  --------------------------------

  // reacting when some route was pushed
  $: if ($navigateStore.isConsuming && !isConsumingActivated) {
    consumeRoute();
  }
</script>

{#await loading}
  {#if coreStore.getLoadingComponent()}
    <svelte:component
      this={loadingComponent}
      {...coreStore.getLoadingParams()}
    />
  {/if}
{:then loaded}
  <svelte:component this={currentComponent} {...coreStore.getCurrentParams()} />
{:catch error}
  {logError(error)}
{/await}
