import{S as n,i as u,s as l,h as i,m as c,j as p,k as q,o as m,e as g,b as R,c as d,n as S,g as _}from"./index.fc5ef2be.js";import{S as C}from"./SCR_Page.a121dc3b.js";function b(a){let t;return{c(){t=g("div"),t.innerHTML=`<h4 class="scr-h4">Getting Started</h4> 
    <h5 class="scr-h5">Loading The Svelte Client Router</h5> 
    <pre class="scr-pre">import {  
  SCR_ROUTER_COMPONENT,
  SCR_ROUTER_LINK,
  SCR_ROUTER_STORE,
  SCR_CONFIG_STORE,
  SCR_NAVIGATE_STORE,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;

<b class="scr-b">// Make sure to declare the default slot &quot;&lt;slot /&gt;&quot; inside of your layout component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>
import MY_LAYOUT from &quot;./path/to/my/MY_LAYOUT.svelte&quot;;
</pre> 
    <br/> 
    <h5 class="scr-h5">Declaring Routes</h5> 
    <pre class="scr-pre">const routes = [
  {
    name: &quot;root&quot;,
    path: &quot;/&quot;,
    beforeEnter: [
      (resolve, rFrom, rTo, params, payload) =&gt; {
        resolve({ redirect: &quot;/svelte-client-router&quot; } );
      },
    ],
  },
  {
    name: &quot;rootRoute&quot;,
    path: &quot;/svelte-client-router&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Presentation.svelte&quot;),
    title: &quot;SCR - Presentation&quot;,
  },
  {
    name: &quot;installationRoute&quot;,
    path: &quot;/svelte-client-router/installation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Installation.svelte&quot;),
    title: &quot;SCR - Installation&quot;,
  },
  {
    name: &quot;gettingStartedRoute&quot;,
    path: &quot;/svelte-client-router/gettingStarted&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_GettingStarted.svelte&quot;),
    title: &quot;SCR - Getting Started&quot;,
  },
  ];
} 
  </pre> 
    <br/> 
    <h5 class="scr-h5">Using The Component</h5> 
    <pre class="scr-pre">&lt;SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={MY_LAYOUT} /&gt;
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
  SCR_ROUTER_COMPONENT,
  SCR_ROUTER_LINK,
  SCR_ROUTER_STORE,
  SCR_CONFIG_STORE,
  SCR_NAVIGATE_STORE,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;

<b class="scr-b">// Make sure to declare the default slot &quot;&lt;slot /&gt;&quot; inside of your layout component</b>
<b class="scr-b">// <a href="https://svelte.dev/tutorial/slots" target="_blank">For more info about Svelte Slots</a></b>
<b class="scr-b">// Importing My Very Nice Layout</b>
import MY_LAYOUT from &quot;./path/to/my/MY_LAYOUT.svelte&quot;;

<b class="scr-b">// Setting Routes</b>
const routes = [
  {
    <b class="scr-b">// Doesn&#39;t declare a component because it redirects only!</b>
    name: &quot;root&quot;,
    path: &quot;/&quot;,
    beforeEnter: [
      (resolve, rFrom, rTo, params, payload) =&gt; {
        resolve({ redirect: &quot;/svelte-client-router&quot; } );
      },
    ],
  },
  {
    name: &quot;rootRoute&quot;,
    path: &quot;/svelte-client-router&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Presentation.svelte&quot;),
    title: &quot;SCR - Presentation&quot;,
  },
  {
    name: &quot;installationRoute&quot;,
    path: &quot;/svelte-client-router/installation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Installation.svelte&quot;),
    title: &quot;SCR - Installation&quot;,
  },
  {
    name: &quot;gettingStartedRoute&quot;,
    path: &quot;/svelte-client-router/gettingStarted&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_GettingStarted.svelte&quot;),
    title: &quot;SCR - Getting Started&quot;,
  },
];
&lt;script&gt; 

<b class="scr-b">&lt;!-- Using SCR Router Component - passing routes and my custom layout --&gt;</b>
&lt;SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={MY_LAYOUT} /&gt;
</pre> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre">{
    name: &quot;gettingStartedRoute&quot;,
    path: &quot;/svelte-client-router/gettingStarted&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_GettingStarted.svelte&quot;),
    title: &quot;SCR - Getting Started&quot;,
}
</pre>`,R(t,"class","scr-page")},m(o,e){d(o,t,e)},p:S,d(o){o&&_(t)}}}function h(a){let t,o;return t=new C({props:{back:{name:"v1_Installation",text:"Installation"},forward:{name:"v1_Configuration_Options",text:"Configuration Options"},$$slots:{default:[b]},$$scope:{ctx:a}}}),{c(){i(t.$$.fragment)},m(e,s){c(t,e,s),o=!0},p(e,[s]){const r={};s&1&&(r.$$scope={dirty:s,ctx:e}),t.$set(r)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){q(t.$$.fragment,e),o=!1},d(e){m(t,e)}}}class O extends n{constructor(t){super(),u(this,t,null,h,l,{})}}export{O as default};
