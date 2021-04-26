<script>
  import { SCR_ROUTER_LINK } from "../index.js";
</script>

<main>
  C6
  <SCR_ROUTER_LINK to="{ {name: "2"} }" props="{{ pushCustomParam: "OKDOKEY!!!!!"}}" elementProps={ {style:"background-color:blue"}}>
    <button>Teste</button>
  </SCR_ROUTER_LINK>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
