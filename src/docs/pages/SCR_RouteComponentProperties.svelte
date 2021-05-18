<script>
  import { SCR_ROUTER_LINK } from "../../index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Route Component - Properties</h4>
  <p class="scr-text-justify">
    The route component is a <a
      href="https://svelte.dev/tutorial/basics"
      target="_blank">Svelte Component</a
    >
    , so it can receive parameters to pass further. Some of these parameters are
    <SCR_ROUTER_LINK
      to={{ name: "routeComponentComponentsRoute" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;"
        >components - that can be check in the next section -</a
      >, and some are crucial for it to work correctly.
    </SCR_ROUTER_LINK>
    <br />
    <br />

    Lets see these parameters that aren't components:
  </p>
  <pre
    class="scr-pre">

<b class="scr-b">// Importing the router component</b>
import &#123; SCR_ROUTER_COMPONENT &#125; from "svelte-client-router"
import SCR_Layout from "../testComponents/SCR_Layout.svelte";
import SCR_Loading from "../testComponents/SCR_LoadingComponent.svelte";
import SCR_Error from "../testComponents/SCR_Error.svelte";
import SCR_NotFound from "../testComponents/SCR_NotFound.svelte";

<b class="scr-b">// Define the router object array</b>
const routes = [
  &#123;
    ... <b class="scr-b">// Your routes definitions</b>
  &#125;
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  defaultLayoutComponent=&#123;SCR_Layout&#125;
  notFoundComponent=&#123;SCR_NotFound&#125;
  errorComponent=&#123;SCR_Error&#125;
  loadingComponent=&#123;SCR_Loading&#125;
  allProps=&#123;... <b class="scr-b">// Passing parameters to be available in and routes and all components</b> &#125;
  allLoadingProps=&#123;... <b class="scr-b">// Passing parameters to be available in and routes in loading component</b> &#125;
/&gt;

  </pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Routes</h4>
  <p class="scr-text-justify">
    This is where you declare all your routes. It is the index of your
    application. It has several options that you can configure.
    <br />
    For more information see the <SCR_ROUTER_LINK
      to={{ name: "routeObjectOptionsRoute" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;"
        >route object properties section.</a
      >
    </SCR_ROUTER_LINK>
    <br />
    <br />
    Lets check out a complete example of declaration with all possible options:
  </p>
  <pre
    class="scr-pre">

<b class="scr-b">// Setting Route Object Definition Example</b>
const routes = [
  &#123;
    name: "routeName1",
    path: "/test1",

    component: SCR_C1,
    
    <b class="scr-b">// This property has preference over component property</b>
    lazyLoadComponent: () =&gt;
      import("./docs/pages/SCR_RouteComponentProperties.svelte"),
    
    layout: SCR_Layout,

    <b class="scr-b">// This property has preference over layout property</b>
    lazyLoadLayoutComponent: () =&gt;
      import("./docs/SCR_Layout.svelte"),

    loadingComponent: SCR_Loading,

    <b class="scr-b">// This property has preference over loadingComponent property</b>
    lazyLoadLoadingComponent: () =&gt;
      import("./docs/SCR_Layout.svelte"),

    ignoreLayout: false,
    ignoreScroll: false,
    scrollProps: &#123;
      top: 0,
      left: 0,
      behavior: "smooth",
      timeout: 10, // timeout must be greater than 10 milliseconds
    &#125;,
    title: "First Route Title",
    params: &#123; myCustomParam: "text param!", &#125;
    loadingProps: &#123; textLoading: "Loading this route...", &#125;
    ignoreGlobalBeforeFunction: false,
    executeRouteBEFBeforeGlobalBEF: false,
    forceReload: false,
    afterBeforeEnter: (routeObjParams) =&gt; console.log(routeObjParams)
    beforeEnter: [
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
    ],
    onError: (err, routeObjParams) =&gt; console.error(err)
  &#125;,
]
  </pre>
  <p class="scr-text-justify">
    Each route defined inside the route array object can have these options.
    Very robust and we can see that SCR is focused on before enter behaviour.
  </p>
  <hr class="scr-hr" />
  <h4 class="scr-h4">All Props</h4>
  <p class="scr-text-justify">
    The <b>allProps</b> option can be passed to the router component. It must be
    an object with all the properties that you want to deliver to every route and
    component. This property will be made available everywhere.
  </p>
  <pre
    class="scr-pre">

<b class="scr-b">// Example</b>
const allProps = &#123;
  passToAll: "OK"
&#125;
  </pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">All Loading Props</h4>
  <p class="scr-text-justify">
    The <b>allLoadingProps</b> option can be passed to the router component. It must
    be an object with all the properties that you want to deliver to every route
    when loading the component.
  </p>
  <pre
    class="scr-pre">

<b class="scr-b">// Example</b>
const allLoadingProps = &#123;
  passToAll: "OK"
&#125;
  </pre>
  <p class="scr-text-justify">
    Now that we saw the basic properties of the component. In the next section
    we will explore the SCR component components properties.
  </p>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routeComponentPropertiesRoute",
  path: "/svelte-client-router/routeComponentProperties",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_RouteComponentProperties.svelte"),
  title: "SCR - Route Component - Properties",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="routeObjectOnErrorRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="routeComponentComponentsRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
