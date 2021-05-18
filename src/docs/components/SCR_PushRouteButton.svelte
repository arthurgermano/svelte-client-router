<script>
  import { pushRoute } from "../../index.js";

  export let routeName = "rootRoute";
  export let routePath;
  export let text = "Button";
  export let style = "";
  export let title;
  function go() {
    if (!routePath) {
      pushRoute({ name: routeName });
      return;
    }
    pushRoute({ path: routePath });
  }
</script>

<button {title} {style} type="button" class="btn scr-button" on:click={go}
  >{text}</button
>
