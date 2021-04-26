<script>
    import { pushRoute } from "../index.js";
</script>

<main>
  C3
  <br>
  <button on:click={() => {
    pushRoute({ name: '1'});
  }}>TESTE1</button>
  <br>
  <button on:click={() => {
    pushRoute({ name: '2'});
  }}>TESTE2</button>
  <br>
  <button on:click={() => {
    pushRoute({ name: '3'});
  }}>TESTE3</button>
  <br>
  <button on:click={() => {
    pushRoute({ path: '/test5'});
  }}>TESTE5</button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
