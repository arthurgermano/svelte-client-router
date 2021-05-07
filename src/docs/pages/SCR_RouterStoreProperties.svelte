<script>
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Route Store</h4>
  <p class="scr-text-justify">
    Router Store is the store where all the route definitions are updated and
    controlled. You can check real time what is happening.
    <br />
    Lets see how to import and use it:
  </p>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // Importing Router Store
    </b>
&lt;script&gt;
  import &#123; SCR_ROUTER_STORE &#125; from "svelte-client-router";

  <b class="scr-b">
    // Methods inside the store
  </b>
  SCR_ROUTER_STORE.setRoutes();
  SCR_ROUTER_STORE.getRoutes();
  SCR_ROUTER_STORE.setCurrentRoute();
  SCR_ROUTER_STORE.getCurrentRoute();
  SCR_ROUTER_STORE.setFromRoute();
  SCR_ROUTER_STORE.getFromRoute();
  SCR_ROUTER_STORE.setNavigationHistory();
  SCR_ROUTER_STORE.getNavigationHistory();
  SCR_ROUTER_STORE.pushNavigationHistory();
  SCR_ROUTER_STORE.popNavigationHistory();
  SCR_ROUTER_STORE.setCurrentLocation();
  SCR_ROUTER_STORE.getCurrentLocation();
  SCR_ROUTER_STORE.getConfig();
&lt;/script&gt;
  </pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Properties</h4>
  <p class="scr-text-justify">Let's see the inside properties:</p>
  <pre
    class="scr-pre">
&#123;
  // ## Routes
  // ## The Array object defined on initialization of the application
  // ## Array
  routes: [],

  // ## Current Location
  // ## Used inside the component to identify where it is coming from
  // ## updating based on the configuration store
  // ## Object
  currentLocation: undefined,

  // ## Current Route
  // ## The object with current route information
  // ## Updated before "after before enter function" execution
  // ## Object
  currentRoute: &#123;
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
  &#125;,

  // ## From Route
  // ## The object with from route information
  // ## Updated before "after before enter function" execution
  // ## Object
  fromRoute: &#123;
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
  &#125;,

  // ## Navigation History
  // ## An array with all the route history objects - the limit is 
  // ## defined in the configuration store
  // ## Updated before "after before enter function" execution
  // ## Array
  navigationHistory: [],
&#125;
  </pre>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routerStorePropertiesRoute",
  path: "/svelte-client-router/routerStoreProperties",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_RouterStoreProperties.svelte"),
  title: "SCR - Route Store - Properties",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="routerLinkPropertiesRoute"
        />
        <SCR_PushRouteButton
          style="float:right; opacity: 0.5"
          text="Next"
          routeName="routerStorePropertiesRoute"
          title="More content to be added"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
