<script>
  import { SCR_ROUTER_LINK } from "../../index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";
  import SCR_BeforeEnterRouteAnatomy from "../components/SCR_BeforeEnterRouteAnatomy.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Configuration - Before Enter Function</h4>
  <p class="scr-text-justify">
    The <b>beforeEnter</b> option sets an array of functions or just a function
    that must be executed for before each route if the option
    <b>ignoreGlobalBeforeFunction</b>
    isn't set in the route definition object.
    <br />
    <br />
    The default order of execution is first execute all Global Before Functions and
    then execute route object before enter functions. But for a particular route
    the behaviour maybe different. Maybe it is needed to execute the route before
    function before Global Before Functions.
    <br />
    <br />
    If that is the case then you can set in the route object the option
    <b>executeRouteBEFBeforeGlobalBEF</b> to true. When this option is enabled
    in the route definition object the default order of execution is overrided
    and executes route object before functions before Global Before Functions.
    <br />
    <br />
    See the <SCR_ROUTER_LINK
      to={{ name: "routeObjectOptionsRoute" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;">Route Object Properties</a>
    </SCR_ROUTER_LINK> for more info.
    <br />
    <br />
    See the next example of how to set this option:
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">// importing the SCR - The configuration store</b>
import &#123; SCR_CONFIG_STORE &#125; from "svelte-client-router"

<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Global Before Enter Function</b>
SCR_CONFIG_STORE.setBeforeEnter((resolve) =&gt; &#123; resolve(true); &#125;);

<b class="scr-b">// OR </b>

<b class="scr-b">// ------ SETTING AN ARRAY OF FUNCTIONS ------ </b>
<b class="scr-b">// Setting Global Before Enter Functions</b>
<b class="scr-b">// You can set as many Before Enter Functions as you want!</b>
SCR_CONFIG_STORE.setBeforeEnter([
  (resolve) =&gt; &#123; resolve(true); &#125;,
  (resolve) =&gt; &#123; resolve(true); &#125;,
  (resolve) =&gt; &#123; resolve(true); &#125;,
]);
  </pre>
  <br />
  <SCR_BeforeEnterRouteAnatomy />
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "configurationGlobalBeforeEnterOptionRoute",
    path: "/svelte-client-router/configurationBeforeEnter",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration - Before Enter",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="configurationOptionsRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="configurationOnErrorOptionRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
