<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "rootRoute", text: "Home" }}
  forward={{ name: "v1_Installation", text: "Installation" }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Presentation</h4>
    <p class="scr-text-justify">
      Hi.. This is The Svelte Router - thought to be focused on controlling what
      happens before entering the route.
      <br />
      <br />
      The motivation to develop this router was that, until now, there isn't a nice
      router for svelte. When we think on routing what do we want? Did you stop do
      think about it?
      <br />
      <br />
      Let's see what we thought...
    </p>
    <ul>
      <li class="scr-li">Lazy Load Components and Layouts</li>
      <li class="scr-li">Global and Per Route Layout</li>
      <li class="scr-li">
        Execute something Before Enter <b><u>The</u></b> Route
      </li>
      <li class="scr-li">
        Execute something Before Enter <b><u>Each</u></b> Route
      </li>
      <li class="scr-li">
        The possibility to ignore global before enter on a single route
      </li>
      <li class="scr-li">A Loading Component To Keep Our Users Waiting</li>
      <li class="scr-li">
        A Error Component To land when something goes wrong
      </li>
      <li class="scr-li">
        A Not Found Component To land when the user try to enter a not existing
        route
      </li>
      <li class="scr-li">Customize this routes and components at our will</li>
      <li class="scr-li">To set the title automatically</li>
      <li class="scr-li">
        To pass information between Before Enter Function and send to Route
        Loaded Components
      </li>
      <li class="scr-li">The possibility to use hash routing</li>
    </ul>
    <p class="scr-text-justify">
      Not only that is important but to control the overall behaviour when
      routing. Where to set the scroll position, reload the route everytime or
      just when I am not in the route - this may prevent some looping issues in
      your application.
      <br />
      <br />
      Anyway a lot of cool stuff when routing. So in each section it will be provided
      the configuration used to configure each route ok? See below the configuration
      for this first route.
      <br />
      Pretty simple isn't it ?
    </p>
    <center >
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "rootRoute",
  path: "/svelte-client-router",
  lazyLoadComponent: () =&gt; import("./docs/pages/SCR_Presentation.svelte"),
  title: "SCR - Presentation",
&#125;
</pre>
  </div>
</SCR_Page>

<style>
  .scr-li {
    position: relative;
    text-transform: capitalize;
  }
</style>
