// TODO add eslint to the project
export function debounce(func: (...args: any[]) => any, wait = 1000) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
