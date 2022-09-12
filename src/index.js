import SCR_Router from "./components/SCR_Router.svelte";
import SCR_RouterLink from "./components/SCR_RouterLink.svelte";
import * as SCR_Stores_Module from "./stores/index.js";

const pushRoute = SCR_Stores_Module.navigateStore.pushRoute;
const backRoute = SCR_Stores_Module.navigateStore.backRoute;
const configStore = SCR_Stores_Module.configStore;
const routesStore = SCR_Stores_Module.routesStore;
const scr_router = SCR_Router;
const scr_router_link = SCR_RouterLink;

export {
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
};
