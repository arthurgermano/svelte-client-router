import{S as pt,i as ft,s as dt,h as ot,m as rt,j as it,k as lt,o as ut,B as ht,e as s,a as l,t as y,b as i,c as mt,d as e,D as S,l as nt,f as st,g as ct,E as gt,n as bt}from"./index.fc5ef2be.js";import{S as _t}from"./SCR_Page.a121dc3b.js";function vt(a){let t;return{c(){t=s("div"),t.textContent="Test Route With Two Params and Route Custom Loading Component",i(t,"class","scr-btn")},m(n,o){mt(n,t,o)},p:bt,d(n){n&&ct(t)}}}function Tt(a){let t,n,o,m,c,p,P,v,b,u,H,B,R=(a[0].timeout||"")+"",W,O,Q,D,w,q=(a[1].subLoadingText||"")+"",j,I,F,U,Z,G,J,g,C,$,K,f,N,L,x,V,d,X,_,Y,k,tt,M,et,E,T,z,at;return _=new ht({props:{params:{path:`/svelte-client-router/v1/testLoadingComponentWithBeforeEnter/${a[2]||10}?subLoadingText=${a[3]}`},$$slots:{default:[vt]},$$scope:{ctx:a}}}),{c(){t=s("div"),n=s("h4"),n.textContent="Test - Loading Component With Route Before Enter",o=l(),m=s("p"),m.textContent="This route is demonstrating several concepts, as some as follows:",c=l(),p=s("ul"),p.innerHTML=`<li>The Loading Component</li> 
      <li>Lazy Loading a Custom Loading Component for this specific Route</li> 
      <li>Capturing params in Loading Component</li> 
      <ul><li>Path Params</li> 
        <li>Query Params</li></ul> 
      <li>Passing query params</li> 
      <ul><li>Try it via browser URL - passing at end of this route
          ?subLoadingText=MyCustomText!</li></ul> 
      <li>Before Enter Route</li>`,P=l(),v=s("p"),v.innerHTML=`The default value is 2000 milliseconds. If nothing is declared it is
      assumed 2000. Or if it is passed a valid number greater than 10
      milliseconds it will wait the milliseconds specified.
      <br/> 
      <br/> 
      <b>Important: All the variables captured by this component are passed to
        all components!</b>`,b=l(),u=s("p"),H=y("The route timeout param path passed is: "),B=s("b"),W=y(R),O=l(),Q=s("br"),D=y(`
      The route query param passed is: `),w=s("b"),j=y(q),I=l(),F=s("br"),U=l(),Z=s("br"),G=y(`
      Try it!`),J=l(),g=s("div"),C=s("div"),$=s("label"),$.textContent="Route Timeout Path Param",K=l(),f=s("input"),N=l(),L=s("div"),x=s("label"),x.textContent="Route Query Param",V=l(),d=s("input"),X=l(),ot(_.$$.fragment),Y=l(),k=s("hr"),tt=l(),M=s("center"),M.innerHTML='<small class="scr-small">The configuration for this route.</small>',et=l(),E=s("pre"),E.innerHTML=`{
  name: &quot;testLoadingComponentWithBeforeEnterRoute&quot;,
  path: &quot;/svelte-client-router/testLoadingComponentWithBeforeEnter/:timeout&quot;,

  <b class="scr-b">// Lazy loading an specific loading component for this route</b>
  lazyLoadLoadingComponent: () =&gt;
    import(&quot;./docs/SCR_Loading.svelte&quot;),

  component: SCR_TestLoadingComponentWithBeforeEnter,

  <b class="scr-b">// Demonstrating one function as before enter</b>
  beforeEnter: (resolve, routeFrom, routeTo, routeObjParams, payload) ==&gt; {
    setTimeout(() =&gt; resolve(true), routeObjParams?.pathParams?.timeout || 10)
  },
  
  title: &quot;SCR - Test - Loading Component with Before Enter&quot;,
  forceReload: true
}
`,i(n,"class","scr-h4"),i(m,"class","scr-text-justify"),i(v,"class","scr-text-justify"),i(u,"class","scr-text-justify"),i($,"for","scr-timeout-param"),i(f,"type","text"),i(f,"id","scr-timeout-param"),i(f,"placeholder",":timeoutParam"),i(x,"for","scr-query-param"),i(d,"type","text"),i(d,"id","scr-query-param"),i(d,"placeholder",":queryParam"),i(g,"class","scr-test"),i(k,"class","scr-hr"),i(E,"class","scr-pre"),i(t,"class","scr-page")},m(r,h){mt(r,t,h),e(t,n),e(t,o),e(t,m),e(t,c),e(t,p),e(t,P),e(t,v),e(t,b),e(t,u),e(u,H),e(u,B),e(B,W),e(u,O),e(u,Q),e(u,D),e(u,w),e(w,j),e(u,I),e(u,F),e(u,U),e(u,Z),e(u,G),e(t,J),e(t,g),e(g,C),e(C,$),e(C,K),e(C,f),S(f,a[2]),e(g,N),e(g,L),e(L,x),e(L,V),e(L,d),S(d,a[3]),e(g,X),rt(_,g,null),e(t,Y),e(t,k),e(t,tt),e(t,M),e(t,et),e(t,E),T=!0,z||(at=[nt(f,"input",a[4]),nt(d,"input",a[5])],z=!0)},p(r,h){(!T||h&1)&&R!==(R=(r[0].timeout||"")+"")&&st(W,R),(!T||h&2)&&q!==(q=(r[1].subLoadingText||"")+"")&&st(j,q),h&4&&f.value!==r[2]&&S(f,r[2]),h&8&&d.value!==r[3]&&S(d,r[3]);const A={};h&12&&(A.params={path:`/svelte-client-router/v1/testLoadingComponentWithBeforeEnter/${r[2]||10}?subLoadingText=${r[3]}`}),h&64&&(A.$$scope={dirty:h,ctx:r}),_.$set(A)},i(r){T||(it(_.$$.fragment,r),T=!0)},o(r){lt(_.$$.fragment,r),T=!1},d(r){r&&ct(t),ut(_),z=!1,gt(at)}}}function Ct(a){let t,n;return t=new _t({props:{back:{name:"v1_Test_Regex_Path_2",text:"Test - Regex Path 2"},forward:{name:"v1_Test_Any_Route_Wildcard",text:"Test - Any Route Wildcard"},$$slots:{default:[Tt]},$$scope:{ctx:a}}}),{c(){ot(t.$$.fragment)},m(o,m){rt(t,o,m),n=!0},p(o,[m]){const c={};m&79&&(c.$$scope={dirty:m,ctx:o}),t.$set(c)},i(o){n||(it(t.$$.fragment,o),n=!0)},o(o){lt(t.$$.fragment,o),n=!1},d(o){ut(t,o)}}}let Lt=/[0-9]/g,yt=/[A-Za-zÀ-ú0-9]/g;function Pt(a=""){if(!a)return a;a=a.toString();const t=a.match(Lt);return t?t.join("").substr(0,100)+"":""}function Rt(a=""){if(!a)return a;a=a.toString();const t=a.match(yt);return t?t.join("").substr(0,100)+"":""}function qt(a,t,n){let{pathParams:o={}}=t,{queryParams:m={}}=t,c=2e3,p="";function P(){c=this.value,n(2,c)}function v(){p=this.value,n(3,p)}return a.$$set=b=>{"pathParams"in b&&n(0,o=b.pathParams),"queryParams"in b&&n(1,m=b.queryParams)},a.$$.update=()=>{a.$$.dirty&4&&c&&n(2,c=Pt(c)),a.$$.dirty&8&&p&&n(3,p=Rt(p))},[o,m,c,p,P,v]}class Et extends pt{constructor(t){super(),ft(this,t,qt,Ct,dt,{pathParams:0,queryParams:1})}}export{Et as default};
