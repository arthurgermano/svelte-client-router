import{S as oe,i as se,s as ae,h as j,m as E,j as B,k as C,o as S,B as le,e as n,a as l,t as c,b as u,c as re,d as e,g as ne,C as ce,n as ie}from"./index.fc5ef2be.js";import{S as ue}from"./SCR_Page.a121dc3b.js";import{S as fe}from"./SCR_BeforeEnterRouteAnatomy.d8ee10ee.js";function be(b){let r;return{c(){r=n("a"),r.textContent="Route Object Properties",u(r,"href","/"),ce(r,"pointer-events","none")},m(s,o){re(s,r,o)},p:ie,d(s){s&&ne(r)}}}function pe(b){let r,s,o,t,p,d,O,F,y,g,T,w,A,G,N,I,P,k,L,R,M,H,U,V,Y,i,q,z,W,D,J,K,m,Q,x,X,f,Z,v,ee,_,h;return i=new le({props:{params:{name:"v2_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[be]},$$scope:{ctx:b}}}),f=new fe({}),{c(){r=n("div"),s=n("h4"),s.textContent="Route Object - Before Enter Functions",o=l(),t=n("p"),p=c("The "),d=n("b"),d.textContent="beforeEnter",O=c(` option sets an array of functions or just a
      function that must be executed for before each route.
      `),F=n("br"),y=c(`
      If the option `),g=n("b"),g.textContent="ignoreGlobalBeforeFunction",T=c(`
      is set in the route definition object to true it will ignore global before
      enter functions.
      `),w=n("br"),A=l(),G=n("br"),N=c(`
      The default order of execution is first execute all Global Before Functions
      and then execute route object before enter functions. But for a particular
      route the behaviour maybe different. Maybe it is needed to execute the route
      before function before Global Before Functions.
      `),I=n("br"),P=l(),k=n("br"),L=c(`
      If that is the case then you can set in the route object the option
      `),R=n("b"),R.textContent="executeRouteBEFBeforeGlobalBEF",M=c(` to true. When this option is enabled
      in the route definition object the default order of execution is overrided
      and executes route object before functions before Global Before Functions.
      `),H=n("br"),U=l(),V=n("br"),Y=c(`
      See the `),j(i.$$.fragment),q=c(` for more info.
      `),z=n("br"),W=l(),D=n("br"),J=c(`
      See the next example of how to set this option:`),K=l(),m=n("pre"),m.innerHTML=`<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Route Before Enter Function</b>
{
  beforeEnter(({ resolve }) =&gt; { resolve(true); });
}
<b class="scr-b">// OR </b>

<b class="scr-b">// ------ SETTING AN ARRAY OF FUNCTIONS ------ </b>
<b class="scr-b">// Setting Route Before Enter Functions</b>
<b class="scr-b">// You can set as many Before Enter Functions as you want!</b>
{
  beforeEnter([
    ({ resolve }) =&gt; { resolve(true); },
    ({ resolve }) =&gt; { resolve(true); },
    ({ resolve }) =&gt; { resolve(true); },
  ]);
}
`,Q=l(),x=n("hr"),X=l(),j(f.$$.fragment),Z=l(),v=n("center"),v.innerHTML='<small class="scr-small">The configuration for this route.</small>',ee=l(),_=n("pre"),_.textContent=`{
  name: "v2_Route_Object_Before_Enter",
  path: "/svelte-client-router/v2/routeObjectBeforeEnter",
  lazyLoadComponent: () => import("../../pages/v2/SCR_RouteObjectBeforeEnter.svelte"),
  title: "SCR - Route Object Before Enter - Version 1",
  beforeEnter: [setVersion2],
}
`,u(s,"class","scr-h4"),u(t,"class","scr-text-justify"),u(m,"class","scr-pre"),u(x,"class","scr-hr"),u(_,"class","scr-pre"),u(r,"class","scr-page")},m(a,$){re(a,r,$),e(r,s),e(r,o),e(r,t),e(t,p),e(t,d),e(t,O),e(t,F),e(t,y),e(t,g),e(t,T),e(t,w),e(t,A),e(t,G),e(t,N),e(t,I),e(t,P),e(t,k),e(t,L),e(t,R),e(t,M),e(t,H),e(t,U),e(t,V),e(t,Y),E(i,t,null),e(t,q),e(t,z),e(t,W),e(t,D),e(t,J),e(r,K),e(r,m),e(r,Q),e(r,x),e(r,X),E(f,r,null),e(r,Z),e(r,v),e(r,ee),e(r,_),h=!0},p(a,$){const te={};$&1&&(te.$$scope={dirty:$,ctx:a}),i.$set(te)},i(a){h||(B(i.$$.fragment,a),B(f.$$.fragment,a),h=!0)},o(a){C(i.$$.fragment,a),C(f.$$.fragment,a),h=!1},d(a){a&&ne(r),S(i),S(f)}}}function me(b){let r,s;return r=new ue({props:{back:{name:"v2_Route_Object_Properties",text:"Route Object Properties"},forward:{name:"v2_Route_Object_After_Enter",text:"Route Object After Enter"},$$slots:{default:[pe]},$$scope:{ctx:b}}}),{c(){j(r.$$.fragment)},m(o,t){E(r,o,t),s=!0},p(o,[t]){const p={};t&1&&(p.$$scope={dirty:t,ctx:o}),r.$set(p)},i(o){s||(B(r.$$.fragment,o),s=!0)},o(o){C(r.$$.fragment,o),s=!1},d(o){S(r,o)}}}class de extends oe{constructor(r){super(),se(this,r,null,me,ae,{})}}export{de as default};
