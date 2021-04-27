<script>
  import { backRoute } from "../index.js";
</script>

<main>
  <h2>Component Two!</h2>
  <div>
    A
    <br />
    <br />
    <button
      class="scr-button"
      on:click={() => {
        backRoute();
      }}>Go Back</button
    >
  </div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
  <div>E</div>
  <div>F</div>
  <div>G</div>
  <div>H</div>
  <div>I</div>
  <div class="J_TEST">J</div>
  <div>K</div>
  <div>L</div>
  <div>M</div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    min-height: 200vh;
  }

  div {
    min-height: 25vh;
  }

  .scr-button {
    background-color: #ff3e0010;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all linear 0.2s;
    width: 100%;
    color: #ff3e00;
    border: 1px solid #ff3e00;
  }

  .scr-button:hover {
    background-color: #ff3e0040;
    cursor: pointer;
    font-weight: bolder;
  }
</style>
