<script>
  import { SCR_RouterLink } from "../../../../src/index.js";
  import SCR_Page from "../../layout/SCR_Page.svelte";

  export let pathParams;
  export let toRoute;

  let somePathParam = "";
  let routeWildcardText = "";
  let routeWildcardTextSent = "";
  let regex = /[A-Za-zÀ-ú0-9]/g;

  $: if (somePathParam) {
    const match = somePathParam.toString().match(regex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    somePathParam = value;
  }

  $: if (routeWildcardText) {
    const match = somePathParam.toString().match(regex);
    const value = match ? match.join("").substr(0, 20) + "" : "";
    somePathParam = value;
  }

  $: if (toRoute) {
    if (toRoute.path) {
      const splitHashRoute = toRoute.path.split("/");
      routeWildcardTextSent = splitHashRoute[4];
    }
  }
</script>

<SCR_Page
  back={{
    name: "v2_Test_Loading_Component_Before_Enter",
    text: "Test - Loading Component Before Enter",
  }}
  forward={{
    name: "v2_Not_Found_Route",
    text: "Test - Not Found Route",
  }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Test - Any Route Wildcard</h4>
    <p class="scr-text-justify">
      This route tests any route wildcard with regex param path.
      <br />
      <br />
      The route path for wildcard value is: <b>{routeWildcardTextSent}</b>
      <br />
      The route param path passed is: <b>{pathParams.somePathParam}</b>
      <br />
      <br />
      Try it!
    </p>
    <div class="scr-test">
      <div>
        <label for="scr-route-wildcard-text">Route Wildcard Value</label>
        <input
          type="text"
          id="scr-route-wildcard-text"
          placeholder="routeWildcardText"
          bind:value={routeWildcardText}
        />
      </div>
      <div>
        <label for="scr-some-path-param">Route Param</label>
        <input
          type="text"
          id="scr-some-path-param"
          placeholder=":somePathParam"
          bind:value={somePathParam}
        />
      </div>
      <SCR_RouterLink
        params={{
          path: `/svelte-client-router/v2/anyRouteWildcard/${routeWildcardText}/${somePathParam}/`,
        }}
      >
        <div class="scr-btn">Test Route Any Route Wildcard With Param</div>
      </SCR_RouterLink>
    </div>
    <hr class="scr-hr" />
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Test_Any_Route_Wildcard",
  path: "/svelte-client-router/v2/anyRouteWildcard/*/:somePathParam",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_TestAnyRouteWildcard.svelte"),
  title: "SCR - Test - Any Route Wildcard - Version 2",
&#125;
</pre>
  </div></SCR_Page
>
