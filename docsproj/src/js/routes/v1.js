import { appStore } from "../stores/index.js";

function setVersion1({ resolve }) {
  appStore.setVersion(1);
  resolve(true);
}

const routes = [
  {
    name: "v1_Presentation",
    path: "/svelte-client-router/v1/presentation",
    lazyLoadComponent: () => import("../../pages/v1/SCR_Presentation.svelte"),
    title: "SCR - Presentation - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Installation",
    path: "/svelte-client-router/v1/installation",
    lazyLoadComponent: () => import("../../pages/v1/SCR_Installation.svelte"),
    title: "SCR - Installation - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Getting_Started",
    path: "/svelte-client-router/v1/gettingStarted",
    lazyLoadComponent: () => import("../../pages/v1/SCR_GettingStarted.svelte"),
    title: "SCR - Getting Started - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Configuration_Options",
    path: "/svelte-client-router/v1/configurationOptions",
    lazyLoadComponent: () => import("../../pages/v1/SCR_ConfigurationOptions.svelte"),
    title: "SCR - Configuration Options - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Configuration_Global_Before_Enter_Option",
    path: "/svelte-client-router/v1/configurationGlobalBeforeEnterOption",
    lazyLoadComponent: () => import("../../pages/v1/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration Global Before Enter Option - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Configuration_Global_On_Error",
    path: "/svelte-client-router/v1/configurationGlobalOnError",
    lazyLoadComponent: () => import("../../pages/v1/SCR_ConfigurationOnError.svelte"),
    title: "SCR - Configuration Global On Error - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Object_Properties",
    path: "/svelte-client-router/v1/routeObjectProperties",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteObjectProperties.svelte"),
    title: "SCR - Route Object Properties - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Object_Before_Enter",
    path: "/svelte-client-router/v1/routeObjectBeforeEnter",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteObjectBeforeEnter.svelte"),
    title: "SCR - Route Object Before Enter - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Object_After_Enter",
    path: "/svelte-client-router/v1/routeObjectAfterEnter",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteObjectAfterEnter.svelte"),
    title: "SCR - Route Object After Enter - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Object_On_Error",
    path: "/svelte-client-router/v1/routeObjectOnError",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object On Error - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Component_Properties",
    path: "/svelte-client-router/v1/routeComponentProperties",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteComponentProperties.svelte"),
    title: "SCR - Route Component Properties - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Route_Component_Components",
    path: "/svelte-client-router/v1/routeComponentComponents",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouteComponentComponents.svelte"),
    title: "SCR - Route Component Components - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Navigation_Routing",
    path: "/svelte-client-router/v1/navigationRouting",
    lazyLoadComponent: () => import("../../pages/v1/SCR_NavigationRouting.svelte"),
    title: "SCR - Navigation Routing - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Navigation_Store",
    path: "/svelte-client-router/v1/navigationStore",
    lazyLoadComponent: () => import("../../pages/v1/SCR_NavigationStore.svelte"),
    title: "SCR - Navigation Store - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Router_Link",
    path: "/svelte-client-router/v1/routerLink",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouterLink.svelte"),
    title: "SCR - Router Link - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Router_Store",
    path: "/svelte-client-router/v1/routerStore",
    lazyLoadComponent: () => import("../../pages/v1/SCR_RouterStore.svelte"),
    title: "SCR - Router Store - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Test_Regex_Path",
    path: "/svelte-client-router/v1/:testParam/testRegexPath",
    lazyLoadComponent: () => import("../../pages/v1/SCR_TestRegexPath.svelte"),
    title: "SCR - Test Regex Path - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Test_Regex_Path_2",
    path: "/svelte-client-router/v1/:firstParam/testRegexPath2/:secondParam",
    lazyLoadComponent: () => import("../../pages/v1/SCR_TestRegexPath2.svelte"),
    title: "SCR - Test Regex Path 2 - Version 1",
    beforeEnter: [setVersion1],
  },
  {
    name: "v1_Test_Loading_Component_Before_Enter",
    path: "/svelte-client-router/v1/testLoadingComponentWithBeforeEnter/:timeout",
    lazyLoadComponent: () => import("../../pages/v1/SCR_TestLoadingComponentWithBeforeEnter.svelte"),
    title: "SCR - Test Regex Path 2 - Version 1",
    beforeEnter: [setVersion1, ({resolve, routeTo}) => {
      let timeout = 10;
      if (routeTo && routeTo.pathParams && routeTo.pathParams.timeout) {
        routeTo.pathParams.timeout = parseInt(routeTo.pathParams.timeout);
        if (routeTo.pathParams.timeout > 0) {
          timeout = routeTo.pathParams.timeout;
        }
      }
      setTimeout(() => {

        resolve(true);
      }, timeout);
    }],
  },
  {
    name: "v1_Test_Any_Route_Wildcard",
    path: "/svelte-client-router/v1/anyRouteWildcard/*/:somePathParam",
    lazyLoadComponent: () =>
      import("../../pages/v1/SCR_TestAnyRouteWildcard.svelte"),
    title: "SCR - Test - Any Route Wildcard - Version 1",
  },
];


export default routes;