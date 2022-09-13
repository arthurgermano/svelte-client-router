import{S as ne,i as re,s as oe,h as x,m as E,j as R,k as B,o as v,B as se,e as r,a as l,t as i,b as f,c as ee,d as e,g as te,C as ae,n as le}from"./index.fc5ef2be.js";import{S as ie}from"./SCR_Page.a121dc3b.js";import{S as ce}from"./SCR_BeforeEnterRouteAnatomy.0bca315a.js";function ue(b){let t;return{c(){t=r("a"),t.textContent="Route Object Properties",f(t,"href","/"),ae(t,"pointer-events","none")},m(s,o){ee(s,t,o)},p:le,d(s){s&&te(t)}}}function fe(b){let t,s,o,n,p,d,O,C,F,T,G,y,j,N,I,w,k,$,A,L,P,q,M,c,H,U,Y,z,W,D,m,J,K,Q,u,V,S,X,_,g;return c=new se({props:{params:{name:"v1_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[ue]},$$scope:{ctx:b}}}),u=new ce({}),{c(){t=r("div"),s=r("h4"),s.textContent="Configuration - Before Enter Function",o=l(),n=r("p"),p=i("The "),d=r("b"),d.textContent="beforeEnter",O=i(` option sets an array of functions or just a
      function that must be executed for before each route if the option
      `),C=r("b"),C.textContent="ignoreGlobalBeforeFunction",F=i(`
      isn't set in the route definition object.
      `),T=r("br"),G=l(),y=r("br"),j=i(`
      The default order of execution is first execute all Global Before Functions
      and then execute route object before enter functions. But for a particular
      route the behaviour maybe different. Maybe it is needed to execute the route
      before function before Global Before Functions.
      `),N=r("br"),I=l(),w=r("br"),k=i(`
      If that is the case then you can set in the route object the option
      `),$=r("b"),$.textContent="executeRouteBEFBeforeGlobalBEF",A=i(` to true. When this option is enabled
      in the route definition object the default order of execution is overrided
      and executes route object before functions before Global Before Functions.
      `),L=r("br"),P=l(),q=r("br"),M=i(`
      See the `),x(c.$$.fragment),H=i(` for more info.
      `),U=r("br"),Y=l(),z=r("br"),W=i(`
      See the next example of how to set this option:`),D=l(),m=r("pre"),m.innerHTML=`<b class="scr-b">// importing the SCR - The configuration store</b>
import { SCR_CONFIG_STORE } from &quot;svelte-client-router&quot;

<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Global Before Enter Function</b>
SCR_CONFIG_STORE.setBeforeEnter((resolve) =&gt; { resolve(true); });

<b class="scr-b">// OR </b>

<b class="scr-b">// ------ SETTING AN ARRAY OF FUNCTIONS ------ </b>
<b class="scr-b">// Setting Global Before Enter Functions</b>
<b class="scr-b">// You can set as many Before Enter Functions as you want!</b>
SCR_CONFIG_STORE.setBeforeEnter([
  (resolve) =&gt; { resolve(true); },
  (resolve) =&gt; { resolve(true); },
  (resolve) =&gt; { resolve(true); },
]);
`,J=l(),K=r("br"),Q=l(),x(u.$$.fragment),V=l(),S=r("center"),S.innerHTML='<small class="scr-small">The configuration for this route.</small>',X=l(),_=r("pre"),_.textContent=`{
    name: "configurationGlobalBeforeEnterOptionRoute",
    path: "/svelte-client-router/configurationBeforeEnter",
    lazyLoadComponent: () => import("./docs/pages/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration - Before Enter",
}
`,f(s,"class","scr-h4"),f(n,"class","scr-text-justify"),f(m,"class","scr-pre"),f(_,"class","scr-pre"),f(t,"class","scr-page")},m(a,h){ee(a,t,h),e(t,s),e(t,o),e(t,n),e(n,p),e(n,d),e(n,O),e(n,C),e(n,F),e(n,T),e(n,G),e(n,y),e(n,j),e(n,N),e(n,I),e(n,w),e(n,k),e(n,$),e(n,A),e(n,L),e(n,P),e(n,q),e(n,M),E(c,n,null),e(n,H),e(n,U),e(n,Y),e(n,z),e(n,W),e(t,D),e(t,m),e(t,J),e(t,K),e(t,Q),E(u,t,null),e(t,V),e(t,S),e(t,X),e(t,_),g=!0},p(a,h){const Z={};h&1&&(Z.$$scope={dirty:h,ctx:a}),c.$set(Z)},i(a){g||(R(c.$$.fragment,a),R(u.$$.fragment,a),g=!0)},o(a){B(c.$$.fragment,a),B(u.$$.fragment,a),g=!1},d(a){a&&te(t),v(c),v(u)}}}function be(b){let t,s;return t=new ie({props:{back:{name:"v1_Configuration_Options",text:"Configuration Options"},forward:{name:"v1_Configuration_Global_On_Error",text:"Configuration On Error"},$$slots:{default:[fe]},$$scope:{ctx:b}}}),{c(){x(t.$$.fragment)},m(o,n){E(t,o,n),s=!0},p(o,[n]){const p={};n&1&&(p.$$scope={dirty:n,ctx:o}),t.$set(p)},i(o){s||(R(t.$$.fragment,o),s=!0)},o(o){B(t.$$.fragment,o),s=!1},d(o){v(t,o)}}}class ge extends ne{constructor(t){super(),re(this,t,null,be,oe,{})}}export{ge as default};
