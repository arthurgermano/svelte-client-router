<h4 class="scr-h4">Anatomy of the Before Enter Function</h4>
<p class="scr-text-justify">
  When declaring a Before Enter function it will be provided some cool
  parameters for you to play with. Lets check them:
</p>
<pre class="scr-pre">
<b class="scr-b">// Example of one before enter function declaration</b>
(&#123; reject, resolve, routeFrom, routeTo &#125;, payload) =&gt; &#123; 
  resolve(true); 
&#125;
</pre>
<ul>
  <li>
    <b>resolve: </b>This param is the solvable function. When all the code has
    executed you must call this function to end it.
    <br />
    The resolve function can receive the following parameters:
    <ul>
      <li>
        <b>true: </b> When is everything ok and should continue execution. For example:
        resolve(true)
      </li>
      <li>
        <b>false: </b> When something went wrong and should stop execution. For example:
        resolve(false) or resolve() - The route will just stop and do nothing.
      </li>
      <li>
        <b>&#123; redirect: "/somePath" &#125: </b> To redirect to another
        route. This means that it will not continue executing the Before Enter
        of the current route and will start to execute the redirected route
        before enter sequence.
        <br />
        For example: resolve(&#123; redirect: "/somePath" &#125)
        <br />
        <br />
      </li>
      <li>
        <b>&#123; path: "/somePath" &#125: </b> To redirect to another route.
        This means that it will not continue executing the Before Enter of the
        current route and will start to execute the redirected route before
        enter sequence.
        <br />
        For example: resolve(&#123; path: "/somePath" &#125)
        <br />
        <br />
      </li>
      <li>
        <b>&#123; name: "routeName" &#125: </b> To redirect to another route.
        This means that it will not continue executing the Before Enter of the
        current route and will start to execute the redirected route before
        enter sequence.
        <br />
        For example: resolve(&#123; name: "someRouteName" &#125)
        <br />
        <br />
      </li>
    </ul>
  </li>
  <li>
    <b>reject: </b>This param is the solvable function. This will throw an
    exception that will be catch by Route on Error Function or Global on Error
    Function.
    <br />
    The reject function can receive anything as param and will be return as error
  </li>
  <li>
    <b>routeFrom: </b>This is a boolean "false" or a object containing the
    values of the route which is coming from. This object has the following
    values:
    <ul>
      <li>
        <b>name: </b>The name of the route -
        "v2_Configuration_Global_Before_Enter_Option"
      </li>
      <li><b>hash: </b>The hash value of the route - ""</li>
      <li>
        <b>host: </b>The host of the route. For example: "localhost:5173"
      </li>
      <li>
        <b>origin: </b>The origin of the route. For example:
        "http://localhost:5173"
      </li>
      <li><b>port: </b>The port of the host. For example: "5173"</li>
      <li><b>protocol: </b>The protocol used. For example: "http"</li>
      <li>
        <b>path:</b> "/svelte-client-router/v2/configurationGlobalBeforeEnterOption"
      </li>
      <li>
        <b>fullPath:</b> "/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam="someParamValue"
      </li>
      <li>
        <b>pathname:</b> "/svelte-client-router/"
      </li>
      <li>
        <b>params: </b>The params passed in the route definition. For example:
        &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>queryParams: </b>The params passed as query params in the path. For
        example: &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>pathParams: </b>The params passed in the path param. For example:
        &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul>
          <li>
            <b>beforeEnter:</b> The function or functions defined to be execute before
            enter this route.
          </li>
          <li>
            <b>lazyLoadComponent:</b> The function to import the component.
          </li>
          <li><b>name:</b> The name of this route</li>
          <li><b>path:</b> The path of this route</li>
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!
        </ul>
      </li>
    </ul>
  </li>
  <br />
  <li>
    <b>routeTo: </b>This is a boolean "false" or a object containing the values
    of the route which is coming from. This object has the following values:
    <ul>
      <li>
        <b>name: </b>The name of the route -
        "v2_Configuration_Global_Before_Enter_Option"
      </li>
      <li><b>hash: </b>The hash value of the route - ""</li>
      <li>
        <b>host: </b>The host of the route. For example: "localhost:5173"
      </li>
      <li>
        <b>origin: </b>The origin of the route. For example:
        "http://localhost:5173"
      </li>
      <li><b>port: </b>The port of the host. For example: "5173"</li>
      <li><b>protocol: </b>The protocol used. For example: "http"</li>
      <li>
        <b>path:</b> "/svelte-client-router/v2/configurationGlobalBeforeEnterOption"
      </li>
      <li>
        <b>fullPath:</b> "/svelte-client-router/v2/configurationGlobalBeforeEnterOption?testParam="someParamValue"
      </li>
      <li>
        <b>pathname:</b> "/svelte-client-router/"
      </li>
      <li>
        <b>params: </b>The params passed in the route definition. For example:
        &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>queryParams: </b>The params passed as query params in the path. For
        example: &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>pathParams: </b>The params passed in the path param. For example:
        &#123; testParam: "someParamValue" &#125
      </li>
      <li>
        <b>definition: </b>The route defined by you object with all the
        properties - For example a simple route defition with NOT all the
        params:
        <ul>
          <li>
            <b>beforeEnter:</b> The function or functions defined to be execute before
            enter this route.
          </li>
          <li>
            <b>lazyLoadComponent:</b> The function to import the component.
          </li>
          <li><b>name:</b> The name of this route</li>
          <li><b>path:</b> The path of this route</li>
          <li><b>title:</b> The title of this route</li>
          Several other options if defined will be available here!
        </ul>
      </li>
    </ul>
  </li>
  <br />
  <li>
    <b>payload: </b>This is an special object. You can set parameters to pass
    forward down the chain of before enter funcions execution. This variable
    will be made available in all the components.
    <br />
    <span style="color:red">
      <b>OBS: </b> DO NOT REDEFINE THIS OBJECT - because you will lose all previous
      properties set and it will reset the object not sending the new definition
      that you made for this object. 
      <br />
      If redefined it will log a console warn if configStore.setConsoleLogErrorMessages(true).
    </span>
  </li>
</ul>
<p class="scr-text-justify">
  So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.
</p>
