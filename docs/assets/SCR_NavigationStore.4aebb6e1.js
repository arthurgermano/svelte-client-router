import{S as n,i,s as c,h as u,m as l,j as p,k as m,o as g,e as h,b as f,c as _,n as d,g as v}from"./index.fc5ef2be.js";import{S as b}from"./SCR_Page.a121dc3b.js";function S(r){let t;return{c(){t=h("div"),t.innerHTML=`<h4 class="scr-h4">Navigation - Store</h4> 
  <p class="scr-text-justify">As well as the previous section you can import the entire navigation store.
    This is not recommend though. If you can use the methods directly it is
    recommended to you to do so. Because when pushing routes there is a flow to
    be followed. Anyway just so you know there is this store and you can check
    it like below.
    <br/> 
    <br/>
    For more info about the anatomy of the functions provided go back to the previous
    section.</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Navigate Store
    </b>
import {  
    SCR_NAVIGATE_STORE,
} from &quot;svelte-client-router&quot;
<b class="scr-b">
// Example of Usage
</b>&lt;script&gt;
  <b class="scr-b">
  // Go to defined path route
</b>  SCR_NAVIGATE_STORE.pushRoute(&quot;/routePath&quot;);
  <b class="scr-b">
  // Go to previous entered route.
  // It returns the previous route too
</b>  SCR_NAVIGATE_STORE.backRoute();

&lt;/script&gt;
</pre> 
  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
  name: &quot;routeNavigationStore&quot;,
  path: &quot;/svelte-client-router/navigationStore&quot;,
  lazyLoadComponent: () =&gt;
    import(&quot;./docs/pages/SCR_NavigationStore.svelte&quot;),
  title: &quot;SCR - Navigation - Store&quot;,
}
</pre>`,f(t,"class","scr-page")},m(o,e){_(o,t,e)},p:d,d(o){o&&v(t)}}}function R(r){let t,o;return t=new b({props:{back:{name:"v1_Navigation_Routing",text:"Navigation Routing"},forward:{name:"v1_Router_Link",text:"Router Link"},$$slots:{default:[S]},$$scope:{ctx:r}}}),{c(){u(t.$$.fragment)},m(e,s){l(t,e,s),o=!0},p(e,[s]){const a={};s&1&&(a.$$scope={dirty:s,ctx:e}),t.$set(a)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){m(t.$$.fragment,e),o=!1},d(e){g(t,e)}}}class y extends n{constructor(t){super(),i(this,t,null,R,c,{})}}export{y as default};
