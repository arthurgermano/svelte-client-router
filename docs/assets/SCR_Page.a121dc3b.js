import{S as F,i as G,s as H,p as I,e as k,a as S,b as $,c as v,d as g,u as J,q as K,r as M,j as c,v as y,k as p,w as C,x as N,y as O,z as R,A as Q,g as h,B as z,h as A,m as B,o as L,t as D,f as E}from"./index.fc5ef2be.js";function q(s){let e;return{c(){e=k("hr")},m(n,t){v(n,e,t)},d(n){n&&h(e)}}}function P(s){let e,n;return e=new z({props:{params:{name:s[0].name},$$slots:{default:[T]},$$scope:{ctx:s}}}),{c(){A(e.$$.fragment)},m(t,a){B(e,t,a),n=!0},p(t,a){const l={};a&1&&(l.params={name:t[0].name}),a&9&&(l.$$scope={dirty:a,ctx:t}),e.$set(l)},i(t){n||(c(e.$$.fragment,t),n=!0)},o(t){p(e.$$.fragment,t),n=!1},d(t){L(e,t)}}}function T(s){let e,n=s[0].text+"",t;return{c(){e=k("button"),t=D(n),$(e,"class","scr-page-btn svelte-1ysve6x"),$(e,"type","button")},m(a,l){v(a,e,l),g(e,t)},p(a,l){l&1&&n!==(n=a[0].text+"")&&E(t,n)},d(a){a&&h(e)}}}function j(s){let e,n;return e=new z({props:{params:{name:s[1].name},$$slots:{default:[U]},$$scope:{ctx:s}}}),{c(){A(e.$$.fragment)},m(t,a){B(e,t,a),n=!0},p(t,a){const l={};a&2&&(l.params={name:t[1].name}),a&10&&(l.$$scope={dirty:a,ctx:t}),e.$set(l)},i(t){n||(c(e.$$.fragment,t),n=!0)},o(t){p(e.$$.fragment,t),n=!1},d(t){L(e,t)}}}function U(s){let e,n=s[1].text+"",t;return{c(){e=k("button"),t=D(n),$(e,"class","scr-page-btn svelte-1ysve6x"),$(e,"type","button")},m(a,l){v(a,e,l),g(e,t)},p(a,l){l&2&&n!==(n=a[1].text+"")&&E(t,n)},d(a){a&&h(e)}}}function V(s){let e,n,t,a,l,d,u,b;const w=s[2].default,_=I(w,s,s[3],null);let f=(s[0].name||s[1].name)&&q(),o=s[0].name&&P(s),i=s[1].name&&j(s);return{c(){e=k("div"),_&&_.c(),n=S(),f&&f.c(),t=S(),a=k("div"),o&&o.c(),l=S(),i&&i.c(),$(a,"class","scr-page-actions svelte-1ysve6x")},m(r,m){v(r,e,m),_&&_.m(e,null),g(e,n),f&&f.m(e,null),g(e,t),g(e,a),o&&o.m(a,null),g(a,l),i&&i.m(a,null),b=!0},p(r,[m]){_&&_.p&&(!b||m&8)&&J(_,w,r,r[3],b?M(w,r[3],m,null):K(r[3]),null),r[0].name||r[1].name?f||(f=q(),f.c(),f.m(e,t)):f&&(f.d(1),f=null),r[0].name?o?(o.p(r,m),m&1&&c(o,1)):(o=P(r),o.c(),c(o,1),o.m(a,l)):o&&(y(),p(o,1,1,()=>{o=null}),C()),r[1].name?i?(i.p(r,m),m&2&&c(i,1)):(i=j(r),i.c(),c(i,1),i.m(a,null)):i&&(y(),p(i,1,1,()=>{i=null}),C())},i(r){b||(c(_,r),c(o),c(i),N(()=>{u&&u.end(1),d=O(e,R,{delay:301,x:300,duration:300,opacity:0}),d.start()}),b=!0)},o(r){p(_,r),p(o),p(i),d&&d.invalidate(),u=Q(e,R,{x:300,duration:300,opacity:0}),b=!1},d(r){r&&h(e),_&&_.d(r),f&&f.d(),o&&o.d(),i&&i.d(),r&&u&&u.end()}}}function W(s,e,n){let{$$slots:t={},$$scope:a}=e,{back:l={}}=e,{forward:d={}}=e;return s.$$set=u=>{"back"in u&&n(0,l=u.back),"forward"in u&&n(1,d=u.forward),"$$scope"in u&&n(3,a=u.$$scope)},[l,d,t,a]}class Y extends F{constructor(e){super(),G(this,e,W,V,H,{back:0,forward:1})}}export{Y as S};
