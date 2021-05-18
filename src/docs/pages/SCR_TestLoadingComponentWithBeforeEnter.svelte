<script>
  import { SCR_ROUTER_LINK } from "../../index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";

  export let pathParams = {};
  export let queryParams = {};

  let regex = /[0-9]/g;
  let queryRegex = /[A-Za-zÀ-ú0-9]/g;
  let timeoutParam = 2000;
  let queryParam = "";

  function applyRegex(param = "") {
    if (!param) {
      return param;
    }
    param = param.toString();
    const match = param.match(regex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    return value;
  }

  $: if (timeoutParam) {
    timeoutParam = applyRegex(timeoutParam);
  }

  function applyQueryRegex(param = "") {
    if (!param) {
      return param;
    }
    param = param.toString();
    const match = param.match(queryRegex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    return value;
  }

  $: if (queryParam) {
    queryParam = applyQueryRegex(queryParam);
  }
</script>

<div class="scr-page">
  <h4 class="scr-h4">Test - Loading Component With Route Before Enter</h4>
  <p class="scr-text-justify">
    This route is demonstrating several concepts, as some as follows:
  </p>
  <ul>
    <li>The Loading Component</li>
    <li>Lazy Loading a Custom Loading Component for this specific Route</li>
    <li>Capturing params in Loading Component</li>
    <ul>
      <li>Path Params</li>
      <li>Query Params</li>
    </ul>
    <li>Passing query params</li>
    <ul>
      <li>
        Try it via browser URL - passing at end of this route
        ?subLoadingText=MyCustomText!
      </li>
    </ul>
    <li>Before Enter Route</li>
  </ul>
  <p class="scr-text-justify">
    The default value is 2000 milliseconds. If nothing is declared it is assumed
    2000. Or if it is passed a valid number greater than 10 milliseconds it will
    wait the milliseconds specified.
    <br />
    <br />
    <b
      >Important: All the variables captured by this component are passed to all
      components!</b
    >
  </p>
  <p class="scr-text-justify">
    The route timeout param path passed is: <b>{pathParams.timeout || ""}</b>
    <br />
    The route query param passed is: <b>{queryParams.subLoadingText || ""}</b>
    <br />
    <br />
    Try it!
  </p>
  <div class="mb-3">
    <label for="scr-timeout-param" class="form-label"
      >Route Timeout Path Param</label
    >
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-timeout-param"
      placeholder=":timeoutParam"
      bind:value={timeoutParam}
    />
  </div>
  <div class="mb-3">
    <label for="scr-query-param" class="form-label">Route Query Param</label>
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-query-param"
      placeholder=":queryParam"
      bind:value={queryParam}
    />
  </div>
  <SCR_ROUTER_LINK
    to={{
      path: `/svelte-client-router/testLoadingComponentWithBeforeEnter/${
        timeoutParam || 10
      }?subLoadingText=${queryParam}`,
    }}
  >
    <div class="scr-btn">
      Test Route With Two Params and Route Custom Loading Component
    </div>
  </SCR_ROUTER_LINK>
  <hr class="scr-hr" />
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "testLoadingComponentWithBeforeEnterRoute",
  path: "/svelte-client-router/testLoadingComponentWithBeforeEnter/:timeout",

  <b class="scr-b">// Lazy loading an specific loading component for this route</b>
  lazyLoadLoadingComponent: () =&gt;
    import("./docs/SCR_Loading.svelte"),

  component: SCR_TestLoadingComponentWithBeforeEnter,

  <b class="scr-b">// Demonstrating one function as before enter</b>
  beforeEnter: (resolve, routeFrom, routeTo, routeObjParams, payload) ==&gt; &#123;
    setTimeout(() =&gt resolve(true), routeObjParams?.pathParams?.timeout || 10)
  &#125;,
  
  title: "SCR - Test - Loading Component with Before Enter",
  forceReload: true
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="testRegexPath2Route"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="testAnyWildcardRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
  .scr-btn {
    border: 1px solid;
  }
</style>
