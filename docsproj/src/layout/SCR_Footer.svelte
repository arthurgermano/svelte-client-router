<div class="scr-footer">
  <div class="scr-footer-left">
    <b>Last Git Version:</b> {import.meta.env.VITE_SCR_VERSION}
    <br />
    <br />
    <b>License:</b>
    <a href="https://en.wikipedia.org/wiki/MIT_License" target="_blank">MIT</a>
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

<style>
  .scr-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    display: grid;
    grid-template-columns: 3fr 7fr;
    padding: 0.5rem;
    overflow-y: hidden;
    justify-content: center;
    align-content: center;
    width: 100%;
    min-height: 10vh;
    text-align: center;
    border-top: 1px solid var(--main-color);
  }
</style>
