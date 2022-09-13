import{S as r,i as l,s as a,h as u,m as c,j as h,k as p,o as f,e as m,b as g,c as v,n as d,g as b}from"./index.fc5ef2be.js";import{S as k}from"./SCR_Page.a121dc3b.js";function _(n){let e;return{c(){e=m("div"),e.innerHTML=`<h4 class="scr-h4">Presentation</h4> 
    <p class="scr-text-justify">Hi.. This is The Svelte Router - <u>VERSION 2</u> - thought to be focused on
      controlling what happens before entering the route.
      <br/> 
      <br/>
      The motivation to improve this router was that, until now, there isn&#39;t a nice
      router for svelte. When we think on routing what do we want? Did you stop do
      think about it?
      <br/> 
      <br/>
      Let&#39;s see what we thought...</p> 
    <ul><li class="scr-li svelte-1kf261k">Lazy Load Components and Layouts</li> 
      <li class="scr-li svelte-1kf261k">Global and Per Route Layout</li> 
      <li class="scr-li svelte-1kf261k">Execute something Before Enter <b><u>The</u></b> Route</li> 
      <li class="scr-li svelte-1kf261k">Execute something Before Enter <b><u>Each</u></b> Route</li> 
      <li class="scr-li svelte-1kf261k">The possibility to ignore global before enter on a single route</li> 
      <li class="scr-li svelte-1kf261k">A Loading Component To Keep Our Users Waiting</li> 
      <li class="scr-li svelte-1kf261k">A Not Found Component to land when the user try to enter a not existing
        route</li> 
      <li class="scr-li svelte-1kf261k">Customize routes and components at our will</li> 
      <li class="scr-li svelte-1kf261k">To set the title automatically</li> 
      <li class="scr-li svelte-1kf261k">To pass information between Before Enter Function and send to Route
        Loaded Components</li> 
      <li class="scr-li svelte-1kf261k">The possibility to use hash routing</li></ul> 
    <p class="scr-text-justify">Not only that is important but to control the overall behaviour when
      routing. Where to set the scroll position, reload the route everytime or
      just when I am not in the route - this may prevent some looping issues in
      your application.
      <br/> 
      <br/>
      Anyway a lot of cool stuff when routing. So in each section it will be provided
      the configuration used to configure each route ok? See below the configuration
      for this first route.
      <br/>
      Pretty simple isn&#39;t it ?</p> 
    <center><small class="scr-small">The configuration for this route.</small></center> 
    <pre class="scr-pre">{
  name: &quot;v2Presentation&quot;,
  path: &quot;/svelte-client-router/v2/presentation&quot;,
  lazyLoadComponent: () =&gt; import(&quot;../../pages/v2/SCR_Presentation.svelte&quot;),
  title: &quot;SCR - Presentation - Version 2&quot;,
  beforeEnter: [setVersion2],
}
</pre>`,g(e,"class","scr-page")},m(o,t){v(o,e,t)},p:d,d(o){o&&b(e)}}}function w(n){let e,o;return e=new k({props:{back:{name:"rootRoute",text:"Home"},forward:{name:"v2_Installation",text:"Installation"},$$slots:{default:[_]},$$scope:{ctx:n}}}),{c(){u(e.$$.fragment)},m(t,s){c(e,t,s),o=!0},p(t,[s]){const i={};s&1&&(i.$$scope={dirty:s,ctx:t}),e.$set(i)},i(t){o||(h(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){f(e,t)}}}class C extends r{constructor(e){super(),l(this,e,null,w,a,{})}}export{C as default};
