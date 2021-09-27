import SCR_ROUTER_COMPONENT_IMPORT from "./components/SCR_Router.svelte";
import SCR_ROUTER_LINK_COMPONENT_IMPORT from "./components/SCR_RouterLink.svelte";
import routerStore from "./js/store/router.js";
import configStore from "./js/store/config.js";
import navigateStore from "./js/store/navigate.js";

export const SCR_ROUTER_COMPONENT = SCR_ROUTER_COMPONENT_IMPORT;
export const SCR_ROUTER_LINK = SCR_ROUTER_LINK_COMPONENT_IMPORT;
export const SCR_ROUTER_STORE = routerStore;
export const SCR_CONFIG_STORE = configStore;
export const SCR_NAVIGATE_STORE = navigateStore;
export const pushRoute = navigateStore.pushRoute;
export const backRoute = navigateStore.backRoute;