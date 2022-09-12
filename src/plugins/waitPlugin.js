class WaitPlugin {
  constructor() {
    this.waitList = [];
  }

  finishWait(name, accepted = true, returnParam = true) {
    if (!this.waitList[name]) {
      return false;
    }
    try {
      if (!this.waitList[name]) {
        return;
      }
      if (accepted) {
        return this.waitList[name].resolve(returnParam || accepted);
      }
      return this.waitList[name].reject(returnParam || accepted);
    } catch (error) {
    } finally {
      if (this.waitList[name]) {
        this.waitList[name] = undefined;
      }
    }
  }

  startWait(name) {
    if (this.waitList[name]) {
      return;
    }
    this.waitList[name] = {};
    this.waitList[name].promise = new Promise((resolve, reject) => {
      this.waitList[name].resolve = resolve;
      this.waitList[name].reject = reject;
    });
    return this.waitList[name].promise;
  }

  finishAll(accepted, returnParam) {
    for (let key of this.waitList) {
      this.finishWait(key, accepted, returnParam);
    }
  }
}

export default WaitPlugin;
