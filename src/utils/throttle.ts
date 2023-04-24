export function throttle(fn: (...args: any[]) => any, wait = 1000) {
  let shouldWait = false;
  let waitingArgs: any[] | null = null;

  const timeoutFn = () => {
    if (waitingArgs) {
      fn(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFn, wait);
    } else {
      shouldWait = false;
    }
  };

  return (...args: any[]) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    fn(...args);
    shouldWait = true;

    setTimeout(timeoutFn, wait);
  };
}
