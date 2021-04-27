<script>
  import { SCR_ROUTER_COMPONENT, SCR_CONFIG_STORE } from "svelte-client-router";

  import SCR_C1 from "./testComponents/SCR_C1.svelte";
  import SCR_C3 from "./testComponents/SCR_C3.svelte";
  import SCR_Layout_Global from "./testComponents/SCR_Layout_Global.svelte";

  SCR_CONFIG_STORE.setNotFoundRoute("/myCustomNotFound");
  SCR_CONFIG_STORE.setConsoleLogStores(false);
  SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
  SCR_CONFIG_STORE.setHashMode(false);
  SCR_CONFIG_STORE.setOnError((err, routeObjParams) => {
    console.log("GLOBAL ERROR CONFIG", routeObjParams);
  });
  SCR_CONFIG_STORE.setBeforeEnter([
    (resolve, rFrom, rTo, p) => {
      console.log(rFrom);
      console.log(rTo);
      resolve(true);
    },
    (resolve) => {
      console.log("GBER-2");
      resolve(true);
    },
  ]);

  let routes = [
    {
      name: "1",
      path: "/test1",
      component: SCR_C1,
      executeRouteBEFBeforeGlobalBEF: false,
      ignoreGlobalBeforeFunction: false,
      beforeEnter: [
        (resolve) => {
          console.log("beforeEnter Executed");
          setTimeout(() => resolve(true), 2000);
        },
        (resolve) => {
          console.log("beforeEnter Executed2");
          setTimeout(() => resolve({ redirect: "/test4" }), 1000);
        },
      ],
      title: "First Route Title",
      params: {
        myCustomParam: "OK THEN SHALL WE!",
      },
      loadingProps: { loadingText: "Carregando 1..." },
    },
    {
      name: "2",
      path: "/test2",
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
      name: "3",
      path: "/test3",
      component: SCR_C3,
      params: {
        myCustomParam: "OK THEN SHALL WE!",
      },
      beforeEnter: [
        (resolve) => {
          console.log("BEFORE ENTEDER C3");
          throw new Error("teste");
          resolve(true);
        },
      ],
      onError: (err, params) => {
        console.log("ERROR DEFINED ROUTER C1", err);
        console.log(params);
      },
    },
    {
      name: "4",
      path: "/test4",
      params: {
        myCustomParam: "OK THEN SHALL WE!",
      },
      title: "I SHOUT",
      lazyLoadComponent: () => import('./testComponents/SCR_C3.svelte'),
      lazyLoadLayoutComponent: () => import("./testComponents/SCR_Layout.svelte"),
      afterBeforeEnter: (routeObjParams) => {
        console.log("After BE")
        console.log(routeObjParams);
      },
      loadingProps: { loadingText: "Carregando 4..." },
    },
    {
      name: "5",
      path: "/test5",
      params: {
        myCustomParam: "OK THEN SHALL WE!",
      },
      title: "I SHOUT",
      lazyLoadComponent: () => import('./testComponents/SCR_C5.svelte'),
      loadingProps: { loadingText: "Carregando 5..." },
      ignoreLayout: true
    },
    {
      name: "6",
      path: "/test6",
      params: {
        myCustomParam: "OK THEN SHALL WE!",
      },
      title: "I SHOUT",
      lazyLoadComponent: () => import('./testComponents/SCR_C6.svelte'),
      
      loadingProps: { loadingText: "Carregando 6..." },
    },
  ];

</script>

<SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={SCR_Layout_Global} />
