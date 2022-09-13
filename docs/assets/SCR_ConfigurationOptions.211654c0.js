import{S as i,i as l,s as n,h as c,m as h,j as u,k as p,o as b,e as g,b as f,c as d,n as m,g as S}from"./index.fc5ef2be.js";import{S as v}from"./SCR_Page.a121dc3b.js";function y(r){let e;return{c(){e=g("div"),e.innerHTML=`<h4 class="scr-h4">Configuration Options</h4> 
  <p>The configuration are managed in a <a href="https://svelte.dev/tutorial/writable-stores" target="_blank">Svelte Store.</a>
    The Svelte Store are one of the cooliest things in Svelte. Is very reactive and
    helps us to make our router reactive too. You can change the behaviour at any
    point and will instantly react to it.</p> 
  <h5>Importing</h5> 
  <pre class="scr-pre"><b class="scr-b">// Importing configuration store</b>
import { SCR_CONFIG_STORE } from &quot;svelte-client-router&quot;
</pre> 
  <p>Next.. lets check out all the available properties.</p> 
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Hash Mode</h4> 
  <p class="scr-text-justify">The <b>hashMode</b> option controls either if our router must check a hashed
    based route like this site or must <b>NOT</b> consider a hashed based route
    path where the hash char doesn&#39;t mean much.
    <br/> 
    <br/>
    This website for example must be hashed based because Github Pages is not prepared
    to return the index.html page for each route request.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Hash Mode checks route using #/ before the location path
// ## for example http://localhost:5000/pathAAA#/pathBBB
// ## it will consider only pathBBB and ignore pathAAA as path!
// ## Boolean 
// ## Default value: false
</b>
{
  hashMode: false,
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setHashMode(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Navigation History Limit</h4> 
  <p class="scr-text-justify">The <b>navigationHistoryLimit</b> option sets the size of the navigation
    history. Inside the router store we have an array that contains all the
    route objects where the first position is the last page visited and the last
    position is the first page visited.
    <br/> 
    <br/>
    If is set 0 or less it will be considered unlimited.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Navigation History Limit is the amount of route history is added 
// ## in the route navigation history list 
// ## 0 or -1 equals to &quot;no limit&quot;
// ## Integer
// ## Default value: 10
</b>
{
  navigationHistoryLimit: 10, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Save Mode</h4> 
  <p class="scr-text-justify">The <b>saveMode</b> option has the following options:</p> 
  <ul><li><b>localstorage:</b> (default) Saves the router store in the localstorage.</li> 
    <li><b>indexeddb:</b> Saves the router store in the Index DB Storage.</li> 
    <li><b>none:</b> Doesn&#39;t save the store anywhere.</li></ul> 
  <p>The implications are implicit. Saving the route object helps us to keep
    track all the user history if you need that information when reloading the
    page.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Save mode sets the type of saving history route and store
// ## It can be set to one of this following values:
// ## - localstorage: it saves route in the localstorage
// ## - indexeddb: it saves route in the IndexedDb 
// ## - none: Doesn&#39;t save anything - meaning when reload it starts fresh all values!
// ## String
// ## Default value: localstorage
</b>
{
  saveMode: localstorage, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setSaveMode(&quot;localstorage&quot;);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Not Found Route</h4> 
  <p class="scr-text-justify">The <b>notFoundRoute</b> option sets the route to redirect to when the user
    enter a non existent url path.
    <br/> 
    <br/> 
    <b>OBS: It has to start with &quot;/&quot;</b></p> 
  <pre class="scr-pre"><b class="scr-b">// ## Not Found Route Path
// ## is the path that should redirect when not found a path in the application
// ## String - must include &quot;/&quot;
// ## Default value: /notFound
</b>
{
  notFound: &quot;/notFound&quot;, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setNotFoundRoute(&quot;/notFound&quot;);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Error Route</h4> 
  <p class="scr-text-justify">The <b>errorRoute</b> option sets the route to redirect to when an error
    occurs.
    <br/> 
    <br/> 
    <b>OBS: It has to start with &quot;/&quot;</b></p> 
  <pre class="scr-pre"><b class="scr-b">// ## Error Route Path
// ## is the path that should redirect when an error occurs in the application
// ## String - must include &quot;/&quot;
// ## Default value: /error
</b>
{
  error: &quot;/error&quot;, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setErrorRoute(&quot;/error&quot;);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Console Log Error Messages</h4> 
  <p class="scr-text-justify">The <b>consoleLogErrorMessages</b> option enables SCR to log all possible
    errors in the console log.
    <br/> 
    <br/>
    When something goes wrong it helps to see the stack trace and the error messages.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Console Log Error Messages logs in the console 
// ## any error messages of the SCR for debugging purposes
// ## Boolean
// ## Default value: true
</b>
{
  consoleLogStores: true, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsoleLogErrorMessages(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Console Log Stores</h4> 
  <p class="scr-text-justify">The <b>consoleLogStores</b> option enables SCR to log all changes in the
    stores.
    <br/> 
    <br/>
    This is great for debugging purposes.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Console Log Stores logs in the console 
// ## any changes in the Router Store for debugging purposes
// ## Boolean
// ## Default value: true
</b>
{
  setConsoleLogStores: true, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsoleLogStores(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Uses Route Layout</h4> 
  <p class="scr-text-justify">The <b>usesRouteLayout</b> option tells the SCR that you are going to use a
    Global Layout.
    <br/> 
    <br/>
    You can set a layout per route, but most common cases you want to set a global
    layout and if necessary set a different route layout.
    <br/> 
    <br/>
    The SCR has a default simple layout that you probably not going to use, so if
    you do not want to use a custom layout it is better to set this option to false.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Uses Route Layout defines if you will be using layout 
// ## for each route or not - can be ignored in the route 
// ## Boolean
// ## Default value: true
</b>
{
  usesRouteLayout: true, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setUsesRouteLayout(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Consider Trailing Slash On Matching Route</h4> 
  <p class="scr-text-justify">The <b>considerTrailingSlashOnMatchingRoute</b> option speaks for itself. When
    searching for a matching route a trailing slash should be considered or not.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Consider Trailing Slash On Matching Route
// ## add an slash in the end of the route path to search in the route definitions
// ## Boolean
// ## Default value: true
</b>
{
  considerTrailingSlashOnMatchingRoute: true, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsiderTrailingSlashOnMatchingRoute(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Use Scroll</h4> 
  <p class="scr-text-justify">The <b>useScroll</b> option tell SCR that you will be using a scroll
    behaviour globally. That means SCR will apply the global <b>scrollProps</b>
    configuration for each route entered if the route do not specify a differente
    <b>scrollProps</b>
    configuration or the <b>ignoreScroll</b> property.</p> 
  <pre class="scr-pre"><b class="scr-b">// ## Use Scroll - enable or disables scrolling on entering the route
// ## Boolean
// ## Default value: true
</b>
{
  useScroll: true, 
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setUseScroll(true);
</pre> 
  
  
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Scroll Props</h4> 
  <p class="scr-text-justify">The <b>scrollProps</b> option is the behaviour options when the scrolling is enabled.
    It has the following options:</p> 
  <ul><li><b>top: </b>The top position to scroll - Default is 0</li> 
    <li><b>left: </b>The left position to scroll - Default is 0</li> 
    <li><b>behaviour: </b>The behaviour when scrolling to position - Default is
      &quot;smooth&quot;</li> 
    <li><b>timeout: </b>This options sets a timeout to fire the scrolling. The
      minimum value accepted is 10 milliseconds. Default is 10 milliseconds.</li></ul> 
  <pre class="scr-pre"><b class="scr-b">// ## Scroll Props
// ## The scrolling props on entering the route if enabled
// ## Default Values: 
// ## scrollProps: {
// ##   top: 0,
// ##   left: 0,
// ##   behaviour: &quot;smooth&quot;,
// ##   timeout: 10, // timeout must be greater than 10 milliseconds
// ## },
// ## Object
// ## Default value: {
  top: 0,
  left: 0,
  behaviour: &quot;smooth&quot;,   
  timeout: 10, // timeout must be greater than 10 milliseconds
}
</b>
{
  scrollProps: {
    top: 0,
    left: 0,
    behaviour: &quot;smooth&quot;,
    timeout: 10, // timeout must be greater than 10 milliseconds
  },
}

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setScrollProps({
  top: 0,
  left: 0,
  behaviour: &quot;smooth&quot;,
  timeout: 10,
});
</pre> 
  <p class="scr-text-justify">So that is it for this section. But the configuration store is not over yet.
    The next properties has its own sections each. Click next to see more
    information.</p> 

  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
    name: &quot;configurationOptionsRoute&quot;,
    path: &quot;/svelte-client-router/configurationOptions&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_ConfigurationOptions.svelte&quot;),
    title: &quot;SCR - Configuration Options&quot;,
}
</pre>`,f(e,"class","scr-page")},m(s,t){d(s,e,t)},p:m,d(s){s&&S(e)}}}function R(r){let e,s;return e=new v({props:{back:{name:"v1_Getting_Started",text:"Getting Started"},forward:{name:"v1_Configuration_Global_Before_Enter_Option",text:"Configuration Before Enter"},$$slots:{default:[y]},$$scope:{ctx:r}}}),{c(){c(e.$$.fragment)},m(t,o){h(e,t,o),s=!0},p(t,[o]){const a={};o&1&&(a.$$scope={dirty:o,ctx:t}),e.$set(a)},i(t){s||(u(e.$$.fragment,t),s=!0)},o(t){p(e.$$.fragment,t),s=!1},d(t){b(e,t)}}}class T extends i{constructor(e){super(),l(this,e,null,R,n,{})}}export{T as default};
