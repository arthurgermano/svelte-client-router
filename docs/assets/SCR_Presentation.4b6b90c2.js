import{S as r,i as l,s as a,h as c,m as u,j as h,k as p,o as f,e as m,b as g,c as d,n as k,g as v}from"./index.fc5ef2be.js";import{S as b}from"./SCR_Page.a121dc3b.js";function _(n){let e;return{c(){e=m("div"),e.innerHTML=`<h4 class="scr-h4">Presentation</h4> 
    <p class="scr-text-justify">Hi.. This is The Svelte Router - thought to be focused on controlling what
      happens before entering the route.
      <br/> 
      <br/>
      The motivation to develop this router was that, until now, there isn&#39;t a nice
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
      <li class="scr-li svelte-1kf261k">A Error Component To land when something goes wrong</li> 
      <li class="scr-li svelte-1kf261k">A Not Found Component To land when the user try to enter a not existing
        route</li> 
      <li class="scr-li svelte-1kf261k">Customize this routes and components at our will</li> 
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
  name: &quot;rootRoute&quot;,
  path: &quot;/svelte-client-router&quot;,
  lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_Presentation.svelte&quot;),
  title: &quot;SCR - Presentation&quot;,
}
</pre>`,g(e,"class","scr-page")},m(o,t){d(o,e,t)},p:k,d(o){o&&v(e)}}}function w(n){let e,o;return e=new b({props:{back:{name:"rootRoute",text:"Home"},forward:{name:"v1_Installation",text:"Installation"},$$slots:{default:[_]},$$scope:{ctx:n}}}),{c(){c(e.$$.fragment)},m(t,s){u(e,t,s),o=!0},p(t,[s]){const i={};s&1&&(i.$$scope={dirty:s,ctx:t}),e.$set(i)},i(t){o||(h(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){f(e,t)}}}class T extends r{constructor(e){super(),l(this,e,null,w,a,{})}}export{T as default};
