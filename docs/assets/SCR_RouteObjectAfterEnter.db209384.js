import{S as y,i as F,s as P,e as n,a as p,b as f,c as u,n as v,g as h,h as O,m as j,j as w,k as R,o as $,d as i}from"./index.fc5ef2be.js";import{S}from"./SCR_Page.a121dc3b.js";function A(T){let e,r,o,a,s,b,c,q,m;return{c(){e=n("h4"),e.textContent="Anatomy of the Before Enter Function",r=p(),o=n("p"),o.innerHTML=`When declaring a After Enter Function it will be provided a parameter.
  <br/>
  Lets check it:`,a=p(),s=n("pre"),s.innerHTML=`<b class="scr-b">// Example of After Enter Function declaration</b>
(params) =&gt; { 
  console.log(params);
}
`,b=p(),c=n("ul"),c.innerHTML=`<li><b>routeFrom: </b>This is a boolean &quot;false&quot; or a object containing the
    values of the route which is coming from. This object has the following
    values:
    <ul><li><b>name: </b>The name of the route -
        &quot;v2_Configuration_Global_Before_Enter_Option&quot;</li> 
      <li><b>hash: </b>The hash value of the route - &quot;&quot;</li> 
      <li><b>host: </b>The host of the route. For example: &quot;localhost:5173&quot;</li> 
      <li><b>origin: </b>The origin of the route. For example:
        &quot;http://localhost:5173&quot;</li> 
      <li><b>port: </b>The port of the host. For example: &quot;5173&quot;</li> 
      <li><b>protocol: </b>The protocol used. For example: &quot;http&quot;</li> 
      <li><b>path:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption&quot;</li> 
      <li><b>fullPath:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam=&quot;someParamValue&quot;</li> 
      <li><b>params: </b>The params passed in the route definition. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>queryParams: </b>The params passed as query params in the path. For
        example: { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>pathParams: </b>The params passed in the path param. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul><li><b>afterEnter:</b> The function defined to be execute after enter this
            route.</li> 
          <li><b>lazyLoadComponent:</b> The function to import the component.</li> 
          <li><b>name:</b> The name of this route</li> 
          <li><b>path:</b> The path of this route</li> 
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!</ul></li></ul></li> 
  <br/> 
  <li><b>routeTo: </b>This is a boolean &quot;false&quot; or a object containing the values
    of the route which is coming from. This object has the following values:
    <ul><li><b>name: </b>The name of the route -
        &quot;v2_Configuration_Global_Before_Enter_Option&quot;</li> 
      <li><b>hash: </b>The hash value of the route - &quot;&quot;</li> 
      <li><b>host: </b>The host of the route. For example: &quot;localhost:5173&quot;</li> 
      <li><b>origin: </b>The origin of the route. For example:
        &quot;http://localhost:5173&quot;</li> 
      <li><b>port: </b>The port of the host. For example: &quot;5173&quot;</li> 
      <li><b>protocol: </b>The protocol used. For example: &quot;http&quot;</li> 
      <li><b>path:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption&quot;</li> 
      <li><b>fullPath:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam=&quot;someParamValue&quot;</li> 
      <li><b>params: </b>The params passed in the route definition. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>queryParams: </b>The params passed as query params in the path. For
        example: { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>pathParams: </b>The params passed in the path param. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul><li><b>afterEnter:</b> The function defined to be execute after enter this
            route.</li> 
          <li><b>lazyLoadComponent:</b> The function to import the component.</li> 
          <li><b>name:</b> The name of this route</li> 
          <li><b>path:</b> The path of this route</li> 
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!</ul></li></ul></li> 
  <br/> 
  <li><b>payload: </b>All the params passed down in before enter functions sequence will be available here.</li>`,q=p(),m=n("p"),m.textContent=`So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.`,f(e,"class","scr-h4"),f(o,"class","scr-text-justify"),f(s,"class","scr-pre"),f(m,"class","scr-text-justify")},m(t,l){u(t,e,l),u(t,r,l),u(t,o,l),u(t,a,l),u(t,s,l),u(t,b,l),u(t,c,l),u(t,q,l),u(t,m,l)},p:v,i:v,o:v,d(t){t&&h(e),t&&h(r),t&&h(o),t&&h(a),t&&h(s),t&&h(b),t&&h(c),t&&h(q),t&&h(m)}}}class L extends y{constructor(e){super(),F(this,e,null,A,P,{})}}function V(T){let e,r,o,a,s,b,c,q,m,t,l,E,g,_,x;return t=new L({}),{c(){e=n("div"),r=n("h4"),r.textContent="Route Object - After Enter Function",o=p(),a=n("p"),a.innerHTML=`The <b>afterEnter</b> option sets a function that must be executed for
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
    See the next example of how to set this option:`,s=p(),b=n("pre"),b.innerHTML=`<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Route After Enter Function</b>
{
  afterEnter(( 
    { 
      toRoute,
      fromRoute,
      payload,
  } ) =&gt; { 
    console.log(
      toRoute,
      fromRoute,
      payload,
    ); 
  });
}
`,c=p(),q=n("hr"),m=p(),O(t.$$.fragment),l=p(),E=n("center"),E.innerHTML='<small class="scr-small">The configuration for this route.</small>',g=p(),_=n("pre"),_.textContent=`{
  name: "v2_Route_Object_After_Enter",
  path: "/svelte-client-router/v2/routeObjectAfterEnter",
  lazyLoadComponent: () => import("../../pages/v2/SCR_RouteObjectAfterEnter.svelte"),
  title: "SCR - Route Object After Enter - Version 1",
  beforeEnter: [setVersion2],
}
`,f(r,"class","scr-h4"),f(a,"class","scr-text-justify"),f(b,"class","scr-pre"),f(q,"class","scr-hr"),f(_,"class","scr-pre"),f(e,"class","scr-page")},m(d,C){u(d,e,C),i(e,r),i(e,o),i(e,a),i(e,s),i(e,b),i(e,c),i(e,q),i(e,m),j(t,e,null),i(e,l),i(e,E),i(e,g),i(e,_),x=!0},p:v,i(d){x||(w(t.$$.fragment,d),x=!0)},o(d){R(t.$$.fragment,d),x=!1},d(d){d&&h(e),$(t)}}}function B(T){let e,r;return e=new S({props:{back:{name:"v2_Route_Object_Before_Enter",text:"Route Object Before Enter"},forward:{name:"v2_Route_Object_On_Error",text:"Route Object On Error"},$$slots:{default:[V]},$$scope:{ctx:T}}}),{c(){O(e.$$.fragment)},m(o,a){j(e,o,a),r=!0},p(o,[a]){const s={};a&1&&(s.$$scope={dirty:a,ctx:o}),e.$set(s)},i(o){r||(w(e.$$.fragment,o),r=!0)},o(o){R(e.$$.fragment,o),r=!1},d(o){$(e,o)}}}class M extends y{constructor(e){super(),F(this,e,null,B,P,{})}}export{M as default};
