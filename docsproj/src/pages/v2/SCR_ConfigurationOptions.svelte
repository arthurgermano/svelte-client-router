<script>
  import SCR_Page from "../../layout/SCR_Page.svelte";
</script>

<SCR_Page
  back={{ name: "v2_Getting_Started", text: "Getting Started" }}
  forward={{
    name: "v2_Configuration_Global_Before_Enter_Option",
    text: "Configuration Before Enter",
  }}
>
  <div class="scr-page">
    <h4 class="scr-h4">Configuration Options</h4>
    <p>
      The configuration are managed in a <a
        href="https://svelte.dev/tutorial/writable-stores"
        target="_blank">Svelte Store.</a
      >
      The Svelte Store are one of the cooliest things in Svelte. Is very reactive
      and helps us to make our router reactive too. You can change the behaviour
      at any point and will instantly react to it.
    </p>
    <h4 class="scr-h4">Importing</h4>
    <pre class="scr-pre">
<b class="scr-b">// Importing configuration store</b>
import &#123; configStore &#125; from "svelte-client-router"
</pre>
    <p>
      It is a Svelte Store and can be use like $configStore inside Svelte Components.
      <br />
      Next.. lets check out all the available properties.
    </p>
    <!-- ----------------  HASH MODE OPTION  ------------------------------------------ -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Hash Mode</h4>
    <p class="scr-text-justify">
      The <b>hashMode</b> option controls either if our router must check a
      hashed based route like this site or must <b>NOT</b> consider a hashed
      based route path where the hash char doesn't mean much.
      <br />
      <br />
      This website for example must be hashed based because Github Pages is not prepared
      to return the index.html page for each route request.
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Hash Mode checks route using #/ before the location path
// ## for example http://localhost:5000/pathAAA#/pathBBB
// ## it will consider only pathBBB and ignore pathAAA as path!
// ## Boolean 
// ## Default value: false
</b>
&#123;
  hashMode: false,
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setHashMode(true);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  NAVIGATION HISTORY LIMIT OPTION  ----------------------------- -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Navigation History Limit</h4>
    <p class="scr-text-justify">
      The <b>navigationHistoryLimit</b> option sets the size of the navigation
      history. Inside the router store we have an array that contains all the
      route objects where the first position is the last page visited and the
      last position is the first page visited.
      <br />
      <br />
      If is set 0 or less it will be considered unlimited.
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Navigation History Limit is the amount of route history is added 
// ## in the route navigation history list 
// ## 0 or -1 equals to "no limit"
// ## Integer
// ## Default value: 200
</b>
&#123;
  navigationHistoryLimit: 200, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setNavigationHistoryLimit(10);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  NOT FOUND ROUTE OPTION  -------------------------------------- -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Not Found Route</h4>
    <p class="scr-text-justify">
      The <b>notFoundRoute</b> option sets the route to redirect to when the
      user enter a non existent url path.
      <br />
      <br />
      <b>OBS: It has to start with "/" </b>
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Not Found Route Path
// ## is the path that should redirect when not found a path in the application
// ## String - must include "/"
// ## Default value: /notFound
</b>
&#123;
  notFound: "/notFound", 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setNotFoundRoute("/notFound");
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
    <pre class="scr-pre"><b class="scr-b"
        >// ## Console Log Error Messages logs in the console 
// ## any error messages of the SCR for debugging purposes
// ## Boolean
// ## Default value: true
</b>
&#123;
  consoleLogStores: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setConsoleLogErrorMessages(true);
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
    <pre class="scr-pre"><b class="scr-b"
        >// ## Console Log Stores logs in the console 
// ## any changes in the Router Store for debugging purposes
// ## Boolean
// ## Default value: true
</b>
&#123;
  setConsoleLogStores: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setConsoleLogStores(true);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  CONSIDER TRAILING SLASH ON MATCHING ROUTE OPTION  ------------ -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Consider Trailing Slash On Matching Route</h4>
    <p class="scr-text-justify">
      The <b>considerTrailingSlashOnMatchingRoute</b> option speaks for itself. When
      searching for a matching route a trailing slash should be considered or not.
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Consider Trailing Slash On Matching Route
// ## add an slash in the end of the route path to search in the route definitions
// ## Boolean
// ## Default value: true
</b>
&#123;
  considerTrailingSlashOnMatchingRoute: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setConsiderTrailingSlashOnMatchingRoute(true);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  MAX REDIRECT BEFORE ENTER OPTION  ---------------------------- -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Max Redirect Before Enter</h4>
    <p class="scr-text-justify">
      The <b>maxRedirectBeforeEnter</b> option tell SCR that there is a limit to
      redirect routes. When executing before enter routes you can be by mistake
      make a loop redirecting it for ever and never finishing to load a specif
      route.
      <br /><br />
      For that specific case the default max redirect limit is set to 30. You can change that
      by setting any value that you want.
      <br /><br />
      If a invalid value or less than 1 is set - a default of 1 will be setted instead.
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Max Redirect Before Enter - the maximum value to before enter execute when redirecting
// ## Numeric
// ## Default value: 30
</b>
&#123;
  maxRedirectBeforeEnter: 30, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setMaxRedirectBeforeEnter(true);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  USE SCROLL ROUTE OPTION  ------------------------------------- -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Use Scroll</h4>
    <p class="scr-text-justify">
      The <b>useScroll</b> option tell SCR that you will be using a scroll
      behaviour globally. That means SCR will apply the global
      <b>scrollProps</b>
      configuration for each route entered if the route do not specify a differente
      <b>scrollProps</b>
      configuration or the <b>ignoreScroll</b> property.
    </p>
    <pre class="scr-pre"><b class="scr-b"
        >// ## Use Scroll - enable or disables scrolling on entering the route
// ## Boolean
// ## Default value: true
</b>
&#123;
  useScroll: true, 
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setUseScroll(true);
</pre>
    <!-- -------------------------------------------------------------------------------- -->
    <!-- ----------------  SCROLL PROPS OPTION  ----------------------------------------- -->
    <hr class="scr-hr" />
    <h4 class="scr-h4">Scroll Props</h4>
    <p class="scr-text-justify">
      The <b>scrollProps</b> option is the behaviour options when the scrolling is
      enabled. It has the following options:
    </p>
    <ul>
      <li>
        <b>target: </b>The target element ID to scroll to top - if not provided
        uses window
      </li>
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
    <pre class="scr-pre"><b class="scr-b"
        >// ## Scroll Props
// ## The scrolling props on entering the route if enabled
// ## Default Values: 
// ## scrollProps: &#123;
// ##   target: false,
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
    target: false,
    top: 0,
    left: 0,
    behaviour: "smooth",
    timeout: 10, // timeout must be greater than 10 milliseconds
  &#125;,
&#125;

<b class="scr-b">// How to set in the store</b>
configStore.setScrollProps(&#123;
  target: "someDivID"
  top: 0,
  left: 0,
  behaviour: "smooth",
  timeout: 10,
&#125);
</pre>
    <p class="scr-text-justify">
      So that is it for this section. But the configuration store is not over
      yet. The next properties has its own sections each. Click next to see more
      information.
    </p>

    <center>
      <small class="scr-small">The configuration for this route.</small>
    </center>
    <pre class="scr-pre">
&#123;
  name: "v2_Configuration_Options",
  path: "/svelte-client-router/v2/configurationOptions",
  lazyLoadComponent: () =&gt; import("../../pages/v2/SCR_ConfigurationOptions.svelte"),
  title: "SCR - Configuration Options - Version 2",
  beforeEnter: [setVersion2],
&#125;
</pre>
  </div>
</SCR_Page>

<style>
</style>
