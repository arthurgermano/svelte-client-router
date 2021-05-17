<script>
  import { SCR_ROUTER_LINK } from "../index.js";
</script>

<div class="scr-menu">
  <h4 class="scr-menu-h4">Introduction</h4>
  <SCR_ROUTER_LINK to={{ name: "rootRoute" }}>
    <div class="scr-btn">Presentation</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "installationRoute" }}>
    <div class="scr-btn">Installation</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "gettingStartedRoute" }}>
    <div class="scr-btn">Getting Started</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Configuration</h4>
  <SCR_ROUTER_LINK to={{ name: "configurationOptionsRoute" }}>
    <div class="scr-btn">Configuration Options</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "configurationGlobalBeforeEnterOptionRoute" }}>
    <div class="scr-btn">Global Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "configurationOnErrorOptionRoute" }}>
    <div class="scr-btn">Global On Error</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Object</h4>
  <SCR_ROUTER_LINK to={{ name: "routeObjectOptionsRoute" }}>
    <div class="scr-btn">Properties</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectBeforeEnterRoute" }}>
    <div class="scr-btn">Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectAfterBeforeEnterRoute" }}>
    <div class="scr-btn">After Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectOnErrorRoute" }}>
    <div class="scr-btn">On Error</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Component</h4>
  <SCR_ROUTER_LINK to={{ name: "routeComponentPropertiesRoute" }}>
    <div class="scr-btn">Properties</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeComponentComponentsRoute" }}>
    <div class="scr-btn">Components</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Navigation</h4>
  <SCR_ROUTER_LINK to={{ name: "navigationRoutingRoute" }}>
    <div class="scr-btn">Routing</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "navigationStoreRoute" }}>
    <div class="scr-btn">Store</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Link</h4>
  <SCR_ROUTER_LINK to={{ name: "routerLinkPropertiesRoute" }}>
    <div class="scr-btn">Properties</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Router Store</h4>
  <SCR_ROUTER_LINK to={{ name: "routerStorePropertiesRoute" }}>
    <div class="scr-btn">Properties</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Testing</h4>
  <SCR_ROUTER_LINK to={{ name: "testRegexPathRoute" }}>
    <div class="scr-btn">Test - Regex Path</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "testRegexPath2Route" }}>
    <div class="scr-btn">Test - Regex Path 2</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "testLoadingComponentWithBeforeEnterRoute" }}>
    <div class="scr-btn">Test - Loading Component with Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ path: "/svelte-client-router/some_route_not_declared" }}>
    <div class="scr-btn">Test - Not Found</div>
  </SCR_ROUTER_LINK>
</div>

<style>
  .scr-menu {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: start;
    width: 100%;
    min-height: 85vh;
    border-radius: 0.5rem;
    -webkit-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    -moz-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    padding: 0.5rem;
    border: 1px solid rgba(255, 68, 0, 0.164);
    min-width: 15rem;
  }

  .scr-menu-h4 {
    margin: 0.5rem 0;
    padding-left: 1rem;
    color: #d43900;
  }

</style>
