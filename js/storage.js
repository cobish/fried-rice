class Storage {
  constructor () {
    this.storage = chrome.storage.sync;
  }

  get (target) {
    return new Promise(resolve => {
      this.storage.get(target, result => {
        resolve(result[target]);
      });
    });
  }

  set (target) {
    this.storage.set(target);
  }
}