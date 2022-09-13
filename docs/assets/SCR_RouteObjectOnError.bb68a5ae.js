import{S as D,i as G,s as J,h as R,m as x,j as O,k as S,o as E,B as K,e as s,a as c,t as m,b as l,c as W,d as e,g as Y,C as N,n as Q}from"./index.fc5ef2be.js";import{S as U}from"./SCR_Page.a121dc3b.js";import{S as V}from"./SCR_OnErrorAnatomy.c15689c1.js";function X(p){let t;return{c(){t=s("a"),t.textContent="Route Component Components",l(t,"href","/"),N(t,"pointer-events","none")},m(o,n){W(o,t,n)},p:Q,d(o){o&&Y(t)}}}function Z(p){let t,o,n,r,f,d,j,v,y,w,k,T,L,i,P,A,_,F,H,M,u,q,h,z,C,B,$,b;return i=new K({props:{params:{name:"v2_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[X]},$$scope:{ctx:p}}}),u=new V({}),{c(){t=s("div"),o=s("h4"),o.textContent="Route Object - On Error Function",n=c(),r=s("p"),f=m("The "),d=s("b"),d.textContent="onError",j=m(` option sets a function that is going to be executed for
      the specific route when something goes wrong.
      `),v=s("br"),y=c(),w=s("br"),k=m(`
      When that happens the natural behaviour is to execute a specific function.
      In this context SCR has a very basic error function that comes with it. You
      can of course set you own error function and it is encouraged to do so.
      `),T=s("br"),L=m(`
      See the `),R(i.$$.fragment),P=m(" for more info."),A=c(),_=s("pre"),_.innerHTML=`<b class="scr-b">// Setting Route On Error Function</b>
}
  onError((error) =&gt; { console.error(err) });
{
`,F=c(),H=s("br"),M=c(),R(u.$$.fragment),q=c(),h=s("p"),h.textContent=`So that is it for this section. This feature enables us to handle any
      errors that may occur inside this specific route definition.`,z=c(),C=s("center"),C.innerHTML='<small class="scr-small">The configuration for this route.</small>',B=c(),$=s("pre"),$.textContent=`{
    name: "routeObjectOnErrorRoute",
    path: "/svelte-client-router/routeObjectOnError",
    lazyLoadComponent: () => import("./docs/pages/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object - On Error Function",
}
`,l(o,"class","scr-h4"),l(r,"class","scr-text-justify"),l(_,"class","scr-pre"),l(h,"class","scr-text-justify"),l($,"class","scr-pre"),l(t,"class","scr-page")},m(a,g){W(a,t,g),e(t,o),e(t,n),e(t,r),e(r,f),e(r,d),e(r,j),e(r,v),e(r,y),e(r,w),e(r,k),e(r,T),e(r,L),x(i,r,null),e(r,P),e(t,A),e(t,_),e(t,F),e(t,H),e(t,M),x(u,t,null),e(t,q),e(t,h),e(t,z),e(t,C),e(t,B),e(t,$),b=!0},p(a,g){const I={};g&1&&(I.$$scope={dirty:g,ctx:a}),i.$set(I)},i(a){b||(O(i.$$.fragment,a),O(u.$$.fragment,a),b=!0)},o(a){S(i.$$.fragment,a),S(u.$$.fragment,a),b=!1},d(a){a&&Y(t),E(i),E(u)}}}function tt(p){let t,o;return t=new U({props:{back:{name:"v2_Route_Object_After_Enter",text:"Route Object After Enter"},forward:{name:"v2_Route_Component_Properties",text:"Route Component Properties"},$$slots:{default:[Z]},$$scope:{ctx:p}}}),{c(){R(t.$$.fragment)},m(n,r){x(t,n,r),o=!0},p(n,[r]){const f={};r&1&&(f.$$scope={dirty:r,ctx:n}),t.$set(f)},i(n){o||(O(t.$$.fragment,n),o=!0)},o(n){S(t.$$.fragment,n),o=!1},d(n){E(t,n)}}}class ot extends D{constructor(t){super(),G(this,t,null,tt,J,{})}}export{ot as default};
