import "./assets/app.css";
import App from "./App.svelte";

import "./assets/fontawesome/solid.min.js";
import "./assets/fontawesome/fontawesome.min.js";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
