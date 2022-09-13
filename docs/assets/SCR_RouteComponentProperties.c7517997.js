import{S as be,i as de,s as _e,h as E,m as k,j as F,k as B,o as O,B as me,e as o,a,t as f,b as n,c as q,d as t,g as P,C as fe,n as he}from"./index.fc5ef2be.js";import{S as ge}from"./SCR_Page.a121dc3b.js";function Ce(p){let e,l;return{c(){e=o("a"),e.textContent="components - that can be check in the next section -",l=f(" and some are crucial for it to work correctly."),n(e,"href","/"),fe(e,"pointer-events","none")},m(r,s){q(r,e,s),q(r,l,s)},p:he,d(r){r&&P(e),r&&P(l)}}}function $e(p){let e;return{c(){e=o("a"),e.textContent="route object properties section.",n(e,"href","/"),fe(e,"pointer-events","none")},m(l,r){q(l,e,r)},p:he,d(l){l&&P(e)}}}function ve(p){let e,l,r,s,b,d,H,u,I,M,D,V,z,G,_,N,j,K,g,Y,c,A,J,Q,m,U,W,X,Z,ee,te,C,oe,$,re,w,se,v,ne,R,ae,x,le,y,ce,T,ie,L,S;return u=new me({props:{params:{name:"v2_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[Ce]},$$scope:{ctx:p}}}),m=new me({props:{params:{name:"v2__Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[$e]},$$scope:{ctx:p}}}),{c(){e=o("div"),l=o("h4"),l.textContent="Route Component - Properties",r=a(),s=o("p"),b=f("The route component is a "),d=o("a"),d.textContent="Svelte Component",H=f(`, so it can receive parameters to pass further. Some of these parameters
      are
      `),E(u.$$.fragment),I=a(),M=o("br"),D=a(),V=o("br"),z=f(`

      Lets see these parameters of the Router Component:`),G=a(),_=o("pre"),_.innerHTML=`<b class="scr-b">// Importing the router component</b>
import { SCR_Router, scr_router } from &quot;svelte-client-router&quot;
import SCR_Loading from &quot;../testComponents/SCR_LoadingComponent.svelte&quot;;

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
  defaultLoadingParams={... <b class="scr-b">// Passing parameters to be available in loading components</b> }
/&gt;
`,N=a(),j=o("hr"),K=a(),g=o("h4"),g.textContent="Routes",Y=a(),c=o("p"),A=f(`This is where you declare all your routes. It is the index of your
      application. It has several options that you can configure.
      `),J=o("br"),Q=f(`
      For more information see the `),E(m.$$.fragment),U=a(),W=o("br"),X=a(),Z=o("br"),ee=f(`
      Lets check out a complete example of declaration with all possible options:`),te=a(),C=o("pre"),C.innerHTML=`<b class="scr-b">// Setting Route Object Definition Example</b>
const routes = [
  {
    name: &quot;routeName1&quot;,
    path: &quot;/test1&quot;,

    component: SCR_C1,

    loadingComponent: SCR_Loading,

    <b class="scr-b">// This property has preference over loadingComponent property</b>
    lazyLoadLoadingComponent: () =&gt;
      import(&quot;./docs/SCR_Layout.svelte&quot;),

    ignoreScroll: false,
    scrollProps: {
      target: false,
      top: 0,
      left: 0,
      behavior: &quot;smooth&quot;,
      timeout: 10, // timeout must be greater than 10 milliseconds
    },
    title: &quot;First Route Title&quot;,
    params: { myCustomParam: &quot;text param!&quot;, }
    loadingParams: { textLoading: &quot;Loading this route...&quot;, }
    ignoreGlobalBeforeFunction: false,
    executeRouteBEFBeforeGlobalBEF: false,
    forceReload: false,
    afterEnter: (params) =&gt; console.log(params)
    beforeEnter: [
      ({ resolve, reject, routeFrom, routeTo }, payload) =&gt; resolve(true),
      ({ resolve, reject, routeFrom, routeTo }, payload) =&gt; resolve(true),
      ({ resolve, reject, routeFrom, routeTo }, payload) =&gt; resolve(true),
    ],
    onError: (error) =&gt; console.error(error)
  },
]
`,oe=a(),$=o("p"),$.textContent=`Each route defined inside the route array object can have these options.
      Very robust and we can see that SCR is focused on before enter behaviour.`,re=a(),w=o("hr"),se=a(),v=o("h4"),v.textContent="Default Loading Params",ne=a(),R=o("p"),R.innerHTML=`The <b>defaultLoadingParams</b> option can be passed to the router component. It
      must be an object with all the properties that you want to deliver to every
      loading component.`,ae=a(),x=o("pre"),x.innerHTML=`<b class="scr-b">// Example</b>
const defaultLoadingParams = {
  availableOnLoading: &quot;OK&quot;
}
`,le=a(),y=o("p"),y.textContent=`Now that we saw the basic properties of the component. In the next section
      we will explore the SCR component components properties.`,ce=a(),T=o("center"),T.innerHTML='<small class="scr-small">The configuration for this route.</small>',ie=a(),L=o("pre"),L.textContent=`{
  name: "v2_Route_Component_Properties",
  path: "/svelte-client-router/v2/routeComponentProperties",
  lazyLoadComponent: () => import("../../pages/v2/SCR_RouteComponentProperties.svelte"),
  title: "SCR - Route Component Properties - Version 2",
  beforeEnter: [setVersion2],
}
`,n(l,"class","scr-h4"),n(d,"href","https://svelte.dev/tutorial/basics"),n(d,"target","_blank"),n(s,"class","scr-text-justify"),n(_,"class","scr-pre"),n(j,"class","scr-hr"),n(g,"class","scr-h4"),n(c,"class","scr-text-justify"),n(C,"class","scr-pre"),n($,"class","scr-text-justify"),n(w,"class","scr-hr"),n(v,"class","scr-h4"),n(R,"class","scr-text-justify"),n(x,"class","scr-pre"),n(y,"class","scr-text-justify"),n(L,"class","scr-pre"),n(e,"class","scr-page")},m(i,h){q(i,e,h),t(e,l),t(e,r),t(e,s),t(s,b),t(s,d),t(s,H),k(u,s,null),t(s,I),t(s,M),t(s,D),t(s,V),t(s,z),t(e,G),t(e,_),t(e,N),t(e,j),t(e,K),t(e,g),t(e,Y),t(e,c),t(c,A),t(c,J),t(c,Q),k(m,c,null),t(c,U),t(c,W),t(c,X),t(c,Z),t(c,ee),t(e,te),t(e,C),t(e,oe),t(e,$),t(e,re),t(e,w),t(e,se),t(e,v),t(e,ne),t(e,R),t(e,ae),t(e,x),t(e,le),t(e,y),t(e,ce),t(e,T),t(e,ie),t(e,L),S=!0},p(i,h){const pe={};h&1&&(pe.$$scope={dirty:h,ctx:i}),u.$set(pe);const ue={};h&1&&(ue.$$scope={dirty:h,ctx:i}),m.$set(ue)},i(i){S||(F(u.$$.fragment,i),F(m.$$.fragment,i),S=!0)},o(i){B(u.$$.fragment,i),B(m.$$.fragment,i),S=!1},d(i){i&&P(e),O(u),O(m)}}}function Re(p){let e,l;return e=new ge({props:{back:{name:"v2_Route_Object_Before_Enter",text:"Route Object Before Enter"},forward:{name:"v2_Route_Component_Components",text:"Route Component Components"},$$slots:{default:[ve]},$$scope:{ctx:p}}}),{c(){E(e.$$.fragment)},m(r,s){k(e,r,s),l=!0},p(r,[s]){const b={};s&1&&(b.$$scope={dirty:s,ctx:r}),e.$set(b)},i(r){l||(F(e.$$.fragment,r),l=!0)},o(r){B(e.$$.fragment,r),l=!1},d(r){O(e,r)}}}class Le extends be{constructor(e){super(),de(this,e,null,Re,_e,{})}}export{Le as default};
