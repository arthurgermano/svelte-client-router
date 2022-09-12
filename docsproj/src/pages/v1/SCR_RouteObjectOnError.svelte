<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../../src/index.js";
  import SCR_OnErrorAnatomy from "./common/SCR_OnErrorAnatomy.svelte";
</script>

<SCR_Page
  back={{
    name: "v1_Route_Object_After_Enter",
    text: "Route Object After Enter",
  }}
  forward={{
    name: "v1_Route_Component_Properties",
    text: "Route Component Properties",
  }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Object - On Error Function</h4>
  <p class="scr-text-justify">
    The <b>onError</b> option sets a function that is going to be executed for
    the specific route when something goes wrong.
    <br />
    <br />
    When that happens the natural behaviour is to open the error page. In this context
    SCR has a very basic error component that comes with it. You can of course set
    you own error component and it is encouraged to do so.
    <br />
    See the <SCR_RouterLink
      params={{ name: "v1_Route_Component_Components" }}
      elementProps={{ style: "display: inline; cursor: pointer;" }}
    >
      <a href="/" style="pointer-events: none;">Route Component Components</a>
    </SCR_RouterLink> for more info.
  </p>
  <pre
    class="scr-pre"><b class="scr-b">// Setting Route On Error Function</b>
&#125;
  onError((err, routeObjParams) =&gt; &#123; console.error(err) &#125;);
&#123;
</pre>
  <br />
  <SCR_OnErrorAnatomy />

  <p class="scr-text-justify">
    So that is it for this section. This feature enables us to handle any errors
    that may occur inside this specific route definition.
  </p>
  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "routeObjectOnErrorRoute",
    path: "/svelte-client-router/routeObjectOnError",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object - On Error Function",
&#125;
</pre>
</SCR_Page>

<style>
</style>
