<script>
  // receiving route information
  export let notFound;
  // ----------------------------------------------------------------------------------------------

  function back() {
    history.back();
  }
</script>

<center>
  <p class="scr-p">TESTE</p>
  <p class="scr-p-small">{notFound.path || notFound.name || "='("}</p>
  <button type="button" class="scr-btn" on:click={back}>Go Back</button>
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
    cursor: pointer;
    padding: 0.5rem;
    text-align: center;
    border: 1px solid;
    border-radius: 0.5rem;
    background-color: transparent;
    color: orangered;
    transition: all 0.3s ease-in-out;
    min-width: 10rem;
    font-size: 1rem;
    width: 75%;
  }

  .scr-btn:hover {
    box-shadow: 0 20px 20px rgb(255 69 0 /10%);
    background-color: rgba(255, 69, 0, 0.329);
  }
</style>
