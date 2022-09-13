import{S as D,i as G,s as J,h as R,m as O,j as x,k as S,o as j,B as K,e as s,a as c,t as f,b as i,c as W,d as e,g as Y,C as N,n as Q}from"./index.fc5ef2be.js";import{S as U}from"./SCR_Page.a121dc3b.js";import{S as V}from"./SCR_OnErrorAnatomy.4d9f905e.js";function X(p){let t;return{c(){t=s("a"),t.textContent="Route Component Components",i(t,"href","/"),N(t,"pointer-events","none")},m(o,n){W(o,t,n)},p:Q,d(o){o&&Y(t)}}}function Z(p){let t,o,n,r,m,d,E,v,y,w,k,P,T,l,L,A,_,F,H,M,u,q,h,z,C,B,$,b;return l=new K({props:{params:{name:"v1_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[X]},$$scope:{ctx:p}}}),u=new V({}),{c(){t=s("div"),o=s("h4"),o.textContent="Route Object - On Error Function",n=c(),r=s("p"),m=f("The "),d=s("b"),d.textContent="onError",E=f(` option sets a function that is going to be executed for
    the specific route when something goes wrong.
    `),v=s("br"),y=c(),w=s("br"),k=f(`
    When that happens the natural behaviour is to open the error page. In this context
    SCR has a very basic error component that comes with it. You can of course set
    you own error component and it is encouraged to do so.
    `),P=s("br"),T=f(`
    See the `),R(l.$$.fragment),L=f(" for more info."),A=c(),_=s("pre"),_.innerHTML=`<b class="scr-b">// Setting Route On Error Function</b>
}
  onError((err, routeObjParams) =&gt; { console.error(err) });
{
`,F=c(),H=s("br"),M=c(),R(u.$$.fragment),q=c(),h=s("p"),h.textContent=`So that is it for this section. This feature enables us to handle any errors
    that may occur inside this specific route definition.`,z=c(),C=s("center"),C.innerHTML='<small class="scr-small">The configuration for this route.</small>',B=c(),$=s("pre"),$.textContent=`{
    name: "routeObjectOnErrorRoute",
    path: "/svelte-client-router/routeObjectOnError",
    lazyLoadComponent: () => import("./docs/pages/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object - On Error Function",
}
`,i(o,"class","scr-h4"),i(r,"class","scr-text-justify"),i(_,"class","scr-pre"),i(h,"class","scr-text-justify"),i($,"class","scr-pre"),i(t,"class","scr-page")},m(a,g){W(a,t,g),e(t,o),e(t,n),e(t,r),e(r,m),e(r,d),e(r,E),e(r,v),e(r,y),e(r,w),e(r,k),e(r,P),e(r,T),O(l,r,null),e(r,L),e(t,A),e(t,_),e(t,F),e(t,H),e(t,M),O(u,t,null),e(t,q),e(t,h),e(t,z),e(t,C),e(t,B),e(t,$),b=!0},p(a,g){const I={};g&1&&(I.$$scope={dirty:g,ctx:a}),l.$set(I)},i(a){b||(x(l.$$.fragment,a),x(u.$$.fragment,a),b=!0)},o(a){S(l.$$.fragment,a),S(u.$$.fragment,a),b=!1},d(a){a&&Y(t),j(l),j(u)}}}function tt(p){let t,o;return t=new U({props:{back:{name:"v1_Route_Object_After_Enter",text:"Route Object After Enter"},forward:{name:"v1_Route_Component_Properties",text:"Route Component Properties"},$$slots:{default:[Z]},$$scope:{ctx:p}}}),{c(){R(t.$$.fragment)},m(n,r){O(t,n,r),o=!0},p(n,[r]){const m={};r&1&&(m.$$scope={dirty:r,ctx:n}),t.$set(m)},i(n){o||(x(t.$$.fragment,n),o=!0)},o(n){S(t.$$.fragment,n),o=!1},d(n){j(t,n)}}}class ot extends D{constructor(t){super(),G(this,t,null,tt,J,{})}}export{ot as default};
