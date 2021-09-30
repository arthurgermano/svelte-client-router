<script>
  import { SCR_ROUTER_LINK } from "../../../src/index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../common/SCR_PushRouteButton.svelte";
  import SCR_OnErrorAnatomy from "../common/SCR_OnErrorAnatomy.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Configuration - On Error Function</h4>
  <p class="scr-text-justify">
    The <b>onError</b> option sets a function that is going to be executed for
    any route when something goes wrong.
    <br />
    <br />
    When that happens the natural behaviour is to open the error page. In this context
    SCR has a very basic error component that comes with it. You can of course set
    you own error component and it is encouraged to do so.
    <br />
    See the <SCR_ROUTER_LINK
      to={{ name: "routeComponentComponentsRoute" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;">Route Component Components</a>
    </SCR_ROUTER_LINK> for more info.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">// importing the SCR - The configuration store</b>
import &#123; SCR_CONFIG_STORE &#125; from "svelte-client-router"

<b class="scr-b">// Setting Global On Error Function</b>
SCR_CONFIG_STORE.setOnError((err, routeObjParams) =&gt; &#123; console.error(err) &#125;);
  </pre>
  <br />
  <SCR_OnErrorAnatomy />
  
  <p class="scr-text-justify">
    So that is it for this section. This feature enables us to handle any errors
    that may occur inside our routing definitions.
  </p>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "configurationOnErrorOptionRoute",
    path: "/svelte-client-router/configurationOnError",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_ConfigurationOnError.svelte"),
    title: "SCR - Configuration - On Error",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="configurationGlobalBeforeEnterOptionRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="routeObjectOptionsRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
