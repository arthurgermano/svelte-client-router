import{S as T,i as x,s as v,e as n,a as h,b,c as o,n as d,g as l}from"./index.fc5ef2be.js";function w(q){let r,c,i,p,a,m,u,f,s;return{c(){r=n("h4"),r.textContent="Anatomy of the Before Enter Function",c=h(),i=n("p"),i.textContent=`When declaring a Before Enter function it will be provided some cool
  parameters for you to play with. Lets check them in order of declaration:`,p=h(),a=n("pre"),a.innerHTML=`<b class="scr-b">// Example of one before enter function declaration</b>
(resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; { 
  resolve(true); 
}
`,m=h(),u=n("ul"),u.innerHTML=`<li><b>resolve: </b>The first param is the a solvable function. When all the
    code has executed you must call this function to end it. Note that there
    isn&#39;t a reject call as one might expect.
    <br/>
    You always solve the Before Function with resolve! The resolve function can receive
    the following parameters:
    <ul><li><b>true:</b> When is everything ok and should continue execution. For example:
        resolve(true)</li> 
      <li><b>false:</b> When something went wrong and should stop execution. For example:
        resolve(false) or resolve()</li> 
      <li><b>{ redirect: &quot;/somePath&quot; }:</b> To redirect to another
        route. This means that it will not continue executing the Before Enter
        sequence and just will redirect to the specified path.
        <br/>
        For example: resolve({ redirect: &quot;/somePath&quot; })
        <br/> 
        <br/></li> 
      <li><b>{ path: &quot;/somePath&quot; }:</b> To redirect to another route.
        This means that it will not continue executing the Before Enter sequence
        and just will redirect to the specified path.
        <br/>
        For example: resolve({ path: &quot;/somePath&quot; })
        <br/> 
        <br/></li> 
      <li><b>{ name: &quot;routeName&quot; }:</b> To redirect to another route by
        name. This means that it will not continue executing the Before Enter
        sequence and just will redirect to the specified route name.
        <br/>
        For example: resolve({ name: &quot;someRouteName&quot; })
        <br/> 
        <br/></li></ul></li> 
  <li><b>routeFrom: </b>This is an object containing the values of the route which
    is coming from. This object has the following values:
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
  <li><b>routeTo: </b>This is an object containing the values of the route which
    is going to. This object has the following values:
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
  <li><b>routeObjectParam: </b>All the parameters passed to this route set in the
    route object definition until the execution of this before enter. Order of declaration matters.
    It will include any defined payload properties.</li> 
  <br/> 
  <li><b>payload: </b>This is an special object. You can set parameters to pass
    forward down the chain of before enter funcions execution. This variable
    will be made available in all the component and layout components.
    <br/> 
    <span style="color:red"><b>OBS:</b> DO NOT REDEFINE THIS OBJECT - because you will lose all previous
      properties set and it will reset the object not sending the new definition
      that you made for this object.</span></li>`,f=h(),s=n("p"),s.textContent=`So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.`,b(r,"class","scr-h4"),b(i,"class","scr-text-justify"),b(a,"class","scr-pre"),b(s,"class","scr-text-justify")},m(e,t){o(e,r,t),o(e,c,t),o(e,i,t),o(e,p,t),o(e,a,t),o(e,m,t),o(e,u,t),o(e,f,t),o(e,s,t)},p:d,i:d,o:d,d(e){e&&l(r),e&&l(c),e&&l(i),e&&l(p),e&&l(a),e&&l(m),e&&l(u),e&&l(f),e&&l(s)}}}class F extends T{constructor(r){super(),x(this,r,null,w,v,{})}}export{F as S};
