import { test, expect } from '@playwright/test';
import { sleep } from "./helpers"

test('test', async ({ page }) => {

  // Go to http://localhost:5173/
  await page.goto('http://localhost:5173/');

  // Click h2:has-text("Version 1")
  await page.locator('h2:has-text("Version 2")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/presentation');

  // Click button:has-text("Installation")
  await page.locator('button:has-text("Installation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/installation');

  // Click button:has-text("Getting Started")
  await page.locator('button:has-text("Getting Started")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/gettingStarted');

  // Click button:has-text("Configuration Options")
  await page.locator('button:has-text("Configuration Options")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationOptions');

  // Click text=Configuration Before Enter
  await page.locator('text=Configuration Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationGlobalBeforeEnterOption');

  // Click text=Configuration On Error
  await page.locator('text=Configuration On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationGlobalOnError');

  // Click button:has-text("Route Object Properties")
  await page.locator('button:has-text("Route Object Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectProperties');

  // Click text=Route Object Before Enter
  await page.locator('text=Route Object Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectBeforeEnter');

  // Click text=Route Object After Enter
  await page.locator('text=Route Object After Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectAfterEnter');

  // Click text=Route Object On Error
  await page.locator('text=Route Object On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectOnError');

  // Click button:has-text("Route Component Properties")
  await page.locator('button:has-text("Route Component Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeComponentProperties');

  // Click text=Route Component Components
  await page.locator('text=Route Component Components').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeComponentComponents');

  // Click button:has-text("Navigation Routing")
  await page.locator('button:has-text("Navigation Routing")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/navigationRouting');

  // Click text=Router Link
  await page.locator('text=Router Link').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routerLink');

  // Click button:has-text("Routes Store")
  await page.locator('button:has-text("Routes Store")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routesStore');

  // Click button:has-text("Test - Regex Path")
  await page.locator('button:has-text("Test - Regex Path")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/:testParam/testRegexPath');

  // Click button:has-text("Test - Regex Path 2")
  await page.locator('button:has-text("Test - Regex Path 2")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/:firstParam/testRegexPath2/:secondParam');

  // Click text=Test - Loading Component Before Enter
  await page.locator('text=Test - Loading Component Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout');

  // Click button:has-text("Test - Any Route Wildcard")
  await page.locator('button:has-text("Test - Any Route Wildcard")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/anyRouteWildcard/*/:somePathParam');

  // Click text=Test - Not Found Route
  await page.locator('text=Test - Not Found Route').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/notFound');

  // Click text=Go Back
  await page.locator('text=Go Back').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/anyRouteWildcard/*/:somePathParam');

  // Click text=Test - Loading Component Before Enter
  await page.locator('text=Test - Loading Component Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/testLoadingComponentWithBeforeEnter/:timeout');

  // Click button:has-text("Test - Regex Path 2")
  await page.locator('button:has-text("Test - Regex Path 2")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/:firstParam/testRegexPath2/:secondParam');

  // Click button:has-text("Test - Regex Path")
  await page.locator('button:has-text("Test - Regex Path")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/:testParam/testRegexPath');

  // Click button:has-text("Routes Store")
  await page.locator('button:has-text("Routes Store")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routesStore');

  // Click text=Router Link
  await page.locator('text=Router Link').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routerLink');

  // Click button:has-text("Navigation Routing")
  await page.locator('button:has-text("Navigation Routing")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/navigationRouting');

  // Click text=Route Component Components
  await page.locator('text=Route Component Components').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeComponentComponents');

  // Click button:has-text("Route Component Properties")
  await page.locator('button:has-text("Route Component Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeComponentProperties');

  // Click text=Route Object Before Enter
  await page.locator('text=Route Object Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectBeforeEnter');

  // Click button:has-text("Route Object Properties")
  await page.locator('button:has-text("Route Object Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/routeObjectProperties');

  // Click text=Configuration On Error
  await page.locator('text=Configuration On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationGlobalOnError');

  // Click text=Configuration Before Enter
  await page.locator('text=Configuration Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationGlobalBeforeEnterOption');

  // Click button:has-text("Configuration Options")
  await page.locator('button:has-text("Configuration Options")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/configurationOptions');

  // Click button:has-text("Getting Started")
  await page.locator('button:has-text("Getting Started")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/gettingStarted');

  // Click button:has-text("Installation")
  await page.locator('button:has-text("Installation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/installation');

  // Click button:has-text("Presentation")
  await page.locator('button:has-text("Presentation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v2/presentation');

  // Click text=Home
  await page.locator('text=Home').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/');

});