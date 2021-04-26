<script>
  import navigateStore from "../js/store/navigate.js";

  export let props = {};
  export let onError;
  export let to;
  export let elementProps;

  function onClick() {
    if (!to) {
      alert("SCR_ROUTERLINK Component\n- to property is not defined");
      return;
    }
    navigateStore.pushRoute(to, props, onError);
  }
</script>

<div {...elementProps} on:click={onClick}>
  <slot />
</div>
