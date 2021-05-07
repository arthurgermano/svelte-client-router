<script>
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Route Link</h4>
  <p class="scr-text-justify">
    The Route Link is a component wrapper to make links. Easy to click and
    execute what you want. It is totally customisable.
    <br />
    Lets see how to import and use it:
  </p>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // Importing Navigate Store
    </b>
&lt;script&gt;
  import &#123; SCR_ROUTE_LINK &#125; from "svelte-client-router";
&lt;/script&gt;

<b class="scr-b">
  &lt;--! Example of Usage --&gt;
</b>
&lt;SCR_ROUTER_LINK
  to=&#123;&#123; name: "routeComponentComponentsRoute" &#125;&#125;
  elementProps=&#123;&#123; style: "display: inline; cursor: pointer;" &#125;&#125;
&gt;
  &lt;a style="pointer-events: none;"&gt;
  components - that can be check in the next section -&lt;/a&gt;, 
  and some are crucial for it to work correctly.

&lt;/SCR_ROUTER_LINK&gt;
  </pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Properties</h4>
  <p class="scr-text-justify">
    Pretty easy to use, isn't it? So now lets check out the component exported
    properties:
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
      <b>props: </b>Some custom params to send to Before Enter and After Before
      Enter Functions as well the components
    </li>
    <br />
    <li>
      <b>onError: </b>A custom onError function. This is nice because you can
      override your route onError declaration. It will execute this function
      instead of the route definition declared function.
    </li>
    <br />
    <li>
      <b>elementProps: </b>This is all the HTML properties to pass to parent div
      so you can customize it at your own will.
    </li>
  </ul>
  <p class="scr-text-justify">Lets see another example:</p>
  <pre
    class="scr-pre">
    <b class="scr-b">
      // Importing Navigate Store
    </b>
&lt;script&gt;
  import &#123; SCR_ROUTE_LINK &#125; from "svelte-client-router";
&lt;/script&gt;

<b class="scr-b">
  &lt;--! Another Example of Usage --&gt;
</b>
&lt;SCR_ROUTER_LINK 
  to=&#123;&#123;name: "myRouteNameThree" &#125;&#125;
  props=&#123;&#123; pushCustomParam: "someCustomParams" &#125;&#125;
  elementProps=&#123;&#123; style:"background-color: green" &#125;&#125;
  onError=&#123;(err, routeObjParams) =&gt; console.log("Execute this instead error defined on router object! - Only if something goes wrong&#125;
&gt;
  &lt;button&gt;Click to Go to Defined Route Named: myRouteNameThree!&lt;/button&gt;
&lt;/SCR_ROUTER_LINK&gt;
  </pre>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "routerLinkPropertiesRoute",
  path: "/svelte-client-router/routerLinkProperties",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_RouterLinkProperties.svelte"),
  title: "SCR - Route Link - Properties",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="navigationStoreRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="routerStorePropertiesRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
