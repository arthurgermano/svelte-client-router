import { appStore } from "../stores/index.js";

function setVersion2({ resolve }) {
  appStore.setVersion(2);
  resolve(true);
}

function setVersion0({ resolve }) {
  appStore.setVersion(0);
  resolve(true);
}

const routes = [
  {
    name: "root",
    path: "",
    beforeEnter: ({ resolve }) => {
      resolve({ path: "/svelte-client-router/" });
    },
  },
  {
    name: "root2",
    path: "/",
    beforeEnter: ({ resolve }) => {
      resolve({ path: "/svelte-client-router/" });
    },
  },
  {
    name: "rootRoute",
    path: "/svelte-client-router/",
    lazyLoadComponent: () => import("../../pages/SCR_Home.svelte"),
    title: "SCR - Home",
    beforeEnter: [setVersion0],
  },
  {
    name: "v2_Presentation",
    path: "/svelte-client-router/v2/presentation",
    lazyLoadComponent: () => import("../../pages/v2/SCR_Presentation.svelte"),
    title: "SCR - Presentation - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Installation",
    path: "/svelte-client-router/v2/installation",
    lazyLoadComponent: () => import("../../pages/v2/SCR_Installation.svelte"),
    title: "SCR - Installation - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Getting_Started",
    path: "/svelte-client-router/v2/gettingStarted",
    lazyLoadComponent: () => import("../../pages/v2/SCR_GettingStarted.svelte"),
    title: "SCR - Getting Started - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Options",
    path: "/svelte-client-router/v2/configurationOptions",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationOptions.svelte"),
    title: "SCR - Configuration Options - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Global_Before_Enter_Option",
    path: "/svelte-client-router/v2/configurationGlobalBeforeEnterOption",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration Global Before Enter Option - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Global_On_Error",
    path: "/svelte-client-router/v2/configurationGlobalOnError",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationOnError.svelte"),
    title: "SCR - Configuration Global On Error - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_Properties",
    path: "/svelte-client-router/v2/routeObjectProperties",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectProperties.svelte"),
    title: "SCR - Route Object Properties - Version 2",
    beforeEnter: [setVersion2],
    ignoreScroll: true,
  },
  {
    name: "v2_Route_Object_Before_Enter",
    path: "/svelte-client-router/v2/routeObjectBeforeEnter",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectBeforeEnter.svelte"),
    title: "SCR - Route Object Before Enter - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_After_Enter",
    path: "/svelte-client-router/v2/routeObjectAfterEnter",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectAfterEnter.svelte"),
    title: "SCR - Route Object After Enter - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_On_Error",
    path: "/svelte-client-router/v2/routeObjectOnError",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object On Error - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Component_Properties",
    path: "/svelte-client-router/v2/routeComponentProperties",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteComponentProperties.svelte"),
    title: "SCR - Route Component Properties - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Component_Components",
    path: "/svelte-client-router/v2/routeComponentComponents",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteComponentComponents.svelte"),
    title: "SCR - Route Component Components - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Navigation_Routing",
    path: "/svelte-client-router/v2/navigationRouting",
    lazyLoadComponent: () => import("../../pages/v2/SCR_NavigationRouting.svelte"),
    title: "SCR - Navigation Routing - Version 2",
    beforeEnter: [setVersion2],
  },
];

export default routes;
