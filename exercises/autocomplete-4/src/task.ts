import { isPromise, wait } from './utils/promise';

export interface CancellablePromise<T> extends PromiseLike<T> {
  cancelled?: boolean;
}

/**
 * Given a generator function that yields one or more
 * promises, chain them together in sequence
 *
 * @param {any} genFn generator function that yields one or more promises
 * @return {undefined}
 */
export function task<T>(genFn: () => IterableIterator<any>): CancellablePromise<T> {
  let p = new Promise<T>((resolve) => {
    let iterator = genFn(); // Get the iterator
    let value: any;
    
    function nextStep(lastPromiseVal: any) {
      let iteratorResult = iterator.next(lastPromiseVal);
      if (iteratorResult.done && typeof iteratorResult.value === 'undefined') {
        resolve(value as T);
        return;
      } else {
        value = iteratorResult.value;
        if (isPromise(value)) {
          value.then((promiseResult: any) => {
            if (!p.cancelled) { 
              nextStep(promiseResult);
            }
          });
        } else {
          nextStep(value);
        }
      }
    };
    // passing undefined just for the first time
    nextStep(undefined);
  }) as CancellablePromise<T>;
  p.cancelled = false;
  return p;
}
