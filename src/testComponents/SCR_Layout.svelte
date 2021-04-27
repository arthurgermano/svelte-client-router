<main class="scr-main-layout">
  <slot name="scr_header">
    <h1 class="scr-main-layout__header">
      Svelte Client Router - The Svelte SPA Router!
    </h1>
  </slot>
  <slot name="scr_before-main">
    <p class="scr-main-layout__p">
      Test some button to see the router working!
    </p>
  </slot>
  <slot />
  <slot name="scr_after-main">
    <p class="scr-main-layout__p">
      Nice Routing!
    </p>
  </slot>
  <slot name="scr_footer">
    <footer class="scr-main-layout__footer">This is some footer content</footer>
  </slot>
</main>

<style>
  .scr-main-layout {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
    margin: 1rem 0;
    padding: 1rem 0;
    width: 100%;
    min-height: 1vh;
  }

  .scr-main-layout__header {
    text-align: center;
    color: #ff3e00;
    border-bottom: 1px solid #000;
    padding: 1rem 0;
  }

  .scr-main-layout__p {
    text-align: center;
    color: #ff3e00;
  }
  
  .scr-main-layout__footer {
    width: 100%;
    border-top: 1px solid #000;
    text-align: center;
    color: #ff3e00;
    padding: 1rem 0;
  }
</style>
