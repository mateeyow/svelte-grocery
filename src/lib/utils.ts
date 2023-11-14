export function debounce<TArgs = unknown, TReturn = unknown>(fn: (args: TArgs) => TReturn, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      fn(args);
    }, wait)
  }
}
