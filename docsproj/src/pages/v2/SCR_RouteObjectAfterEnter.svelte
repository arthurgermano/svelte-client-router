<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
  import SCR_AfterEnterRouteAnatomy from "./common/SCR_AfterEnterRouteAnatomy.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Route_Object_Before_Enter", text: "Route Object Before Enter" }}
  forward={{ name: "v2_Route_Object_On_Error", text: "Route Object On Error" }}
>
<div class="scr-page">
  <h4 class="scr-h4">Route Object - After Enter Function</h4>
  <p class="scr-text-justify">
    The <b>afterEnter</b> option sets a function that must be executed for
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
<b class="scr-b">// Setting Route After Enter Function</b>
&#123;
  afterEnter(( 
    &#123; 
      toRoute,
      fromRoute,
      payload,
  &#125; ) =&gt; &#123; 
    console.log(
      toRoute,
      fromRoute,
      payload,
    ); 
  &#125;);
&#125;
</pre>
  <hr class="scr-hr" />
  <SCR_AfterEnterRouteAnatomy />

  <center >
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
  name: "v2_Route_Object_After_Enter",
  path: "/svelte-client-router/v2/routeObjectAfterEnter",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_RouteObjectAfterEnter.svelte"),
  title: "SCR - Route Object After Enter - Version 1",
  beforeEnter: [setVersion2],
&#125;
</pre>
</SCR_Page>

<style>
</style>
