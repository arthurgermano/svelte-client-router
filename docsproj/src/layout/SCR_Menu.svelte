<script>
  import { fly } from "svelte/transition";
  import { appStore } from "../js/stores/index.js";
  import { SCR_RouterLink, routesStore } from "../../../src/index.js";

  let currentRoute = false;
  let routeDefinition = false;
  let routeName = "";

  $: version = $appStore.version > 0 ? `Version ${$appStore.version}` : "Menu";

  $: if ($routesStore) {
    currentRoute = $routesStore.currentRoute;
  } else {
    currentRoute = false;
  }

  $: if (currentRoute) {
    routeDefinition = currentRoute.definition;
  } else {
    routeDefinition = false;
  }

  $: if (routeDefinition) {
    routeName = routeDefinition.name;
  } else {
    routeName = false;
  }
</script>

{#if $appStore.menuOpened}
  <div
    class="scr-menu"
    in:fly={{ x: -200, duration: 300 }}
    out:fly={{ x: -200, duration: 200 }}
  >
    <h4>{version}</h4>
    {#if $appStore.version == 0}
      <!-- VERSION 0 -->
      <SCR_RouterLink params={{ name: "v1_Presentation" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Getting_Started"}>VERSION 1</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Presentation" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Getting_Started"}>VERSION 2</div>
      </SCR_RouterLink>
      <!-- END VERSION 0 -->
    {:else if $appStore.version == 1}
      <!-- VERSION 1 -->
      <h4 class="scr-menu-h4">Introduction</h4>
      <SCR_RouterLink params={{ name: "v1_Presentation" }}>
        <div
          class="scr-menu-btn"
          class:scr-menu-active={routeName == "v1_Presentation"}
        >
          Presentation
        </div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Installation" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Installation"}>Installation</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Getting_Started" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Getting_Started"}>Getting Started</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Configuration</h4>
      <SCR_RouterLink params={{ name: "v1_Configuration_Options" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Configuration_Options"}>Configuration Options</div>
      </SCR_RouterLink>
      <SCR_RouterLink
        params={{ name: "v1_Configuration_Global_Before_Enter_Option" }}
      >
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Configuration_Global_Before_Enter_Option"}>Global Before Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Configuration_Global_On_Error" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Configuration_Global_On_Error"}>Global On Error</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Route Object</h4>
      <SCR_RouterLink params={{ name: "v1_Route_Object_Properties" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Object_Properties"}>Properties</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Route_Object_Before_Enter" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Object_Before_Enter"}>Before Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Route_Object_After_Enter" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Object_After_Enter"}>After Before Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Route_Object_On_Error" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Object_On_Error"}>On Error</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Route Component</h4>
      <SCR_RouterLink params={{ name: "v1_Route_Component_Properties" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Component_Properties"}>Properties</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Route_Component_Components" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Route_Component_Components"}>Components</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Navigation</h4>
      <SCR_RouterLink params={{ name: "v1_Navigation_Routing" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Navigation_Routing"}>Routing</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Navigation_Store" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Navigation_Store"}>Store</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Route Link</h4>
      <SCR_RouterLink params={{ name: "v1_Router_Link" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Router_Link"}>Properties</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Router Store</h4>
      <SCR_RouterLink params={{ name: "v1_Router_Store" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Router_Store"}>Properties</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Testing</h4>
      <SCR_RouterLink params={{ name: "v1_Test_Regex_Path" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Test_Regex_Path"}>Test - Regex Path</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v1_Test_Regex_Path_2" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Test_Regex_Path_2"}>Test - Regex Path 2</div>
      </SCR_RouterLink>
      <SCR_RouterLink
        params={{ name: "v1_Test_Loading_Component_Before_Enter" }}
      >
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Test_Loading_Component_Before_Enter"}>
          Test - Loading Component with Before Enter
        </div>
      </SCR_RouterLink>
      <SCR_RouterLink
        params={{
          name: "v1_Test_Any_Route_Wildcard",
        }}
      >
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "SCR_ROUTE_NOT_FOUND"}>Test - Any Route Wildcard</div>
      </SCR_RouterLink>
      <SCR_RouterLink
        params={{ path: "/svelte-client-router/v1/some_route_not_declared" }}
      >
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "SCR_NOT_FOUND_ROUTE"}>Test - Not Found</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Version</h4>
      <SCR_RouterLink params={{ name: "v2_Presentation" }}>
        <div class="scr-menu-btn">See Version 2</div>
      </SCR_RouterLink>
      <!-- END VERSION 1 -->
    {:else if $appStore.version == 2}
      <!-- VERSION 2 -->
      <h4 class="scr-menu-h4">Introduction</h4>
      <SCR_RouterLink params={{ name: "v2_Presentation" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Presentation"}>Presentation</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Installation" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Installation"}>Installation</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Getting_Started" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Getting_Started"}>Getting Started</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Configuration</h4>
      <SCR_RouterLink params={{ name: "v2_Configuration_Options" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Configuration_Options"}>Configuration Options</div>
      </SCR_RouterLink>
      <SCR_RouterLink
        params={{ name: "v2_Configuration_Global_Before_Enter_Option" }}
      >
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Configuration_Global_Before_Enter_Option"}>Global Before Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Configuration_Global_On_Error" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Configuration_Global_On_Error"}>Global On Error</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Route Object</h4>
      <SCR_RouterLink params={{ name: "v2_Route_Object_Properties" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Object_Properties"}>Properties</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Route_Object_Before_Enter" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Object_Before_Enter"}>Before Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Route_Object_After_Enter" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Object_After_Enter"}>After Enter</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Route_Object_On_Error" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Object_On_Error"}>On Error</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Route Component</h4>
      <SCR_RouterLink params={{ name: "v2_Route_Component_Properties" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Component_Properties"}>Properties</div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Route_Component_Components" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v2_Route_Component_Components"}>Components</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Navigation</h4>
      <SCR_RouterLink params={{ name: "v2_Navigation_Routing" }}>
        <div class="scr-menu-btn" class:scr-menu-active={routeName == "v1_Navigation_Routing"}>Routing</div>
      </SCR_RouterLink>
      <h4 class="scr-menu-h4">Version</h4>
      <SCR_RouterLink params={{ name: "v1_Presentation" }}>
        <div class="scr-menu-btn">See Version 1</div>
      </SCR_RouterLink>
      <!-- END VERSION 2 -->
    {:else}
      <div>VERSION NOT FOUND</div>
    {/if}
  </div>
{/if}

<style>
  h4 {
    text-align: center;
    margin: 0.5rem 0;
  }

  .scr-menu {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: start;
    height: 100%;
    width: 25vw;
    z-index: 101;
    padding: 0;
    border-right: 1px solid var(--main-color);
    text-align: center;
    min-width: 100px;
  }

  .scr-menu-btn {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: left;
    align-content: center;
    width: 80%;
    background-color: #ff440009;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
    text-align: center;
    color: #a82d00;
    margin: 0 auto 0.5rem auto;
    padding: 0.5rem;
  }

  .scr-menu-btn:hover {
    background-color: #ff440018;
    cursor: pointer;
    font-weight: bolder;
    color: #d43900;
  }

  .scr-menu-h4 {
    font-size: 1.35rem;
    margin: 0.5rem 0 1rem 2rem;
    color: #d43900;
    text-align: left;
  }

  .scr-menu-active {
    border: 1px solid #a82d00;
    font-weight: bolder;
    color: #d43900;
    background-color: #ff440018;
  }

  .scr-menu-active:hover {
    border: 1px solid #a82d00;
    font-weight: bolder;
    color: #d43900;
    background-color: #ff44002f;
  }

  @media (max-width: 500px) {
    .scr-menu {
      font-size: 0.7rem;
    }

    .scr-menu-h4 {
      font-size: 1rem;
      text-align: center;
      margin: 0;
    }
  }
</style>
