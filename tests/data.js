export const routes = [
  {
    name: "root",
    path: "/",
    beforeEnter: [
      (resolve, rFrom, rTo, params, payload) => {
        resolve({ redirect: "/scr" });
      },
    ],
  },
  {
    name: "rootRoute",
    path: "/scr",
    title: "SCR - Presentation",
  },
  {
    name: "installationRoute",
    path: "/scr/installation",
    title: "SCR - Installation",
  },
  {
    name: "gettingStartedRoute",
    path: "/scr/gettingStarted",
    title: "SCR - Getting Started",
  },
  {
    name: "configurationOptionsRoute",
    path: "/scr/configurationOptions",
    title: "SCR - Configuration Options",
  },
  {
    name: "configurationGlobalBeforeEnterOptionRoute",
    path: "/scr/configurationBeforeEnter",
    title: "SCR - Configuration - Before Enter",
  },
  {
    name: "configurationOnErrorOptionRoute",
    path: "/scr/configurationOnError",
    title: "SCR - Configuration - On Error",
  },
  {
    name: "routeObjectOptionsRoute",
    path: "/scr/routeObjectOptions",
    title: "SCR - Route Object - Options",
  },
  {
    name: "routeObjectBeforeEnterRoute",
    path: "/scr/routeObjectBeforeEnter",
    title: "SCR - Route Object - Before Enter Functions",
  },
  {
    name: "routeObjectAfterBeforeEnterRoute",
    path: "/scr/routeObjectAfterBeforeEnter",
    title: "SCR - Route Object - After Before Function",
  },
  {
    name: "routeObjectOnErrorRoute",
    path: "/scr/routeObjectOnError",
    title: "SCR - Route Object - On Error Function",
  },
  {
    name: "routeComponentPropertiesRoute",
    path: "/scr/routeComponentProperties",
    title: "SCR - Route Component - Properties",
  },
  {
    name: "routeComponentComponentsRoute",
    path: "/scr/routeComponentComponents",
    title: "SCR - Route Component - Components",
  },
  {
    name: "navigationRoutingRoute",
    path: "/scr/navigationRouting",
    title: "SCR - Navigation - Routing",
  },
  {
    name: "navigationStoreRoute",
    path: "/scr/navigationStore",
    title: "SCR - Navigation - Store",
  },
  {
    name: "routerWithParamsDefined",
    path: "/scr/routerWithParamsDefined",
    title: "SCR - Route With Params Defined",
    params: { p1: "Route", isDefined: true },
  },
  {
    name: "routerStorePropertiesRoute",
    path: "/scr/routerStoreProperties",
    title: "SCR - Route Store - Properties",
  },
  {
    name: "testRegexPathRoute",
    path: "/scr/:teste/testRegexPathParam",
    title: "SCR - Test - Regex Path Route",
    forceReload: true,
  },
  {
    name: "testRegexPath2Route",
    path: "/scr/:firstParam/testRegexPathParam2/:secondParam",
    title: "SCR - Test - - Regex Path Route 2",
    forceReload: true,
  },
  {
    name: "testLoadingComponentWithBeforeEnterRoute",
    path: "/scr/testLoadingComponentWithBeforeEnter/:timeout",
    title: "SCR - Test - Loading Component with Before Enter",
    forceReload: true,
  },
  {
    name: "testAnyWildCardMiddle",
    path: "/scr/anyRouteWildcard/*/middle",
    title: "SCR - Test - Any Route Wildcard 1",
    forceReload: true,
  },
  {
    name: "testAnyWildCardEnd",
    path: "/scr/end/*",
    title: "SCR - Test - Any Route Wildcard 2",
    forceReload: true,
  },
  {
    name: "testAnyWildCardStringStarting",
    path: "/scr/path/some*",
    title: "SCR - Test - Any Route Wildcard 3",
    forceReload: true,
  },
  {
    name: "testAnyWildcardRouteWithPathParam",
    path: "/scr/anyRouteWildcard/*/:somePathParam",
    title: "SCR - Test - Any Route Wildcard 4",
    forceReload: true,
  },
];

export const route = {
  name: "navigationStoreRoute",
  path: "/scr/navigationStore",
  title: "SCR - Navigation - Store",
  beforeEnter: () => {},
};
