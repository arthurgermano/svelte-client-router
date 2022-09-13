import{S as a,i,s as l,h as c,m as u,j as p,k as d,o as m,e as g,b as f,c as v,n as b,g as h}from"./index.fc5ef2be.js";import{S as C}from"./SCR_Page.a121dc3b.js";function _(s){let t;return{c(){t=g("div"),t.innerHTML=`<h4 class="scr-h4">Route Component - Components</h4> 
    <p class="scr-text-justify">In the first version, SCR had a lot of default components to facilitate
      usage, like layout components, error and not found components that would
      pop up to a given case. 
      <br/><br/>
      The second version is very succinct in that
      matter, it is focused to deliver routing leaving to you to specify a the
      components. Layout, Error and Not Found components must be set by you in
      this version.
      <br/>
      So now in this version we have only one component we can set. Let&#39;s check it:</p> 
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Default Loading Component</h4> 
    <p class="scr-text-justify">The Default Loading Component is the default loading screen used to show when before enter
      routes are been processed.
      <br/>
      It will receive <b>defaultLoadingParams</b> declared and any route object
      <b>loadingParams</b> defined.</p> 
    <pre class="scr-pre"><b class="scr-b">// Importing your components</b>
import { SCR_Router } from &quot;svelte-client-router&quot;
import SCR_Loading from &quot;../testComponents/SCR_Loading.svelte&quot;;

<b class="scr-b">// Define the router object array</b>
const routes = [
  {
    ... <b class="scr-b">// Your routes definitions</b>
  }
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_Router 
  bind:routes 
  defaultLoadingComponent={SCR_Loading}
/&gt;
</pre> 
    <p class="scr-text-justify">Next an example of Svelte Loading Component:</p> 
    <pre class="scr-pre"><b class="scr-b">// Example of a Svelte Loading Component</b>
&lt;script&gt;

  <b class="scr-b">// This variable was passed on loadingProps - Route Object Definition </b>
  export let loadingText = &quot;Loading...&quot;;
&lt;/script&gt;

&lt;center &gt;
  &lt;div class=&quot;scr-lds-spinner&quot;&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
    &lt;div /&gt;
  &lt;/div&gt;
  &lt;h1 class=&quot;scr-h1&quot;&gt;{loadingText}&lt;/h1&gt;
&lt;/center&gt;
</pre> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre">{
  name: &quot;v2_Route_Component_Components&quot;,
  path: &quot;/svelte-client-router/v2/routeComponentComponents&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_RouteComponentComponents.svelte&quot;),
  title: &quot;SCR - Route Component Components - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,f(t,"class","scr-page")},m(o,e){v(o,t,e)},p:b,d(o){o&&h(t)}}}function R(s){let t,o;return t=new C({props:{back:{name:"v2_Route_Component_Properties",text:"Route Component Properties"},forward:{name:"v2_Navigation_Routing",text:"Navigation Routing"},$$slots:{default:[_]},$$scope:{ctx:s}}}),{c(){c(t.$$.fragment)},m(e,n){u(t,e,n),o=!0},p(e,[n]){const r={};n&1&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){o||(p(t.$$.fragment,e),o=!0)},o(e){d(t.$$.fragment,e),o=!1},d(e){m(t,e)}}}class x extends a{constructor(t){super(),i(this,t,null,R,l,{})}}export{x as default};
