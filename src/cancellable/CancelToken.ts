export class CancelToken {
  private _promise: Promise<any>;
  private reject!: (reason?: any) => void;
  private _isCancelled = false;

  constructor() {
    this._promise = new Promise((_, reject) => {
      this.reject = reject;
    });
  }

  get promise() {
    return this._promise;
  }

  get isCancelled() {
    return this._isCancelled;
  }

  abort(reason: any) {
    this._isCancelled = true;
    this.reject(reason);
  }
}
