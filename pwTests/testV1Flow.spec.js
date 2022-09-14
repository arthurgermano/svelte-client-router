import { test, expect } from '@playwright/test';
import { sleep } from "./helpers"

test('test', async ({ page }) => {

  // Go to http://localhost:5173/
  await page.goto('http://localhost:5173/');

  // Click h2:has-text("Version 1")
  await page.locator('h2:has-text("Version 1")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/presentation');

  // Click button:has-text("Installation")
  await page.locator('button:has-text("Installation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/installation');

  // Click button:has-text("Getting Started")
  await page.locator('button:has-text("Getting Started")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/gettingStarted');

  // Click button:has-text("Configuration Options")
  await page.locator('button:has-text("Configuration Options")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationOptions');

  // Click text=Configuration Before Enter
  await page.locator('text=Configuration Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationGlobalBeforeEnterOption');

  // Click text=Configuration On Error
  await page.locator('text=Configuration On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationGlobalOnError');

  // Click button:has-text("Route Object Properties")
  await page.locator('button:has-text("Route Object Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectProperties');

  // Click text=Route Object Before Enter
  await page.locator('text=Route Object Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectBeforeEnter');

  // Click text=Route Object After Enter
  await page.locator('text=Route Object After Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectAfterEnter');

  // Click text=Route Object On Error
  await page.locator('text=Route Object On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectOnError');

  // Click button:has-text("Route Component Properties")
  await page.locator('button:has-text("Route Component Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeComponentProperties');

  // Click text=Route Component Components
  await page.locator('text=Route Component Components').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeComponentComponents');

  // Click button:has-text("Navigation Routing")
  await page.locator('button:has-text("Navigation Routing")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/navigationRouting');

  // Click text=Navigation Store
  await page.locator('text=Navigation Store').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/navigationStore');

  // Click text=Router Link
  await page.locator('text=Router Link').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routerLink');

  // Click button:has-text("Router Store")
  await page.locator('button:has-text("Router Store")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routerStore');

  // Click button:has-text("Test - Regex Path")
  await page.locator('button:has-text("Test - Regex Path")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/:testParam/testRegexPath');

  // Click button:has-text("Test - Regex Path 2")
  await page.locator('button:has-text("Test - Regex Path 2")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/:firstParam/testRegexPath2/:secondParam');

  // Click text=Test - Loading Component Before Enter
  await page.locator('text=Test - Loading Component Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/testLoadingComponentWithBeforeEnter/:timeout');

  // Click button:has-text("Test - Any Route Wildcard")
  await page.locator('button:has-text("Test - Any Route Wildcard")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/anyRouteWildcard/*/:somePathParam');

  // Click text=Test - Not Found Route
  await page.locator('text=Test - Not Found Route').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/notFound');

  // Click text=Go Back
  await page.locator('text=Go Back').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/anyRouteWildcard/*/:somePathParam');

  // Click text=Test - Loading Component Before Enter
  await page.locator('text=Test - Loading Component Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/testLoadingComponentWithBeforeEnter/:timeout');

  // Click button:has-text("Test - Regex Path 2")
  await page.locator('button:has-text("Test - Regex Path 2")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/:firstParam/testRegexPath2/:secondParam');

  // Click button:has-text("Test - Regex Path")
  await page.locator('button:has-text("Test - Regex Path")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/:testParam/testRegexPath');

  // Click button:has-text("Router Store")
  await page.locator('button:has-text("Router Store")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routerStore');

  // Click text=Router Link
  await page.locator('text=Router Link').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routerLink');

  // Click text=Navigation Store
  await page.locator('text=Navigation Store').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/navigationStore');

  // Click button:has-text("Navigation Routing")
  await page.locator('button:has-text("Navigation Routing")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/navigationRouting');

  // Click text=Route Component Components
  await page.locator('text=Route Component Components').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeComponentComponents');

  // Click button:has-text("Route Component Properties")
  await page.locator('button:has-text("Route Component Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeComponentProperties');

  // Click text=Route Object Before Enter
  await page.locator('text=Route Object Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectBeforeEnter');

  // Click button:has-text("Route Object Properties")
  await page.locator('button:has-text("Route Object Properties")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/routeObjectProperties');

  // Click text=Configuration On Error
  await page.locator('text=Configuration On Error').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationGlobalOnError');

  // Click text=Configuration Before Enter
  await page.locator('text=Configuration Before Enter').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationGlobalBeforeEnterOption');

  // Click button:has-text("Configuration Options")
  await page.locator('button:has-text("Configuration Options")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/configurationOptions');

  // Click button:has-text("Getting Started")
  await page.locator('button:has-text("Getting Started")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/gettingStarted');

  // Click button:has-text("Installation")
  await page.locator('button:has-text("Installation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/installation');

  // Click button:has-text("Presentation")
  await page.locator('button:has-text("Presentation")').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/v1/presentation');

  // Click text=Home
  await page.locator('text=Home').click();
  await sleep(500);
  await expect(page).toHaveURL('http://localhost:5173/#/svelte-client-router/');

});