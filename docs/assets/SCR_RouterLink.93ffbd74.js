import{S as a,i,s as l,h as u,m as c,j as p,k as m,o as g,e as h,b,c as f,n as _,g as d}from"./index.fc5ef2be.js";import{S as q}from"./SCR_Page.a121dc3b.js";function R(s){let t;return{c(){t=h("div"),t.innerHTML=`<h4 class="scr-h4">Route Link</h4> 
  <p class="scr-text-justify">The Route Link is a component wrapper to make links. Easy to click and
    execute what you want. It is totally customisable.
    <br/>
    Lets see how to import and use it:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Navigate Store, both ways work equally
</b>&lt;script&gt;
  import { SCR_RouterLink, scr_router_link } from &quot;svelte-client-router&quot;;
&lt;/script&gt;
<b class="scr-b">
&lt;--! Example of Usage --&gt;
</b>&lt;SCR_RouterLink
  params={{ name: &quot;v2_Router_Link&quot; }}
  elementProps={{ style: &quot;display: inline; cursor: pointer;&quot; }}
&gt;
  &lt;a style=&quot;pointer-events: none;&quot;&gt;
    components - that can be check in the next section, 
    and some are crucial for it to work correctly.
  -&lt;/a&gt;
&lt;/SCR_RouterLink&gt;
</pre> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Properties</h4> 
  <p class="scr-text-justify">Pretty easy to use, isn&#39;t it? So now lets check out the component exported
    properties:</p> 
  <ul><li><b>params: </b>the route path to go to. It can understand three types of
      declarations:
      <ul><li><b>A string path: </b>For example: &quot;/someRoute/to/go&quot;</li> 
        <li><b>path: </b>For example: { path: &quot;/routePath&quot; }</li> 
        <li><b>name: </b>For example: { name: &quot;theRouteName&quot; }</li></ul></li> 
    <br/> 
    <li><b>params.params: </b>Some custom params to send to Before Enter and After Before
      Enter Functions as well the components</li> 
    <br/> 
    <li><b>params.onError: </b>A custom onError function. This is nice because you can
      override your route onError declaration. It will execute this function
      instead of the route definition declared function.</li> 
    <br/> 
    <li><b>elementProps: </b>This is all the HTML properties to pass to parent div
      so you can customize it at your own will.</li></ul> 
  <p class="scr-text-justify">Lets see another example:</p> 
  <pre class="scr-pre"><b class="scr-b">// Importing Navigate Store
</b>&lt;script&gt;
  import { SCR_RouterLink } from &quot;svelte-client-router&quot;;
&lt;/script&gt;
<b class="scr-b">
&lt;--! Another Example of Usage --&gt;
</b>&lt;SCR_RouterLink 
  params={
    {
      name: &quot;My_Route_Name_Three&quot;, 
      params: { myCustomParam: &quot;Only for this Link&quot;},
      onError: (error) =&gt; console.log(&quot;Execute this instead error defined on router object! - Only if something goes wrong),
    }
  }
  elementProps={{ style:&quot;background-color: green&quot; }}
&gt;
  &lt;button&gt;Click to Go to Defined Route Named: My_Route_Name_Three!&lt;/button&gt;
&lt;/SCR_RouterLink&gt;
</pre> 
  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
  name: &quot;v2_Router_Link&quot;,
  path: &quot;/svelte-client-router/v2/routerLink&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_RouterLink.svelte&quot;),
  title: &quot;SCR - Router Link - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,b(t,"class","scr-page")},m(o,e){f(o,t,e)},p:_,d(o){o&&d(t)}}}function k(s){let t,o;return t=new q({props:{back:{name:"v2_Navigation_Routing",text:"Navigation Routing"},forward:{name:"v2_Routes_Store",text:"Routes Store"},$$slots:{default:[R]},$$scope:{ctx:s}}}),{c(){u(t.$$.fragment)},m(e,r){c(t,e,r),o=!0},p(e,[r]){const n={};r&1&&(n.$$scope={dirty:r,ctx:e}),t.$set(n)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){m(t.$$.fragment,e),o=!1},d(e){g(t,e)}}}class L extends a{constructor(t){super(),i(this,t,null,k,l,{})}}export{L as default};
