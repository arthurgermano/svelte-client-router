<h4 class="scr-h4">Anatomy of the Before Enter Function</h4>
<p class="scr-text-justify">
  When declaring a Before Enter function it will be provided some cool
  parameters for you to play with. Lets check them in order of declaration:
</p>
<pre
  class="scr-pre">
<b class="scr-b">// Example of one before enter function declaration</b>
(resolve, routeFrom, routeTo, routeObjParams, payload) =&gt; &#123; 
  resolve(true); 
&#125;
</pre>
<ul>
  <li>
    <b>resolve: </b>The first param is the a solvable function. When all the
    code has executed you must call this function to end it. Note that there
    isn't a reject call as one might expect.
    <br />
    You always solve the Before Function with resolve! The resolve function can receive
    the following parameters:
    <ul>
      <li>
        <b>true: </b> When is everything ok and should continue execution. For example:
        resolve(true)
      </li>
      <li>
        <b>false: </b> When something went wrong and should stop execution. For example:
        resolve(false) or resolve()
      </li>
      <li>
        <b>&#123; redirect: "/somePath" &#125: </b> To redirect to another
        route. This means that it will not continue executing the Before Enter
        sequence and just will redirect to the specified path.
        <br />
        For example: resolve(&#123; redirect: "/somePath" &#125)
        <br />
        <br />
      </li>
      <li>
        <b>&#123; path: "/somePath" &#125: </b> To redirect to another route.
        This means that it will not continue executing the Before Enter sequence
        and just will redirect to the specified path.
        <br />
        For example: resolve(&#123; path: "/somePath" &#125)
        <br />
        <br />
      </li>
      <li>
        <b>&#123; name: "routeName" &#125: </b> To redirect to another route by
        name. This means that it will not continue executing the Before Enter
        sequence and just will redirect to the specified route name.
        <br />
        For example: resolve(&#123; name: "someRouteName" &#125)
        <br />
        <br />
      </li>
    </ul>
  </li>
  <li>
    <b>routeFrom: </b>This is an object containing the values of the route which
    is coming from. This object has the following values:
    <ul>
      <li><b>name: </b>The name of the route</li>
      <li><b>hash: </b>The hash value of the route</li>
      <li>
        <b>hostname: </b>The hostname of the route. For example: "localhost"
      </li>
      <li>
        <b>origin: </b>The origin of the route. For example:
        "http://localhost:5000"
      </li>
      <li>
        <b>params: </b>The query params of the route. For example: &#123;
        testParam: "someParamValue" &#125
      </li>
      <li>
        <b>pathname: </b>The path of the route. For example:
        "/svelte-client-router/configurationBeforeEnter"
      </li>
      <li><b>port: </b>The port of the host. For example: "5000"</li>
      <li><b>protocol: </b>The protocol used. For example: "http:"</li>
    </ul>
  </li>
  <br />
  <li>
    <b>routeTo: </b>This is an object containing the values of the route which
    is going to. This object has the following values:
    <ul>
      <li><b>name: </b>The name of the route</li>
      <li><b>hash: </b>The hash value of the route</li>
      <li>
        <b>hostname: </b>The hostname of the route. For example: "localhost"
      </li>
      <li>
        <b>origin: </b>The origin of the route. For example:
        "http://localhost:5000"
      </li>
      <li>
        <b>params: </b>The query params of the route. For example: &#123;
        testParam: "someParamValue" &#125
      </li>
      <li>
        <b>pathname: </b>The path of the route. For example:
        "/svelte-client-router/configurationBeforeEnter"
      </li>
      <li><b>port: </b>The port of the host. For example: "5000"</li>
      <li><b>protocol: </b>The protocol used. For example: "http:"</li>
    </ul>
  </li>
  <br />
  <li>
    <b>routeObjectParam: </b>All the parameters passed to this route set in the
    route object definition until the execution of this before enter. Order of declaration matters.
    It will include any defined payload properties.
  </li>
  <br />
  <li>
    <b>payload: </b>This is an special object. You can set parameters to pass
    forward down the chain of before enter funcions execution. This variable
    will be made available in all the component and layout components.
    <br />
    <span style="color:red">
      <b>OBS: </b> DO NOT REDEFINE THIS OBJECT - because you will lose all previous
      properties set and it will reset the object not sending the new definition
      that you made for this object.
    </span>
  </li>
</ul>
<p class="scr-text-justify">
  So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.
</p>
