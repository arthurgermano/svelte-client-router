import{S as pt,i as mt,s as ht,h as rt,m as nt,j as lt,k as ot,o as it,B as ft,e as a,a as u,t as R,b as n,c as ct,d as e,D as y,l as et,f as at,g as ut,E as dt,n as gt}from"./index.fc5ef2be.js";import{S as _t}from"./SCR_Page.a121dc3b.js";function bt(s){let t;return{c(){t=a("div"),t.textContent="Test Route With Two Params",n(t,"class","scr-btn")},m(r,l){ct(r,t,l)},p:gt,d(r){r&&ut(t)}}}function Pt(s){let t,r,l,c,p,_,$,o,I,k,x=s[0].firstParam+"",j,M,W,z,E,T=s[0].secondParam+"",q,V,A,D,Z,G,J,d,P,C,K,m,N,v,S,O,h,Q,g,U,B,X,w,Y,L,b,F,tt;return g=new ft({props:{params:{path:`/svelte-client-router/v1/${s[1]}/testRegexPath2/${s[2]}/`},$$slots:{default:[bt]},$$scope:{ctx:s}}}),{c(){t=a("div"),r=a("h4"),r.textContent="Test - Regex Path 2",l=u(),c=a("p"),c.innerHTML=`This route tests two regex params path. When declaring it - to go to the
      route - you should remember that the last part of the route is a regex.
      <br/>
      So if it is empty add a trailing slash after it
      <br/> 
      <b style="color:red">This route would not be matched if consider trailing slash on matching route was disabled!</b>`,p=u(),_=a("pre"),_.innerHTML=`<b class="scr-b">&lt;!-- Look how the bellow button was declared --&gt;</b>
&lt;SCR_RouterLink
  to={{
    path: \`/svelte-client-router/\${nextFirstParam}/testRegexPathParam2/\${nextSecondParam}/\`,
  }}
&gt;

<b class="scr-b">&lt;!-- It was added a trailing slash at the end --&gt;</b>
<b class="scr-b">&lt;!-- If you pass an empty value then SCR will still match this route --&gt;</b>
<b class="scr-b">&lt;!-- If not present then it will try to match a different route configuration --&gt;</b>
&lt;div class=&quot;scr-btn&quot;&gt;Test Route With Param&lt;/div&gt;
&lt;/SCR_RouterLink&gt;
`,$=u(),o=a("p"),I=R("The route first param path passed is: "),k=a("b"),j=R(x),M=u(),W=a("br"),z=R(`
      The route second param path passed is: `),E=a("b"),q=R(T),V=u(),A=a("br"),D=u(),Z=a("br"),G=R(`
      Try it!`),J=u(),d=a("div"),P=a("div"),C=a("label"),C.textContent="Route First Path Param",K=u(),m=a("input"),N=u(),v=a("div"),S=a("label"),S.textContent="Route Second Path Param",O=u(),h=a("input"),Q=u(),rt(g.$$.fragment),U=u(),B=a("hr"),X=u(),w=a("center"),w.innerHTML='<small class="scr-small">The configuration for this route.</small>',Y=u(),L=a("pre"),L.textContent=`{
  name: "v2_Test_Regex_Path_2",
  path: "/svelte-client-router/v2/:firstParam/testRegexPath2/:secondParam",
  lazyLoadComponent: () => import("../../pages/v2/SCR_TestRegexPath2.svelte"),
  title: "SCR - Test Regex Path 2 - Version 2",
  beforeEnter: [setVersion2],
}
`,n(r,"class","scr-h4"),n(c,"class","scr-text-justify"),n(_,"class","scr-pre"),n(o,"class","scr-text-justify"),n(C,"for","scr-next-first-param"),n(m,"type","text"),n(m,"id","scr-next-first-param"),n(m,"placeholder",":firstParam"),n(S,"for","scr-next-second-param"),n(h,"type","text"),n(h,"id","scr-next-second-param"),n(h,"placeholder",":secondParam"),n(d,"class","scr-test"),n(B,"class","scr-hr"),n(w,"class",""),n(L,"class","scr-pre"),n(t,"class","scr-page")},m(i,f){ct(i,t,f),e(t,r),e(t,l),e(t,c),e(t,p),e(t,_),e(t,$),e(t,o),e(o,I),e(o,k),e(k,j),e(o,M),e(o,W),e(o,z),e(o,E),e(E,q),e(o,V),e(o,A),e(o,D),e(o,Z),e(o,G),e(t,J),e(t,d),e(d,P),e(P,C),e(P,K),e(P,m),y(m,s[1]),e(d,N),e(d,v),e(v,S),e(v,O),e(v,h),y(h,s[2]),e(d,Q),nt(g,d,null),e(t,U),e(t,B),e(t,X),e(t,w),e(t,Y),e(t,L),b=!0,F||(tt=[et(m,"input",s[3]),et(h,"input",s[4])],F=!0)},p(i,f){(!b||f&1)&&x!==(x=i[0].firstParam+"")&&at(j,x),(!b||f&1)&&T!==(T=i[0].secondParam+"")&&at(q,T),f&2&&m.value!==i[1]&&y(m,i[1]),f&4&&h.value!==i[2]&&y(h,i[2]);const H={};f&6&&(H.params={path:`/svelte-client-router/v1/${i[1]}/testRegexPath2/${i[2]}/`}),f&32&&(H.$$scope={dirty:f,ctx:i}),g.$set(H)},i(i){b||(lt(g.$$.fragment,i),b=!0)},o(i){ot(g.$$.fragment,i),b=!1},d(i){i&&ut(t),it(g),F=!1,dt(tt)}}}function vt(s){let t,r;return t=new _t({props:{back:{name:"v1_Test_Regex_Path",text:"Test - Regex Path"},forward:{name:"v1_Test_Loading_Component_Before_Enter",text:"Test - Loading Component Before Enter"},$$slots:{default:[Pt]},$$scope:{ctx:s}}}),{c(){rt(t.$$.fragment)},m(l,c){nt(t,l,c),r=!0},p(l,[c]){const p={};c&39&&(p.$$scope={dirty:c,ctx:l}),t.$set(p)},i(l){r||(lt(t.$$.fragment,l),r=!0)},o(l){ot(t.$$.fragment,l),r=!1},d(l){it(t,l)}}}let Rt=/[A-Za-zÀ-ú0-9]/g;function st(s){const t=s.match(Rt);return t?t.join("").substr(0,100)+"":""}function $t(s,t,r){let{pathParams:l}=t,c="",p="";function _(){c=this.value,r(1,c)}function $(){p=this.value,r(2,p)}return s.$$set=o=>{"pathParams"in o&&r(0,l=o.pathParams)},s.$$.update=()=>{s.$$.dirty&2&&c&&r(1,c=st(c)),s.$$.dirty&4&&p&&r(2,p=st(p))},[l,c,p,_,$]}class Ct extends pt{constructor(t){super(),mt(this,t,$t,vt,ht,{pathParams:0})}}export{Ct as default};
