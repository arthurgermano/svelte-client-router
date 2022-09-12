<script>

</script>

<div class="scr-page">
  <h4 class="scr-h4">Installation</h4>
  <h5>Via npm:</h5>
  <pre class="scr-pre">
    npm install svelte-client-router
  </pre>
  <h5>Importing in your code:</h5>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // This is just an example of all possibilities exported by the package
    </b>
import &#123;  
    SCR_ROUTER_COMPONENT,
    SCR_ROUTER_LINK,
    SCR_ROUTER_STORE,
    SCR_CONFIG_STORE,
    SCR_NAVIGATE_STORE,
    pushRoute,
    backRoute,
&#125; from "svelte-client-router"
  </pre>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
    <b class="scr-b">
// This is an example of one route declaration.
// This object must go inside of an array.
// See the next chapter for more info!
    </b>
&#123;
    name: "installationRoute",
    path: "/svelte-client-router/installation",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Installation.svelte"),
    title: "SCR - Installation",
&#125;
</pre>

</div>

<style>
</style>
