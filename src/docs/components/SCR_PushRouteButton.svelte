<script>
  import { pushRoute } from "../../index.js";

  export let routeName = "rootRoute";
  export let text = "Button";
  export let style = "";
  export let title;
  function go() {
    pushRoute({ name: routeName });
  }
</script>

<button {title} {style} type="button" class="btn scr-button" on:click={go}
  >{text}</button
>
