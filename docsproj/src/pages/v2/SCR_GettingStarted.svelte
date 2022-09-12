<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Installation", text: "Installation" }}
  forward={{ name: "v2_Configuration_Options", text: "Configuration Options" }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Getting Started</h4>
    <h5 class="scr-h5">Loading The Svelte Client Router</h5>
    <pre class="scr-pre">
import &#123;  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
&#125; from "svelte-client-router"

<b class="scr-b"
        >// Make sure to declare the default slot "&lt;slot /&gt;" inside of your component</b
      >
<b class="scr-b"
        >// <a href="https://svelte.dev/tutorial/slots" target="_blank"
          >For more info about Svelte Slots</a
        ></b
      >
</pre>
    <br />
    <h5 class="scr-h5">Declaring Routes</h5>
    <pre class="scr-pre">
const routes = [
  &#123;
    name: "root",
    path: "",
    beforeEnter: (&#123; resolve &#125;) =&gt; &#123;
      resolve(&#123; path: "/svelte-client-router/" &#125;);
    &#125;,
  &#125;,
  &#123;
    name: "root2",
    path: "/",
    beforeEnter: (&#123; resolve &#125;) =&gt; &#123;
      resolve(&#123; path: "/svelte-client-router/" &#125;);
    &#125;,
  &#125;,
  &#123;
    name: "rootRoute",
    path: "/svelte-client-router/",
    lazyLoadComponent: () =&gt; import("../../pages/SCR_Home.svelte"),
    title: "SCR - Home",
    beforeEnter: [setVersion0],
  &#125;,
  &#123;
    name: "v2_Presentation",
    path: "/svelte-client-router/v2/presentation",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_Presentation.svelte"),
    title: "SCR - Presentation - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
  &#123;
    name: "v2_Installation",
    path: "/svelte-client-router/v2/installation",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_Installation.svelte"),
    title: "SCR - Installation - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
  &#123;
    name: "v2_Getting_Started",
    path: "/svelte-client-router/v2/gettingStarted",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_GettingStarted.svelte"),
    title: "SCR - GettingStarted - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
];
</pre>
    <br />
    <h5 class="scr-h5">Using The Component</h5>
    <pre class="scr-pre">
&lt;SCR_Router
  &#123;routes&#125;
    defaultLoadingComponent=&#123;SCR_Loading&#125;
    defaultLoadingParams=&#123;&#123; subLoadingText: "SubLoading Text Via Param" &#125;&#125;
/&gt;

OR 
// both components are exported - they are the same!
&lt;scr_router
  &#123;routes&#125;
    defaultLoadingComponent=&#123;SCR_Loading&#125;
    defaultLoadingParams=&#123;&#123; subLoadingText: "SubLoading Text Via Param" &#125;&#125;
/&gt;
</pre>
    <p class="scr-text-justify">
      That is it. We are ready to route our application.
      <br />
      <br />
      Of course this is a very basic configuration though. Go through the next sections
      to learn about more advanced settings.
    </p>
    <h5 class="scr-h5">Full Example</h5>
    <pre class="scr-pre">
<b class="scr-b">// Svelte Component</b>
&lt;script&gt;

<b class="scr-b">// Importing Svelte Client Router</b>
import &#123;  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
&#125; from "svelte-client-router"

<b class="scr-b"
        >// Make sure to declare the default slot "&lt;slot /&gt;" inside of your component</b
      >
<b class="scr-b"
        >// <a href="https://svelte.dev/tutorial/slots" target="_blank"
          >For more info about Svelte Slots</a
        ></b
      >

<b class="scr-b">// Setting Routes</b>
const routes = [
  &#123;
    name: "root",
    path: "",
    beforeEnter: (&#123; resolve &#125;) =&gt; &#123;
      resolve(&#123; path: "/svelte-client-router/" &#125;);
    &#125;,
  &#125;,
  &#123;
    name: "root2",
    path: "/",
    beforeEnter: (&#123; resolve &#125;) =&gt; &#123;
      resolve(&#123; path: "/svelte-client-router/" &#125;);
    &#125;,
  &#125;,
  &#123;
    name: "rootRoute",
    path: "/svelte-client-router/",
    lazyLoadComponent: () =&gt; import("../../pages/SCR_Home.svelte"),
    title: "SCR - Home",
    beforeEnter: [setVersion0],
  &#125;,
  &#123;
    name: "v2_Presentation",
    path: "/svelte-client-router/v2/presentation",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_Presentation.svelte"),
    title: "SCR - Presentation - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
  &#123;
    name: "v2_Installation",
    path: "/svelte-client-router/v2/installation",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_Installation.svelte"),
    title: "SCR - Installation - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
  &#123;
    name: "v2_Getting_Started",
    path: "/svelte-client-router/v2/gettingStarted",
    lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_GettingStarted.svelte"),
    title: "SCR - GettingStarted - Version 2",
    beforeEnter: [setVersion2],
  &#125;,
];
&lt;script&gt; 

<b class="scr-b">&lt;!-- Using SCR Router Component - passing routes --&gt;</b>
&lt;SCR_Router
  &#123;routes&#125;
    defaultLoadingComponent=&#123;SCR_Loading&#125;
    defaultLoadingParams=&#123;&#123; subLoadingText: "SubLoading Text Via Param" &#125;&#125;
/&gt;
</pre>
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Getting_Started",
  path: "/svelte-client-router/v2/gettingStarted",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_GettingStarted.svelte"),
  title: "SCR - GettingStarted - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div>
</SCR_Page>

<style>
</style>
