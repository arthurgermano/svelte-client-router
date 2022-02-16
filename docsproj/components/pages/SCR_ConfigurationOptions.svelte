<script>
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../common/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Configuration Options</h4>
  <p>
    The configuration are managed in a <a
      href="https://svelte.dev/tutorial/writable-stores"
      target="_blank">Svelte Store.</a
    >
    The Svelte Store are one of the cooliest things in Svelte. Is very reactive and
    helps us to make our router reactive too. You can change the behaviour at any
    point and will instantly react to it.
  </p>
  <h5>Importing</h5>
  <pre
    class="scr-pre">
<b class="scr-b">// Importing configuration store</b>
import &#123; SCR_CONFIG_STORE &#125; from "svelte-client-router"
  </pre>
  <p>Next.. lets check out all the available properties.</p>
  <!-- ----------------  HASH MODE OPTION  ------------------------------------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Hash Mode</h4>
  <p class="scr-text-justify">
    The <b>hashMode</b> option controls either if our router must check a hashed
    based route like this site or must <b>NOT</b> consider a hashed based route
    path where the hash char doesn't mean much.
    <br />
    <br />
    This website for example must be hashed based because Github Pages is not prepared
    to return the index.html page for each route request.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Hash Mode checks route using #/ before the location path
// ## for example http://localhost:5000/pathAAA#/pathBBB
// ## it will consider only pathBBB and ignore pathAAA as path!
// ## Boolean 
// ## Default value: false
</b>
&#123;
  hashMode: false,
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setHashMode(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  NAVIGATION HISTORY LIMIT OPTION  ----------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Navigation History Limit</h4>
  <p class="scr-text-justify">
    The <b>navigationHistoryLimit</b> option sets the size of the navigation
    history. Inside the router store we have an array that contains all the
    route objects where the first position is the last page visited and the last
    position is the first page visited.
    <br />
    <br />
    If is set 0 or less it will be considered unlimited.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Navigation History Limit is the amount of route history is added 
// ## in the route navigation history list 
// ## 0 or -1 equals to "no limit"
// ## Integer
// ## Default value: 10
</b>
&#123;
  navigationHistoryLimit: 10, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  SAVE MODE LIMIT OPTION  -------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Save Mode</h4>
  <p class="scr-text-justify">
    The <b>saveMode</b> option has the following options:
  </p>
  <ul>
    <li>
      <b>localstorage:</b> (default) Saves the router store in the localstorage.
    </li>
    <li><b>indexeddb:</b> Saves the router store in the Index DB Storage.</li>
    <li><b>none:</b> Doesn't save the store anywhere.</li>
  </ul>
  <p>
    The implications are implicit. Saving the route object helps us to keep
    track all the user history if you need that information when reloading the
    page.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Save mode sets the type of saving history route and store
// ## It can be set to one of this following values:
// ## - localstorage: it saves route in the localstorage
// ## - indexeddb: it saves route in the IndexedDb 
// ## - none: Doesn't save anything - meaning when reload it starts fresh all values!
// ## String
// ## Default value: localstorage
</b>
&#123;
  saveMode: localstorage, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setSaveMode("localstorage");
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  NOT FOUND ROUTE OPTION  -------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Not Found Route</h4>
  <p class="scr-text-justify">
    The <b>notFoundRoute</b> option sets the route to redirect to when the user
    enter a non existent url path.
    <br />
    <br />
    <b>OBS: It has to start with "/" </b>
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Not Found Route Path
// ## is the path that should redirect when not found a path in the application
// ## String - must include "/"
// ## Default value: /notFound
</b>
&#123;
  notFound: "/notFound", 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setNotFoundRoute("/notFound");
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  ERROR ROUTE OPTION  ------------------------------------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Error Route</h4>
  <p class="scr-text-justify">
    The <b>errorRoute</b> option sets the route to redirect to when an error
    occurs.
    <br />
    <br />
    <b>OBS: It has to start with "/" </b>
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Error Route Path
// ## is the path that should redirect when an error occurs in the application
// ## String - must include "/"
// ## Default value: /error
</b>
&#123;
  error: "/error", 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setErrorRoute("/error");
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  CONSOLE LOG ERROR MESSAGES OPTION  --------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Console Log Error Messages</h4>
  <p class="scr-text-justify">
    The <b>consoleLogErrorMessages</b> option enables SCR to log all possible
    errors in the console log.
    <br />
    <br />
    When something goes wrong it helps to see the stack trace and the error messages.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Console Log Error Messages logs in the console 
// ## any error messages of the SCR for debugging purposes
// ## Boolean
// ## Default value: true
</b>
&#123;
  consoleLogStores: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsoleLogErrorMessages(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  CONSOLE LOG STORES OPTION  --------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Console Log Stores</h4>
  <p class="scr-text-justify">
    The <b>consoleLogStores</b> option enables SCR to log all changes in the
    stores.
    <br />
    <br />
    This is great for debugging purposes.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Console Log Stores logs in the console 
// ## any changes in the Router Store for debugging purposes
// ## Boolean
// ## Default value: true
</b>
&#123;
  setConsoleLogStores: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsoleLogStores(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  USES ROUTE LAYOUT OPTION  ------------------------------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Uses Route Layout</h4>
  <p class="scr-text-justify">
    The <b>usesRouteLayout</b> option tells the SCR that you are going to use a
    Global Layout.
    <br />
    <br />
    You can set a layout per route, but most common cases you want to set a global
    layout and if necessary set a different route layout.
    <br />
    <br />
    The SCR has a default simple layout that you probably not going to use, so if
    you do not want to use a custom layout it is better to set this option to false.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Uses Route Layout defines if you will be using layout 
// ## for each route or not - can be ignored in the route 
// ## Boolean
// ## Default value: true
</b>
&#123;
  usesRouteLayout: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setUsesRouteLayout(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  CONSIDER TRAILING SLASH ON MATCHING ROUTE OPTION  ------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Consider Trailing Slash On Matching Route</h4>
  <p class="scr-text-justify">
    The <b>considerTrailingSlashOnMatchingRoute</b> option speaks for itself. When
    searching for a matching route a trailing slash should be considered or not.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Consider Trailing Slash On Matching Route
// ## add an slash in the end of the route path to search in the route definitions
// ## Boolean
// ## Default value: true
</b>
&#123;
  considerTrailingSlashOnMatchingRoute: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setConsiderTrailingSlashOnMatchingRoute(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  USE SCROLL ROUTE OPTION  ------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Use Scroll</h4>
  <p class="scr-text-justify">
    The <b>useScroll</b> option tell SCR that you will be using a scroll
    behaviour globally. That means SCR will apply the global <b>scrollProps</b>
    configuration for each route entered if the route do not specify a differente
    <b>scrollProps</b>
    configuration or the <b>ignoreScroll</b> property.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Use Scroll - enable or disables scrolling on entering the route
// ## Boolean
// ## Default value: true
</b>
&#123;
  useScroll: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setUseScroll(true);
</pre>
  <!-- -------------------------------------------------------------------------------- -->
  <!-- ----------------  SCROLL PROPS OPTION  ----------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Scroll Props</h4>
  <p class="scr-text-justify">
    The <b>scrollProps</b> option is the behaviour options when the scrolling is enabled.
    It has the following options:
  </p>
  <ul>
    <li><b>top: </b>The top position to scroll - Default is 0</li>
    <li><b>left: </b>The left position to scroll - Default is 0</li>
    <li>
      <b>behaviour: </b>The behaviour when scrolling to position - Default is
      "smooth"
    </li>
    <li>
      <b>timeout: </b>This options sets a timeout to fire the scrolling. The
      minimum value accepted is 10 milliseconds. Default is 10 milliseconds.
    </li>
  </ul>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Scroll Props
// ## The scrolling props on entering the route if enabled
// ## Default Values: 
// ## scrollProps: &#123;
// ##   top: 0,
// ##   left: 0,
// ##   behaviour: "smooth",
// ##   timeout: 10, // timeout must be greater than 10 milliseconds
// ## &#125;,
// ## Object
// ## Default value: &#123;
  top: 0,
  left: 0,
  behaviour: "smooth",   
  timeout: 10, // timeout must be greater than 10 milliseconds
&#125;
</b>
&#123;
  scrollProps: &#123;
    top: 0,
    left: 0,
    behaviour: "smooth",
    timeout: 10, // timeout must be greater than 10 milliseconds
  &#125;,
&#125;

<b class="scr-b">// How to set in the store</b>
SCR_CONFIG_STORE.setScrollProps(&#123;
  top: 0,
  left: 0,
  behaviour: "smooth",
  timeout: 10,
&#125);
</pre>
  <p class="scr-text-justify">
    So that is it for this section. But the configuration store is not over yet.
    The next properties has its own sections each. Click next to see more
    information.
  </p>

  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "configurationOptionsRoute",
    path: "/svelte-client-router/configurationOptions",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_ConfigurationOptions.svelte"),
    title: "SCR - Configuration Options",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="gettingStartedRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="configurationGlobalBeforeEnterOptionRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
