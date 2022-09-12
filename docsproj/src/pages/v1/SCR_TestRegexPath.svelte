<script>
  import { SCR_RouterLink } from "../../../../src/index.js";
  import SCR_Page from "../../layout/SCR_Page.svelte";

  export let pathParams;
  let nextParam = "";
  let regex = /[A-Za-zÀ-ú0-9]/g;  

  $: if (nextParam) {
    const match = nextParam.match(regex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    nextParam = value;
  }
</script>

<SCR_Page
  back={{ name: "v1_Router_Store", text: "Router Store" }}
  forward={{ name: "v1_Test_Regex_Path_2", text: "Test - Regex Path 2" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Test - Regex Path</h4>
  <p class="scr-text-justify">
    This route tests regex param path.
    <br />
    <br />
    The route param path passed is: <b>{pathParams.testParam}</b>
    <br />
    <br />
    Try it!
  </p>
  <div class="scr-test">
    <label for="scr-next-param">Route Param</label>
    <input
      type="text"
      id="scr-next-param"
      placeholder=":testParam"
      bind:value={nextParam}
    />
    <SCR_RouterLink params={{ path: `/svelte-client-router/v1/${nextParam}/testRegexPath` }}>
      <div class="scr-btn">Test Route With Param</div>
    </SCR_RouterLink>
  </div>
  <hr class="scr-hr" />
  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "testRegexPathRoute",
  path: "/svelte-client-router/:testParam/testRegexPathParam",
  lazyLoadComponent: () =&gt
    import("./docs/pages/SCR_TestRegexPath.svelte"),
  title: "SCR - Test 1",
  forceReload: true
&#125;
</pre>
</SCR_Page>

<style>
  
</style>
