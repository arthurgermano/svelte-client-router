import{S as oe,i as se,s as ae,h as v,m as B,j as S,k as E,o as R,B as le,e as r,a as l,t as i,b as u,c as ne,d as e,g as re,C as ie,n as ce}from"./index.fc5ef2be.js";import{S as fe}from"./SCR_Page.a121dc3b.js";import{S as ue}from"./SCR_BeforeEnterRouteAnatomy.d8ee10ee.js";function be(b){let n;return{c(){n=r("a"),n.textContent="Route Object Properties",u(n,"href","/"),ie(n,"pointer-events","none")},m(s,o){ne(s,n,o)},p:ce,d(s){s&&re(n)}}}function pe(b){let n,s,o,t,p,d,y,$,F,T,G,O,j,w,N,A,k,C,I,L,P,q,M,c,H,U,Y,z,W,D,J,K,m,Q,V,X,f,Z,x,ee,g,h;return c=new le({props:{params:{name:"v2_Route_Object_Properties"},elementProps:{style:"display: inline; cursor: pointer;"},$$slots:{default:[be]},$$scope:{ctx:b}}}),f=new ue({}),{c(){n=r("div"),s=r("h4"),s.textContent="Configuration - Before Enter Function",o=l(),t=r("p"),p=i("The "),d=r("b"),d.textContent="beforeEnter",y=i(` option sets an array of functions or just a
      function that must be executed for before each route if the option
      `),$=r("b"),$.textContent="ignoreGlobalBeforeFunction",F=i(`
      isn't set in the route definition object.
      `),T=r("br"),G=l(),O=r("br"),j=i(`
      The default order of execution is first execute all Global Before Functions
      and then execute route object before enter functions. But for a particular
      route the behaviour maybe different. Maybe it is needed to execute the route
      before function before Global Before Functions.
      `),w=r("br"),N=l(),A=r("br"),k=i(`
      If that is the case then you can set in the route object the option
      `),C=r("b"),C.textContent="executeRouteBEFBeforeGlobalBEF",I=i(` to true. When this option is enabled
      in the route definition object the default order of execution is overrided
      and executes route object before functions before Global Before Functions.
      `),L=r("br"),P=l(),q=r("br"),M=i(`
      See the `),v(c.$$.fragment),H=i(` for more info.
      `),U=r("br"),Y=l(),z=r("br"),W=i(`
      Always resolve a before enter function, if not the flow will be waiting forever.
      `),D=r("br"),J=i(`
      See the next example of how to set this option:`),K=l(),m=r("pre"),m.innerHTML=`<b class="scr-b">// importing the SCR - The configuration store</b>
import { configStore } from &quot;svelte-client-router&quot;

<b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Global Before Enter Function</b>
configStore.setBeforeEnter(({ resolve }) =&gt; { resolve(true); });

<b class="scr-b">// OR </b>

<b class="scr-b">// ------ SETTING AN ARRAY OF FUNCTIONS ------ </b>
<b class="scr-b">// Setting Global Before Enter Functions</b>
<b class="scr-b">// You can set as many Before Enter Functions as you want!</b>
configStore.setBeforeEnter([
  ({ resolve }) =&gt; { resolve(true); },
  ({ resolve }) =&gt; { resolve(true); },
  ({ resolve }) =&gt; { resolve(true); },
]);
`,Q=l(),V=r("br"),X=l(),v(f.$$.fragment),Z=l(),x=r("center"),x.innerHTML='<small class="scr-small">The configuration for this route.</small>',ee=l(),g=r("pre"),g.textContent=`{
    name: "configurationGlobalBeforeEnterOptionRoute",
    path: "/svelte-client-router/configurationBeforeEnter",
    lazyLoadComponent: () => import("./docs/pages/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration - Before Enter",
}
`,u(s,"class","scr-h4"),u(t,"class","scr-text-justify"),u(m,"class","scr-pre"),u(g,"class","scr-pre"),u(n,"class","scr-page")},m(a,_){ne(a,n,_),e(n,s),e(n,o),e(n,t),e(t,p),e(t,d),e(t,y),e(t,$),e(t,F),e(t,T),e(t,G),e(t,O),e(t,j),e(t,w),e(t,N),e(t,A),e(t,k),e(t,C),e(t,I),e(t,L),e(t,P),e(t,q),e(t,M),B(c,t,null),e(t,H),e(t,U),e(t,Y),e(t,z),e(t,W),e(t,D),e(t,J),e(n,K),e(n,m),e(n,Q),e(n,V),e(n,X),B(f,n,null),e(n,Z),e(n,x),e(n,ee),e(n,g),h=!0},p(a,_){const te={};_&1&&(te.$$scope={dirty:_,ctx:a}),c.$set(te)},i(a){h||(S(c.$$.fragment,a),S(f.$$.fragment,a),h=!0)},o(a){E(c.$$.fragment,a),E(f.$$.fragment,a),h=!1},d(a){a&&re(n),R(c),R(f)}}}function me(b){let n,s;return n=new fe({props:{back:{name:"v2_Configuration_Options",text:"Configuration Options"},forward:{name:"v2_Configuration_Global_On_Error",text:"Configuration On Error"},$$slots:{default:[pe]},$$scope:{ctx:b}}}),{c(){v(n.$$.fragment)},m(o,t){B(n,o,t),s=!0},p(o,[t]){const p={};t&1&&(p.$$scope={dirty:t,ctx:o}),n.$set(p)},i(o){s||(S(n.$$.fragment,o),s=!0)},o(o){E(n.$$.fragment,o),s=!1},d(o){R(n,o)}}}class de extends oe{constructor(n){super(),se(this,n,null,me,ae,{})}}export{de as default};
