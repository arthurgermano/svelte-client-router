import{S as a,i,s as u,h as c,m as d,j as f,k as p,o as l,e as h,b as m,c as g,n as S,g as R}from"./index.fc5ef2be.js";import{S as b}from"./SCR_Page.a121dc3b.js";function _(s){let e;return{c(){e=h("div"),e.innerHTML=`<h4 class="scr-h4">Route Store</h4> 
  <p class="scr-text-justify">Router Store is the store where all the route definitions are updated and
    controlled. You can check real time what is happening.
    <br/> 
    <br/>
    It is a Svelte Store and can be use with $routesStore inside svelte components!
    <br/>
    Lets see how to import and use it:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Router Store
</b>&lt;script&gt;
  import { routesStore } from &quot;svelte-client-router&quot;;
<b class="scr-b">
  // Methods inside the store
</b>  routesStore.setRoutes();
  routesStore.getRoutes();
  routesStore.resetRoutes();
  routesStore.setCurrentRoute();
  routesStore.getCurrentRoute();
  routesStore.setLastRoute();
  routesStore.getLastRoute();
  routesStore.setNavigationHistory();
  routesStore.getNavigationHistory();
  routesStore.pushNavigationHistory();
  routesStore.getNotFoundRoute();
&lt;/script&gt;
</pre> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Properties</h4> 
  <p class="scr-text-justify">Let&#39;s see the inside properties:</p> 
  <pre class="scr-pre">{
  // ## Routes
  // ## The Array object defined on initialization of the application
  // ## Array
  routes: [],

  // ## Current Route
  // ## The object with current route information
  // ## Updated before &quot;after before enter function&quot; execution
  // ## Object
  currentRoute: {
    routeId: undefined,
    name: undefined,
    path: undefined,
    fullPath: undefined,
    queryParams: {},
    pathParams: {},
    params: {},
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: {},
    redirected: undefined,
  },

  // ## Last Route
  // ## The object with last route information
  // ## Updated before &quot;after before enter function&quot; execution
  // ## Object
  lastRoute: {
    routeId: undefined,
    name: undefined,
    path: undefined,
    fullPath: undefined,
    queryParams: {},
    pathParams: {},
    params: {},
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: {},
    redirected: undefined,
  },

  // ## Navigation History
  // ## An array with all the route history objects - the limit is 
  // ## defined in the configuration store
  // ## Updated before &quot;after before enter function&quot; execution
  // ## Array
  navigationHistory: [],
}
</pre> 
  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
  name: &quot;v2_Routes_Store&quot;,
  path: &quot;/svelte-client-router/v2/routesStore&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_RoutesStore.svelte&quot;),
  title: &quot;SCR - Routes Store - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,m(e,"class","scr-page")},m(o,t){g(o,e,t)},p:S,d(o){o&&R(e)}}}function q(s){let e,o;return e=new b({props:{back:{name:"v2_Router_Link",text:"Router Link"},forward:{name:"v2_Test_Regex_Path",text:"Test - Regex Path"},$$slots:{default:[_]},$$scope:{ctx:s}}}),{c(){c(e.$$.fragment)},m(t,r){d(e,t,r),o=!0},p(t,[r]){const n={};r&1&&(n.$$scope={dirty:r,ctx:t}),e.$set(n)},i(t){o||(f(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){l(e,t)}}}class $ extends a{constructor(e){super(),i(this,e,null,q,u,{})}}export{$ as default};
