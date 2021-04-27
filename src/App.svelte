<script>
  import { SCR_ROUTER_COMPONENT, SCR_CONFIG_STORE } from "./index.js";

  import SCR_C1 from "./testComponents/SCR_C1.svelte";
  import SCR_C4 from "./testComponents/SCR_C4.svelte";
  import SCR_Layout_Global from "./testComponents/SCR_Layout_Global.svelte";

  SCR_CONFIG_STORE.setNotFoundRoute("/myCustomNotFound");
  SCR_CONFIG_STORE.setConsoleLogStores(false);
  SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
  SCR_CONFIG_STORE.setHashMode(false);
  SCR_CONFIG_STORE.setOnError((err, routeObjParams) => {
    console.log("GLOBAL ERROR CONFIG", routeObjParams);
  });
  SCR_CONFIG_STORE.setBeforeEnter([
    (resolve) => {
      console.log("GBER-1");
      resolve(true);
    },
    (resolve) => {
      console.log("GBER-2");
      resolve(true);
    },
  ]);

  let routes = [
    {
      name: "rootRoute",
      path: "/svelte-client-router",
      lazyLoadComponent: () => import("./testComponents/SCR_Root.svelte"),
      lazyLoadLayoutComponent: () => import("./testComponents/SCR_Layout.svelte"),
      title: "SCR - Root Route",
    },
    {
      name: "routeOne",
      path: "/svelte-client-router/test1",
      component: SCR_C1,
      beforeEnter: [
        (resolve) => {
          console.log("beforeEnter Executed");
          setTimeout(() => resolve(true), 2000);
        },
        (resolve) => {
          console.log("beforeEnter Executed2");
          setTimeout(() => resolve({ redirect: "/svelte-client-router" }), 1000);
        },
      ],
      title: "First Route Title",
      loadingProps: { loadingText: "Carregando 1..." },
    },
    {
      name: "routeTwo",
      path: "/svelte-client-router/test2",
      lazyLoadComponent: () => import("./testComponents/SCR_C2.svelte"),
      title: "Second Route Title",
      beforeEnter: [
        (resolve, rFrom, rTo, params) => {
          console.log("beforeEnter Executed");
          console.log(params);
          setTimeout(() => resolve(true), 1000);
        },
      ],
      loadingProps: { loadingText: "Carregando 2..." },
    },
    {
      name: "routeThree",
      path: "/svelte-client-router/test3",
      component: SCR_C4,
      title: "Third Route Title",
      beforeEnter: [
        (resolve) => {
          console.log("BEFORE Enter C3");
          throw new Error("teste");
        },
      ],
      onError: (err, params) => {
        console.log("ERROR DEFINED ROUTER C1", err);
        console.log(params);
      },
    },
    {
      name: "routeFour",
      path: "/svelte-client-router/test4",
      params: {
        myCustomParam: "This Param was set in the Router Definition",
      },
      title: "Four Route Title",
      lazyLoadComponent: () => import('./testComponents/SCR_C4.svelte'),
      lazyLoadLayoutComponent: () => import("./testComponents/SCR_Layout_Global.svelte"),
      afterBeforeEnter: (routeObjParams) => {
        console.log("After BE Route Four")
        console.log(routeObjParams);
      },
      loadingProps: { loadingText: "Carregando 4..." },
    },
    {
      name: "routeFive",
      path: "/svelte-client-router/test5",
      title: "Five Route Title",
      lazyLoadComponent: () => import('./testComponents/SCR_C5.svelte'),
      loadingProps: { loadingText: "Carregando 5..." },
      ignoreLayout: true,
      ignoreGlobalBeforeFunction: true
    },
  ];

</script>

<SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={SCR_Layout_Global} allProps={{ allPropsTest: "Passing To ALL"}} />
