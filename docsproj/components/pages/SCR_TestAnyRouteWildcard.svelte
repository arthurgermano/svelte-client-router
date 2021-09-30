<script>
  import { SCR_ROUTER_LINK } from "../../../src/index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../common/SCR_PushRouteButton.svelte";

  export let pathParams;
  export let currentRoute;

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

  $: if (currentRoute) {
    if (currentRoute.hash) {
      const splitHashRoute = currentRoute.hash.split("/");
      routeWildcardTextSent = splitHashRoute[3];
    }
  }
</script>

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
  <div class="mb-3">
    <label for="scr-route-wildcard-text" class="form-label"
      >Route Wildcard Value</label
    >
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-route-wildcard-text"
      placeholder="routeWildcardText"
      bind:value={routeWildcardText}
    />
  </div>
  <div class="mb-3">
    <label for="scr-some-path-param" class="form-label">Route Param</label>
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-some-path-param"
      placeholder=":somePathParam"
      bind:value={somePathParam}
    />
  </div>
  <SCR_ROUTER_LINK
    to={{
      path: `/svelte-client-router/anyRouteWildcard/${routeWildcardText}/${somePathParam}/`,
    }}
  >
    <div class="scr-btn">Test Route Any Route Wildcard With Param</div>
  </SCR_ROUTER_LINK>
  <hr class="scr-hr" />
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "testAnyWildcardRoute",
  path: "/svelte-client-router/anyRouteWildcard/*/:somePathParam",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_TestAnyRouteWildcard.svelte"),
  title: "SCR - Test - Any Route Wildcard",
  forceReload: true
&#125;
  </pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="testLoadingComponentWithBeforeEnterRoute"
        />
        <div on:click={() => alert("This route simulates a not found route!")}>
          <SCR_PushRouteButton
            style="float:right; opacity: 0.9; color: black !important; background-color: lightcoral !important; transition: 200ms; animation: pulseAnimation 2s infinite;"
            text="Next"
            routePath="/svelte-client-router/some_route_not_declared"
            title="Redirect To Not Found Route Test!"
          />
        </div>
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
  /* .scr-li {
    position: relative;
    text-transform: capitalize;
  } */
</style>
