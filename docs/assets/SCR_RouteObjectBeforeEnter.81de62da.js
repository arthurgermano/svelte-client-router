import{S as ee,i as te,s as re,h as j,m as v,j as B,k as E,o as C,B as ne,e as n,a as l,t as c,b as f,c as X,d as e,g as Z,C as oe,n as se}from"./index.fc5ef2be.js";import{S as ae}from"./SCR_Page.a121dc3b.js";import{S as le}from"./SCR_BeforeEnterRouteAnatomy.0bca315a.js";function ce(b){let r;return{c(){r=n("a"),r.textContent="Route Object Properties",f(r,"href","/"),oe(r,"pointer-events","none")},m(s,o){X(s,r,o)},p:se,d(s){s&&Z(r)}}}function ue(b){let r,s,o,t,p,$,S,g,O,F,y,T,A,G,N,w,P,R,k,I,L,M,H,u,U,Y,q,z,W,D,m,J,i,K,x,Q,_,h;return u=new ne({props:{params:{name:"v1_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[ce]},$$scope:{ctx:b}}}),i=new le({}),{c(){r=n("div"),s=n("h4"),s.textContent="Route Object - Before Enter Functions",o=l(),t=n("p"),p=c("The "),$=n("b"),$.textContent="beforeEnter",S=c(` option sets an array of functions or just a function
    that must be executed for before each route if the option
    `),g=n("b"),g.textContent="ignoreGlobalBeforeFunction",O=c(`
    isn't set in the route definition object.
    `),F=n("br"),y=l(),T=n("br"),A=c(`
    The default order of execution is first execute all Global Before Functions and
    then execute route object before enter functions. But for a particular route
    the behaviour maybe different. Maybe it is needed to execute the route before
    function before Global Before Functions.
    `),G=n("br"),N=l(),w=n("br"),P=c(`
    If that is the case then you can set in the route object the option
    `),R=n("b"),R.textContent="executeRouteBEFBeforeGlobalBEF",k=c(` to true. When this option is enabled
    in the route definition object the default order of execution is overrided
    and executes route object before functions before Global Before Functions.
    `),I=n("br"),L=l(),M=n("br"),H=c(`
    See the `),j(u.$$.fragment),U=c(` for more info.
    `),Y=n("br"),q=l(),z=n("br"),W=c(`
    See the next example of how to set this option:`),D=l(),m=n("pre"),m.innerHTML=`<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Route Before Enter Function</b>
{
  beforeEnter((resolve) =&gt; { resolve(true); });
}
<b class="scr-b">// OR </b>

<b class="scr-b">// ------ SETTING AN ARRAY OF FUNCTIONS ------ </b>
<b class="scr-b">// Setting Route Before Enter Functions</b>
<b class="scr-b">// You can set as many Before Enter Functions as you want!</b>
{
  beforeEnter([
    (resolve) =&gt; { resolve(true); },
    (resolve) =&gt; { resolve(true); },
    (resolve) =&gt; { resolve(true); },
  ]);
}
`,J=l(),j(i.$$.fragment),K=l(),x=n("center"),x.innerHTML='<small class="scr-small">The configuration for this route.</small>',Q=l(),_=n("pre"),_.textContent=`{
    name: "routeObjectBeforeEnterRoute",
    path: "/svelte-client-router/routeObjectBeforeEnter",
    lazyLoadComponent: () => import("./docs/pages/SCR_RouteObjectBeforeEnter.svelte"),
    title: "SCR - Route Object - Before Enter Functions",
}
`,f(s,"class","scr-h4"),f(t,"class","scr-text-justify"),f(m,"class","scr-pre"),f(_,"class","scr-pre"),f(r,"class","scr-page")},m(a,d){X(a,r,d),e(r,s),e(r,o),e(r,t),e(t,p),e(t,$),e(t,S),e(t,g),e(t,O),e(t,F),e(t,y),e(t,T),e(t,A),e(t,G),e(t,N),e(t,w),e(t,P),e(t,R),e(t,k),e(t,I),e(t,L),e(t,M),e(t,H),v(u,t,null),e(t,U),e(t,Y),e(t,q),e(t,z),e(t,W),e(r,D),e(r,m),e(r,J),v(i,r,null),e(r,K),e(r,x),e(r,Q),e(r,_),h=!0},p(a,d){const V={};d&1&&(V.$$scope={dirty:d,ctx:a}),u.$set(V)},i(a){h||(B(u.$$.fragment,a),B(i.$$.fragment,a),h=!0)},o(a){E(u.$$.fragment,a),E(i.$$.fragment,a),h=!1},d(a){a&&Z(r),C(u),C(i)}}}function ie(b){let r,s;return r=new ae({props:{back:{name:"v1_Route_Object_Properties",text:"Route Object Properties"},forward:{name:"v1_Route_Object_After_Enter",text:"Route Object After Enter"},$$slots:{default:[ue]},$$scope:{ctx:b}}}),{c(){j(r.$$.fragment)},m(o,t){v(r,o,t),s=!0},p(o,[t]){const p={};t&1&&(p.$$scope={dirty:t,ctx:o}),r.$set(p)},i(o){s||(B(r.$$.fragment,o),s=!0)},o(o){E(r.$$.fragment,o),s=!1},d(o){C(r,o)}}}class me extends ee{constructor(r){super(),te(this,r,null,ie,re,{})}}export{me as default};
