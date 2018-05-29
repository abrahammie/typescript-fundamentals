import { isPromise, wait } from './utils/promise';
/**
 * Given a generator function that yields one or more
 * promises, chain them together in sequence
 *
 * @param {any} genFn generator function that yields one or more promises
 * @return {undefined}
 */
export function task<T>(genFn: () => IterableIterator<any>): Promise<T> {
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
            nextStep(promiseResult);
          });
        } else {
          nextStep(value);
        }
      }
    };
    // passing undefined just for the first time
    nextStep(undefined);
  });
  return p;
}
