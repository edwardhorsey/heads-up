import React, { useEffect, useRef } from 'react';

type IntervalFunction = () => (unknown | void)

function useInterval(callback: IntervalFunction, delay: number | null): void {
  const savedCallback: React.MutableRefObject<IntervalFunction | undefined> = useRef();
  console.log(savedCallback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
