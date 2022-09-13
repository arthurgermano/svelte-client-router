import { appStore } from "../stores/index.js";


function setVersion0({ resolve }) {
  appStore.setVersion(0);
  resolve(true);
}

function setVersion2({ resolve }) {
  appStore.setVersion(2);
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
  {
    name: "v2_Router_Link",
    path: "/svelte-client-router/v2/routerLink",
    lazyLoadComponent: () => import("../../pages/v2/SCR_RouterLink.svelte"),
    title: "SCR - Router Link - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Routes_Store",
    path: "/svelte-client-router/v2/routesStore",
    lazyLoadComponent: () => import("../../pages/v2/SCR_RoutesStore.svelte"),
    title: "SCR - Routes Store - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Regex_Path",
    path: "/svelte-client-router/v2/:testParam/testRegexPath",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestRegexPath.svelte"),
    title: "SCR - Test Regex Path - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Regex_Path_2",
    path: "/svelte-client-router/v2/:firstParam/testRegexPath2/:secondParam",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestRegexPath2.svelte"),
    title: "SCR - Test Regex Path 2 - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Loading_Component_Before_Enter",
    path: "/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestLoadingComponentWithBeforeEnter.svelte"),
    title: "SCR - Test Regex Path 2 - Version 2",
    beforeEnter: [setVersion2, ({resolve, routeTo}) => {
      let timeout = 20;
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
    name: "v2_Test_Any_Route_Wildcard",
    path: "/svelte-client-router/v2/anyRouteWildcard/*/:somePathParam",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_TestAnyRouteWildcard.svelte"),
    title: "SCR - Test - Any Route Wildcard - Version 2",
  },
];

export default routes;
