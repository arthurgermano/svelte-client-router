import{S as n,i as l,s as i,h as c,m as u,j as h,k as p,o as b,e as m,b as d,c as f,n as y,g}from"./index.fc5ef2be.js";import{S as C}from"./SCR_Page.a121dc3b.js";function q(r){let e;return{c(){e=m("div"),e.innerHTML=`<h4 class="scr-h4">Route Object - Properties</h4> 
    <p class="scr-text-justify">This is where we can declare our routes. It has several option that
      modelates the route behaviour.
      <br/>
      There is some mandatory properties that configure a minimal route declaration.
      Lets check each option:</p> 
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Name</h4> 
    <p class="scr-text-justify">The <b>name</b> option is mandatory. It an humam readable identification
      for this route.
      <br/>
      As it is an identification property must be unique. If some route is declared
      with the same name, it will always find the first route with that name and
      route to it.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Route Name
// ## The name identifying this route
// ## String - Obrigatory
// ## Default value: none
</b>
{
  name: &quot;exampleOfRouteName&quot;,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Path</h4> 
    <p class="scr-text-justify">The <b>path</b> is mandatory and it is the path to route to. This property
      is Case Sensitive.
      <br/> 
      <br/>
      As it is an identification property must be unique. If some route is declared
      with the same path, it will always find the first route with that path and
      route to it.
      <br/>
      Simple declaration:
      <br/> 
      <b>path: &quot;/path/to/my/route&quot;,</b> 
      <br/> 
      <br/>
      You can use regex in your route like &quot;:myVar&quot;. For example:
      <br/> 
      <b>path: &quot;/path/:someVar/my/route/:someOtherVar&quot;,</b> 
      <br/> 
      <br/>
      You can use any route wildcard &quot;*&quot; in your route. For example:
      <br/>
      To match any route:
      <br/> 
      <b>path: &quot;*&quot;,</b> 
      <br/> 
      <br/>
      To match a section of route:
      <br/> 
      <b>path: &quot;/path/*&quot;,</b> or <b>path: &quot;/path/prefixValu*&quot;,</b> 
      <br/> 
      <br/>
      To match section route with param paths:
      <br/> 
      <b>path: &quot;/path/prefixValu*/:somePathParamValue&quot;,</b> 
      <br/> 
      <br/>
      It will be made available on all beforeEnter Functions, After Enter Function
      and Components;</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Route Path
// ## The path identifying this route
// ## String - Obrigatory
// ## Can declare regex like /test1/:paramA/testRegexPathParam2/:paramB
// ## The regex must have the format &quot;:string&quot;
// ## Can declare any route wildcard like /test1/:paramA/*/:paramB
// ## This property value is Case Sensitive.
// ## Default value: none
</b>
{
  path: &quot;/path/to/my/route&quot;,

  <b class="scr-b">
// OR Can declare regex path
</b>
  path: &quot;/path/:to/:my/route&quot;,

  <b class="scr-b">
// it will be made available on all beforeEnter Functions, After Enter Function and Component
  // pathParams: {
  //  to: &quot;myroutedefinedvalue&quot;
  //  my: &quot;myroutedefinedvalue&quot;
  // }
  </b>

  <b class="scr-b">
// OR Can declare regex path and any route wildcard
</b>
  path: &quot;/path/:to/*/route&quot;,

  <b class="scr-b">
  // it will be made available on all beforeEnter Functions, After Enter Function and Component
  // pathParams: {
  //  to: &quot;myroutedefinedvalue&quot;
  // }
  </b>

  <b class="scr-b">
// OR Can declare to Any Route to be matched with wildcard
  </b>
  path: &quot;*&quot;,
 
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Component</h4> 
    <p class="scr-text-justify">The <b>component</b> is partially mandatory. This is because if the route
      only redirects, it will not use the loaded component.
      <br/> 
      <br/>
      The component specified will be included inside the default slot of the Layout
      Component.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Component - the loaded component that is going to be used 
// for this route
// ## Function - Imported component for this route
// ## Default value: none
</b>

<b class="scr-b">// Import your component</b>
import SCR_C1 from &quot;./testComponents/SCR_C1.svelte&quot;;

{
  <b class="scr-b">// Setting your route component</b>
  component: SCR_C1,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Lazy Load Component</h4> 
    <p class="scr-text-justify">The <b>lazyLoadComponent</b> is partially mandatory. This is because if
      the route only redirects, it will not load any component.
      <br/> 
      <br/>
      The component specified will be included inside the default slot of the Layout
      Component.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Lazy Load Component - the component that must be loaded to be used 
// ## for this route
// ## Function - Function to load the component for this route
// ## Default value: none
</b>

{
  <b class="scr-b">// Lazy loading your route component</b>
  lazyLoadComponent: () =&gt; import(&quot;./testComponents/SCR_C1.svelte&quot;),
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Layout Component</h4> 
    <p class="scr-text-justify">The <b>layoutComponent</b> is a custom loaded layout to use with this
      specific route. When set it will override any global layout set for this
      route only.
      <br/> 
      <br/>
      The layout component specified must have a default slot declared to include
      route component.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Layout Component - the layout component that is going to be used 
// ## for this route
// ## Function - Imported layout component for this route
// ## Default value: none
</b>

<b class="scr-b">// Import your component</b>
import SRC_Layout from &quot;./testComponents/SRC_Layout.svelte&quot;;

{
  <b class="scr-b">// Setting your route layout component</b>
  layoutComponent: SRC_Layout,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Lazy Load Layout Component</h4> 
    <p class="scr-text-justify">The <b>lazyLoadLayoutComponent</b> is a custom layout to be loaded to use
      with this specific route. When set it will override any global layout set
      for this route only.
      <br/> 
      <br/>
      The lazy layout component specified must have a default slot declared to include
      route component.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Lazy Load Layout Component - the layout component that must be loaded to be used 
// ## for this route
// ## Function - Function to load the layout component for this route
// ## Default value: none
</b>

{
  <b class="scr-b">// Lazy loading your route layout component</b>
  lazyLoadLayoutComponent: () =&gt; import(&quot;./testComponents/SRC_Layout.svelte&quot;),
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Loading Component</h4> 
    <p class="scr-text-justify">The <b>loadingComponent</b> is a custom loaded loading component to use with
      this specific route. When set it will override any global loading component
      set for this route only.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Loading Component - the loading component that is going to be used 
// ## for this route
// ## Function - Imported loading component for this route
// ## Default value: none
</b>

<b class="scr-b">// Import your component</b>
import SRC_Loading from &quot;./testComponents/SRC_Loading.svelte&quot;;

{
  <b class="scr-b">// Setting your route loading component</b>
  loadingComponent: SRC_Loading,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Lazy Load Loading Component</h4> 
    <p class="scr-text-justify">The <b>lazyLoadLoadingComponent</b> is a custom loading component to be loaded
      to use with this specific route. When set it will override any global loading
      component set for this route only.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Lazy Load Loading Component - the loading component that must be loaded to be used 
// ## for this route
// ## Function - Function to load the loading component for this route
// ## Default value: none
</b>

{
  <b class="scr-b">// Lazy loading your route loading component</b>
  lazyLoadLoadingComponent: () =&gt; import(&quot;./testComponents/SRC_Loading.svelte&quot;),
}
</pre> 
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Params</h4> 
    <p class="scr-text-justify">The <b>params</b> option is an object that must be available on before
      enter functions or even the components.
      <br/>
      It will be available at any moment for you. Of course this is some fixed values.
      See the payload param in the before enter sections to pass some custom values
      between functions.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Params - all the params the should be available
// for this route on any Before Enter Execution or 
// After Before Enter Execution
// ## Object
// ## Default value: {}
</b>
{
  params: { 
    myParam: &quot;My Custom Param&quot;, 
  },
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Loading Props</h4> 
    <p class="scr-text-justify">The <b>loadingProps</b> option is an object that will be available on
      loading component.
      <br/>
      When routing the user may be waiting for some request to return and for that
      SCR makes available a loading component. Of course you can override it and
      you are encouraged to do so.
      <br/> 
      <br/>
      Any properties set here will be delivered to the loading component.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Loading Props - all props that must be available to
// loading component when it is triggered
// ## Object
// ## Default value: {}
</b>
{
  loadingProps: { loadingText: &quot;Carregando...&quot; },
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Ignore Layout</h4> 
    <p class="scr-text-justify">The <b>ignoreLayout</b> option when set to true, ignores any layout defined
      to this specific route.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Ignore Layout - if should ignore layout component
// ## when you do not want to use global or local layout component
// ## Boolean
// ## Default value: false
</b>
{
  ignoreLayout: false,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Ignore Scroll</h4> 
    <p class="scr-text-justify">The <b>ignoreScroll</b> option when set to true, ignores any scroll behaviour
      defined.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Ignore Scroll - if this route should ignore scrolling
// ## Boolean
// ## Default value: false
</b>
{
  ignoreScroll: false,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Scroll Props</h4> 
    <p class="scr-text-justify">The <b>scrollProps</b> option overrides the store <b>scrollProps</b> configuration
      for this specific route.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Scroll Props
// ## The scrolling props on entering the route if enabled
// ## Default Values: 
// ## Object
// ## Default value: configuration store
</b>
{
  scrollProps: {
    top: 0,
    left: 0,
    behavior: &quot;smooth&quot;,
    timeout: 10, // timeout must be greater than 10 milliseconds
  },
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Title</h4> 
    <p class="scr-text-justify">The <b>title</b> option sets when enters the route the page title.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Title - it defines the route title
// ## String
// ## Default value: none
</b>
{
  title: &quot;Route Object - Options&quot;,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Ignore Global Before Function</h4> 
    <p class="scr-text-justify">The <b>ignoreGlobalBeforeFunction</b> option when is true will not execute
      any Global Before Enter functions for this specific route.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Ignore Global Before Function - 
// ## if should ignore defined global before function 
// ## Boolean
// ## Default value: false
</b>
{
  ignoreGlobalBeforeFunction: false,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Execute Route BEF Before Global BEF</h4> 
    <p class="scr-text-justify">The <b>executeRouteBEFBeforeGlobalBEF</b> option when is true will modify
      the default behaviour of the SCR. The SCR always runs Global Before Enter
      Functions before Route Before Enter Functions, but is different when this
      option is true.
      <br/>
      When set to true it will execute Route Before Functions before Global Before
      Functions.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Execute Route Before Enter Function Before Global Before Function 
// ## if should execute route before function sequence before 
// ## global before enter execution
// ## Boolean 
// ## Default value: false
</b>
{
  executeRouteBEFBeforeGlobalBEF: false,
}
</pre> 
    
    
    <hr class="scr-hr"/> 
    <h4 class="scr-h4">Force Reload</h4> 
    <p class="scr-text-justify">The <b>forceReload</b> option when is true will not reload the route when
      the route is already loaded. The user may click in a button that pushes to
      the current route. The default behaviour is just not to reload the route.
      <br/> 
      <br/>
      But maybe this is a feature you want to execute.</p> 
    <pre class="scr-pre"><b class="scr-b">// ## Force Reload - when in opened route try to push the same route
// by using pushRoute function
// When enabled it will reload the current route as if it was not opened
// ## Boolean
// ## Default value: false
</b>
{
  forceReload: false,
}
</pre> 
    <p class="scr-text-justify">So that is it for this section. But it is not the end of the Route
      Options. See the next section to more info.</p> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre">{
    name: &quot;routeObjectOptionsRoute&quot;,
    path: &quot;/svelte-client-router/routeObjectOptions&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_RouteObjectProperties.svelte&quot;),
    title: &quot;SCR - Route Object - Options&quot;,
}
</pre>`,d(e,"class","scr-page")},m(o,t){f(o,e,t)},p:y,d(o){o&&g(e)}}}function v(r){let e,o;return e=new C({props:{back:{name:"v1_Configuration_Global_On_Error",text:"Configuration On Error"},forward:{name:"v1_Route_Object_Before_Enter",text:"Route Object Before Enter"},$$slots:{default:[q]},$$scope:{ctx:r}}}),{c(){c(e.$$.fragment)},m(t,s){u(e,t,s),o=!0},p(t,[s]){const a={};s&1&&(a.$$scope={dirty:s,ctx:t}),e.$set(a)},i(t){o||(h(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}class x extends n{constructor(e){super(),l(this,e,null,v,i,{})}}export{x as default};
