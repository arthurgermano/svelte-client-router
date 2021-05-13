<script>
  export let loadingText = "Loading...";
  export let subLoadingText = "";
  export let queryParams;

  let regex = /[A-Za-zÀ-ú0-9]/g;

  if (queryParams && queryParams.subLoadingText) {
    const match = queryParams.subLoadingText.toString().match(regex);
    const value = match ? match.join("").substr(0, 100) + "" : "";
    subLoadingText = value;
  }
</script>

<center class="scr-center">
  <div class="scr-lds-spinner">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
  <h1 class="scr-h1">{loadingText}</h1>
  <h3 class="scr-h3">{subLoadingText}</h3>
</center>

<style>
  .scr-center {
    position: relative;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
    text-align: center;
  }

  .scr-h1 {
    color: #579c34;
    animation: loading-text 1.5s linear infinite;
  }

  .scr-h3 {
    color: #579c34;
    animation: loading-text 1.5s linear infinite;
  }

  .scr-lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }
  .scr-lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .scr-lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: #579c34;
  }
  .scr-lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .scr-lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .scr-lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .scr-lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .scr-lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .scr-lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .scr-lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .scr-lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .scr-lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .scr-lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .scr-lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .scr-lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes loading-text {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
