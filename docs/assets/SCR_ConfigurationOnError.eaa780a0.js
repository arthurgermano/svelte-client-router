import{S as W,i as Y,s as D,h as S,m as O,j as R,k as x,o as E,B as J,e as s,a as i,t as m,b as c,c as z,d as e,g as A,C as K,n as Q}from"./index.fc5ef2be.js";import{S as U}from"./SCR_Page.a121dc3b.js";import{S as V}from"./SCR_OnErrorAnatomy.4d9f905e.js";function X(p){let t;return{c(){t=s("a"),t.textContent="Route Component Components",c(t,"href","/"),K(t,"pointer-events","none")},m(o,n){z(o,t,n)},p:Q,d(o){o&&A(t)}}}function Z(p){let t,o,n,r,f,b,v,y,w,T,j,k,P,l,F,G,_,L,q,B,u,I,g,H,d,M,h,$;return l=new J({props:{params:{name:"v1_Route_Component_Components"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[X]},$$scope:{ctx:p}}}),u=new V({}),{c(){t=s("div"),o=s("h4"),o.textContent="Configuration - On Error Function",n=i(),r=s("p"),f=m("The "),b=s("b"),b.textContent="onError",v=m(` option sets a function that is going to be executed for
      any route when something goes wrong.
      `),y=s("br"),w=i(),T=s("br"),j=m(`
      When that happens the natural behaviour is to open the error page. In this
      context SCR has a very basic error component that comes with it. You can of
      course set you own error component and it is encouraged to do so.
      `),k=s("br"),P=m(`
      See the `),S(l.$$.fragment),F=m(" for more info."),G=i(),_=s("pre"),_.innerHTML=`<b class="scr-b">// importing the SCR - The configuration store</b>
import { SCR_CONFIG_STORE } from &quot;svelte-client-router&quot;

<b class="scr-b">// Setting Global On Error Function</b>
SCR_CONFIG_STORE.setOnError((err, routeObjParams) =&gt; { console.error(err) });
`,L=i(),q=s("br"),B=i(),S(u.$$.fragment),I=i(),g=s("p"),g.textContent=`So that is it for this section. This feature enables us to handle any
      errors that may occur inside our routing definitions.`,H=i(),d=s("center"),d.innerHTML='<small class="scr-small">The configuration for this route.</small>',M=i(),h=s("pre"),h.textContent=`{
    name: "configurationOnErrorOptionRoute",
    path: "/svelte-client-router/configurationOnError",
    lazyLoadComponent: () => import("./docs/pages/SCR_ConfigurationOnError.svelte"),
    title: "SCR - Configuration - On Error",
}
`,c(o,"class","scr-h4"),c(r,"class","scr-text-justify"),c(_,"class","scr-pre"),c(g,"class","scr-text-justify"),c(h,"class","scr-pre"),c(t,"class","scr-page")},m(a,C){z(a,t,C),e(t,o),e(t,n),e(t,r),e(r,f),e(r,b),e(r,v),e(r,y),e(r,w),e(r,T),e(r,j),e(r,k),e(r,P),O(l,r,null),e(r,F),e(t,G),e(t,_),e(t,L),e(t,q),e(t,B),O(u,t,null),e(t,I),e(t,g),e(t,H),e(t,d),e(t,M),e(t,h),$=!0},p(a,C){const N={};C&1&&(N.$$scope={dirty:C,ctx:a}),l.$set(N)},i(a){$||(R(l.$$.fragment,a),R(u.$$.fragment,a),$=!0)},o(a){x(l.$$.fragment,a),x(u.$$.fragment,a),$=!1},d(a){a&&A(t),E(l),E(u)}}}function tt(p){let t,o;return t=new U({props:{back:{name:"v1_Configuration_Global_Before_Enter_Option",text:"Configuration Before Enter"},forward:{name:"v1_Route_Object_Properties",text:"Route Object Properties"},$$slots:{default:[Z]},$$scope:{ctx:p}}}),{c(){S(t.$$.fragment)},m(n,r){O(t,n,r),o=!0},p(n,[r]){const f={};r&1&&(f.$$scope={dirty:r,ctx:n}),t.$set(f)},i(n){o||(R(t.$$.fragment,n),o=!0)},o(n){x(t.$$.fragment,n),o=!1},d(n){E(t,n)}}}class ot extends W{constructor(t){super(),Y(this,t,null,tt,D,{})}}export{ot as default};
