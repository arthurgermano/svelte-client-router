<script>
  import { SCR_ROUTER_LINK } from "../../index.js";
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";

  export let pathParams;
  let nextFirstParam = "";
  let nextSecondParam = "";
  let regex = /[A-Za-zÀ-ú0-9]/g;

  function applyRegex(param) {
    const match = param.match(regex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    return value;
  }

  $: if (nextFirstParam) {
    nextFirstParam = applyRegex(nextFirstParam);
  }

  $: if (nextSecondParam) {
    nextSecondParam = applyRegex(nextSecondParam);
  }
</script>

<div class="scr-page">
  <h4 class="scr-h4">Test - Regex Path 2</h4>
  <p class="scr-text-justify">
    This route tests two regex params path. When declaring it - to go to the
    route - you should remember that the last part of the route is a regex. 
    <br />
    So if it is empty add a trailing slash after it
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">&lt;!-- Look how the bellow button was declared --&gt;</b>
&lt;SCR_ROUTER_LINK
  to=&#123;&#123;
    path: `/svelte-client-router/$&#123;nextFirstParam&#125;/testRegexPathParam2/$&#123;nextSecondParam&#125;/`,
  &#125;&#125;
&gt;

<b class="scr-b">&lt;!-- It was added a trailing slash at the end --&gt;</b>
<b class="scr-b">&lt;!-- If you pass an empty value then SCR will still match this route --&gt;</b>
<b class="scr-b">&lt;!-- If not present then it will try to match a different route configuration --&gt;</b>
&lt;div class="scr-btn"&gt;Test Route With Param&lt;/div&gt;
&lt;/SCR_ROUTER_LINK&gt;
</pre>  
  <p class="scr-text-justify">
    The route first param path passed is: <b>{pathParams.firstParam}</b>
    <br />
    The route second param path passed is: <b>{pathParams.secondParam}</b>
    <br />
    <br />
    Try it!
  </p>
  <div class="mb-3">
    <label for="scr-next-first-param" class="form-label"
      >Route First Path Param</label
    >
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-next-first-param"
      placeholder=":firstParam"
      bind:value={nextFirstParam}
    />
  </div>
  <div class="mb-3">
    <label for="scr-next-second-param" class="form-label"
      >Route Second Path Param</label
    >
    <input
      type="text"
      class="form-control form-control-sm"
      id="scr-next-second-param"
      placeholder=":secondParam"
      bind:value={nextSecondParam}
    />
  </div>
  <SCR_ROUTER_LINK
    to={{
      path: `/svelte-client-router/${nextFirstParam}/testRegexPathParam2/${nextSecondParam}/`,
    }}
  >
    <div class="scr-btn">Test Route With Two Params</div>
  </SCR_ROUTER_LINK>
  <hr class="scr-hr" />
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "testRegexPath2Route",
  path: "/svelte-client-router/:firstParam/testRegexPathParam2/:secondParam",
  lazyLoadComponent: () =&gt;
    import("./docs/pages/SCR_TestRegexPath2.svelte"),
  title: "SCR - Test 2",
  forceReload: true
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="testRegexPathRoute"
        />
        <SCR_PushRouteButton
          style="float:right;"
          text="Next"
          routeName="testLoadingComponentWithBeforeEnterRoute"
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
