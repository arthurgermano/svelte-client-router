<script>
  import { pushRoute } from "../index.js";
</script>

<main class="scr-main">
  <section class="scr-section">
    <h3 class="scr-h3">
      <b>Route One Executes:</b>
      <br />
    </h3>
    <ul class="scr-ul">
      <li class="scr-li">Demonstrates Loading Component In Action</li>
      <li class="scr-li">Global Before Enter Functions</li>
      <li class="scr-li">Route Before Enter Functions</li>
      <li class="scr-li">
        Redirects in the second Before Enter Function to Root Page
      </li>
    </ul>
    <button
      class="scr-button"
      on:click={() => {
        pushRoute({ name: "routeOne" });
      }}>Route One - GO!</button
    >
  </section>
  <hr />
  <section class="scr-section">
    <h3 class="scr-h3">
      <b>Route Two Executes:</b>
      <br />
    </h3>
    <ul class="scr-ul">
      <li class="scr-li">Global Before Enter Functions</li>
      <li class="scr-li">Route Before Enter Functions</li>
      <li class="scr-li">
        Resolve Opening the Component
      </li>
    </ul>
    <button
      class="scr-button"
      on:click={() => {
        pushRoute({ name: "routeTwo" });
      }}>Route Two - GO!</button
    >
  </section>
  <hr />
  <section class="scr-section">
    <h3 class="scr-h3">
      <b>Route Three Executes:</b>
      <br />
    </h3>
    <ul class="scr-ul">
      <li class="scr-li">Global Before Enter Functions</li>
      <li class="scr-li">Route Before Enter Functions</li>
      <li class="scr-li" style="color: red">
        Throws An Error on Before Enter - For Example Purposes!
      </li>
    </ul>
    <button
      class="scr-button"
      on:click={() => {
        pushRoute({ name: "routeThree" });
      }}>Route Three - GO!</button
    >
  </section>
  <hr />
  <section class="scr-section">
    <h3 class="scr-h3">
      <b>Route Four Executes:</b>
      <br />
    </h3>
    <ul class="scr-ul">
      <li class="scr-li">Global Before Enter Functions</li>
      <li class="scr-li">Route Before Enter Functions</li>
      <li class="scr-li">After Enter Route Function</li>
      <li class="scr-li">
        Resolve Opening the Component
      </li>
    </ul>
    <button
      class="scr-button"
      on:click={() => {
        pushRoute({ name: "routeFour" });
      }}>Route Four - GO!</button
    >
  </section>
  <hr />
  <section class="scr-section">
    <h3 class="scr-h3">
      <b>Route Five Executes:</b>
      <br />
    </h3>
    <ul class="scr-ul">
      <li class="scr-li">IGNORES Global Before Enter Functions</li>
      <li class="scr-li">Has NO Before Enter Functions</li>
      <li class="scr-li">IGNORES Layout</li>
      <li class="scr-li">
        Resolve Opening the Component
      </li>
      <li class="scr-li">
        Examples Router Link Component
      </li>
    </ul>
    <button
      class="scr-button"
      on:click={() => {
        pushRoute({ name: "routeFive" });
      }}>Route Five - GO!</button
    >
  </section>
</main>

<style>
  * {
    box-sizing: border-box;
  }

  .scr-main {
    margin: 0 auto;
    width: 100%;
  }

  .scr-section {
    text-align: center;
    margin: 0 auto;
    width: 80%;
  }

  .scr-h3 {
    color: #000;
    background-color: #fd984330;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .scr-ul {
    color: #000;
    background-color: #fd984330;
    border-radius: 0.5rem;
  }

  .scr-li {
    padding: 0.5rem;
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
