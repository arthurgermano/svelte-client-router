# Svelte Client Router (SCR)

## Svelte Client Router makes SPA routes easy!

Svelte Client Router is everything you need and think when routing SPA's. This is THE SVELTE ROUTER for SPA!

Designed to help make you in control of the routing of your Single Page Applications (SPA)!

## Index

- [Svelte Client Router (SCR)](#svelte-client-router-scr)
  - [Svelte Client Router makes SPA routes easy!](#svelte-client-router-makes-spa-routes-easy)
  - [Index](#index)
  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
    - [SCR - Documentation and Test It!](#scr---documentation-and-test-it)
    - [SCR - Example](#scr---example)
    - [SCR - Configuration Store](#scr---configuration-store)
    - [SCR - Route Object Definition](#scr---route-object-definition)
    - [SCR - Router Svelte Component](#scr---router-svelte-component)
    - [SCR - Navigation](#scr---navigation)
    - [SCR - Router Link Component](#scr---router-link-component)
    - [SCR - Router Store](#scr---router-store)

## Features

- Lazy Load Components
- Lazy Load Loading Components
- Routes Based in Svelte Stores
- Before Enter Global Functions
- Ignore Global Before Enter Function Per Route
- Before Enter Per Route Functions
- Execute Before Enter Router Functions before Global Before Enter Functions
- After Function (Before Enter Function Sequence Array)
- Route Title 
- Global Route Error Function
- Route Error Functions
- Loading Component on Route Changing

## Install

To install Svelte Router on your svelte app:

with npm

```bash
npm i svelte-client-router
```

## Usage

Ensure your local server is configured in SPA mode. 
In a default Svelte installation you need to edit your package.json and add _-s_ to `sirv public`.

```javascript
"start": "sirv public -s"
```

### SCR - Documentation and Test It!
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/presentation" target="_blank">Click here to see Svelte Client Router - In Action!</a>


### SCR - Example
 
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationOptions" target="_blank">Configuration Options</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationGlobalOnError" target="_blank">Global On Error</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectProperties" target="_blank">Route Object Options</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentProperties" target="_blank">SCR Component Properties</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentComponents" target="_blank">SCR Component Components</a><br />

```javascript
<script>
  import SCR_Loading from "./components/SCR_Loading.svelte";
  import { SCR_Router, configStore } from "./index.js";

  // Setting configurations of the SCR Router
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationOptions
  configStore.setNotFoundRoute(
    "/svelte-client-router/myCustomNotFoundRoute"
  );

  configStore.setConsoleLogStores(false);
  configStore.setNavigationHistoryLimit(100);
  configStore.setHashMode(true);
  configStore.setUseScroll(true);
  configStore.setScrollProps({
    target: "scr-container",
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10,
  });

  // Setting global error function 
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationGlobalBeforeEnterOption
  configStore.setOnError((error) => {
    console.log("GLOBAL ERROR CONFIG", error);
  });

  // Setting a single before enter function - you can set an array as well.
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationGlobalOnError
  configStore.setBeforeEnter(({ resolve }) => {
    console.log("GLOBAL Before Enter", error);
    resolve(true);
  });

  // Setting the route object definition
  // https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectProperties
  const routes = [
  {
    name: "root",
    path: "",
    beforeEnter: ({ resolve }) => {
      resolve({ path: "/svelte-client-router/" });
    },
  },
  {
    name: "root2",
    path: "/",
    beforeEnter: ({ resolve }) => {
      resolve({ path: "/svelte-client-router/" });
    },
  },
  {
    name: "rootRoute",
    path: "/svelte-client-router/",
    lazyLoadComponent: () => import("../../pages/SCR_Home.svelte"),
    title: "SCR - Home",
    beforeEnter: [setVersion0],
  },
  {
    name: "v2_Presentation",
    path: "/svelte-client-router/v2/presentation",
    lazyLoadComponent: () => import("../../pages/v2/SCR_Presentation.svelte"),
    title: "SCR - Presentation - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Installation",
    path: "/svelte-client-router/v2/installation",
    lazyLoadComponent: () => import("../../pages/v2/SCR_Installation.svelte"),
    title: "SCR - Installation - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Getting_Started",
    path: "/svelte-client-router/v2/gettingStarted",
    lazyLoadComponent: () => import("../../pages/v2/SCR_GettingStarted.svelte"),
    title: "SCR - Getting Started - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Options",
    path: "/svelte-client-router/v2/configurationOptions",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationOptions.svelte"),
    title: "SCR - Configuration Options - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Global_Before_Enter_Option",
    path: "/svelte-client-router/v2/configurationGlobalBeforeEnterOption",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationBeforeEnter.svelte"),
    title: "SCR - Configuration Global Before Enter Option - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Configuration_Global_On_Error",
    path: "/svelte-client-router/v2/configurationGlobalOnError",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_ConfigurationOnError.svelte"),
    title: "SCR - Configuration Global On Error - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_Properties",
    path: "/svelte-client-router/v2/routeObjectProperties",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectProperties.svelte"),
    title: "SCR - Route Object Properties - Version 2",
    beforeEnter: [setVersion2],
    ignoreScroll: true,
  },
  {
    name: "v2_Route_Object_Before_Enter",
    path: "/svelte-client-router/v2/routeObjectBeforeEnter",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectBeforeEnter.svelte"),
    title: "SCR - Route Object Before Enter - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_After_Enter",
    path: "/svelte-client-router/v2/routeObjectAfterEnter",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectAfterEnter.svelte"),
    title: "SCR - Route Object After Enter - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Object_On_Error",
    path: "/svelte-client-router/v2/routeObjectOnError",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteObjectOnError.svelte"),
    title: "SCR - Route Object On Error - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Component_Properties",
    path: "/svelte-client-router/v2/routeComponentProperties",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteComponentProperties.svelte"),
    title: "SCR - Route Component Properties - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Route_Component_Components",
    path: "/svelte-client-router/v2/routeComponentComponents",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_RouteComponentComponents.svelte"),
    title: "SCR - Route Component Components - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Navigation_Routing",
    path: "/svelte-client-router/v2/navigationRouting",
    lazyLoadComponent: () => import("../../pages/v2/SCR_NavigationRouting.svelte"),
    title: "SCR - Navigation Routing - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Router_Link",
    path: "/svelte-client-router/v2/routerLink",
    lazyLoadComponent: () => import("../../pages/v2/SCR_RouterLink.svelte"),
    title: "SCR - Router Link - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Routes_Store",
    path: "/svelte-client-router/v2/routesStore",
    lazyLoadComponent: () => import("../../pages/v2/SCR_RoutesStore.svelte"),
    title: "SCR - Routes Store - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Regex_Path",
    path: "/svelte-client-router/v2/:testParam/testRegexPath",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestRegexPath.svelte"),
    title: "SCR - Test Regex Path - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Regex_Path_2",
    path: "/svelte-client-router/v2/:firstParam/testRegexPath2/:secondParam",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestRegexPath2.svelte"),
    title: "SCR - Test Regex Path 2 - Version 2",
    beforeEnter: [setVersion2],
  },
  {
    name: "v2_Test_Loading_Component_Before_Enter",
    path: "/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout",
    lazyLoadComponent: () => import("../../pages/v2/SCR_TestLoadingComponentWithBeforeEnter.svelte"),
    title: "SCR - Test Regex Path 2 - Version 2",
    beforeEnter: [setVersion2, ({resolve, routeTo}) => {
      let timeout = 20;
      if (routeTo && routeTo.pathParams && routeTo.pathParams.timeout) {
        routeTo.pathParams.timeout = parseInt(routeTo.pathParams.timeout);
        if (routeTo.pathParams.timeout > 0) {
          timeout = routeTo.pathParams.timeout;
        }
      }

      setTimeout(() => {
        resolve(true);
      }, timeout);
    }],
  },
  {
    name: "v2_Test_Any_Route_Wildcard",
    path: "/svelte-client-router/v2/anyRouteWildcard/*/:somePathParam",
    lazyLoadComponent: () =>
      import("../../pages/v2/SCR_TestAnyRouteWildcard.svelte"),
    title: "SCR - Test - Any Route Wildcard - Version 2",
  },
];
</script>

<!-- Using SCR_Router -->
<!-- https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentProperties -->
<!-- https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentComponents -->
<SCR_Router
  {routes}
  defaultLoadingComponent={SCR_Loading}
  defaultLoadingParams={{ subLoadingText: "SubLoading Text Via Param" }}
/>

```

### SCR - Configuration Store

Configuration Store manages the behavior of the <abbr title="Svelte Client Router">SCR</abbr>.
Let's see the options we have here:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationOptions" target="_blank">Configuration Options</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationGlobalBeforeEnterOption" target="_blank">Global Before Enter Functions</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/configurationGlobalOnError" target="_blank">Global On Error</a><br />

```javascript
{
  // ## Hash Mode checks route using #/ before the location path
  // ## for example http://localhost:5000/pathAAA#/pathBBB
  // ## it will consider only pathBBB and ignore pathAAA as path!
  // ## Boolean
  hashMode: false, // ## Default is false

  // ## Navigation History Limit is the amount of route history is added 
  // ## in the route navigation history list 
  // ## 0 or -1 equals to "no limit"
  // ## Integer
  navigationHistoryLimit: 200, // ## Default is 200

  // ## Not Found Route Path
  // ## is the path that should redirect when not found a path in the application
  // ## String - must include "/"
  notFoundRoute: "/notFound", // ## Default is "/notFound"

  // ## Console Log Error Messages logs in the console 
  // ## any error messages of the SCR for debugging purposes
  // ## Boolean
  consoleLogErrorMessages: true, // ## Default is true

  // ## Console Log Stores logs in the console 
  // ## any changes in the Router Store for debugging purposes
  // ## Boolean
  consoleLogStores: true, // ## Default is true

  // ## Consider Trailing Slash On Matching Route
  // ## add an slash in the end of the route path to search in the route definitions
  // ## Boolean
  considerTrailingSlashOnMatchingRoute: true // ## Default is true

  // ## Max Redirect Before Enter
  // ## the maximum value to before enter execute when redirecting
  // ## Integer
  maxRedirectBeforeEnter: 30, // ## Default is 30

  // ## Use Scroll - enable or disables scrolling on entering the route
  // ## Boolean
  useScroll: true // ## Default is true

  // ## Scroll Props
  // ## The scrolling props on entering the route if enabled
  // ## Default Values: 
  // ## scrollProps: {
  // ##   target: false,  
  // ##   top: 0,
  // ##   left: 0,
  // ##   behavior: "smooth",
  // ##   timeout: 10, // timeout must be greater than 10 milliseconds
  // ## },
  // ## Object
  scrollProps: {
    target: false,
    top: 100,
    left: 100,
    behavior: "smooth",
    timeout: 1000,
  },

  // ## Before Enter defines a function or array of Functions
  // ## that must execute before each route
  // ## Function or Array - of Functions
  beforeEnter: [],

  // ## On Error defines a function when an error occurs
  // ## when routing
  // ## Function
  onError: (error) => console.log(error),
}

// ## EXAMPLE 
import { configStore } from "svelte-client-router";

configStore.setHashMode(false);
configStore.setNavigationHistoryLimit(100);
configStore.setNotFoundRoute("/myCustomNotFoundRoute");
configStore.setConsoleLogErrorMessages(true);
configStore.setConsoleLogStores(true);
configStore.setMaxRedirectBeforeEnter(30);
configStore.setUsesRouteLayout(true);
configStore.setConsiderTrailingSlashOnMatchingRoute(true);

// ## Callback receives 2 params 
// ## 1) Error 
// ## 2) Parameters defined for the route, current route, from route, etc..
configStore.setOnError((error) => {
  // ## Error Object
  console.log("GLOBAL ERROR CONFIG", error);
});

// ## Receives a Function or an Array of Functions
// ## Callback receives 2 params
// ## 1) resolve function 
// ## Should resolve with: 
// ## - true - when everything went OK
// ## - false - when just ignore routing and stop
// ## - { redirect: "/some_route" }
// ## - { path: "/some_route" }
// ## - { name: "route_name" }
// ##
// ## Route coming from
// ## Route going to
// ## reject function - throws exception
// ## 2) payload object - to pass info between before enter functions - do not override this variable!
configStore.setBeforeEnter([
  ({resolve, routeFrom, routeTo, reject}, payload) => {
    payload.test = "have some variable passing";
    console.log("Global Before Enter Route - 1");
    resolve(true);
  },
  ({resolve, routeFrom, routeTo, reject}, payload) => {
    console.log("Global Before Enter Route - 2");
    console.log(payload.test) // will print - have some variable passing
    resolve(true);
  },
]);

// ## You can set the entire object with the following
configStore.setConfig({
  hashMode: false,
  navigationHistoryLimit: 200,
  notFoundRoute: "/notFound",
  consoleLogErrorMessages: true,
  consoleLogStores: false,
  considerTrailingSlashOnMatchingRoute: true,
  maxRedirectBeforeEnter: 30,
  useScroll: false,
  scrollProps: {
    target: false,
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10,
  },
  onError: (error) => {
    console.log("GLOBAL ERROR CONFIG", error);
  },
  beforeEnter: [
    (resolve, routeFrom, routeTo, routeObjParams, payload) => {
      payload.GBER1 = "My Custom Param to Pass";
      console.log("Global Before Enter Route - 1");
      resolve(true);
    },
    (resolve, routeFrom, routeTo, routeObjParams, payload) => {
      if (payload.GBER1) {
        payload.GBER2 = "Yes, I will be set too!";
      }
      console.log("Global Before Enter Route - 2");
      resolve(true);
    }
  ]
})
```

### SCR - Route Object Definition

Route Object is the definition of every route we have in the SPA application and is below our <abbr title="Svelte Client Router">SCR</abbr> Route Component.

Let's see the object format:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectProperties" target="_blank">Route Object Options</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectBeforeEnter" target="_blank">Route Object Before Enter Functions</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectAfterEnter" target="_blank">Route Object After Before Enter Function</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeObjectOnError" target="_blank">Route Object  On Error</a><br />


```javascript
import { SCR_Router } from "svelte-client-router";

import SCR_C1 from "./testComponents/SCR_C1.svelte";
import SCR_Loading from "./testComponents/SCR_Loading.svelte";

{
  // ## Route Name
  // ## The name identifying this route
  // ## String - Obrigatory
  name: "routeName1",

  // ## Route Path
  // ## The path identifying this route
  // ## String - Obrigatory
  // ## Can declare regex like /test1/:paramA/test2/:paramB
  // ## Can declare any route wildcard like /test1/:paramA/*/:paramB
  // ## This property value is Case Sensitive.
  // ## The regex must have the format ":string"
  path: "/test1",

  // ## Component - the component that is going to be used 
  // ## for this route
  // ## Function - Imported component for this route
  component: SCR_C1,

  // ## Lazy Load Component - the component that must be loaded to be used 
  // ## for this route
  // ## Function - Function to load the component for this route
  lazyLoadComponent: () => import("./testComponents/SCR_C1.svelte"),

  // ## Lazy Load Loading Component - the loading component that must be loaded to be used 
  // ## for this route
  // ## Function - Function to load the loading component for this route
  lazyLoadLoadingComponent: () => import("./testComponents/SCR_Loading.svelte"),

  // ## Loading Component - the loading component that is going to be used 
  // ## for this route
  // ## Function - Imported loading component for this route
  loadingComponent: SRC_Loading,

  // ## Ignore Layout - if should ignore layout component
  // ## when you do not want to use global or local layout component
  // ## Boolean
  ignoreLayout: false,

  // ## Ignore Scroll - if this route should ignore scrolling
  // ## Boolean
  ignoreScroll: true,

  // ## Scroll Props
  // ## The scrolling props on entering the specific route if enabled
  // ## Default Values: configuration store
  // ## Object
  scrollProps: {
    target: false,
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10, // timeout must be greater than 10 milliseconds
  },

  // ## Title - it defines the route title
  // ## String
  title: "First Route Title",

  // ## Params - all the params the should be available
  // for this route on any Before Enter Execution or 
  // After Before Enter Execution
  // ## Object
  params: {
    myCustomParam: "OK THEN SHALL WE!",
  },

  // ## Force Reload - when in opened route try to push the same route
  // by using pushRoute function
  // When enabled it will reload the current route as if it was not opened
  // ## Boolean
  forceReload: false,

  // ## Ignore Global Before Function - 
  // ## if should ignore defined global before function 
  // ## Boolean 
  ignoreGlobalBeforeFunction: false,

  // ## Execute Route Before Enter Function Before Global Before Function 
  // ## if should execute route before function sequence before 
  // ## global before enter execution
  // ## Boolean 
  executeRouteBEFBeforeGlobalBEF: false,

  // ## Loading Props - all props that must be available to
  // loading component when it is triggered
  loadingParams: { loadingText: "Carregando..." },

  afterBeforeEnter: (
    {
      toRoute,
      fromRoute,
      payload
    }
  ) => { 
    console.log("AFTER ENTER", toRoute, fromRoute, payload);  
  },

  // ## Before Enter - a function or array of Functions
  // ## defining all functions that must be executed for this specific route
  // ## Function or Array (Functions)
  beforeEnter: [
    ({resolve, routeFrom, routeTo, reject}, payload) => {
      payload.passingToNextBeforeEnter: "yes, I will be there!",
      payload.passingToComponents: "yes, I will be there either!",
      
      setTimeout(() => resolve(true), 2000);
      console.log("beforeEnter Executed");
      resolve(true);
    },
    ({resolve, routeFrom, routeTo, reject}, payload) => {
      console.log(payload);
      setTimeout(() => resolve(true), 1000);
      console.log("beforeEnter Executed2");
      resolve({ redirect: "/test2" });
    },
  ],

  // ## On Error - a function to execute when somenthing goes wrong on loading
  // ## this specific route
  // ## Error Object
  // ## Function
  onError: (error) => {
    console.log("ERROR DEFINED ROUTER C1", error);
  },
},

<SCR_Router bind:routes />

```

### SCR - Router Svelte Component

Route Svelte Component will control the selection of the route, execute all the logic and return accordingly you 
specified in the router object. 

Let's see this component properties and possibilities:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentProperties" target="_blank">Route Component Properties</a><br />
<a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routeComponentComponents" target="_blank">Route Component Components</a><br />

```javascript
import { SCR_Router } from "svelte-client-router";

// ## Your route definitions as exampled above
const routes = [
  ...
]

// ## THE SVELTE CLIENT ROUTER COMPONENT!
// ## Properties
// ## the route object definition
// ## Array of routes
export let routes;

// ## The Default Loading Component - SCR has a Loading Component by Default - 
// ## If you not specify nothing will appear between routes - unless defined per route
// ## It is used when it is executing Before Enter Route or Global Before Enter
// ## Function
export let defaultLoadingComponent = SCR_Loading;

// ## defaultLoadingParams - loading params to be available on loading component
// ## Object - default is an empty object
export let defaultLoadingParams = {};

<SCR_Router 
  bind:routes 
  defaultLoadingComponent 
  defaultLoadingParams
/>

```

### SCR - Navigation

<abbr title="Svelte Client Router">SCR</abbr> navigation can be very simple. You can import the navigation store or
just the methods to navigate.

Let's see them:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/navigationRouting" target="_blank">Navigate Routing</a><br />

```javascript
// < -- You Svelte Component Definition-- >
<script>
    import { pushRoute, backRoute } from "svelte-client-router";
</script>

<main>
  My Svelte Component
  <button on:click={() => { pushRoute("/routeNameOne"); }}>
    Go To Route Path: /routeNameOne
  </button>
  <br>
  <button on:click={() => { pushRoute({ name: 'routeNameOne'}); }}>
    Go To Route Named: routeNameOne
  </button>
  <br>
  <button on:click={() => { pushRoute({ path: '/routeNameOne'}); }}>
    Go To Route Path: /routeNameOne
  </button>
  <br>
  <button on:click={() => { backRoute(); }}>
    Back to Previous Route
  </button>
</main>

```

The assinature of the methods

```javascript

// ## Push Route Function 
// ## -----------------------------------------------------------------------------------
// ## -- First Property of Param is where to send accepts the following:
// ## String /pathToRoute
// ## Object { path: "/pathToRoute" }
// ## Object { name: "myRouteName" }
// ## -----------------------------------------------------------------------------------
// ## -- Second Property of Param custom params to pass to route they will be considered
// ## and made available on before functions after enter route function and component
// ## Object { someCustomParams: { isAvailable: "Hell ya" }}
// ## -----------------------------------------------------------------------------------
// ## -- Third Property of Param a custom onError to execute if something goes wrong.
// ## it will override, ONLY WHEN SET, the route on error defined in the routes object
// ## -----------------------------------------------------------------------------------
// ## Function
pushRoute({ 
  name: "someRouteName", 
  params: { myParam: "OK" }, 
  onError: (error) => console.log("Some customization of an error function")
});

// ## Back Route Function - returns last route definition
// ## Function
backRoute()

```

### SCR - Router Link Component

<abbr title="Svelte Client Router">SCR</abbr> RouterLink Component is a component to make easy clickable go to route.

Let's see it:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routerLink" target="_blank">Router Link Properties</a><br />

```javascript
// < -- You Svelte Component Definition-- >
<script>
  import { SCR_RouterLink } from "svelte-client-router";
</script>

<main>
  <SCR_RouterLink 
    params={{
      name: "myRouteNameThree", 
      params: { pushCustomParam: "someCustomParams" }, 
      onError: () => console.log("Execute this instead error defined on router object! - Only if something goes wrong") 
    }}
  elementProps={{ style:"background-color: green" }}
  
  >
    <button>Click to Go to Defined Route Named: myRouteNameThree!</button>
  </SCR_RouterLink>
</main>

```

### SCR - Router Store

<abbr title="Svelte Client Router">SCR</abbr> Router Store is the store where all the route definitions
are updated and controlled. You can check real time what is happening.

Let's see it:
<br /><a href="https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/v2/routesStore" target="_blank">Router Store Properties</a><br />

```javascript
// < -- You Svelte Component Definition-- >
<script>
  import { routesStore } from "svelte-client-router";
</script>

{
  // ## Routes
  // ## The Array object defined on initialization of the application
  // ## Array
  routes: [],

  // ## Current Route
  // ## The object with current route information
  // ## Updated before "after before enter function" execution
  // ## Object
  currentRoute: {
    routeId: undefined,
    name: undefined,
    path: undefined,
    pathname: undefined,
    fullPath: undefined,
    queryParams: {},
    pathParams: {},
    params: {},
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: {},
    redirected: undefined,
  },

  // ## From Route
  // ## The object with from route information
  // ## Updated before "after before enter function" execution
  // ## Object
  fromRoute: {
    routeId: undefined,
    name: undefined,
    path: undefined,
    pathname: undefined,
    fullPath: undefined,
    queryParams: {},
    pathParams: {},
    params: {},
    host: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
    routeObj: {},
    redirected: undefined,
  },

  // ## Navigation History
  // ## An array with all the route history objects - the limit is 
  // ## defined in the configuration store
  // ## Updated before "after before enter function" execution
  // ## Array
  navigationHistory: [],
}

// ## Methods available on the STORE OBJECTS
// ## -----------------------------------------------------------------------------------
// ## setRoutes,
// ## getRoutes,
// ## setCurrentRoute,
// ## getCurrentRoute,
// ## setFromRoute,
// ## getFromRoute,
// ## setNavigationHistory,
// ## getNavigationHistory,
// ## pushNavigationHistory,
// ## getNotFoundRoute,

```
