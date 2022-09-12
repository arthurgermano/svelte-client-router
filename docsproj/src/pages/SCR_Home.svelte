<script>
  import SCR_Page from "../layout/SCR_Page.svelte";
  import { SCR_RouterLink } from "../../../src/index.js";
</script>

<SCR_Page>
  <div class="scr-home">
    <h2>Choose a Version</h2>
    <div class="scr-versions">
      <SCR_RouterLink params={{ name: "v1_Presentation" }}>
        <div class="scr-version">
          <h2>Version 1</h2>
          <p>
            The first version, with a lot of features, the code is not test
            covered.
          </p>
        </div>
      </SCR_RouterLink>
      <SCR_RouterLink params={{ name: "v2_Presentation" }}>
        <div class="scr-version">
          <h2>Version 2</h2>
          <p>Redesigned from scratch, test covered and more reliable.</p>
        </div>
      </SCR_RouterLink>
    </div>
  </div>
</SCR_Page>

<style>
  .scr-home {
    text-align: center;
  }

  .scr-versions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-content: center;
  }

  .scr-version {
    display: grid;
    justify-content: center;
    align-content: center;
    padding: 0.5rem;
    border: 1px solid var(--main-color);
    border-radius: 0.5rem;
    margin: 1rem;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    height: 100%;
  }

  .scr-version h2 {
    color: var(--main-color);
  }

  .scr-version:hover {
    box-shadow: 0 20px 20px rgb(240 191 85 / 38%);
    background-color: rgba(240, 191, 85, 0.329);
  }

  @media (max-width: 500px) {
    .scr-versions {
      display: grid;
      grid-template-columns: 1fr;
      row-gap: 2rem;
    }
  }
</style>
