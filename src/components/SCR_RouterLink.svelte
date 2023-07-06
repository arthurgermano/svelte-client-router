<script>
  import navigateStore from "../stores/navigate.js";

  // ----------------------------------------------------------------------------------------------

  // exported params
  export let params = undefined;
  export let onError = undefined;
  export let elementProps = undefined;

  // ----------------------------------------------------------------------------------------------
  
  function onClick() {
    if (!params) {
      throw new Error("SCR: Router Link param property is not defined.");
    }
    navigateStore.pushRoute({ ...params, onError });
  }
</script>

<div {...elementProps} on:click={onClick} role="button" tabindex="0">
  <slot />
</div>
