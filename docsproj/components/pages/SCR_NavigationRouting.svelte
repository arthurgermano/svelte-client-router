<script>
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../common/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Navigation - Routing</h4>
  <p class="scr-text-justify">There are two main methods when routing SCR.</p>
  <ul>
    <li><b>pushRoute: </b>pushes a route forward.</li>
    <li>
      <b>backRoute: </b>back to the first route history, uses
      window.history.back(-1).
    </li>
  </ul>
  <p class="scr-text-justify">
    There are no secret of using them, but <b>pushRoute</b> has some nice features.
    Lets check them:
  </p>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Push Route</h4>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // Importing pushRoute function
    </b>
import &#123; pushRoute &#125; from "svelte-client-router"

<b class="scr-b">
  // Example of Usage
</b>
&lt;script&gt;
  pushRoute("/routePath");
&lt;/script&gt;
  </pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Push Route Function Anatomy</h4>
  <p class="scr-text-justify">
    This function can receive three paramenters as it follows:
  </p>
  <ul>
    <li>
      <b>to: </b>the route path to go to. It can understand three types of
      declarations:
      <ul>
        <li><b>A string path: </b>For example: "/someRoute/to/go"</li>
        <li><b>path: </b>For example: &#123; path: "/routePath" &#125;</li>
        <li><b>name: </b>For example: &#123; name: "theRouteName" &#125;</li>
      </ul>
    </li>
    <br />
    <li>
      <b>customParams: </b>Some custom params to send to Before Enter and After
      Before Enter Functions as well the components
    </li>
    <br />
    <li>
      <b>onError: </b>A custom onError function. This is nice because you can
      override your route onError declaration. It will execute this function
      instead of the route definition declared function.
    </li>
  </ul>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Back Route</h4>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // Importing backRoute function
    </b>
import &#123; backRoute &#125; from "svelte-client-router"

<b class="scr-b">
  // Example of Usage
</b>
&lt;script&gt;
  <b class="scr-b">
  // Go to previous entered route.
  // It returns the previous route too
</b>
  backRoute();
&lt;/script&gt;
  </pre>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routeNavigationRouting",
  path: "/svelte-client-router/navigationRouting",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_NavigationRouting.svelte"),
  title: "SCR - Navigation - Routing",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="routeComponentComponentsRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="navigationStoreRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
