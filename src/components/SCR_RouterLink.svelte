<script>
  import navigateStore from "../stores/navigate.js";

  export let params = undefined;
  export let onError = undefined;
  export let elementProps = undefined;

  function onClick() {
    if (!params) {
      throw new Error("SCR: Router Link param property is not defined.");
    }
    navigateStore.pushRoute({ ...params, onError });
  }
</script>

<div {...elementProps} on:click={onClick}>
  <slot />
</div>
