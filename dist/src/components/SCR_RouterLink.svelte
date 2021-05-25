<script>
  import navigateStore from "../js/store/navigate.js";

  export let props = undefined;
  export let onError = undefined;
  export let to = undefined;
  export let elementProps = undefined;

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
