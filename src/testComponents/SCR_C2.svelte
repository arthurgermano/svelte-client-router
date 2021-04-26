<script>
  import { backRoute } from "../index.js";
</script>

<main>
  C2
  <div>
    A
    <br>
    <button on:click={() => {
      backRoute();
    }}>TESTE1</button>
  </div>
  <div>
    B
  </div>
  <div>
    C
  </div>
  <div>
    D
  </div>
  <div>
    E
  </div>
  <div>
    F
  </div>
  <div>
    G
  </div>
  <div>
    H
  </div>
  <div>
    I
  </div>
  <div  class="J_TEST">
    J
  </div>
  <div>
    K
  </div>
  <div>
    L
  </div>
  <div>
    M
  </div>
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
</style>
