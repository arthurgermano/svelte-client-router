<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Router_Link", text: "Router Link" }}
  forward={{ name: "v2_Test_Regex_Path", text: "Test - Regex Path" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Store</h4>
  <p class="scr-text-justify">
    Router Store is the store where all the route definitions are updated and
    controlled. You can check real time what is happening.
    <br />
    <br />
    It is a Svelte Store and can be use with $routesStore inside svelte components!
    <br />
    Lets see how to import and use it:
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing Router Store
</b>&lt;script&gt;
  import &#123; routesStore &#125; from "svelte-client-router";
<b class="scr-b">
  // Methods inside the store
</b>  routesStore.setRoutes();
  routesStore.getRoutes();
  routesStore.resetRoutes();
  routesStore.setCurrentRoute();
  routesStore.getCurrentRoute();
  routesStore.setLastRoute();
  routesStore.getLastRoute();
  routesStore.setNavigationHistory();
  routesStore.getNavigationHistory();
  routesStore.pushNavigationHistory();
  routesStore.getNotFoundRoute();
&lt;/script&gt;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Properties</h4>
  <p class="scr-text-justify">Let's see the inside properties:</p>
  <pre
    class="scr-pre">&#123;
  // ## Routes
  // ## The Array object defined on initialization of the application
  // ## Array
  routes: [],

  // ## Current Route
  // ## The object with current route information
  // ## Updated before "after before enter function" execution
  // ## Object
  currentRoute: &#123;
    routeId: undefined,
    name: undefined,
    path: undefined,
    fullPath: undefined,
    pathname: undefined,
    queryParams: &#123;&#125;,
    pathParams: &#123;&#125;,
    params: &#123;&#125;,
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: &#123;&#125;,
    redirected: undefined,
  &#125;,

  // ## Last Route
  // ## The object with last route information
  // ## Updated before "after before enter function" execution
  // ## Object
  lastRoute: &#123;
    routeId: undefined,
    name: undefined,
    path: undefined,
    fullPath: undefined,
    pathname: undefined,
    queryParams: &#123;&#125;,
    pathParams: &#123;&#125;,
    params: &#123;&#125;,
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: &#123;&#125;,
    redirected: undefined,
  &#125;,

  // ## Navigation History
  // ## An array with all the route history objects - the limit is 
  // ## defined in the configuration store
  // ## Updated before "after before enter function" execution
  // ## Array
  navigationHistory: [],
&#125;
</pre>
  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "v2_Routes_Store",
  path: "/svelte-client-router/v2/routesStore",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_RoutesStore.svelte"),
  title: "SCR - Routes Store - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
</SCR_Page>

<style>
</style>
