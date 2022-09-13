import{S as n,i as u,s as l,h as i,m as q,j as c,k as p,o as g,e as m,b as v,c as d,n as S,g as b}from"./index.fc5ef2be.js";import{S as h}from"./SCR_Page.a121dc3b.js";function f(s){let t;return{c(){t=m("div"),t.innerHTML=`<h4 class="scr-h4">Getting Started</h4> 
    <h5 class="scr-h5">Loading The Svelte Client Router</h5> 
    <pre class="scr-pre">import {  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;

<b class="scr-b">// Make sure to declare the default slot &quot;&lt;slot /&gt;&quot; inside of your component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>
</pre> 
    <br/> 
    <h5 class="scr-h5">Declaring Routes</h5> 
    <pre class="scr-pre">const routes = [
  {
    name: &quot;root&quot;,
    path: &quot;&quot;,
    beforeEnter: ({ resolve }) =&gt; {
      resolve({ path: &quot;/svelte-client-router/&quot; });
    },
  },
  {
    name: &quot;root2&quot;,
    path: &quot;/&quot;,
    beforeEnter: ({ resolve }) =&gt; {
      resolve({ path: &quot;/svelte-client-router/&quot; });
    },
  },
  {
    name: &quot;rootRoute&quot;,
    path: &quot;/svelte-client-router/&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/SCR_Home.svelte&quot;),
    title: &quot;SCR - Home&quot;,
    beforeEnter: [setVersion0],
  },
  {
    name: &quot;v2_Presentation&quot;,
    path: &quot;/svelte-client-router/v2/presentation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Presentation.svelte&quot;),
    title: &quot;SCR - Presentation - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
  {
    name: &quot;v2_Installation&quot;,
    path: &quot;/svelte-client-router/v2/installation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Installation.svelte&quot;),
    title: &quot;SCR - Installation - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
  {
    name: &quot;v2_Getting_Started&quot;,
    path: &quot;/svelte-client-router/v2/gettingStarted&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_GettingStarted.svelte&quot;),
    title: &quot;SCR - GettingStarted - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
];
</pre> 
    <br/> 
    <h5 class="scr-h5">Using The Component</h5> 
    <pre class="scr-pre">&lt;SCR_Router
  {routes}
    defaultLoadingComponent={SCR_Loading}
    defaultLoadingParams={{ subLoadingText: &quot;SubLoading Text Via Param&quot; }}
/&gt;

OR 
// both components are exported - they are the same!
&lt;scr_router
  {routes}
    defaultLoadingComponent={SCR_Loading}
    defaultLoadingParams={{ subLoadingText: &quot;SubLoading Text Via Param&quot; }}
/&gt;
</pre> 
    <p class="scr-text-justify">That is it. We are ready to route our application.
      <br/> 
      <br/>
      Of course this is a very basic configuration though. Go through the next sections
      to learn about more advanced settings.</p> 
    <h5 class="scr-h5">Full Example</h5> 
    <pre class="scr-pre"><b class="scr-b">// Svelte Component</b>
&lt;script&gt;

<b class="scr-b">// Importing Svelte Client Router</b>
import {  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;

<b class="scr-b">// Make sure to declare the default slot &quot;&lt;slot /&gt;&quot; inside of your component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>

<b class="scr-b">// Setting Routes</b>
const routes = [
  {
    name: &quot;root&quot;,
    path: &quot;&quot;,
    beforeEnter: ({ resolve }) =&gt; {
      resolve({ path: &quot;/svelte-client-router/&quot; });
    },
  },
  {
    name: &quot;root2&quot;,
    path: &quot;/&quot;,
    beforeEnter: ({ resolve }) =&gt; {
      resolve({ path: &quot;/svelte-client-router/&quot; });
    },
  },
  {
    name: &quot;rootRoute&quot;,
    path: &quot;/svelte-client-router/&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/SCR_Home.svelte&quot;),
    title: &quot;SCR - Home&quot;,
    beforeEnter: [setVersion0],
  },
  {
    name: &quot;v2_Presentation&quot;,
    path: &quot;/svelte-client-router/v2/presentation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Presentation.svelte&quot;),
    title: &quot;SCR - Presentation - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
  {
    name: &quot;v2_Installation&quot;,
    path: &quot;/svelte-client-router/v2/installation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Installation.svelte&quot;),
    title: &quot;SCR - Installation - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
  {
    name: &quot;v2_Getting_Started&quot;,
    path: &quot;/svelte-client-router/v2/gettingStarted&quot;,
    lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_GettingStarted.svelte&quot;),
    title: &quot;SCR - GettingStarted - Version 2&quot;,
    beforeEnter: [setVersion2],
  },
];
&lt;script&gt; 

<b class="scr-b">&lt;!-- Using SCR Router Component - passing routes --&gt;</b>
&lt;SCR_Router
  {routes}
    defaultLoadingComponent={SCR_Loading}
    defaultLoadingParams={{ subLoadingText: &quot;SubLoading Text Via Param&quot; }}
/&gt;
</pre> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre">{
  name: &quot;v2_Getting_Started&quot;,
  path: &quot;/svelte-client-router/v2/gettingStarted&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_GettingStarted.svelte&quot;),
  title: &quot;SCR - GettingStarted - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,v(t,"class","scr-page")},m(o,e){d(o,t,e)},p:S,d(o){o&&b(t)}}}function _(s){let t,o;return t=new h({props:{back:{name:"v2_Installation",text:"Installation"},forward:{name:"v2_Configuration_Options",text:"Configuration Options"},$$slots:{default:[f]},$$scope:{ctx:s}}}),{c(){i(t.$$.fragment)},m(e,r){q(t,e,r),o=!0},p(e,[r]){const a={};r&1&&(a.$$scope={dirty:r,ctx:e}),t.$set(a)},i(e){o||(c(t.$$.fragment,e),o=!0)},o(e){p(t.$$.fragment,e),o=!1},d(e){g(t,e)}}}class L extends n{constructor(t){super(),u(this,t,null,_,l,{})}}export{L as default};
