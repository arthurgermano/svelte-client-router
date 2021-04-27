<script>
  import { SCR_ROUTER_LINK, backRoute } from "../index.js";
</script>

<main>
  <h2>Component Five!</h2>
  <button
    class="scr-button"
    on:click={() => {
      backRoute();
    }}>Go Back</button
  >
  <SCR_ROUTER_LINK
    to={{ name: "rootRoute" }}
    props={{ pushCustomParam: "Custom Param Defined Router Link - Navigation" }}
    elementProps={{
      style: `margin: 1rem; padding: 1rem 0; display: grid; grid-template-columns: 1fr; justify-content: center; align-content:center; background-color:#ff3e0012`,
    }}
  >
    <button class="scr-button">Button With No Click Action<br />But Works Because Router Link!</button>
  </SCR_ROUTER_LINK>
</main>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    width: 100%;
  }

  .scr-button {
    background-color: #ff3e0010;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all linear 0.2s;
    width: 80%;
    color: #ff3e00;
    border: 1px solid #ff3e00;
    margin: 0 auto;
  }

  .scr-button:hover {
    background-color: #ff3e0040;
    cursor: pointer;
    font-weight: bolder;
  }
</style>
