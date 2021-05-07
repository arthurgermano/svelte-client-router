<script>
  import { SCR_ROUTER_LINK } from "../index.js";
</script>

<div class="scr-menu">
  <h4 class="scr-menu-h4">Introduction</h4>
  <SCR_ROUTER_LINK to={{ name: "rootRoute" }}>
    <div class="scr-menu-item">Presentation</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "installationRoute" }}>
    <div class="scr-menu-item">Installation</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "gettingStartedRoute" }}>
    <div class="scr-menu-item">Getting Started</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Configuration</h4>
  <SCR_ROUTER_LINK to={{ name: "configurationOptionsRoute" }}>
    <div class="scr-menu-item">Configuration Options</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "configurationGlobalBeforeEnterOptionRoute" }}>
    <div class="scr-menu-item">Global Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "configurationOnErrorOptionRoute" }}>
    <div class="scr-menu-item">Global On Error</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Object</h4>
  <SCR_ROUTER_LINK to={{ name: "routeObjectOptionsRoute" }}>
    <div class="scr-menu-item">Properties</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectBeforeEnterRoute" }}>
    <div class="scr-menu-item">Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectAfterBeforeEnterRoute" }}>
    <div class="scr-menu-item">After Before Enter</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeObjectOnErrorRoute" }}>
    <div class="scr-menu-item">On Error</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Component</h4>
  <SCR_ROUTER_LINK to={{ name: "routeComponentPropertiesRoute" }}>
    <div class="scr-menu-item">Properties</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "routeComponentComponentsRoute" }}>
    <div class="scr-menu-item">Components</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Navigation</h4>
  <SCR_ROUTER_LINK to={{ name: "navigationRoutingRoute" }}>
    <div class="scr-menu-item">Routing</div>
  </SCR_ROUTER_LINK>
  <SCR_ROUTER_LINK to={{ name: "navigationStoreRoute" }}>
    <div class="scr-menu-item">Store</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Route Link</h4>
  <SCR_ROUTER_LINK to={{ name: "routerLinkPropertiesRoute" }}>
    <div class="scr-menu-item">Properties</div>
  </SCR_ROUTER_LINK>
  <h4 class="scr-menu-h4">Router Store</h4>
  <SCR_ROUTER_LINK to={{ name: "routerStorePropertiesRoute" }}>
    <div class="scr-menu-item">Properties</div>
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

  .scr-menu-item {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: left;
    align-content: center;
    width: 100%;
    padding: 0.5rem;
    background-color: #ff440009;
    border-radius: 0.5rem;
    transition: all linear 0.2s;
    text-align: center;
    color: #a82d00;
    margin-bottom: 0.5rem;
  }

  .scr-menu-item:hover {
    background-color: #ff440018;
    cursor: pointer;
    font-weight: bolder;
    color: #d43900;
  }
</style>
