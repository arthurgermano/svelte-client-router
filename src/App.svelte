<script>
  import { SCR_ROUTER_COMPONENT, SCR_CONFIG_STORE } from "./index.js";

  import SCR_Layout from "./docs/SCR_Layout.svelte";

  // Setting configurations of the SCR Router
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/configurationOptions
  SCR_CONFIG_STORE.setNotFoundRoute(
    "/svelte-client-router/myCustomNotFoundRoute"
  );
  SCR_CONFIG_STORE.setErrorRoute("/svelte-client-router/myCustomErrorRoute");
  SCR_CONFIG_STORE.setConsoleLogStores(false);
  SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
  SCR_CONFIG_STORE.setHashMode(true);
  SCR_CONFIG_STORE.setUseScroll(true);
  SCR_CONFIG_STORE.setScrollProps({
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10,
  });

  // Setting global error function 
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/configurationOnError
  SCR_CONFIG_STORE.setOnError((err, routeObjParams) => {
    console.log("GLOBAL ERROR CONFIG", routeObjParams);
  });

  // Setting the route object definition
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/routeObjectOptions
  let routes = [
    {
      name: "root",
      path: "/",
      beforeEnter: [
        (resolve, rFrom, rTo, params, payload) => {
          resolve({ redirect: "/svelte-client-router" });
        },
      ],
    },
    {
      name: "rootRoute",
      path: "/svelte-client-router",
      lazyLoadComponent: () => import("./docs/pages/SCR_Presentation.svelte"),
      title: "SCR - Presentation",
    },
    {
      name: "installationRoute",
      path: "/svelte-client-router/installation",
      lazyLoadComponent: () => import("./docs/pages/SCR_Installation.svelte"),
      title: "SCR - Installation",
    },
    {
      name: "gettingStartedRoute",
      path: "/svelte-client-router/gettingStarted",
      lazyLoadComponent: () => import("./docs/pages/SCR_GettingStarted.svelte"),
      title: "SCR - Getting Started",
    },
    {
      name: "configurationOptionsRoute",
      path: "/svelte-client-router/configurationOptions",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_ConfigurationOptions.svelte"),
      title: "SCR - Configuration Options",
    },
    {
      name: "configurationGlobalBeforeEnterOptionRoute",
      path: "/svelte-client-router/configurationBeforeEnter",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_ConfigurationBeforeEnter.svelte"),
      title: "SCR - Configuration - Before Enter",
    },
    {
      name: "configurationOnErrorOptionRoute",
      path: "/svelte-client-router/configurationOnError",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_ConfigurationOnError.svelte"),
      title: "SCR - Configuration - On Error",
    },
    {
      name: "routeObjectOptionsRoute",
      path: "/svelte-client-router/routeObjectOptions",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteObjectProperties.svelte"),
      title: "SCR - Route Object - Options",
    },
    {
      name: "routeObjectBeforeEnterRoute",
      path: "/svelte-client-router/routeObjectBeforeEnter",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteObjectBeforeEnter.svelte"),
      title: "SCR - Route Object - Before Enter Functions",
    },
    {
      name: "routeObjectAfterBeforeEnterRoute",
      path: "/svelte-client-router/routeObjectAfterBeforeEnter",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte"),
      title: "SCR - Route Object - After Before Function",
    },
    {
      name: "routeObjectOnErrorRoute",
      path: "/svelte-client-router/routeObjectOnError",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteObjectOnError.svelte"),
      title: "SCR - Route Object - On Error Function",
    },
    {
      name: "routeComponentPropertiesRoute",
      path: "/svelte-client-router/routeComponentProperties",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteComponentProperties.svelte"),
      title: "SCR - Route Component - Properties",
    },
    {
      name: "routeComponentComponentsRoute",
      path: "/svelte-client-router/routeComponentComponents",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouteComponentComponents.svelte"),
      title: "SCR - Route Component - Components",
    },
    {
      name: "navigationRoutingRoute",
      path: "/svelte-client-router/navigationRouting",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_NavigationRouting.svelte"),
      title: "SCR - Navigation - Routing",
    },
    {
      name: "navigationStoreRoute",
      path: "/svelte-client-router/navigationStore",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_NavigationStore.svelte"),
      title: "SCR - Navigation - Store",
    },
    {
      name: "routerLinkPropertiesRoute",
      path: "/svelte-client-router/routerLinkProperties",
      lazyLoadComponent: () =>
        import("./docs/pages/SCR_RouterLinkProperties.svelte"),
      title: "SCR - Route Link - Properties",
    },
  ];
</script>

<!-- Using SCR_ROUTER_COMPONENT -->
<!-- https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/routeComponentProperties -->
<!-- https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/routeComponentComponents -->
<SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={SCR_Layout} />
