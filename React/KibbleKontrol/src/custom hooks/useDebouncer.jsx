import { useState, useEffect } from "react";

export const useDebouncer = (value, delay) => {
  const [debounceVal, setDebounceVal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceVal(value);
    }, delay);

    //returning functions in useEffect are treated as cleanup functions
    //running before next load
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceVal;
};
