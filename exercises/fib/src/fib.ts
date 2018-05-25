
/**
 * Implement a generator function that can be used
 * to generate numbers in the Fibonacci Sequence
 */
export function* getFibSequence(): IterableIterator<number> {
  let num = 1;
  let num2 = 0;
  while (true) {
    let nextFib = num + num2;
    yield nextFib;
    num = num2;
    num2 = nextFib;
  }
}
