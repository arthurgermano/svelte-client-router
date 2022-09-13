import{S as ct,i as ft,s as dt,h as rt,m as ot,j as it,k as lt,o as ut,B as ht,e as s,a as l,t as y,b as i,c as mt,d as e,D as S,l as nt,f as st,g as pt,E as gt,n as _t}from"./index.fc5ef2be.js";import{S as Tt}from"./SCR_Page.a121dc3b.js";function vt(a){let t;return{c(){t=s("div"),t.textContent="Test Route With Two Params and Route Custom Loading Component",i(t,"class","scr-btn")},m(n,r){mt(n,t,r)},p:_t,d(n){n&&pt(t)}}}function bt(a){let t,n,r,m,p,c,L,v,_,u,H,B,R=(a[0].timeout||"")+"",W,I,Q,V,w,x=(a[1].subLoadingText||"")+"",j,D,O,U,Z,F,G,g,P,$,J,f,K,C,q,N,d,X,T,Y,k,tt,A,et,E,b,M,at;return T=new ht({props:{params:{path:`/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/${a[2]||10}?subLoadingText=${a[3]}`},$$slots:{default:[vt]},$$scope:{ctx:a}}}),{c(){t=s("div"),n=s("h4"),n.textContent="Test - Loading Component With Route Before Enter",r=l(),m=s("p"),m.textContent="This route is demonstrating several concepts, as some as follows:",p=l(),c=s("ul"),c.innerHTML=`<li>The Loading Component</li> 
      <li>Lazy Loading a Custom Loading Component for this specific Route</li> 
      <li>Capturing params in Loading Component</li> 
      <ul><li>Path Params</li> 
        <li>Query Params</li></ul> 
      <li>Passing query params</li> 
      <ul><li>Try it via browser URL - passing at end of this route
          ?subLoadingText=MyCustomText!</li></ul> 
      <li>Before Enter Route</li>`,L=l(),v=s("p"),v.innerHTML=`The default value is 2000 milliseconds. If nothing is declared it is
      assumed 2000. Or if it is passed a valid number greater than 10
      milliseconds it will wait the milliseconds specified.
      <br/> 
      <br/> 
      <b>Important: All the variables captured by this component are passed to
        all components!</b>`,_=l(),u=s("p"),H=y("The route timeout param path passed is: "),B=s("b"),W=y(R),I=l(),Q=s("br"),V=y(`
      The route query param passed is: `),w=s("b"),j=y(x),D=l(),O=s("br"),U=l(),Z=s("br"),F=y(`
      Try it!`),G=l(),g=s("div"),P=s("div"),$=s("label"),$.textContent="Route Timeout Path Param",J=l(),f=s("input"),K=l(),C=s("div"),q=s("label"),q.textContent="Route Query Param",N=l(),d=s("input"),X=l(),rt(T.$$.fragment),Y=l(),k=s("hr"),tt=l(),A=s("center"),A.innerHTML='<small class="scr-small">The configuration for this route.</small>',et=l(),E=s("pre"),E.textContent=`{
  name: "v2_Test_Loading_Component_Before_Enter",
  path: "/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout",
  lazyLoadComponent: () => import("../../pages/v2/SCR_TestLoadingComponentWithBeforeEnter.svelte"),
  title: "SCR - Test Regex Path 2 - Version 2",
  beforeEnter: [setVersion2, ({ resolve, routeTo }) => {
      let timeout = 20;
      if (routeTo && routeTo.pathParams && routeTo.pathParams.timeout) {
        routeTo.pathParams.timeout = parseInt(routeTo.pathParams.timeout);
        if (routeTo.pathParams.timeout > 0) {
          timeout = routeTo.pathParams.timeout;
        }
      }

      setTimeout(() => {
        resolve(true);
      }, timeout);
    }
  ],
}
`,i(n,"class","scr-h4"),i(m,"class","scr-text-justify"),i(v,"class","scr-text-justify"),i(u,"class","scr-text-justify"),i($,"for","scr-timeout-param"),i(f,"type","text"),i(f,"id","scr-timeout-param"),i(f,"placeholder",":timeoutParam"),i(q,"for","scr-query-param"),i(d,"type","text"),i(d,"id","scr-query-param"),i(d,"placeholder",":queryParam"),i(g,"class","scr-test"),i(k,"class","scr-hr"),i(E,"class","scr-pre"),i(t,"class","scr-page")},m(o,h){mt(o,t,h),e(t,n),e(t,r),e(t,m),e(t,p),e(t,c),e(t,L),e(t,v),e(t,_),e(t,u),e(u,H),e(u,B),e(B,W),e(u,I),e(u,Q),e(u,V),e(u,w),e(w,j),e(u,D),e(u,O),e(u,U),e(u,Z),e(u,F),e(t,G),e(t,g),e(g,P),e(P,$),e(P,J),e(P,f),S(f,a[2]),e(g,K),e(g,C),e(C,q),e(C,N),e(C,d),S(d,a[3]),e(g,X),ot(T,g,null),e(t,Y),e(t,k),e(t,tt),e(t,A),e(t,et),e(t,E),b=!0,M||(at=[nt(f,"input",a[4]),nt(d,"input",a[5])],M=!0)},p(o,h){(!b||h&1)&&R!==(R=(o[0].timeout||"")+"")&&st(W,R),(!b||h&2)&&x!==(x=(o[1].subLoadingText||"")+"")&&st(j,x),h&4&&f.value!==o[2]&&S(f,o[2]),h&8&&d.value!==o[3]&&S(d,o[3]);const z={};h&12&&(z.params={path:`/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/${o[2]||10}?subLoadingText=${o[3]}`}),h&64&&(z.$$scope={dirty:h,ctx:o}),T.$set(z)},i(o){b||(it(T.$$.fragment,o),b=!0)},o(o){lt(T.$$.fragment,o),b=!1},d(o){o&&pt(t),ut(T),M=!1,gt(at)}}}function Pt(a){let t,n;return t=new Tt({props:{back:{name:"v2_Test_Regex_Path_2",text:"Test - Regex Path 2"},forward:{name:"v2_Test_Any_Route_Wildcard",text:"Test - Any Route Wildcard"},$$slots:{default:[bt]},$$scope:{ctx:a}}}),{c(){rt(t.$$.fragment)},m(r,m){ot(t,r,m),n=!0},p(r,[m]){const p={};m&79&&(p.$$scope={dirty:m,ctx:r}),t.$set(p)},i(r){n||(it(t.$$.fragment,r),n=!0)},o(r){lt(t.$$.fragment,r),n=!1},d(r){ut(t,r)}}}let Ct=/[0-9]/g,yt=/[A-Za-zÀ-ú0-9]/g;function Lt(a=""){if(!a)return a;a=a.toString();const t=a.match(Ct);return t?t.join("").substr(0,100)+"":""}function Rt(a=""){if(!a)return a;a=a.toString();const t=a.match(yt);return t?t.join("").substr(0,100)+"":""}function xt(a,t,n){let{pathParams:r={}}=t,{queryParams:m={}}=t,p=2e3,c="";function L(){p=this.value,n(2,p)}function v(){c=this.value,n(3,c)}return a.$$set=_=>{"pathParams"in _&&n(0,r=_.pathParams),"queryParams"in _&&n(1,m=_.queryParams)},a.$$.update=()=>{a.$$.dirty&4&&p&&n(2,p=Lt(p)),a.$$.dirty&8&&c&&n(3,c=Rt(c))},[r,m,p,c,L,v]}class Et extends ct{constructor(t){super(),ft(this,t,xt,Pt,dt,{pathParams:0,queryParams:1})}}export{Et as default};
