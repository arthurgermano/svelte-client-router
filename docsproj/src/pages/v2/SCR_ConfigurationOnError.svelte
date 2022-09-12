<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../../src/index.js";
  import SCR_OnErrorAnatomy from "./common/SCR_OnErrorAnatomy.svelte";
</script>

<SCR_Page
  back={{
    name: "v2_Configuration_Global_Before_Enter_Option",
    text: "Configuration Before Enter",
  }}
  forward={{
    name: "v2_Route_Object_Properties",
    text: "Route Object Properties",
  }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Configuration - On Error Function</h4>
    <p class="scr-text-justify">
      The <b>onError</b> option sets a function that is going to be executed for
      any route when something goes wrong.
      <br />
      <br />
      When that happens the natural behaviour is to execute a function. In this context
      SCR has a very basic error function that comes with it. You can of course set
      you own error function and it is encouraged to do so.
      <br />
      <br />
      If the route onError option is set then it has priority!
      <br />
      See the <SCR_RouterLink
        params={{ name: "v2_Route_Component_Components" }}
        elementProps={{ style: "display: inline; cursor: pointer;" }}
      >
        <a href="/" style="pointer-events: none;">Route Component Components</a>
      </SCR_RouterLink> for more info.
    </p>
    <pre class="scr-pre">
<b class="scr-b">// importing the SCR - The configuration store</b>
import &#123; configStore &#125; from "svelte-client-router"

<b class="scr-b">// Setting Global On Error Function</b>
configStore.setOnError((error) =&gt; &#123; console.error(error) &#125;);
</pre>
    <br />
    <SCR_OnErrorAnatomy />

    <p class="scr-text-justify">
      So that is it for this section. This feature enables us to handle any
      errors that may occur inside our routing definitions.
    </p>
    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Configuration_Global_On_Error",
  path: "/svelte-client-router/v2/configurationGlobalOnError",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_ConfigurationOnError.svelte"),
  title: "SCR - Configuration Global On Error - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div></SCR_Page
>

<style>
</style>
