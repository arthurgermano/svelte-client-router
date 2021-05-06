<script>
  import SCR_Menu from "./SCR_Menu.svelte";
</script>

<div class="scr-main-layout">
  <div class="scr-header">
    <slot name="scr_header">
      <h2 class="scr-main-layout__header">
        Svelte Client Router - The Svelte SPA Router!
      </h2>
    </slot>
  </div>
  <div class="scr-main">
    <SCR_Menu />
    <div class="scr-pages"><slot /></div>
  </div>
  <div class="scr-footer">
    <div class="scr-footer-left">
      <b>Last Git Version:</b> SCR_VERSION
      <br />
      <br />
      <b>License:</b> <a href="https://en.wikipedia.org/wiki/MIT_License" target="_blank">MIT</a>
    </div>
    <div class="scr-footer-right">
      <b>Github: </b><a
        href="https://github.com/arthurgermano/svelte-client-router"
        target="_blank">https://github.com/arthurgermano/svelte-client-router</a
      >
      <br />
      <br />
      <b>NPM: </b><a
        href="https://www.npmjs.com/package/svelte-client-router"
        target="_blank">https://www.npmjs.com/package/svelte-client-router</a
      >
    </div>
  </div>
</div>

<style>
  .scr-main-layout {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
    width: 100%;
    min-height: 1vh;
  }

  .scr-header {
    -webkit-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    -moz-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    border-radius: 0.5rem;
    padding: 1rem 0;
    background-color: #ff400013;
  }

  .scr-main-layout__header {
    text-align: center;
    color: #ff3e00;
    margin: 0 auto;
    padding: 0;
  }

  .scr-main {
    display: grid;
    grid-template-columns: 3fr 10fr;
    padding: 0.5rem;
    overflow-y: hidden;
    margin: 0.5rem auto;
    justify-content: center;
    align-content: center;
    width: 100%;
    column-gap: 0.5rem;
  }

  .scr-pages {
    -webkit-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    -moz-box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 68, 0, 0.164);
  }

  .scr-footer {
    display: grid;
    grid-template-columns: 3fr 7fr;
    padding: 0.5rem;
    overflow-y: hidden;
    margin: 0.5rem auto;
    justify-content: center;
    align-content: center;
    width: 100%;
    min-height: 10vh;
    border-radius: 0.5rem;
    text-align: center;
    background-color: #ff400013;
  }


  @media only screen and (max-width: 600px) {
    .scr-main {
      grid-template-columns: 1fr;
    }
  }
</style>
