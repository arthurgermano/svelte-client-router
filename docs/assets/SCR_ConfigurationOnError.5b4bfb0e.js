import{S as K,i as N,s as Q,h as S,m as x,j as v,k as E,o as y,B as U,e as n,a as i,t as f,b as c,c as D,d as e,g as J,C as X,n as Z}from"./index.fc5ef2be.js";import{S as tt}from"./SCR_Page.a121dc3b.js";import{S as et}from"./SCR_OnErrorAnatomy.c15689c1.js";function rt(p){let t;return{c(){t=n("a"),t.textContent="Route Component Components",c(t,"href","/"),X(t,"pointer-events","none")},m(s,o){D(s,t,o)},p:Z,d(s){s&&J(t)}}}function nt(p){let t,s,o,r,m,C,R,O,w,T,j,k,G,L,P,q,B,l,F,H,_,I,M,V,u,z,g,A,d,W,h,b;return l=new U({props:{params:{name:"v2_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[rt]},$$scope:{ctx:p}}}),u=new et({}),{c(){t=n("div"),s=n("h4"),s.textContent="Configuration - On Error Function",o=i(),r=n("p"),m=f("The "),C=n("b"),C.textContent="onError",R=f(` option sets a function that is going to be executed for
      any route when something goes wrong.
      `),O=n("br"),w=i(),T=n("br"),j=f(`
      When that happens the natural behaviour is to execute a function. In this context
      SCR has a very basic error function that comes with it. You can of course set
      you own error function and it is encouraged to do so.
      `),k=n("br"),G=i(),L=n("br"),P=f(`
      If the route onError option is set then it has priority!
      `),q=n("br"),B=f(`
      See the `),S(l.$$.fragment),F=f(" for more info."),H=i(),_=n("pre"),_.innerHTML=`<b class="scr-b">// importing the SCR - The configuration store</b>
import { configStore } from &quot;svelte-client-router&quot;

<b class="scr-b">// Setting Global On Error Function</b>
configStore.setOnError((error) =&gt; { console.error(error) });
`,I=i(),M=n("br"),V=i(),S(u.$$.fragment),z=i(),g=n("p"),g.textContent=`So that is it for this section. This feature enables us to handle any
      errors that may occur inside our routing definitions.`,A=i(),d=n("center"),d.innerHTML='<small class="scr-small">The configuration for this route.</small>',W=i(),h=n("pre"),h.textContent=`{
  name: "v2_Configuration_Global_On_Error",
  path: "/svelte-client-router/v2/configurationGlobalOnError",
  lazyLoadComponent: () => import("../../pages/v2/SCR_ConfigurationOnError.svelte"),
  title: "SCR - Configuration Global On Error - Version 2",
  beforeEnter: [setVersion2],
}
`,c(s,"class","scr-h4"),c(r,"class","scr-text-justify"),c(_,"class","scr-pre"),c(g,"class","scr-text-justify"),c(h,"class","scr-pre"),c(t,"class","scr-page")},m(a,$){D(a,t,$),e(t,s),e(t,o),e(t,r),e(r,m),e(r,C),e(r,R),e(r,O),e(r,w),e(r,T),e(r,j),e(r,k),e(r,G),e(r,L),e(r,P),e(r,q),e(r,B),x(l,r,null),e(r,F),e(t,H),e(t,_),e(t,I),e(t,M),e(t,V),x(u,t,null),e(t,z),e(t,g),e(t,A),e(t,d),e(t,W),e(t,h),b=!0},p(a,$){const Y={};$&1&&(Y.$$scope={dirty:$,ctx:a}),l.$set(Y)},i(a){b||(v(l.$$.fragment,a),v(u.$$.fragment,a),b=!0)},o(a){E(l.$$.fragment,a),E(u.$$.fragment,a),b=!1},d(a){a&&J(t),y(l),y(u)}}}function ot(p){let t,s;return t=new tt({props:{back:{name:"v2_Configuration_Global_Before_Enter_Option",text:"Configuration Before Enter"},forward:{name:"v2_Route_Object_Properties",text:"Route Object Properties"},$$slots:{default:[nt]},$$scope:{ctx:p}}}),{c(){S(t.$$.fragment)},m(o,r){x(t,o,r),s=!0},p(o,[r]){const m={};r&1&&(m.$$scope={dirty:r,ctx:o}),t.$set(m)},i(o){s||(v(t.$$.fragment,o),s=!0)},o(o){E(t.$$.fragment,o),s=!1},d(o){y(t,o)}}}class lt extends K{constructor(t){super(),N(this,t,null,ot,Q,{})}}export{lt as default};
