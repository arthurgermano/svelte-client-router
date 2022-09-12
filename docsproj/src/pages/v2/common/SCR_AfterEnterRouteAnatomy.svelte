<h4 class="scr-h4">Anatomy of the Before Enter Function</h4>
<p class="scr-text-justify">
  When declaring a After Enter Function it will be provided a parameter.
  <br />
  Lets check it:
</p>
<pre class="scr-pre"><b class="scr-b"
    >// Example of After Enter Function declaration</b
  >
(params) =&gt; &#123; 
  console.log(params);
&#125;
</pre>
<ul>
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
            <b>afterEnter:</b> The function defined to be execute after enter this
            route.
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
            <b>afterEnter:</b> The function defined to be execute after enter this
            route.
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
    <b>payload: </b>All the params passed down in before enter functions sequence will be available here.
  </li>
</ul>
<p class="scr-text-justify">
  So that is it for this section. This is a powerfull feature enables us to
  control for each route necessary security of overall behaviour.
</p>
