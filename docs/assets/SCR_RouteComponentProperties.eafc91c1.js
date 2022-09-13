import{S as $e,i as Le,s as Se,h as M,m as N,j as B,k as H,o as I,B as Re,e as o,a as s,t as b,b as r,c as j,d as t,g as w,C as ye,n as ve}from"./index.fc5ef2be.js";import{S as qe}from"./SCR_Page.a121dc3b.js";function xe(i){let e,l;return{c(){e=o("a"),e.textContent="components - that can be check in the next section -",l=b(", and some are crucial for it to work correctly."),r(e,"href","/"),ye(e,"pointer-events","none")},m(n,a){j(n,e,a),j(n,l,a)},p:ve,d(n){n&&w(e),n&&w(l)}}}function Pe(i){let e;return{c(){e=o("a"),e.textContent="route object properties section.",r(e,"href","/"),ye(e,"pointer-events","none")},m(l,n){j(l,e,n)},p:ve,d(l){l&&w(e)}}}function Te(i){let e,l,n,a,f,d,z,u,A,D,G,K,U,V,C,Y,E,J,_,Q,p,W,X,Z,m,ee,te,oe,re,se,ne,g,ae,R,le,O,pe,y,ce,v,ie,$,ue,F,me,L,be,S,he,q,fe,x,de,k,Ce,P,T;return u=new Re({props:{params:{name:"v1_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[xe]},$$scope:{ctx:i}}}),m=new Re({props:{params:{name:"v1_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[Pe]},$$scope:{ctx:i}}}),{c(){e=o("div"),l=o("h4"),l.textContent="Route Component - Properties",n=s(),a=o("p"),f=b("The route component is a "),d=o("a"),d.textContent="Svelte Component",z=b(`
      , so it can receive parameters to pass further. Some of these parameters are
      `),M(u.$$.fragment),A=s(),D=o("br"),G=s(),K=o("br"),U=b(`

      Lets see these parameters that aren't components:`),V=s(),C=o("pre"),C.innerHTML=`<b class="scr-b">// Importing the router component</b>
import { SCR_ROUTER_COMPONENT } from &quot;svelte-client-router&quot;
import SCR_Layout from &quot;../testComponents/SCR_Layout.svelte&quot;;
import SCR_Loading from &quot;../testComponents/SCR_LoadingComponent.svelte&quot;;
import SCR_Error from &quot;../testComponents/SCR_Error.svelte&quot;;
import SCR_NotFound from &quot;../testComponents/SCR_NotFound.svelte&quot;;

<b class="scr-b">// Define the router object array</b>
const routes = [
  {
    ... <b class="scr-b">// Your routes definitions</b>
  }
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  defaultLayoutComponent={SCR_Layout}
  notFoundComponent={SCR_NotFound}
  errorComponent={SCR_Error}
  loadingComponent={SCR_Loading}
  allProps={... <b class="scr-b">// Passing parameters to be available in and routes and all components</b> }
  allLoadingProps={... <b class="scr-b">// Passing parameters to be available in and routes in loading component</b> }
/&gt;
`,Y=s(),E=o("hr"),J=s(),_=o("h4"),_.textContent="Routes",Q=s(),p=o("p"),W=b(`This is where you declare all your routes. It is the index of your
      application. It has several options that you can configure.
      `),X=o("br"),Z=b(`
      For more information see the `),M(m.$$.fragment),ee=s(),te=o("br"),oe=s(),re=o("br"),se=b(`
      Lets check out a complete example of declaration with all possible options:`),ne=s(),g=o("pre"),g.innerHTML=`<b class="scr-b">// Setting Route Object Definition Example</b>
const routes = [
  {
    name: &quot;routeName1&quot;,
    path: &quot;/test1&quot;,

    component: SCR_C1,
    
    <b class="scr-b">// This property has preference over component property</b>
    lazyLoadComponent: () =&gt;
      import(&quot;./docs/pages/SCR_RouteComponentProperties.svelte&quot;),
    
    layout: SCR_Layout,

    <b class="scr-b">// This property has preference over layout property</b>
    lazyLoadLayoutComponent: () =&gt;
      import(&quot;./docs/SCR_Layout.svelte&quot;),

    loadingComponent: SCR_Loading,

    <b class="scr-b">// This property has preference over loadingComponent property</b>
    lazyLoadLoadingComponent: () =&gt;
      import(&quot;./docs/SCR_Layout.svelte&quot;),

    ignoreLayout: false,
    ignoreScroll: false,
    scrollProps: {
      top: 0,
      left: 0,
      behavior: &quot;smooth&quot;,
      timeout: 10, // timeout must be greater than 10 milliseconds
    },
    title: &quot;First Route Title&quot;,
    params: { myCustomParam: &quot;text param!&quot;, }
    loadingProps: { textLoading: &quot;Loading this route...&quot;, }
    ignoreGlobalBeforeFunction: false,
    executeRouteBEFBeforeGlobalBEF: false,
    forceReload: false,
    afterBeforeEnter: (routeObjParams) =&gt; console.log(routeObjParams)
    beforeEnter: [
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
      (resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; resolve(true),
    ],
    onError: (err, routeObjParams) =&gt; console.error(err)
  },
]
`,ae=s(),R=o("p"),R.textContent=`Each route defined inside the route array object can have these options.
      Very robust and we can see that SCR is focused on before enter behaviour.`,le=s(),O=o("hr"),pe=s(),y=o("h4"),y.textContent="All Props",ce=s(),v=o("p"),v.innerHTML=`The <b>allProps</b> option can be passed to the router component. It must be
      an object with all the properties that you want to deliver to every route and
      component. This property will be made available everywhere.`,ie=s(),$=o("pre"),$.innerHTML=`<b class="scr-b">// Example</b>
const allProps = {
  passToAll: &quot;OK&quot;
}
`,ue=s(),F=o("hr"),me=s(),L=o("h4"),L.textContent="All Loading Props",be=s(),S=o("p"),S.innerHTML=`The <b>allLoadingProps</b> option can be passed to the router component. It
      must be an object with all the properties that you want to deliver to every
      route when loading the component.`,he=s(),q=o("pre"),q.innerHTML=`<b class="scr-b">// Example</b>
const allLoadingProps = {
  passToAll: &quot;OK&quot;
}
`,fe=s(),x=o("p"),x.textContent=`Now that we saw the basic properties of the component. In the next section
      we will explore the SCR component components properties.`,de=s(),k=o("center"),k.innerHTML='<small class="scr-small">The configuration for this route.</small>',Ce=s(),P=o("pre"),P.textContent=`{
  name: "routeComponentPropertiesRoute",
  path: "/svelte-client-router/routeComponentProperties",
  lazyLoadComponent: () =>
    import("./docs/pages/SCR_RouteComponentProperties.svelte"),
  title: "SCR - Route Component - Properties",
}
`,r(l,"class","scr-h4"),r(d,"href","https://svelte.dev/tutorial/basics"),r(d,"target","_blank"),r(a,"class","scr-text-justify"),r(C,"class","scr-pre"),r(E,"class","scr-hr"),r(_,"class","scr-h4"),r(p,"class","scr-text-justify"),r(g,"class","scr-pre"),r(R,"class","scr-text-justify"),r(O,"class","scr-hr"),r(y,"class","scr-h4"),r(v,"class","scr-text-justify"),r($,"class","scr-pre"),r(F,"class","scr-hr"),r(L,"class","scr-h4"),r(S,"class","scr-text-justify"),r(q,"class","scr-pre"),r(x,"class","scr-text-justify"),r(P,"class","scr-pre"),r(e,"class","scr-page")},m(c,h){j(c,e,h),t(e,l),t(e,n),t(e,a),t(a,f),t(a,d),t(a,z),N(u,a,null),t(a,A),t(a,D),t(a,G),t(a,K),t(a,U),t(e,V),t(e,C),t(e,Y),t(e,E),t(e,J),t(e,_),t(e,Q),t(e,p),t(p,W),t(p,X),t(p,Z),N(m,p,null),t(p,ee),t(p,te),t(p,oe),t(p,re),t(p,se),t(e,ne),t(e,g),t(e,ae),t(e,R),t(e,le),t(e,O),t(e,pe),t(e,y),t(e,ce),t(e,v),t(e,ie),t(e,$),t(e,ue),t(e,F),t(e,me),t(e,L),t(e,be),t(e,S),t(e,he),t(e,q),t(e,fe),t(e,x),t(e,de),t(e,k),t(e,Ce),t(e,P),T=!0},p(c,h){const _e={};h&1&&(_e.$$scope={dirty:h,ctx:c}),u.$set(_e);const ge={};h&1&&(ge.$$scope={dirty:h,ctx:c}),m.$set(ge)},i(c){T||(B(u.$$.fragment,c),B(m.$$.fragment,c),T=!0)},o(c){H(u.$$.fragment,c),H(m.$$.fragment,c),T=!1},d(c){c&&w(e),I(u),I(m)}}}function je(i){let e,l;return e=new qe({props:{back:{name:"v1_Route_Object_Before_Enter",text:"Route Object Before Enter"},forward:{name:"v1_Route_Component_Components",text:"Route Component Components"},$$slots:{default:[Te]},$$scope:{ctx:i}}}),{c(){M(e.$$.fragment)},m(n,a){N(e,n,a),l=!0},p(n,[a]){const f={};a&1&&(f.$$scope={dirty:a,ctx:n}),e.$set(f)},i(n){l||(B(e.$$.fragment,n),l=!0)},o(n){H(e.$$.fragment,n),l=!1},d(n){I(e,n)}}}class Oe extends $e{constructor(e){super(),Le(this,e,null,je,Se,{})}}export{Oe as default};
