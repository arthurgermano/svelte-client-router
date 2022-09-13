import{S as n,i,s as l,h as c,m as u,j as p,k as m,o as f,e as _,b as h,c as g,n as d,g as S}from"./index.fc5ef2be.js";import{S as b}from"./SCR_Page.a121dc3b.js";function $(o){let t;return{c(){t=_("div"),t.innerHTML=`<h4 class="scr-h4">Installation</h4> 
    <h5 class="scr-h5">Via npm:</h5> 
    <pre class="scr-pre">npm install svelte-client-router
</pre> 
    <h5 class="scr-h5">Importing in your code:</h5> 
    <pre class="scr-pre"><b class="scr-b">// This is just an example of all possibilities exported by the package
</b>import {  
  scr_router,
  SCR_Router,
  SCR_RouterLink,
  scr_router_link,
  configStore,
  routesStore,
  pushRoute,
  backRoute,
} from &quot;svelte-client-router&quot;
</pre> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre"><b class="scr-b">// This is an example of one route declaration.
// This object must go inside of an array.
// See the next chapter for more info!</b>
{
  name: &quot;v2_Installation&quot;,
  path: &quot;/svelte-client-router/v2/installation&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Installation.svelte&quot;),
  title: &quot;SCR - Installation - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,h(t,"class","scr-page")},m(s,e){g(s,t,e)},p:d,d(s){s&&S(t)}}}function v(o){let t,s;return t=new b({props:{back:{name:"v2_Presentation",text:"Presentation"},forward:{name:"v2_Getting_Started",text:"Getting Started"},$$slots:{default:[$]},$$scope:{ctx:o}}}),{c(){c(t.$$.fragment)},m(e,r){u(t,e,r),s=!0},p(e,[r]){const a={};r&1&&(a.$$scope={dirty:r,ctx:e}),t.$set(a)},i(e){s||(p(t.$$.fragment,e),s=!0)},o(e){m(t.$$.fragment,e),s=!1},d(e){f(t,e)}}}class x extends n{constructor(t){super(),i(this,t,null,v,l,{})}}export{x as default};
