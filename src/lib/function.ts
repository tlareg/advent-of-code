export function memoize<TArgs extends unknown[], TResult>(fn: Function): Function {
  const cache = new Map<string, TResult>();

  return (...args: TArgs) => {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = fn(...args);
    cache.set(cacheKey, result);

    return result;
  };
}
