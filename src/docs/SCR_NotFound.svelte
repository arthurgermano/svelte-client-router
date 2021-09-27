<script>
  import routerStore from "../js/store/router.js";
  import navigateStore from "../js/store/navigate.js";
</script>

<center>
  <p class="scr-p">Not Found</p>
  <p class="scr-p-small">{$routerStore.currentLocation || "='("}</p>
  <br />
  <div>
    <div class="scr-btn" on:click={navigateStore.backRoute}>Back</div>
  </div>
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

  .scr-btn {
    width: 50% !important;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: left;
    align-content: center;
    width: 100%;
    padding: 0.5rem;
    background-color: #ff440009;
    border-radius: 0.5rem;
    transition: all linear 0.2s;
    text-align: center;
    color: #a82d00;
    margin-bottom: 0.5rem;
  }

  .scr-btn:hover {
    background-color: #ff440018;
    cursor: pointer;
    font-weight: bolder;
    color: #d43900;
  }
</style>
