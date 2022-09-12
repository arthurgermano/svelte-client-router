<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../../src/index.js";
</script>

<SCR_Page
  back={{
    name: "v2_Route_Object_Before_Enter",
    text: "Route Object Before Enter",
  }}
  forward={{
    name: "v2_Route_Component_Components",
    text: "Route Component Components",
  }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Route Component - Properties</h4>
    <p class="scr-text-justify">
      The route component is a <a
        href="https://svelte.dev/tutorial/basics"
        target="_blank">Svelte Component</a
      >, so it can receive parameters to pass further. Some of these parameters
      are
      <SCR_RouterLink
        params={{ name: "v2_Route_Component_Components" }}
        elementProps={{ style: "display: inline; cursor: pointer;" }}
      >
        <a href="/" style="pointer-events: none;"
          >components - that can be check in the next section -</a
        > and some are crucial for it to work correctly.
      </SCR_RouterLink>
      <br />
      <br />

      Lets see these parameters of the Router Component:
    </p>
    <pre class="scr-pre"><b class="scr-b">// Importing the router component</b>
import &#123; SCR_Router, scr_router &#125; from "svelte-client-router"
import SCR_Loading from "../testComponents/SCR_LoadingComponent.svelte";

<b class="scr-b">// Define the router object array</b>
const routes = [
  &#123;
    ... <b class="scr-b">// Your routes definitions</b>
  &#125;
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_Router 
  bind:routes 
  defaultLoadingComponent=&#123;SCR_Loading&#125;
  defaultLoadingParams=&#123;... <b class="scr-b">// Passing parameters to be available in loading components</b
      > &#125;
/&gt;
</pre>
    <hr class="scr-hr" />
    <h4 class="scr-h4">Routes</h4>
    <p class="scr-text-justify">
      This is where you declare all your routes. It is the index of your
      application. It has several options that you can configure.
      <br />
      For more information see the <SCR_RouterLink
        params={{ name: "v2__Route_Object_Properties" }}
        elementProps={{ style: "display: inline; cursor: pointer;" }}
      >
        <a href="/" style="pointer-events: none;"
          >route object properties section.</a
        >
      </SCR_RouterLink>
      <br />
      <br />
      Lets check out a complete example of declaration with all possible options:
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// Setting Route Object Definition Example</b
      >
const routes = [
  &#123;
    name: "routeName1",
    path: "/test1",

    component: SCR_C1,

    loadingComponent: SCR_Loading,

    <b class="scr-b"
        >// This property has preference over loadingComponent property</b
      >
    lazyLoadLoadingComponent: () =&gt;
      import("./docs/SCR_Layout.svelte"),

    ignoreScroll: false,
    scrollProps: &#123;
      target: false,
      top: 0,
      left: 0,
      behavior: "smooth",
      timeout: 10, // timeout must be greater than 10 milliseconds
    &#125;,
    title: "First Route Title",
    params: &#123; myCustomParam: "text param!", &#125;
    loadingParams: &#123; textLoading: "Loading this route...", &#125;
    ignoreGlobalBeforeFunction: false,
    executeRouteBEFBeforeGlobalBEF: false,
    forceReload: false,
    afterEnter: (params) =&gt; console.log(params)
    beforeEnter: [
      (&#123; resolve, reject, routeFrom, routeTo &#125;, payload) =&gt; resolve(true),
      (&#123; resolve, reject, routeFrom, routeTo &#125;, payload) =&gt; resolve(true),
      (&#123; resolve, reject, routeFrom, routeTo &#125;, payload) =&gt; resolve(true),
    ],
    onError: (error) =&gt; console.error(error)
  &#125;,
]
</pre>
    <p class="scr-text-justify">
      Each route defined inside the route array object can have these options.
      Very robust and we can see that SCR is focused on before enter behaviour.
    </p>
    <hr class="scr-hr" />
    <h4 class="scr-h4">Default Loading Params</h4>
    <p class="scr-text-justify">
      The <b>defaultLoadingParams</b> option can be passed to the router component. It
      must be an object with all the properties that you want to deliver to every
      loading component.
    </p>
    <pre class="scr-pre"><b class="scr-b">// Example</b>
const defaultLoadingParams = &#123;
  availableOnLoading: "OK"
&#125;
</pre>
    <p class="scr-text-justify">
      Now that we saw the basic properties of the component. In the next section
      we will explore the SCR component components properties.
    </p>
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Route_Component_Properties",
  path: "/svelte-client-router/v2/routeComponentProperties",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_RouteComponentProperties.svelte"),
  title: "SCR - Route Component Properties - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div></SCR_Page
>

<style>
</style>
