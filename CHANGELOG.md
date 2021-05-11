# Svelte Router changelog

## 1.1.0

- RegexPath - now you can declare an route with params /my/route/:with/params
- Divided code into another file - improving readability
- Fixed name of considerTrailingSlashOnMachingRoute to considerTrailingSlashOnMatchingRoute
- Fixed issue on hash routing with query params - keeping hashing on route
- Fixed issue on updating variables passed to beforeEnters functions
- Several improvements regarding finding a route match

## 1.0.14

- Fixed issue with query params on routing
- Fixed issue on hash routing with query params
- Better code commenting on Route Component

## 1.0.13

- Fixed issue when backing route - Now is not pushing that route into the history
- Fixed issue of non passing parameters to Loading Components

## 1.0.12

- Fixed package.json imports. Now saving as dev-dependencies non production packages.
- Removed date-fns as production package - not using removeExpiredKeys and addExpiredKeys
- Remove @rollup/plugin-replace as production package

## 1.0.11

- (Component Not Defined Mandatory) - Now only throws an error when is going to load the component
- Added route option <b>forceReload</b>
- Fixed issue when passing a strage parameter in Before Enter Function - Resolve Function
- Improvement documentation - Now we have a documentation using Svelte Client Router!

## 1.0.10

- Changed routeObjParam returned inside Before Enter Functions 
- Added configuration option <b>setScrollProps</b>
- Added configuration option <b>setUseScroll</b>
- Added route option <b>scrollProps</b>
- Added route option <b>ignoreScroll</b>
- Added payload passing between all Before Enter Functions

## 1.0.9

- Improved documentation
- Added configuration option <b>considerTrailingSlashOnMatchingRoute</b>

## 1.0.8

- Improved documentation
- Fixed bug on passing params to currentRoute

## 1.0.7

- Fix documentation problems and some bugs on starting.

## 1.0.0

- First version release published.