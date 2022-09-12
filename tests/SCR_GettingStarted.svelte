<script>
  

</script>

<div class="scr-page">
  <h4 class="scr-h4">Getting Started</h4>
  <h5>Loading The Svelte Client Router</h5>
  <pre
    class="scr-pre">
    import &#123;  
    SCR_ROUTER_COMPONENT,
    SCR_ROUTER_LINK,
    SCR_ROUTER_STORE,
    SCR_CONFIG_STORE,
    SCR_NAVIGATE_STORE,
    pushRoute,
    backRoute,
&#125; from "svelte-client-router"

<b class="scr-b">// Make sure to declare the default slot "&lt;slot /&gt;" inside of your layout component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>
import MY_LAYOUT from "./path/to/my/MY_LAYOUT.svelte";
  </pre>
  <br />
  <h5>Declaring Routes</h5>
  <pre
    class="scr-pre">
    const routes = [
    &#123;
      name: "root",
      path: "/",
      beforeEnter: [
        (resolve, rFrom, rTo, params, payload) =&gt; &#123;
          resolve(&#123; redirect: "/svelte-client-router" &#125; );
        &#125; ,
      ],
    &#125; ,
    &#123;
      name: "rootRoute",
      path: "/svelte-client-router",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Presentation.svelte"),
      title: "SCR - Presentation",
    &#125; ,
    &#123;
      name: "installationRoute",
      path: "/svelte-client-router/installation",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Installation.svelte"),
      title: "SCR - Installation",
    &#125; ,
    &#123;
      name: "gettingStartedRoute",
      path: "/svelte-client-router/gettingStarted",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_GettingStarted.svelte"),
      title: "SCR - Getting Started",
    &#125; ,
  ];
&#125; 
  </pre>
  <br />
  <h5>Using The Component</h5>
  <pre
    class="scr-pre">
    &lt;SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent=&#123;MY_LAYOUT&#125; /&gt;
  </pre>
  <p class="scr-text-justify">
    That is it. We are ready to route our application.
    <br />
    <br />
    Of course this is a very basic configuration though. Go through the next sections
    to learn about more advanced settings.
  </p>
  <br />
  <h5>Full Example</h5>
  <pre
    class="scr-pre">
<b class="scr-b">// Svelte Component</b>
&lt;script&gt;

<b class="scr-b">// Importing Svelte Client Router</b>
import &#123;  
    SCR_ROUTER_COMPONENT,
    SCR_ROUTER_LINK,
    SCR_ROUTER_STORE,
    SCR_CONFIG_STORE,
    SCR_NAVIGATE_STORE,
    pushRoute,
    backRoute,
&#125; from "svelte-client-router"

<b class="scr-b">// Make sure to declare the default slot "&lt;slot /&gt;" inside of your layout component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>
<b class="scr-b">// Importing My Very Nice Layout</b>
import MY_LAYOUT from "./path/to/my/MY_LAYOUT.svelte";

<b class="scr-b">// Setting Routes</b>
const routes = [
    &#123;
      <b class="scr-b">// Doesn't declare a component because it redirects only!</b>
      name: "root",
      path: "/",
      beforeEnter: [
        (resolve, rFrom, rTo, params, payload) =&gt; &#123;
          resolve(&#123; redirect: "/svelte-client-router" &#125; );
        &#125; ,
      ],
    &#125; ,
    &#123;
      name: "rootRoute",
      path: "/svelte-client-router",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Presentation.svelte"),
      title: "SCR - Presentation",
    &#125; ,
    &#123;
      name: "installationRoute",
      path: "/svelte-client-router/installation",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Installation.svelte"),
      title: "SCR - Installation",
    &#125; ,
    &#123;
      name: "gettingStartedRoute",
      path: "/svelte-client-router/gettingStarted",
      lazyLoadComponent: () =&gt; import("./docs/pages/SCR_GettingStarted.svelte"),
      title: "SCR - Getting Started",
    &#125; ,
  ];
&#125;

&lt;script&gt; 

<b class="scr-b">&lt;!-- Using SCR Router Component - passing routes and my custom layout --&gt;</b>
&lt;SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent=&#123;MY_LAYOUT&#125; /&gt;
  </pre>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "gettingStartedRoute",
    path: "/svelte-client-router/gettingStarted",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_GettingStarted.svelte"),
    title: "SCR - Getting Started",
&#125;
</pre>


</div>

<style>
</style>
