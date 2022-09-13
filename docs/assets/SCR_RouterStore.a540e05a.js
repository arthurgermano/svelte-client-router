import{S as i,i as a,s as u,h as c,m as R,j as p,k as d,o as f,e as l,b as h,c as m,n as _,g as S}from"./index.fc5ef2be.js";import{S as g}from"./SCR_Page.a121dc3b.js";function T(n){let e;return{c(){e=l("div"),e.innerHTML=`<h4 class="scr-h4">Route Store</h4> 
  <p class="scr-text-justify">Router Store is the store where all the route definitions are updated and
    controlled. You can check real time what is happening.
    <br/>
    Lets see how to import and use it:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Router Store
</b>&lt;script&gt;
  import { SCR_ROUTER_STORE } from &quot;svelte-client-router&quot;;
<b class="scr-b">
  // Methods inside the store
</b>  SCR_ROUTER_STORE.setRoutes();
  SCR_ROUTER_STORE.getRoutes();
  SCR_ROUTER_STORE.setCurrentRoute();
  SCR_ROUTER_STORE.getCurrentRoute();
  SCR_ROUTER_STORE.setFromRoute();
  SCR_ROUTER_STORE.getFromRoute();
  SCR_ROUTER_STORE.setNavigationHistory();
  SCR_ROUTER_STORE.getNavigationHistory();
  SCR_ROUTER_STORE.pushNavigationHistory();
  SCR_ROUTER_STORE.popNavigationHistory();
  SCR_ROUTER_STORE.setCurrentLocation();
  SCR_ROUTER_STORE.getCurrentLocation();
  SCR_ROUTER_STORE.getConfig();
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

  // ## Current Location
  // ## Used inside the component to identify where it is coming from
  // ## updating based on the configuration store
  // ## Object
  currentLocation: undefined,

  // ## Current Route
  // ## The object with current route information
  // ## Updated before &quot;after before enter function&quot; execution
  // ## Object
  currentRoute: {
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
  },

  // ## From Route
  // ## The object with from route information
  // ## Updated before &quot;after before enter function&quot; execution
  // ## Object
  fromRoute: {
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
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
  name: &quot;routerStorePropertiesRoute&quot;,
  path: &quot;/svelte-client-router/routerStoreProperties&quot;,
  lazyLoadComponent: () =&gt;
    import(&quot;./docs/pages/SCR_RouterStoreProperties.svelte&quot;),
  title: &quot;SCR - Route Store - Properties&quot;,
}
</pre>`,h(e,"class","scr-page")},m(o,t){m(o,e,t)},p:_,d(o){o&&S(e)}}}function O(n){let e,o;return e=new g({props:{back:{name:"v1_Router_Link",text:"Router Link"},forward:{name:"v1_Test_Regex_Path",text:"Test - Regex Path"},$$slots:{default:[T]},$$scope:{ctx:n}}}),{c(){c(e.$$.fragment)},m(t,r){R(e,t,r),o=!0},p(t,[r]){const s={};r&1&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){o||(p(e.$$.fragment,t),o=!0)},o(t){d(e.$$.fragment,t),o=!1},d(t){f(e,t)}}}class b extends i{constructor(e){super(),a(this,e,null,O,u,{})}}export{b as default};
