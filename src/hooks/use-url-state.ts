import { useCallback, useEffect, useState } from 'react';

function getUrlParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

function updateUrlParam(key: string, value: string | number | boolean): void {
  const params = new URLSearchParams(window.location.search);
  if (value !== undefined && value !== null) {
    params.set(key, String(value));
  } else {
    params.delete(key);
  }
  const newUrl = `${window.location.pathname}?${params}${window.location.hash}`;
  window.history.pushState(null, '', newUrl);
}

// Widen literal types to their base types
type Widen<T> = T extends number
  ? number
  : T extends boolean
    ? boolean
    : T extends string
      ? string
      : T;

export function useUrlState<T extends string | number | boolean>(
  initialValue: T,
  paramKey: string
): [Widen<T>, (newValue: Widen<T> | ((val: Widen<T>) => Widen<T>)) => void] {
  const [value, setValue] = useState<Widen<T>>(() => {
    const paramValue = getUrlParam(paramKey);
    if (paramValue === null) return initialValue as Widen<T>;

    // Parse the value based on the type of initialValue
    if (typeof initialValue === 'number') {
      const parsed = Number(paramValue);
      return (isNaN(parsed) ? initialValue : parsed) as Widen<T>;
    } else if (typeof initialValue === 'boolean') {
      return (paramValue === 'true') as Widen<T>;
    }
    return paramValue as Widen<T>;
  });

  useEffect(() => {
    const handlePopState = () => {
      const paramValue = getUrlParam(paramKey);
      if (paramValue === null) {
        setValue(initialValue as Widen<T>);
        return;
      }

      // Parse the value based on the type of initialValue
      if (typeof initialValue === 'number') {
        const parsed = Number(paramValue);
        setValue((isNaN(parsed) ? initialValue : parsed) as Widen<T>);
      } else if (typeof initialValue === 'boolean') {
        setValue((paramValue === 'true') as Widen<T>);
      } else {
        setValue(paramValue as Widen<T>);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialValue, paramKey]);

  const setUrlValue = useCallback(
    (newValue: Widen<T> | ((val: Widen<T>) => Widen<T>)) => {
      const actualNewValue =
        typeof newValue === 'function'
          ? (newValue as (val: Widen<T>) => Widen<T>)(value)
          : newValue;
      setValue(actualNewValue);
      updateUrlParam(paramKey, actualNewValue);
    },
    [paramKey, value]
  );

  return [value, setUrlValue];
}
