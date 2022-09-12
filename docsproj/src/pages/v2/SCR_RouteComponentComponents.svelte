<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../../src/index.js";
</script>

<SCR_Page
  back={{
    name: "v2_Route_Component_Properties",
    text: "Route Component Properties",
  }}
  forward={{ name: "v2_Navigation_Routing", text: "Navigation Routing" }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Route Component - Components</h4>
    <p class="scr-text-justify">
      In the first version, SCR had a lot of default components to facilitate
      usage, like layout components, error and not found components that would
      pop up to a given case. 
      <br /><br />
      The second version is very succinct in that
      matter, it is focused to deliver routing leaving to you to specify a the
      components. Layout, Error and Not Found components must be set by you in
      this version.
      <br />
      So now in this version we have only one component we can set. Let's check it:
    </p>
    <hr class="scr-hr" />
    <h4 class="scr-h4">Default Loading Component</h4>
    <p class="scr-text-justify">
      The Default Loading Component is the default loading screen used to show when before enter
      routes are been processed.
      <br />
      It will receive <b>defaultLoadingParams</b> declared and any route object
      <b>loadingParams</b> defined.
    </p>
    <pre class="scr-pre"><b class="scr-b">// Importing your components</b>
import &#123; SCR_Router &#125; from "svelte-client-router"
import SCR_Loading from "../testComponents/SCR_Loading.svelte";

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
/&gt;
</pre>
    <p class="scr-text-justify">Next an example of Svelte Loading Component:</p>
    <pre class="scr-pre"><b class="scr-b"
        >// Example of a Svelte Loading Component</b
      >
&lt;script&gt;

  <b class="scr-b"
        >// This variable was passed on loadingProps - Route Object Definition </b>
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
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Route_Component_Components",
  path: "/svelte-client-router/v2/routeComponentComponents",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_RouteComponentComponents.svelte"),
  title: "SCR - Route Component Components - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div></SCR_Page
>

<style>
</style>
