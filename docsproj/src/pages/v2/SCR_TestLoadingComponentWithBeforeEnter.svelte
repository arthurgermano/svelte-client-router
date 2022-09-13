<script>
  import { SCR_RouterLink } from "../../../../src/index.js";
  import SCR_Page from "../../layout/SCR_Page.svelte";

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

<SCR_Page
  back={{ name: "v2_Test_Regex_Path_2", text: "Test - Regex Path 2" }}
  forward={{
    name: "v2_Test_Any_Route_Wildcard",
    text: "Test - Any Route Wildcard",
  }}
>
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
      The default value is 2000 milliseconds. If nothing is declared it is
      assumed 2000. Or if it is passed a valid number greater than 10
      milliseconds it will wait the milliseconds specified.
      <br />
      <br />
      <b
        >Important: All the variables captured by this component are passed to
        all components!</b
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
    <div class="scr-test">
      <div>
        <label for="scr-timeout-param">Route Timeout Path Param</label>
        <input
          type="text"
          id="scr-timeout-param"
          placeholder=":timeoutParam"
          bind:value={timeoutParam}
        />
      </div>
      <div>
        <label for="scr-query-param">Route Query Param</label>
        <input
          type="text"
          id="scr-query-param"
          placeholder=":queryParam"
          bind:value={queryParam}
        />
      </div>
      <SCR_RouterLink
        params={{
          path: `/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/${
            timeoutParam || 10
          }?subLoadingText=${queryParam}`,
        }}
      >
        <div class="scr-btn">
          Test Route With Two Params and Route Custom Loading Component
        </div>
      </SCR_RouterLink>
    </div>
    <hr class="scr-hr" />
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Test_Loading_Component_Before_Enter",
  path: "/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_TestLoadingComponentWithBeforeEnter.svelte"),
  title: "SCR - Test Regex Path 2 - Version 2",
  beforeEnter: [setVersion2, (&#123; resolve, routeTo &#125;) =&gt; &#123;
      let timeout = 20;
      if (routeTo && routeTo.pathParams && routeTo.pathParams.timeout) &#123;
        routeTo.pathParams.timeout = parseInt(routeTo.pathParams.timeout);
        if (routeTo.pathParams.timeout &gt; 0) &#123;
          timeout = routeTo.pathParams.timeout;
        &#125;
      &#125;

      setTimeout(() =&gt; &#123;
        resolve(true);
      &#125;, timeout);
    &#125;
  ],
&#125;
</pre>
  </div></SCR_Page
>

<style>
</style>
