import { useEffect, useState } from "react";

/** Değer değiştikten `delay` ms sonra güncellenir (arama kutusu gibi sık değişen girdiler için). */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
