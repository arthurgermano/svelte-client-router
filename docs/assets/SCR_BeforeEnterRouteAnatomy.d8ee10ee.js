import{S as T,i as x,s as v,e as s,a as h,b,c as o,n as q,g as i}from"./index.fc5ef2be.js";function w(d){let r,p,l,m,a,f,u,c,n;return{c(){r=s("h4"),r.textContent="Anatomy of the Before Enter Function",p=h(),l=s("p"),l.textContent=`When declaring a Before Enter function it will be provided some cool
  parameters for you to play with. Lets check them:`,m=h(),a=s("pre"),a.innerHTML=`<b class="scr-b">// Example of one before enter function declaration</b>
({ reject, resolve, routeFrom, routeTo }, payload) =&gt; { 
  resolve(true); 
}
`,f=h(),u=s("ul"),u.innerHTML=`<li><b>resolve: </b>This param is the solvable function. When all the code has
    executed you must call this function to end it.
    <br/>
    The resolve function can receive the following parameters:
    <ul><li><b>true:</b> When is everything ok and should continue execution. For example:
        resolve(true)</li> 
      <li><b>false:</b> When something went wrong and should stop execution. For example:
        resolve(false) or resolve() - The route will just stop and do nothing.</li> 
      <li><b>{ redirect: &quot;/somePath&quot; }:</b> To redirect to another
        route. This means that it will not continue executing the Before Enter
        of the current route and will start to execute the redirected route
        before enter sequence.
        <br/>
        For example: resolve({ redirect: &quot;/somePath&quot; })
        <br/> 
        <br/></li> 
      <li><b>{ path: &quot;/somePath&quot; }:</b> To redirect to another route.
        This means that it will not continue executing the Before Enter of the
        current route and will start to execute the redirected route before
        enter sequence.
        <br/>
        For example: resolve({ path: &quot;/somePath&quot; })
        <br/> 
        <br/></li> 
      <li><b>{ name: &quot;routeName&quot; }:</b> To redirect to another route.
        This means that it will not continue executing the Before Enter of the
        current route and will start to execute the redirected route before
        enter sequence.
        <br/>
        For example: resolve({ name: &quot;someRouteName&quot; })
        <br/> 
        <br/></li></ul></li> 
  <li><b>reject: </b>This param is the solvable function. This will throw an
    exception that will be catch by Route on Error Function or Global on Error
    Function.
    <br/>
    The reject function can receive anything as param and will be return as error</li> 
  <li><b>routeFrom: </b>This is a boolean &quot;false&quot; or a object containing the
    values of the route which is coming from. This object has the following
    values:
    <ul><li><b>name: </b>The name of the route -
        &quot;v2_Configuration_Global_Before_Enter_Option&quot;</li> 
      <li><b>hash: </b>The hash value of the route - &quot;&quot;</li> 
      <li><b>host: </b>The host of the route. For example: &quot;localhost:5173&quot;</li> 
      <li><b>origin: </b>The origin of the route. For example:
        &quot;http://localhost:5173&quot;</li> 
      <li><b>port: </b>The port of the host. For example: &quot;5173&quot;</li> 
      <li><b>protocol: </b>The protocol used. For example: &quot;http&quot;</li> 
      <li><b>path:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption&quot;</li> 
      <li><b>fullPath:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam=&quot;someParamValue&quot;</li> 
      <li><b>params: </b>The params passed in the route definition. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>queryParams: </b>The params passed as query params in the path. For
        example: { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>pathParams: </b>The params passed in the path param. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul><li><b>beforeEnter:</b> The function or functions defined to be execute before
            enter this route.</li> 
          <li><b>lazyLoadComponent:</b> The function to import the component.</li> 
          <li><b>name:</b> The name of this route</li> 
          <li><b>path:</b> The path of this route</li> 
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!</ul></li></ul></li> 
  <br/> 
  <li><b>routeTo: </b>This is a boolean &quot;false&quot; or a object containing the values
    of the route which is coming from. This object has the following values:
    <ul><li><b>name: </b>The name of the route -
        &quot;v2_Configuration_Global_Before_Enter_Option&quot;</li> 
      <li><b>hash: </b>The hash value of the route - &quot;&quot;</li> 
      <li><b>host: </b>The host of the route. For example: &quot;localhost:5173&quot;</li> 
      <li><b>origin: </b>The origin of the route. For example:
        &quot;http://localhost:5173&quot;</li> 
      <li><b>port: </b>The port of the host. For example: &quot;5173&quot;</li> 
      <li><b>protocol: </b>The protocol used. For example: &quot;http&quot;</li> 
      <li><b>path:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption&quot;</li> 
      <li><b>fullPath:</b> &quot;/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam=&quot;someParamValue&quot;</li> 
      <li><b>params: </b>The params passed in the route definition. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>queryParams: </b>The params passed as query params in the path. For
        example: { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>pathParams: </b>The params passed in the path param. For example:
        { testParam: &quot;someParamValue&quot; }</li> 
      <li><b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul><li><b>beforeEnter:</b> The function or functions defined to be execute before
            enter this route.</li> 
          <li><b>lazyLoadComponent:</b> The function to import the component.</li> 
          <li><b>name:</b> The name of this route</li> 
          <li><b>path:</b> The path of this route</li> 
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!</ul></li></ul></li> 
  <br/> 
  <li><b>payload: </b>This is an special object. You can set parameters to pass
    forward down the chain of before enter funcions execution. This variable
    will be made available in all the components.
    <br/> 
    <span style="color:red"><b>OBS:</b> DO NOT REDEFINE THIS OBJECT - because you will lose all previous
      properties set and it will reset the object not sending the new definition
      that you made for this object. 
      <br/>
      If redefined it will log a console warn if configStore.setConsoleLogErrorMessages(true).</span></li>`,c=h(),n=s("p"),n.textContent=`So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.`,b(r,"class","scr-h4"),b(l,"class","scr-text-justify"),b(a,"class","scr-pre"),b(n,"class","scr-text-justify")},m(e,t){o(e,r,t),o(e,p,t),o(e,l,t),o(e,m,t),o(e,a,t),o(e,f,t),o(e,u,t),o(e,c,t),o(e,n,t)},p:q,i:q,o:q,d(e){e&&i(r),e&&i(p),e&&i(l),e&&i(m),e&&i(a),e&&i(f),e&&i(u),e&&i(c),e&&i(n)}}}class F extends T{constructor(r){super(),x(this,r,null,w,v,{})}}export{F as S};
