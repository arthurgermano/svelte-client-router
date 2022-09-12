<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Presentation", text: "Presentation" }}
  forward={{ name: "v2_Getting_Started", text: "Getting Started" }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Installation</h4>
    <h5 class="scr-h5">Via npm:</h5>
    <pre class="scr-pre">
npm install svelte-client-router
</pre>
    <h5 class="scr-h5">Importing in your code:</h5>
    <pre class="scr-pre">
<b class="scr-b">// This is just an example of all possibilities exported by the package
</b>import &#123;  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
&#125; from "svelte-client-router"
</pre>
    <center >
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
<b class="scr-b">// This is an example of one route declaration.
// This object must go inside of an array.
// See the next chapter for more info!</b>
&#123;
  name: "v2_Installation",
  path: "/svelte-client-router/v2/installation",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_Installation.svelte"),
  title: "SCR - Installation - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div>
</SCR_Page>

<style>
</style>
