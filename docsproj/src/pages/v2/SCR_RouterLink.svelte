<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Navigation_Routing", text: "Navigation Routing" }}
  forward={{ name: "v2_Routes_Store", text: "Routes Store" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Link</h4>
  <p class="scr-text-justify">
    The Route Link is a component wrapper to make links. Easy to click and
    execute what you want. It is totally customisable.
    <br />
    Lets see how to import and use it:
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Importing Navigate Store, both ways work equally
</b>&lt;script&gt;
  import &#123; SCR_RouterLink, scr_router_link &#125; from "svelte-client-router";
&lt;/script&gt;
<b class="scr-b">
&lt;--! Example of Usage --&gt;
</b>&lt;SCR_RouterLink
  params=&#123;&#123; name: "v2_Router_Link" &#125;&#125;
  elementProps=&#123;&#123; style: "display: inline; cursor: pointer;" &#125;&#125;
&gt;
  &lt;a style="pointer-events: none;"&gt;
    components - that can be check in the next section, 
    and some are crucial for it to work correctly.
  -&lt;/a&gt;
&lt;/SCR_RouterLink&gt;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Properties</h4>
  <p class="scr-text-justify">
    Pretty easy to use, isn't it? So now lets check out the component exported
    properties:
  </p>
  <ul>
    <li>
      <b>params: </b>the route path to go to. It can understand three types of
      declarations:
      <ul>
        <li><b>A string path: </b>For example: "/someRoute/to/go"</li>
        <li><b>path: </b>For example: &#123; path: "/routePath" &#125;</li>
        <li><b>name: </b>For example: &#123; name: "theRouteName" &#125;</li>
      </ul>
    </li>
    <br />
    <li>
      <b>params.params: </b>Some custom params to send to Before Enter and After Before
      Enter Functions as well the components
    </li>
    <br />
    <li>
      <b>params.onError: </b>A custom onError function. This is nice because you can
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
    class="scr-pre"><b class="scr-b">// Importing Navigate Store
</b>&lt;script&gt;
  import &#123; SCR_RouterLink &#125; from "svelte-client-router";
&lt;/script&gt;
<b class="scr-b">
&lt;--! Another Example of Usage --&gt;
</b>&lt;SCR_RouterLink 
  params=&#123;
    &#123;
      name: "My_Route_Name_Three", 
      params: &#123 myCustomParam: "Only for this Link"&#125,
      onError: (error) =&gt; console.log("Execute this instead error defined on router object! - Only if something goes wrong),
    &#125;
  &#125;
  elementProps=&#123;&#123; style:"background-color: green" &#125;&#125;
&gt;
  &lt;button&gt;Click to Go to Defined Route Named: My_Route_Name_Three!&lt;/button&gt;
&lt;/SCR_RouterLink&gt;
</pre>
  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "v2_Router_Link",
  path: "/svelte-client-router/v2/routerLink",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_RouterLink.svelte"),
  title: "SCR - Router Link - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
</SCR_Page>

<style>
</style>
