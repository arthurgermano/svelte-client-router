import{S as q,i as T,s as x,e as u,a as b,b as p,c as r,n as f,g as l}from"./index.fc5ef2be.js";function d(c){let o,n,i,h,a,m,s;return{c(){o=u("h4"),o.textContent="Anatomy of the On Error Function",n=b(),i=u("p"),i.innerHTML=`When declaring a On Error Function it will be provided some parameters for you
  to deal with the issue.
  <br/>
  Lets check them in order of declaration:`,h=b(),a=u("pre"),a.innerHTML=`<b class="scr-b">// Example of On Error function declaration</b>
(err, routeObjParams) =&gt; { 
  console.error(err);
}
`,m=b(),s=u("ul"),s.innerHTML=`<li><b>err:</b> The error object containing the error information</li> 
  <li><b>routeObjParams: </b>All the parameters passed until that error has
    occurred.
    <br/>
    This is a composed object and it has the following parameters:
    <ul><li><b>currentRoute:</b> The current route object containing the
        information of the route that the user is trying to access. It is
        composed by the following params:
        <ul><li><b>name: </b>The name of the route</li> 
          <li><b>hash: </b>The hash value of the route</li> 
          <li><b>hostname: </b>The hostname of the route. For example: &quot;localhost&quot;</li> 
          <li><b>origin: </b>The origin of the route. For example:
            &quot;http://localhost:5000&quot;</li> 
          <li><b>params: </b>The query params of the route. For example: {
            testParam: &quot;someParamValue&quot; }</li> 
          <li><b>pathname: </b>The path of the route. For example:
            &quot;/svelte-client-router/configurationBeforeEnter&quot;</li> 
          <li><b>port: </b>The port of the host. For example: &quot;5000&quot;</li> 
          <li><b>protocol: </b>The protocol used. For example: &quot;http:&quot;</li></ul></li> 
      <br/> 
      <li><b>fromRoute:</b> The coming from route object containing the
        information of the route that the user is coming from. It is composed by
        the following params:
        <ul><li><b>name: </b>The name of the route</li> 
          <li><b>hash: </b>The hash value of the route</li> 
          <li><b>hostname: </b>The hostname of the route. For example: &quot;localhost&quot;</li> 
          <li><b>origin: </b>The origin of the route. For example:
            &quot;http://localhost:5000&quot;</li> 
          <li><b>params: </b>The query params of the route. For example: {
            testParam: &quot;someParamValue&quot; }</li> 
          <li><b>pathname: </b>The path of the route. For example:
            &quot;/svelte-client-router/configurationBeforeEnter&quot;</li> 
          <li><b>port: </b>The port of the host. For example: &quot;5000&quot;</li> 
          <li><b>protocol: </b>The protocol used. For example: &quot;http:&quot;</li></ul></li> 
      <br/> 
      <li><b>routeObjParams:</b> all the parameters passed until the moment of the
        error, including any defined payload properties.</li></ul></li>`,p(o,"class","scr-h4"),p(i,"class","scr-text-justify"),p(a,"class","scr-pre")},m(e,t){r(e,o,t),r(e,n,t),r(e,i,t),r(e,h,t),r(e,a,t),r(e,m,t),r(e,s,t)},p:f,i:f,o:f,d(e){e&&l(o),e&&l(n),e&&l(i),e&&l(h),e&&l(a),e&&l(m),e&&l(s)}}}class y extends q{constructor(o){super(),T(this,o,null,d,x,{})}}export{y as S};
