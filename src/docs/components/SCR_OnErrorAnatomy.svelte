<h4 class="scr-h4">Anatomy of the On Error Function</h4>
<p class="scr-text-justify">
  When declaring a On Error Function it will be provided some parameters for you
  to deal with the issue.
  <br />
  Lets check them in order of declaration:
</p>
<pre
  class="scr-pre">
<b class="scr-b">// Example of On Error function declaration</b>
(err, routeObjParams) =&gt; &#123; 
  console.error(err);
&#125;
  </pre>
<ul>
  <li>
    <b>err: </b> The error object containing the error information
  </li>
  <li>
    <b>routeObjParams: </b>All the parameters passed until that error has
    occurred.
    <br />
    This is a composed object and it has the following parameters:
    <ul>
      <li>
        <b>currentRoute: </b> The current route object containing the
        information of the route that the user is trying to access. It is
        composed by the following params:
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
        <b>fromRoute: </b> The coming from route object containing the
        information of the route that the user is coming from. It is composed by
        the following params:
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
        <b>routeObjParams: </b> all the parameters passed until the moment of the
        error, including any defined payload properties.
      </li>
    </ul>
  </li>
</ul>
