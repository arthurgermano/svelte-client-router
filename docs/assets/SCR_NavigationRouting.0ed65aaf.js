import{S as n,i as u,s as i,h as c,m as l,j as p,k as h,o as m,e as b,b as f,c as g,n as d,g as R}from"./index.fc5ef2be.js";import{S as q}from"./SCR_Page.a121dc3b.js";function v(r){let t;return{c(){t=b("div"),t.innerHTML=`<h4 class="scr-h4">Navigation - Routing</h4> 
  <p class="scr-text-justify">There are two main methods when routing SCR.</p> 
  <ul><li><b>pushRoute: </b>pushes a route forward.</li> 
    <li><b>backRoute: </b>back to the first route history, uses
      window.history.back(-1).</li></ul> 
  <p class="scr-text-justify">There are no secret of using them, but <b>pushRoute</b> has some nice features.
    Lets check them:</p> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Push Route</h4> 
  <pre class="scr-pre"><b class="scr-b">// Importing pushRoute function
    </b>
import { pushRoute } from &quot;svelte-client-router&quot;
<b class="scr-b">
// Example of Usage
</b>
&lt;script&gt;
  pushRoute(&quot;/routePath&quot;);
&lt;/script&gt;
</pre> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Push Route Function Anatomy</h4> 
  <p class="scr-text-justify">This function can receive three parameters as it follows:</p> 
  <ul><li><b>to: </b>the route path to go to. It can understand three types of
      declarations:
      <ul><li><b>A string path: </b>For example: &quot;/someRoute/to/go&quot;</li> 
        <li><b>path: </b>For example: { path: &quot;/routePath&quot; }</li> 
        <li><b>name: </b>For example: { name: &quot;theRouteName&quot; }</li></ul></li> 
    <br/> 
    <li><b>customParams: </b>Some custom params to send to Before Enter and After
      Before Enter Functions as well the components</li> 
    <br/> 
    <li><b>onError: </b>A custom onError function. This is nice because you can
      override your route onError declaration. It will execute this function
      instead of the route definition declared function.</li></ul> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Back Route</h4> 
  <pre class="scr-pre"><b class="scr-b">// Importing backRoute function
    </b>
import { backRoute } from &quot;svelte-client-router&quot;
<b class="scr-b">
// Example of Usage
</b>
&lt;script&gt;<b class="scr-b">
  // Go to previous entered route.
  // It returns the previous route too
</b>
  backRoute();
&lt;/script&gt;
</pre> 
  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
  name: &quot;routeNavigationRouting&quot;,
  path: &quot;/svelte-client-router/navigationRouting&quot;,
  lazyLoadComponent: () =&gt;
    import(&quot;./docs/pages/SCR_NavigationRouting.svelte&quot;),
  title: &quot;SCR - Navigation - Routing&quot;,
}
</pre>`,f(t,"class","scr-page")},m(o,e){g(o,t,e)},p:d,d(o){o&&R(t)}}}function _(r){let t,o;return t=new q({props:{back:{name:"v1_Route_Component_Components",text:"Route Component Components"},forward:{name:"v1_Navigation_Store",text:"Navigation Store"},$$slots:{default:[v]},$$scope:{ctx:r}}}),{c(){c(t.$$.fragment)},m(e,s){l(t,e,s),o=!0},p(e,[s]){const a={};s&1&&(a.$$scope={dirty:s,ctx:e}),t.$set(a)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){h(t.$$.fragment,e),o=!1},d(e){m(t,e)}}}class C extends n{constructor(t){super(),u(this,t,null,_,i,{})}}export{C as default};
