import{S as r,i as l,s as i,h as c,m as p,j as u,k as m,o as _,e as f,b as h,c as R,n as d,g}from"./index.fc5ef2be.js";import{S}from"./SCR_Page.a121dc3b.js";function C(o){let t;return{c(){t=f("div"),t.innerHTML=`<h4 class="scr-h4">Installation</h4> 
    <h5 class="scr-h5">Via npm:</h5> 
    <pre class="scr-pre">npm install svelte-client-router@1.3.10
</pre> 
    <h5 class="scr-h5">Importing in your code:</h5> 
    <pre class="scr-pre"><b class="scr-b">// This is just an example of all possibilities exported by the package
</b>import {  
  SCR_ROUTER_COMPONENT,
  SCR_ROUTER_LINK,
  SCR_ROUTER_STORE,
  SCR_CONFIG_STORE,
  SCR_NAVIGATE_STORE,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;
</pre> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre"><b class="scr-b">// This is an example of one route declaration.
// This object must go inside of an array.
// See the next chapter for more info!
</b>{
    name: &quot;installationRoute&quot;,
    path: &quot;/svelte-client-router/installation&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Installation.svelte&quot;),
    title: &quot;SCR - Installation&quot;,
}
</pre>`,h(t,"class","scr-page")},m(s,e){R(s,t,e)},p:d,d(s){s&&g(t)}}}function T(o){let t,s;return t=new S({props:{back:{name:"v1_Presentation",text:"Presentation"},forward:{name:"v1_Getting_Started",text:"Getting Started"},$$slots:{default:[C]},$$scope:{ctx:o}}}),{c(){c(t.$$.fragment)},m(e,a){p(t,e,a),s=!0},p(e,[a]){const n={};a&1&&(n.$$scope={dirty:a,ctx:e}),t.$set(n)},i(e){s||(u(t.$$.fragment,e),s=!0)},o(e){m(t.$$.fragment,e),s=!1},d(e){_(t,e)}}}class q extends r{constructor(t){super(),l(this,t,null,T,i,{})}}export{q as default};
