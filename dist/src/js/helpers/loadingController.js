function loadingController() {
  let callbackFunc;
  let resolveFunc;
  this.resolveLoading = function () {
    if (this.resolveFunc) {
      this.resolveFunc(true);
      this.resolveFunc = undefined;
    }
  };
  this.startLoading = function () {
    if (resolveFunc) {
      this.resolveLoading();
    }
    this.callbackFunc = new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
    });
    return this.callbackFunc;
  };
}
export default loadingController;
