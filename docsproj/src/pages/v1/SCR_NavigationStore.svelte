<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v1_Navigation_Routing", text: "Navigation Routing" }}
  forward={{ name: "v1_Router_Link", text: "Router Link" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Navigation - Store</h4>
  <p class="scr-text-justify">
    As well as the previous section you can import the entire navigation store.
    This is not recommend though. If you can use the methods directly it is
    recommended to you to do so. Because when pushing routes there is a flow to
    be followed. Anyway just so you know there is this store and you can check
    it like below.
    <br />
    <br />
    For more info about the anatomy of the functions provided go back to the previous
    section.
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing Navigate Store
    </b>
import &#123;  
    SCR_NAVIGATE_STORE,
&#125; from "svelte-client-router"
<b class="scr-b">
// Example of Usage
</b>&lt;script&gt;
  <b class="scr-b">
  // Go to defined path route
</b>  SCR_NAVIGATE_STORE.pushRoute("/routePath");
  <b class="scr-b">
  // Go to previous entered route.
  // It returns the previous route too
</b>  SCR_NAVIGATE_STORE.backRoute();

&lt;/script&gt;
</pre>
  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routeNavigationStore",
  path: "/svelte-client-router/navigationStore",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_NavigationStore.svelte"),
  title: "SCR - Navigation - Store",
&#125;
</pre>
</SCR_Page>

<style>
</style>
