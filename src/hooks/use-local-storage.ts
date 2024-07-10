/* `useLocalStorage`
 *
 * Features:
 *  - JSON Serializing
 *  - Also value will be updated everywhere, when value updated (via `storage` event)
 */

import { useEffect, useState } from "react";

const defaultOptions = {
  serializer: JSON.stringify,
  deserializer: JSON.parse,
};

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: {
    serializer: (value: T) => string;
    deserializer: (value: string) => T;
  }
): [T, (value: T) => void] {
  const [value, setValue] = useState(defaultValue);
  const { serializer, deserializer } = { ...defaultOptions, ...options };

  useEffect(() => {
    const item = localStorage.getItem(key);

    if (!item) {
      localStorage.setItem(key, serializer(defaultValue));
    }

    setValue(item ? deserializer(item) : defaultValue);

    function handler(e: StorageEvent) {
      if (e.key !== key) return;

      const lsi = localStorage.getItem(key);
      setValue(deserializer(lsi ?? ""));
    }

    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setValueWrap = (value: T) => {
    try {
      setValue(value);

      localStorage.setItem(key, serializer(value));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new StorageEvent("storage", { key }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setValueWrap];
}
