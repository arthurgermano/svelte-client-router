<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../../src/index.js";
</script>

<SCR_Page
  back={{
    name: "v1_Route_Component_Properties",
    text: "Route Component Properties",
  }}
  forward={{ name: "v1_Navigation_Routing", text: "Navigation Routing" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Component - Components</h4>
  <p class="scr-text-justify">
    As said throught this documentation it is encouraged to provide your own
    custom components. SCR functions can work with no component provided by you.
    But it is not ideal they are very simple and minimalistic.
    <br />
    Lets see all the components one by one:
  </p>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Layout Component</h4>
  <p class="scr-text-justify">
    The Layout Component is the layout used to encapsulate all your route
    components. It can be override on route declaration object for an specific
    one for that route.
    <br />
    It must be declared a default slot inside of the Layout Component or else your
    route component will not be drawed.
    <br />
    <br />
    The Global Layout must be passed to SCR Router Component as exampled below:
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing your components</b>
import &#123; SCR_ROUTER_COMPONENT &#125; from "svelte-client-router"
import SCR_Layout from "../testComponents/SCR_Layout.svelte";

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
/&gt;
</pre>
  <p class="scr-text-justify">Next an example of Svelte Layout Component:</p>
  <pre
    class="scr-pre"><b class="scr-b">// Example of a Svelte Layout Component</b>
&lt;script&gt;
  import SCR_Menu from "./SCR_Menu.svelte";
  import SCR_Footer from "./SCR_Footer.svelte";

  <b class="scr-b">// This two following variables are always available in the layout component</b>
  export let currentRoute;
  export let fromRoute;

  <b class="scr-b">
  // Any other params declared on before enter functions 
  // all props, payload, etc.. will be made available here too
  </b>
  ...
&lt;/script&gt;

&lt;div class="scr-main-layout"&gt;
  &lt;div class="scr-header"&gt;
    &lt;slot name="scr_header"&gt;
      &lt;h2 class="scr-main-layout__header"&gt;
        Svelte Client Router - The Svelte SPA Router!
      &lt;/h2&gt;

    <b class="scr-b">&lt;--! REMEMBER TO DECLARE A DEFAULT SLOT! -&gt;</b>
    &lt;/slot&gt;

  &lt;/div&gt;
  &lt;div class="scr-main"&gt;
    &lt;SCR_Menu /&gt;
    &lt;div class="scr-pages"&gt;&lt;slot /&gt;&lt;/div&gt;
  &lt;/div&gt;
  &lt;div&gt;&lt;SCR_Footer /&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Loading Component</h4>
  <p class="scr-text-justify">
    The Loading Component is the loading screen used to show when before enter
    routes are been processed.
    <br />
    It will receive <b>allLoadingProps</b> declared and any route object
    <b>loadingProps</b> defined.
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing your components</b>
import &#123; SCR_ROUTER_COMPONENT &#125; from "svelte-client-router"
import SCR_Loading from "../testComponents/SCR_Loading.svelte";

<b class="scr-b">// Define the router object array</b>
const routes = [
  &#123;
    ... <b class="scr-b">// Your routes definitions</b>
  &#125;
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  loadingComponent=&#123;SCR_Loading&#125;
/&gt;
</pre>
  <p class="scr-text-justify">Next an example of Svelte Loading Component:</p>
  <pre
    class="scr-pre"><b class="scr-b">// Example of a Svelte Loading Component</b>
&lt;script&gt;

  <b class="scr-b">// This variable was passed on loadingProps - Route Object Definition </b>
  export let loadingText = "Loading...";
&lt;/script&gt;

&lt;center &gt;
  &lt;div class="scr-lds-spinner"&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
  &lt;/div&gt;
  &lt;h1 class="scr-h1"&gt;&#123;loadingText&#125;&lt;/h1&gt;
&lt;/center&gt;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Not Found Component</h4>
  <p class="scr-text-justify">
    The Not Found Component is the component that will be loaded when the user
    try to access a not existent route - only if there isn't any route declared with an wildcard "*"
    to match all routes.
    <br />
    See the <SCR_RouterLink
      params={{ name: "v1_Route_Object_Properties" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;">Route Object Properties - <b>Path Property</b></a>
    </SCR_RouterLink> for more info.
    <br />
    It will receive all the parameters available.
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing your components</b>
import &#123; SCR_ROUTER_COMPONENT &#125; from "svelte-client-router"
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
  notFoundComponent=&#123;SCR_NotFound&#125;
/&gt;
</pre>
  <p class="scr-text-justify">Next an example of Svelte Not Found Component:</p>
  <pre
    class="scr-pre"><b class="scr-b">// Example of a Svelte Not Found Component</b>
&lt;script&gt;

  <b class="scr-b">// Example of route store usage </b>
  import routerStore from "../../src/js/store/router.js";

&lt;/script&gt;
&lt;center &gt;
  &lt;p class="scr-p"&gt;Not Found&lt;/p&gt;
  &lt;p class="scr-p-small"&gt;&#123;$routerStore.currentLocation || "='("&#125;&lt;/p&gt;
&lt;/center&gt;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Error Component</h4>
  <p class="scr-text-justify">
    The Error Component is the component that must be loaded when something goes
    wrong on routing.
    <br />
    It will receive all the parameters available.
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing your components</b>
import &#123; SCR_ROUTER_COMPONENT &#125; from "svelte-client-router"
import SCR_Error from "../testComponents/SCR_Error.svelte";

<b class="scr-b">// Define the router object array</b>
const routes = [
  &#123;
    ... <b class="scr-b">// Your routes definitions</b>
  &#125;
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  errorComponent=&#123;SCR_Error&#125;
/&gt;
</pre>
  <p class="scr-text-justify">Next an example of Svelte Error Component:</p>
  <pre
    class="scr-pre"><b class="scr-b">// Example of a Svelte Error Component</b>
&lt;script&gt;

  <b class="scr-b">// This variable was passed on onError Function </b>
  export let errorMessage = "An error has occured!";

&lt;/script&gt;

&lt;center &gt;
  &lt;p class="scr-p"&gt;Error&lt;/p&gt;
  &lt;p class="scr-p-small"&gt;&#123;errorMessage&#125;&lt;/p&gt;
&lt;/center&gt;
</pre>

  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routeComponentComponentsRoute",
  path: "/svelte-client-router/routeComponentComponents",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_RouteComponentComponents.svelte"),
  title: "SCR - Route Component - Components",
&#125;
</pre>
</SCR_Page>

<style>
</style>
