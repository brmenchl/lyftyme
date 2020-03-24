import { CancelToken } from "./CancelToken";

export type CancellableFunction = (signal: CancelToken) => any;

export const cancellable = (fn: CancellableFunction) => (
  token: CancelToken
) => {
  if (token.isCancelled) {
    return token.promise;
  }

  const { it, result } = runner(fn, token);

  const cancellation = token.promise.catch(reason => {
    console.log("cancelling", fn.name);
    const ret = it.return(reason);
    throw ret.value !== undefined ? ret.value : reason;
  });

  return Promise.race([result, cancellation]).catch(e => {
    token.abort(e);
  });
};

const runner = <T>(
  gen: (token: CancelToken) => Generator<T | undefined, T, T | undefined>,
  token: CancelToken
) => {
  const it = gen(token);

  const step = (shouldNext: boolean = true, currentValue?: T) => {
    try {
      const nextResult = shouldNext
        ? it.next(currentValue)
        : it.throw(currentValue);
      let prNext = Promise.resolve(nextResult.value);
      if (!nextResult.done) {
        prNext = prNext.then(v => step(true, v), reason => step(false, reason));
      }
      return prNext;
    } catch (err) {
      // Exception from within generator
      return Promise.reject(err);
    }
  };

  return {
    it,
    result: step()
  };
};
