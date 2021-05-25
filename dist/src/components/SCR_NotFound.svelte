<script>
  import routerStore from "../js/store/router.js";
</script>

<center>
  <p class="scr-p">Not Found</p>
  <p class="scr-p-small">{$routerStore.currentLocation || "='("}</p>
</center>

<style>
  .scr-p {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
  }
  .scr-p-small {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 100;
  }
</style>