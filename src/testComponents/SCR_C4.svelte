<script>
  import { pushRoute } from "../index.js";
  export let params;
  export let currentRoute;
  export let fromRoute;
  console.log(params)
</script>

<main>
  <h2>Component Four</h2>
  <span>Params Defined on Route:</span>
  <br />
  <blockquote>
    <pre>
      {JSON.stringify(params)}
    </pre>
  </blockquote>  
  <br />
  <span>Current Route Object:</span>
  <br />
  <blockquote>
    <pre>
      {JSON.stringify(currentRoute)}
    </pre>
  </blockquote>  
  <br />
  <span>From Route Object:</span>
  <br />
  <blockquote>
    <pre>
      {JSON.stringify(fromRoute)}
    </pre>
  </blockquote>  
  <br />
  <button
    class="scr-button"
    on:click={() => {
      pushRoute({ name: "routeOne" });
    }}>Route One - GO!</button
  >
  <button
    class="scr-button"
    on:click={() => {
      pushRoute({ name: "routeTwo" });
    }}>Route Two - GO!</button
  >
  <button
    class="scr-button"
    on:click={() => {
      pushRoute({ name: "routeThree" });
    }}>Route Three - GO!</button
  >
  <button
    class="scr-button"
    on:click={() => {
      pushRoute({ path: "/test5" });
    }}>Route Five - GO!</button
  >
</main>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    width: 80%;
  }

  .scr-button {
    background-color: #ff3e0010;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all linear 0.2s;
    width: 100%;
    color: #ff3e00;
    border: 1px solid #ff3e00;
    margin-bottom: 2rem;
  }

  .scr-button:hover {
    background-color: #ff3e0040;
    cursor: pointer;
    font-weight: bolder;
  }
</style>
