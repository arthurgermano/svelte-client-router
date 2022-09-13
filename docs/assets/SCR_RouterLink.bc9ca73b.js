import{S as a,i,s as l,h as u,m as c,j as p,k as m,o as g,e as h,b,c as f,n as R,g as d}from"./index.fc5ef2be.js";import{S as q}from"./SCR_Page.a121dc3b.js";function _(s){let t;return{c(){t=h("div"),t.innerHTML=`<h4 class="scr-h4">Route Link</h4> 
  <p class="scr-text-justify">The Route Link is a component wrapper to make links. Easy to click and
    execute what you want. It is totally customisable.
    <br/>
    Lets see how to import and use it:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Navigate Store
</b>&lt;script&gt;
  import { SCR_ROUTER_LINK } from &quot;svelte-client-router&quot;;
&lt;/script&gt;
<b class="scr-b">
&lt;--! Example of Usage --&gt;
</b>&lt;SCR_ROUTER_LINK
  to={{ name: &quot;routeComponentComponentsRoute&quot; }}
  elementProps={{ style: &quot;display: inline; cursor: pointer;&quot; }}
&gt;
  &lt;a style=&quot;pointer-events: none;&quot;&gt;
  components - that can be check in the next section -&lt;/a&gt;, 
  and some are crucial for it to work correctly.

&lt;/SCR_ROUTER_LINK&gt;
</pre> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Properties</h4> 
  <p class="scr-text-justify">Pretty easy to use, isn&#39;t it? So now lets check out the component exported
    properties:</p> 
  <ul><li><b>to: </b>the route path to go to. It can understand three types of
      declarations:
      <ul><li><b>A string path: </b>For example: &quot;/someRoute/to/go&quot;</li> 
        <li><b>path: </b>For example: { path: &quot;/routePath&quot; }</li> 
        <li><b>name: </b>For example: { name: &quot;theRouteName&quot; }</li></ul></li> 
    <br/> 
    <li><b>props: </b>Some custom params to send to Before Enter and After Before
      Enter Functions as well the components</li> 
    <br/> 
    <li><b>onError: </b>A custom onError function. This is nice because you can
      override your route onError declaration. It will execute this function
      instead of the route definition declared function.</li> 
    <br/> 
    <li><b>elementProps: </b>This is all the HTML properties to pass to parent div
      so you can customize it at your own will.</li></ul> 
  <p class="scr-text-justify">Lets see another example:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Navigate Store
</b>&lt;script&gt;
  import { SCR_ROUTER_LINK } from &quot;svelte-client-router&quot;;
&lt;/script&gt;
<b class="scr-b">
&lt;--! Another Example of Usage --&gt;
</b>&lt;SCR_ROUTER_LINK 
  to={{name: &quot;myRouteNameThree&quot; }}
  props={{ pushCustomParam: &quot;someCustomParams&quot; }}
  elementProps={{ style:&quot;background-color: green&quot; }}
  onError={(err, routeObjParams) =&gt; console.log(&quot;Execute this instead error defined on router object! - Only if something goes wrong}
&gt;
  &lt;button&gt;Click to Go to Defined Route Named: myRouteNameThree!&lt;/button&gt;
&lt;/SCR_ROUTER_LINK&gt;
</pre> 
  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
  name: &quot;routerLinkPropertiesRoute&quot;,
  path: &quot;/svelte-client-router/routerLinkProperties&quot;,
  lazyLoadComponent: () =&gt;
    import(&quot;./docs/pages/SCR_RouterLinkProperties.svelte&quot;),
  title: &quot;SCR - Route Link - Properties&quot;,
}
</pre>`,b(t,"class","scr-page")},m(o,e){f(o,t,e)},p:R,d(o){o&&d(t)}}}function y(s){let t,o;return t=new q({props:{back:{name:"v1_Navigation_Store",text:"Navigation Store"},forward:{name:"v1_Router_Store",text:"Router Store"},$$slots:{default:[_]},$$scope:{ctx:s}}}),{c(){u(t.$$.fragment)},m(e,r){c(t,e,r),o=!0},p(e,[r]){const n={};r&1&&(n.$$scope={dirty:r,ctx:e}),t.$set(n)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){m(t.$$.fragment,e),o=!1},d(e){g(t,e)}}}class L extends a{constructor(t){super(),i(this,t,null,y,l,{})}}export{L as default};
