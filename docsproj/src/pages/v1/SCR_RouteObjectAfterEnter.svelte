<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v1_Route_Object_Before_Enter", text: "Route Object Before Enter" }}
  forward={{ name: "v1_Route_Object_On_Error", text: "Route Object On Error" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Object - After Before Enter Function</h4>
  <p class="scr-text-justify">
    The <b>afterBeforeEnter</b> option sets a function that must be executed for
    this specific route when finishing routing. This function will not redirect
    or avoid entering the route. The permission to enter has been granted
    already by passing all the before enter functions.
    <br />
    <br />
    So this function is more like a customization before enter. Here you can override
    the title of the route, can pass more parameters or execute important stuff before
    render the route.
    <br />
    <br />
    See the next example of how to set this option:
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// ------ SETTING A FUNCTION ------ </b>
<b class="scr-b">// Setting Route After Before Enter Function</b>
&#123;
  afterBeforeEnter((routeObjParams) =&gt; &#123; console.log(routeObjParams); &#125;);
&#125;
</pre>
  <hr class="scr-hr" />
  <h4 class="scr-h4">Anatomy of the After Before Enter Function</h4>
  <p class="scr-text-justify">
    When declaring a After Before Enter Function it will be provided a
    parameter.
    <br />
    Lets check it:
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Example of After Before Enter Function declaration</b>
(props, routeObjParams) =&gt; &#123; 
  console.log(props);
  console.log(routeObjParams);
&#125;
</pre>
  <ul>
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
              <b>hostname: </b>The hostname of the route. For example:
              "localhost"
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
          information of the route that the user is coming from. It is composed
          by the following params:
          <ul>
            <li><b>name: </b>The name of the route</li>
            <li><b>hash: </b>The hash value of the route</li>
            <li>
              <b>hostname: </b>The hostname of the route. For example:
              "localhost"
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
          <b>pathParams: </b> Path params informed
        </li>
        <br />
        <li>
          <b>payload: </b> Payload params informed
        </li>
        <br />
        <li>
          <b>queryParams: </b> Query params informed
        </li>
      </ul>
      <br />
      <ul>
        <li>
          <b>routeObjectParam: </b>All the parameters passed to this route set
          in the route object definition.
        </li>
      </ul>
    </li>
  </ul>

  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "routeObjectAfterBeforeEnterRoute",
    path: "/svelte-client-router/routeObjectAfterBeforeEnter",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte"),
    title: "SCR - Route Object - After Function",
&#125;
</pre>
</SCR_Page>

<style>
</style>
