<script>
  import SCR_PageFooter from "../SCR_PageFooter.svelte";
  import SCR_PushRouteButton from "../components/SCR_PushRouteButton.svelte";
</script>

<div class="scr-page">
  <h4 class="scr-h4">Route Object - Properties</h4>
  <p class="scr-text-justify">
    This is where we can declare our routes. It has several option that
    modelates the route behaviour.
    <br />
    There is some mandatory properties that configure a minimal route declaration.
    Lets check each option:
  </p>
  <!-- ----------------  NAME OPTION  ----------------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Name</h4>
  <p class="scr-text-justify">
    The <b>name</b> option is mandatory. It an humam readable identification for
    this route.
    <br />
    As it is an identification property must be unique. If some route is declared
    with the same name, it will always find the first route with that name and route
    to it.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Route Name
// ## The name identifying this route
// ## String - Obrigatory
// ## Default value: none
</b>
&#123;
  name: "exampleOfRouteName",
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  PATH OPTION  ----------------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Path</h4>
  <p class="scr-text-justify">
    The <b>path</b> is mandatory and it is the path to route to.
    <br />
    <br />
    As it is an identification property must be unique. If some route is declared
    with the same path, it will always find the first route with that path and route
    to it.
    <br />
    <br />
    You can use regex in your route like ":myVar". For example:
    <br />
    <b>path: "/path/:someVar/my/route/:someOtherVar",</b>
    <br />
    <br />
    It will be made available on all beforeEnter Functions, After Enter Function and Components;
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Route Path
// ## The path identifying this route
// ## String - Obrigatory
// ## Can declare regex like /test1/:paramA/test2/:paramB
// ## The regex must have the format ":string"
// ## Default value: none
</b>
&#123;
  path: "/path/to/my/route",

  <b class="scr-b">
// OR Can declare regex path
  // it will be made available on all beforeEnter Functions, After Enter Function and Component
  </b>
  path: "/path/:to/:my/route",

  <b class="scr-b">
// pathParams: &#123;
  //  to: "myroutedefinedvalue"
  //  my: "myroutedefinedvalue"
  // &#125;
  </b>
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  COMPONENT OPTION  ------------------------------------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Component</h4>
  <p class="scr-text-justify">
    The <b>component</b> is partially mandatory. This is because if the route
    only redirects, it will not use the loaded component.
    <br />
    <br />
    The component specified will be included inside the default slot of the Layout
    Component.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Component - the loaded component that is going to be used 
// for this route
// ## Function - Imported component for this route
// ## Default value: none
</b>

<b class="scr-b">// Import your component</b>
import SCR_C1 from "./testComponents/SCR_C1.svelte";

&#123;
  <b class="scr-b">// Setting your route component</b>
  component: SCR_C1,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  LAZY LOAD COMPONENT OPTION  ------------------------------ -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Lazy Load Component</h4>
  <p class="scr-text-justify">
    The <b>lazyLoadComponent</b> is partially mandatory. This is because if the
    route only redirects, it will not load any component.
    <br />
    <br />
    The component specified will be included inside the default slot of the Layout
    Component.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Lazy Load Component - the component that must be loaded to be used 
// ## for this route
// ## Function - Function to load the component for this route
// ## Default value: none
</b>

&#123;
  <b class="scr-b">// Lazy loading your route component</b>
  lazyLoadComponent: () => import("./testComponents/SCR_C1.svelte"),
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  LAYOUT COMPONENT OPTION  ----------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Layout Component</h4>
  <p class="scr-text-justify">
    The <b>layoutComponent</b> is a custom loaded layout to use with this
    specific route. When set it will override any global layout set for this
    route only.
    <br />
    <br />
    The layout component specified must have a default slot declared to include route
    component.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Layout Component - the layout component that is going to be used 
// ## for this route
// ## Function - Imported layout component for this route
// ## Default value: none
</b>

<b class="scr-b">// Import your component</b>
import SRC_Layout from "./testComponents/SRC_Layout.svelte";

&#123;
  <b class="scr-b">// Setting your route layout component</b>
  layoutComponent: SRC_Layout,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  LAZY LOAD LAYOUT COMPONENT OPTION  ------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Lazy Load Layout Component</h4>
  <p class="scr-text-justify">
    The <b>lazyLoadLayoutComponent</b> is a custom layout to be loaded to use
    with this specific route. When set it will override any global layout set
    for this route only.
    <br />
    <br />
    The lazy layout component specified must have a default slot declared to include
    route component.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Lazy Load Layout Component - the layout component that must be loaded to be used 
// ## for this route
// ## Function - Function to load the layout component for this route
// ## Default value: none
</b>

&#123;
  <b class="scr-b">// Lazy loading your route layout component</b>
  lazyLoadLayoutComponent: () => import("./testComponents/SRC_Layout.svelte"),
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  PARAMS OPTION  --------------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Params</h4>
  <p class="scr-text-justify">
    The <b>params</b> option is an object that must be available on before enter
    functions or even the components.
    <br />
    It will be available at any moment for you. Of course this is some fixed values.
    See the payload param in the before enter sections to pass some custom values
    between functions.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Params - all the params the should be available
// for this route on any Before Enter Execution or 
// After Before Enter Execution
// ## Object
// ## Default value: &#123;&#125;
</b>
&#123;
  params: &#123; 
    myParam: "My Custom Param", 
  &#125;,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  LOADINGPROPS OPTION  --------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Loading Props</h4>
  <p class="scr-text-justify">
    The <b>loadingProps</b> option is an object that will be available on
    loading component.
    <br />
    When routing the user may be waiting for some request to return and for that
    SCR makes available a loading component. Of course you can override it and you
    are encouraged to do so.
    <br />
    <br />
    Any properties set here will be delivered to the loading component.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Loading Props - all props that must be available to
// loading component when it is triggered
// ## Object
// ## Default value: &#123;&#125;
</b>
&#123;
  loadingProps: &#123; loadingText: "Carregando..." &#125;,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  IGNORE LAYOUT OPTION  -------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Ignore Layout</h4>
  <p class="scr-text-justify">
    The <b>ignoreLayout</b> option when set to true, ignores any layout defined to
    this specific route.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Ignore Layout - if should ignore layout component
// ## when you do not want to use global or local layout component
// ## Boolean
// ## Default value: false
</b>
&#123;
  ignoreLayout: false,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  IGNORE SCROLL OPTION  -------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Ignore Scroll</h4>
  <p class="scr-text-justify">
    The <b>ignoreScroll</b> option when set to true, ignores any scroll behaviour
    defined.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Ignore Scroll - if this route should ignore scrolling
// ## Boolean
// ## Default value: false
</b>
&#123;
  ignoreScroll: false,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  SCROLL PROPS OPTION  --------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Scroll Props</h4>
  <p class="scr-text-justify">
    The <b>scrollProps</b> option overrides the store <b>scrollProps</b> configuration
    for this specific route.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Scroll Props
// ## The scrolling props on entering the route if enabled
// ## Default Values: 
// ## Object
// ## Default value: configuration store
</b>
&#123;
  scrollProps: &#123;
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10, // timeout must be greater than 10 milliseconds
  &#125;,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  TITLE OPTION  ---------------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Title</h4>
  <p class="scr-text-justify">
    The <b>title</b> option sets when enters the route the page title.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Title - it defines the route title
// ## String
// ## Default value: none
</b>
&#123;
  title: "Route Object - Options",
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  IGNORE GLOBAL BEFORE FUNCTION OPTION  ---------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Ignore Global Before Function</h4>
  <p class="scr-text-justify">
    The <b>ignoreGlobalBeforeFunction</b> option when is true will not execute any
    Global Before Enter functions for this specific route.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Ignore Global Before Function - 
// ## if should ignore defined global before function 
// ## Boolean
// ## Default value: false
</b>
&#123;
  ignoreGlobalBeforeFunction: false,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- EXECUTE ROUTE BEFORE ENTER FUNCTION BEFORE GLOBAL BEFORE ENTER FUNCTION OPTION -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Execute Route BEF Before Global BEF</h4>
  <p class="scr-text-justify">
    The <b>executeRouteBEFBeforeGlobalBEF</b> option when is true will modify
    the default behaviour of the SCR. The SCR always runs Global Before Enter
    Functions before Route Before Enter Functions, but is different when this
    option is true.
    <br />
    When set to true it will execute Route Before Functions before Global Before
    Functions.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Execute Route Before Enter Function Before Global Before Function 
// ## if should execute route before function sequence before 
// ## global before enter execution
// ## Boolean 
// ## Default value: false
</b>
&#123;
  executeRouteBEFBeforeGlobalBEF: false,
&#125;
</pre>
  <!-- ------------------------------------------------------------------------------ -->
  <!-- ----------------  FORCE RELOAD OPTION  --------------------------------------- -->
  <hr class="scr-hr" />
  <h4 class="scr-h4">Force Reload</h4>
  <p class="scr-text-justify">
    The <b>forceReload</b> option when is true will not reload the route when
    the route is already loaded. The user may click in a button that pushes to
    the current route. The default behaviour is just not to reload the route.
    <br />
    <br />
    But maybe this is a feature you want to execute.
  </p>
  <pre
    class="scr-pre">
<b class="scr-b">
// ## Force Reload - when in opened route try to push the same route
// by using pushRoute function
// When enabled it will reload the current route as if it was not opened
// ## Boolean
// ## Default value: false
</b>
&#123;
  forceReload: false,
&#125;
</pre>
  <p class="scr-text-justify">
    So that is it for this section. But it is not the end of the Route Options.
    See the next section to more info.
  </p>
  <center class="scr-center">
    <small class="scr-small">The configuration for this route.</small>
  </center>
  <pre
    class="scr-pre">
&#123;
    name: "routeObjectOptionsRoute",
    path: "/svelte-client-router/routeObjectOptions",
    lazyLoadComponent: () =&gt; import("./docs/pages/SCR_RouteObjectProperties.svelte"),
    title: "SCR - Route Object - Options",
&#125;
</pre>
  <SCR_PageFooter>
    <div class="row">
      <div class="col">
        <SCR_PushRouteButton
          style="float:left"
          text="Previous"
          routeName="configurationOnErrorOptionRoute"
        />
        <SCR_PushRouteButton
          style="float:right"
          text="Next"
          routeName="routeObjectBeforeEnterRoute"
        />
      </div>
    </div>
  </SCR_PageFooter>
</div>

<style>
</style>
