import{S as Tt,i as Et,s as Lt,h as Rt,m as vt,j as _t,k as qt,o as St,B as Nt,e as o,a as s,t as P,b as r,c as xt,d as e,g as yt,C as Mt,n as Ot}from"./index.fc5ef2be.js";import{S as $t}from"./SCR_Page.a121dc3b.js";function wt(u){let t;return{c(){t=o("a"),t.innerHTML="Route Object Properties - <b>Path Property</b>",r(t,"href","/"),Mt(t,"pointer-events","none")},m(l,n){xt(l,t,n)},p:Ot,d(l){l&&yt(t)}}}function jt(u){let t,l,n,c,m,F,D,b,k,d,Y,g,B,C,z,f,G,H,J,h,K,R,Q,v,V,_,W,q,X,I,Z,S,tt,a,et,ot,rt,p,st,nt,lt,at,x,ct,y,it,T,pt,U,ut,E,mt,L,bt,N,dt,M,gt,O,Ct,A,ft,$,w;return p=new Nt({props:{params:{name:"v1_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[wt]},$$scope:{ctx:u}}}),{c(){t=o("div"),l=o("h4"),l.textContent="Route Component - Components",n=s(),c=o("p"),c.innerHTML=`As said throught this documentation it is encouraged to provide your own
    custom components. SCR functions can work with no component provided by you.
    But it is not ideal they are very simple and minimalistic.
    <br/>
    Lets see all the components one by one:`,m=s(),F=o("hr"),D=s(),b=o("h4"),b.textContent="Layout Component",k=s(),d=o("p"),d.innerHTML=`The Layout Component is the layout used to encapsulate all your route
    components. It can be override on route declaration object for an specific
    one for that route.
    <br/>
    It must be declared a default slot inside of the Layout Component or else your
    route component will not be drawed.
    <br/> 
    <br/>
    The Global Layout must be passed to SCR Router Component as exampled below:`,Y=s(),g=o("pre"),g.innerHTML=`<b class="scr-b">// Importing your components</b>
import { SCR_ROUTER_COMPONENT } from &quot;svelte-client-router&quot;
import SCR_Layout from &quot;../testComponents/SCR_Layout.svelte&quot;;

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
/&gt;
`,B=s(),C=o("p"),C.textContent="Next an example of Svelte Layout Component:",z=s(),f=o("pre"),f.innerHTML=`<b class="scr-b">// Example of a Svelte Layout Component</b>
&lt;script&gt;
  import SCR_Menu from &quot;./SCR_Menu.svelte&quot;;
  import SCR_Footer from &quot;./SCR_Footer.svelte&quot;;

  <b class="scr-b">// This two following variables are always available in the layout component</b>
  export let currentRoute;
  export let fromRoute;

  <b class="scr-b">
  // Any other params declared on before enter functions 
  // all props, payload, etc.. will be made available here too
  </b>
  ...
&lt;/script&gt;

&lt;div class=&quot;scr-main-layout&quot;&gt;
  &lt;div class=&quot;scr-header&quot;&gt;
    &lt;slot name=&quot;scr_header&quot;&gt;
      &lt;h2 class=&quot;scr-main-layout__header&quot;&gt;
        Svelte Client Router - The Svelte SPA Router!
      &lt;/h2&gt;

    <b class="scr-b">&lt;--! REMEMBER TO DECLARE A DEFAULT SLOT! -&gt;</b>
    &lt;/slot&gt;

  &lt;/div&gt;
  &lt;div class=&quot;scr-main&quot;&gt;
    &lt;SCR_Menu /&gt;
    &lt;div class=&quot;scr-pages&quot;&gt;&lt;slot /&gt;&lt;/div&gt;
  &lt;/div&gt;
  &lt;div&gt;&lt;SCR_Footer /&gt;&lt;/div&gt;
&lt;/div&gt;
`,G=s(),H=o("hr"),J=s(),h=o("h4"),h.textContent="Loading Component",K=s(),R=o("p"),R.innerHTML=`The Loading Component is the loading screen used to show when before enter
    routes are been processed.
    <br/>
    It will receive <b>allLoadingProps</b> declared and any route object
    <b>loadingProps</b> defined.`,Q=s(),v=o("pre"),v.innerHTML=`<b class="scr-b">// Importing your components</b>
import { SCR_ROUTER_COMPONENT } from &quot;svelte-client-router&quot;
import SCR_Loading from &quot;../testComponents/SCR_Loading.svelte&quot;;

<b class="scr-b">// Define the router object array</b>
const routes = [
  {
    ... <b class="scr-b">// Your routes definitions</b>
  }
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  loadingComponent={SCR_Loading}
/&gt;
`,V=s(),_=o("p"),_.textContent="Next an example of Svelte Loading Component:",W=s(),q=o("pre"),q.innerHTML=`<b class="scr-b">// Example of a Svelte Loading Component</b>
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
`,X=s(),I=o("hr"),Z=s(),S=o("h4"),S.textContent="Not Found Component",tt=s(),a=o("p"),et=P(`The Not Found Component is the component that will be loaded when the user
    try to access a not existent route - only if there isn't any route declared with an wildcard "*"
    to match all routes.
    `),ot=o("br"),rt=P(`
    See the `),Rt(p.$$.fragment),st=P(` for more info.
    `),nt=o("br"),lt=P(`
    It will receive all the parameters available.`),at=s(),x=o("pre"),x.innerHTML=`<b class="scr-b">// Importing your components</b>
import { SCR_ROUTER_COMPONENT } from &quot;svelte-client-router&quot;
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
  notFoundComponent={SCR_NotFound}
/&gt;
`,ct=s(),y=o("p"),y.textContent="Next an example of Svelte Not Found Component:",it=s(),T=o("pre"),T.innerHTML=`<b class="scr-b">// Example of a Svelte Not Found Component</b>
&lt;script&gt;

  <b class="scr-b">// Example of route store usage </b>
  import routerStore from &quot;../../src/js/store/router.js&quot;;

&lt;/script&gt;
&lt;center &gt;
  &lt;p class=&quot;scr-p&quot;&gt;Not Found&lt;/p&gt;
  &lt;p class=&quot;scr-p-small&quot;&gt;{$routerStore.currentLocation || &quot;=&#39;(&quot;}&lt;/p&gt;
&lt;/center&gt;
`,pt=s(),U=o("hr"),ut=s(),E=o("h4"),E.textContent="Error Component",mt=s(),L=o("p"),L.innerHTML=`The Error Component is the component that must be loaded when something goes
    wrong on routing.
    <br/>
    It will receive all the parameters available.`,bt=s(),N=o("pre"),N.innerHTML=`<b class="scr-b">// Importing your components</b>
import { SCR_ROUTER_COMPONENT } from &quot;svelte-client-router&quot;
import SCR_Error from &quot;../testComponents/SCR_Error.svelte&quot;;

<b class="scr-b">// Define the router object array</b>
const routes = [
  {
    ... <b class="scr-b">// Your routes definitions</b>
  }
]

<b class="scr-b">// Example of usage</b>
&lt;SCR_ROUTER_COMPONENT 
  bind:routes 
  errorComponent={SCR_Error}
/&gt;
`,dt=s(),M=o("p"),M.textContent="Next an example of Svelte Error Component:",gt=s(),O=o("pre"),O.innerHTML=`<b class="scr-b">// Example of a Svelte Error Component</b>
&lt;script&gt;

  <b class="scr-b">// This variable was passed on onError Function </b>
  export let errorMessage = &quot;An error has occured!&quot;;

&lt;/script&gt;

&lt;center &gt;
  &lt;p class=&quot;scr-p&quot;&gt;Error&lt;/p&gt;
  &lt;p class=&quot;scr-p-small&quot;&gt;{errorMessage}&lt;/p&gt;
&lt;/center&gt;
`,Ct=s(),A=o("center"),A.innerHTML='<small class="scr-small">The configuration for this route.</small>',ft=s(),$=o("pre"),$.textContent=`{
  name: "routeComponentComponentsRoute",
  path: "/svelte-client-router/routeComponentComponents",
  lazyLoadComponent: () =>
    import("./docs/pages/SCR_RouteComponentComponents.svelte"),
  title: "SCR - Route Component - Components",
}
`,r(l,"class","scr-h4"),r(c,"class","scr-text-justify"),r(F,"class","scr-hr"),r(b,"class","scr-h4"),r(d,"class","scr-text-justify"),r(g,"class","scr-pre"),r(C,"class","scr-text-justify"),r(f,"class","scr-pre"),r(H,"class","scr-hr"),r(h,"class","scr-h4"),r(R,"class","scr-text-justify"),r(v,"class","scr-pre"),r(_,"class","scr-text-justify"),r(q,"class","scr-pre"),r(I,"class","scr-hr"),r(S,"class","scr-h4"),r(a,"class","scr-text-justify"),r(x,"class","scr-pre"),r(y,"class","scr-text-justify"),r(T,"class","scr-pre"),r(U,"class","scr-hr"),r(E,"class","scr-h4"),r(L,"class","scr-text-justify"),r(N,"class","scr-pre"),r(M,"class","scr-text-justify"),r(O,"class","scr-pre"),r($,"class","scr-pre"),r(t,"class","scr-page")},m(i,j){xt(i,t,j),e(t,l),e(t,n),e(t,c),e(t,m),e(t,F),e(t,D),e(t,b),e(t,k),e(t,d),e(t,Y),e(t,g),e(t,B),e(t,C),e(t,z),e(t,f),e(t,G),e(t,H),e(t,J),e(t,h),e(t,K),e(t,R),e(t,Q),e(t,v),e(t,V),e(t,_),e(t,W),e(t,q),e(t,X),e(t,I),e(t,Z),e(t,S),e(t,tt),e(t,a),e(a,et),e(a,ot),e(a,rt),vt(p,a,null),e(a,st),e(a,nt),e(a,lt),e(t,at),e(t,x),e(t,ct),e(t,y),e(t,it),e(t,T),e(t,pt),e(t,U),e(t,ut),e(t,E),e(t,mt),e(t,L),e(t,bt),e(t,N),e(t,dt),e(t,M),e(t,gt),e(t,O),e(t,Ct),e(t,A),e(t,ft),e(t,$),w=!0},p(i,j){const ht={};j&1&&(ht.$$scope={dirty:j,ctx:i}),p.$set(ht)},i(i){w||(_t(p.$$.fragment,i),w=!0)},o(i){qt(p.$$.fragment,i),w=!1},d(i){i&&yt(t),St(p)}}}function Pt(u){let t,l;return t=new $t({props:{back:{name:"v1_Route_Component_Properties",text:"Route Component Properties"},forward:{name:"v1_Navigation_Routing",text:"Navigation Routing"},$$slots:{default:[jt]},$$scope:{ctx:u}}}),{c(){Rt(t.$$.fragment)},m(n,c){vt(t,n,c),l=!0},p(n,[c]){const m={};c&1&&(m.$$scope={dirty:c,ctx:n}),t.$set(m)},i(n){l||(_t(t.$$.fragment,n),l=!0)},o(n){qt(t.$$.fragment,n),l=!1},d(n){St(t,n)}}}class It extends Tt{constructor(t){super(),Et(this,t,null,Pt,Lt,{})}}export{It as default};
