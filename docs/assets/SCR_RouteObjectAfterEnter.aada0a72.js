import{S as n,i,s as l,h as u,m as c,j as h,k as b,o as p,e as m,b as f,c as g,n as d,g as q}from"./index.fc5ef2be.js";import{S as T}from"./SCR_Page.a121dc3b.js";function x(a){let e;return{c(){e=m("div"),e.innerHTML=`<h4 class="scr-h4">Route Object - After Before Enter Function</h4> 
  <p class="scr-text-justify">The <b>afterBeforeEnter</b> option sets a function that must be executed for
    this specific route when finishing routing. This function will not redirect
    or avoid entering the route. The permission to enter has been granted
    already by passing all the before enter functions.
    <br/> 
    <br/>
    So this function is more like a customization before enter. Here you can override
    the title of the route, can pass more parameters or execute important stuff before
    render the route.
    <br/> 
    <br/>
    See the next example of how to set this option:</p> 
  <pre class="scr-pre"><b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Route After Before Enter Function</b>
{
  afterBeforeEnter((routeObjParams) =&gt; { console.log(routeObjParams); });
}
</pre> 
  <hr class="scr-hr"/> 
  <h4 class="scr-h4">Anatomy of the After Before Enter Function</h4> 
  <p class="scr-text-justify">When declaring a After Before Enter Function it will be provided a
    parameter.
    <br/>
    Lets check it:</p> 
  <pre class="scr-pre"><b class="scr-b">// Example of After Before Enter Function declaration</b>
(props, routeObjParams) =&gt; { 
  console.log(props);
  console.log(routeObjParams);
}
</pre> 
  <ul><li><b>routeObjParams: </b>All the parameters passed until that error has
      occurred.
      <br/>
      This is a composed object and it has the following parameters:
      <ul><li><b>currentRoute:</b> The current route object containing the
          information of the route that the user is trying to access. It is
          composed by the following params:
          <ul><li><b>name: </b>The name of the route</li> 
            <li><b>hash: </b>The hash value of the route</li> 
            <li><b>hostname: </b>The hostname of the route. For example:
              &quot;localhost&quot;</li> 
            <li><b>origin: </b>The origin of the route. For example:
              &quot;http://localhost:5000&quot;</li> 
            <li><b>params: </b>The query params of the route. For example: {
              testParam: &quot;someParamValue&quot; }</li> 
            <li><b>pathname: </b>The path of the route. For example:
              &quot;/svelte-client-router/configurationBeforeEnter&quot;</li> 
            <li><b>port: </b>The port of the host. For example: &quot;5000&quot;</li> 
            <li><b>protocol: </b>The protocol used. For example: &quot;http:&quot;</li></ul></li> 
        <br/> 
        <li><b>fromRoute:</b> The coming from route object containing the
          information of the route that the user is coming from. It is composed
          by the following params:
          <ul><li><b>name: </b>The name of the route</li> 
            <li><b>hash: </b>The hash value of the route</li> 
            <li><b>hostname: </b>The hostname of the route. For example:
              &quot;localhost&quot;</li> 
            <li><b>origin: </b>The origin of the route. For example:
              &quot;http://localhost:5000&quot;</li> 
            <li><b>params: </b>The query params of the route. For example: {
              testParam: &quot;someParamValue&quot; }</li> 
            <li><b>pathname: </b>The path of the route. For example:
              &quot;/svelte-client-router/configurationBeforeEnter&quot;</li> 
            <li><b>port: </b>The port of the host. For example: &quot;5000&quot;</li> 
            <li><b>protocol: </b>The protocol used. For example: &quot;http:&quot;</li></ul></li> 
        <br/> 
        <li><b>pathParams:</b> Path params informed</li> 
        <br/> 
        <li><b>payload:</b> Payload params informed</li> 
        <br/> 
        <li><b>queryParams:</b> Query params informed</li></ul> 
      <br/> 
      <ul><li><b>routeObjectParam: </b>All the parameters passed to this route set
          in the route object definition.</li></ul></li></ul> 

  <center><small class="scr-small">The configuration for this route.</small></center> 
  <pre class="scr-pre">{
    name: &quot;routeObjectAfterBeforeEnterRoute&quot;,
    path: &quot;/svelte-client-router/routeObjectAfterBeforeEnter&quot;,
    lazyLoadComponent: () =&gt; import(&quot;./docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte&quot;),
    title: &quot;SCR - Route Object - After Function&quot;,
}
</pre>`,f(e,"class","scr-page")},m(o,t){g(o,e,t)},p:d,d(o){o&&q(e)}}}function _(a){let e,o;return e=new T({props:{back:{name:"v1_Route_Object_Before_Enter",text:"Route Object Before Enter"},forward:{name:"v1_Route_Object_On_Error",text:"Route Object On Error"},$$slots:{default:[x]},$$scope:{ctx:a}}}),{c(){u(e.$$.fragment)},m(t,r){c(e,t,r),o=!0},p(t,[r]){const s={};r&1&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){o||(h(e.$$.fragment,t),o=!0)},o(t){b(e.$$.fragment,t),o=!1},d(t){p(e,t)}}}class F extends n{constructor(e){super(),i(this,e,null,_,l,{})}}export{F as default};
